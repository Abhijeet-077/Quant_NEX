import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models';
import { log } from '../vite';

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'quant-nex-jwt-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, title, specialization, institution, role } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = await User.create({
      id: uuidv4(),
      email,
      password, // Will be hashed by the model hook
      fullName,
      title,
      specialization,
      institution,
      role: role || 'doctor',
      isEmailVerified: false
    });
    
    // Generate token
    const token = generateToken(user.id);
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Return user data and token
    res.status(201).json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      title: user.title,
      role: user.role,
      token
    });
  } catch (error) {
    log('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.isValidPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Return user data and token
    res.status(200).json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      title: user.title,
      role: user.role,
      token
    });
  } catch (error) {
    log('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires', 'twoFactorSecret'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    log('Get profile error:', error);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { fullName, title, specialization, institution, profileImage } = req.body;
    
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    user.fullName = fullName || user.fullName;
    user.title = title || user.title;
    user.specialization = specialization || user.specialization;
    user.institution = institution || user.institution;
    user.profileImage = profileImage || user.profileImage;
    
    await user.save();
    
    res.status(200).json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      title: user.title,
      specialization: user.specialization,
      institution: user.institution,
      profileImage: user.profileImage,
      role: user.role
    });
  } catch (error) {
    log('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check current password
    const isMatch = await user.isValidPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword; // Will be hashed by the model hook
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    log('Change password error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = uuidv4();
    
    // Set token and expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    
    // In a real application, send an email with the reset link
    // For now, just return the token in the response
    res.status(200).json({
      message: 'Password reset email sent',
      resetToken // In production, this would be sent via email, not in the response
    });
  } catch (error) {
    log('Forgot password error:', error);
    res.status(500).json({ message: 'Server error processing password reset' });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    const user = await User.findOne({
      where: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: new Date() }
      }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Update password
    user.password = newPassword; // Will be hashed by the model hook
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    log('Reset password error:', error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
};
