import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  CreditCard,
  Bell,
  Lock,
  Key,
  UserCog,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  AlertTriangle
} from "lucide-react";

export default function SettingsPage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  
  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);
  const [dataEncryptionEnabled, setDataEncryptionEnabled] = useState(true);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new password and confirmation match.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate password change
    toast({
      title: "Password updated",
      description: "Your password has been successfully updated.",
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: !twoFactorEnabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
      description: !twoFactorEnabled 
        ? "Your account is now more secure with 2FA." 
        : "Two-factor authentication has been turned off.",
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Settings" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="security" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="security">Security & Privacy</TabsTrigger>
                <TabsTrigger value="account">Account Settings</TabsTrigger>
                <TabsTrigger value="billing">Billing & Subscription</TabsTrigger>
              </TabsList>
              
              {/* Security & Privacy Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Shield className="h-6 w-6 text-primary mr-2" />
                      <CardTitle>Security Settings</CardTitle>
                    </div>
                    <CardDescription>
                      Manage your account security and privacy preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-4">
                        <Key className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account by requiring a verification code
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={twoFactorEnabled} 
                          onCheckedChange={handleTwoFactorToggle} 
                          id="two-factor"
                        />
                        <Label htmlFor="two-factor" className="sr-only">
                          Two-factor authentication
                        </Label>
                      </div>
                    </div>
                    
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-4">
                        <Mail className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications about security events
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={emailNotificationsEnabled} 
                          onCheckedChange={setEmailNotificationsEnabled} 
                          id="email-notifications"
                        />
                        <Label htmlFor="email-notifications" className="sr-only">
                          Email notifications
                        </Label>
                      </div>
                    </div>
                    
                    {/* Login Alerts */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-4">
                        <AlertTriangle className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-medium">Login Alerts</h3>
                          <p className="text-sm text-muted-foreground">
                            Get notified when someone logs into your account from a new device
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={loginAlertsEnabled} 
                          onCheckedChange={setLoginAlertsEnabled} 
                          id="login-alerts"
                        />
                        <Label htmlFor="login-alerts" className="sr-only">
                          Login alerts
                        </Label>
                      </div>
                    </div>
                    
                    {/* Data Encryption */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-4">
                        <Lock className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-medium">Data Encryption</h3>
                          <p className="text-sm text-muted-foreground">
                            Enable end-to-end encryption for all patient data
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={dataEncryptionEnabled} 
                          onCheckedChange={setDataEncryptionEnabled} 
                          id="data-encryption"
                        />
                        <Label htmlFor="data-encryption" className="sr-only">
                          Data encryption
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Password Change */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Lock className="h-6 w-6 text-primary mr-2" />
                      <CardTitle>Change Password</CardTitle>
                    </div>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="pt-2">
                        <Button type="submit">Update Password</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                {/* Privacy Policy */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Shield className="h-6 w-6 text-primary mr-2" />
                      <CardTitle>Privacy Policy</CardTitle>
                    </div>
                    <CardDescription>
                      Important information about how we handle your data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="text-muted-foreground">
                        <strong>Disclaimer:</strong> QUANT-NEX is a predictive tool and should not be used as the sole basis for medical decisions. 
                        All predictions and analyses are based on machine learning models and quantum computing algorithms that have inherent limitations.
                      </p>
                      <p className="text-muted-foreground">
                        Our platform employs state-of-the-art security measures including end-to-end encryption, secure data storage, 
                        and strict access controls to protect patient information. We comply with all relevant healthcare data protection 
                        regulations including HIPAA.
                      </p>
                      <p className="text-muted-foreground">
                        By using this application, you acknowledge that the results provided are for informational purposes only and 
                        should be interpreted by qualified healthcare professionals.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Account Settings Tab */}
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <UserCog className="h-6 w-6 text-primary mr-2" />
                      <CardTitle>Account Information</CardTitle>
                    </div>
                    <CardDescription>
                      Manage your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input id="full-name" defaultValue={user?.fullName || "Dr. Jane Smith"} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input id="title" defaultValue={user?.title || "Oncologist"} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="doctor@quantnex.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Bell className="h-6 w-6 text-primary mr-2" />
                      <CardTitle>Notification Preferences</CardTitle>
                    </div>
                    <CardDescription>
                      Control how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive updates, reports, and alerts via email
                        </p>
                      </div>
                      <Switch defaultChecked id="email-toggle" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Get text messages for urgent alerts
                        </p>
                      </div>
                      <Switch id="sms-toggle" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">In-App Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Show notifications within the application
                        </p>
                      </div>
                      <Switch defaultChecked id="in-app-toggle" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-destructive">
                  <CardHeader>
                    <div className="flex items-center">
                      <AlertTriangle className="h-6 w-6 text-destructive mr-2" />
                      <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    </div>
                    <CardDescription>
                      Actions that can't be undone
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-destructive/20 rounded-lg">
                        <h3 className="font-medium mb-1">Delete Account</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Billing & Subscription Tab */}
              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <CreditCard className="h-6 w-6 text-primary mr-2" />
                      <CardTitle>Current Plan</CardTitle>
                    </div>
                    <CardDescription>
                      Manage your subscription and billing information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-6 rounded-lg mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-primary">Professional Plan</h3>
                          <p className="text-muted-foreground">$79.00 billed quarterly</p>
                        </div>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          Active
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-primary mr-2"></div>
                          <span>Unlimited patient records</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-primary mr-2"></div>
                          <span>Advanced quantum analysis</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-primary mr-2"></div>
                          <span>Priority support</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-primary mr-2"></div>
                          <span>Custom reporting</span>
                        </div>
                      </div>
                      <div className="mt-6 flex space-x-4">
                        <Button variant="outline">Change Plan</Button>
                        <Button variant="destructive">Cancel Subscription</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Payment Method</h3>
                      <div className="flex items-center p-4 border rounded-lg">
                        <div className="h-10 w-14 bg-muted rounded flex items-center justify-center mr-4">
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                        </div>
                        <Button variant="ghost" className="ml-auto">Edit</Button>
                      </div>
                      <Button variant="outline">Add Payment Method</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <CreditCard className="h-6 w-6 text-primary mr-2" />
                      <CardTitle>Billing History</CardTitle>
                    </div>
                    <CardDescription>
                      View your past invoices and payment history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border-b">
                        <div>
                          <p className="font-medium">Professional Plan - Quarterly</p>
                          <p className="text-sm text-muted-foreground">Apr 1, 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$79.00</p>
                          <p className="text-sm text-green-600">Paid</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border-b">
                        <div>
                          <p className="font-medium">Professional Plan - Quarterly</p>
                          <p className="text-sm text-muted-foreground">Jan 1, 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$79.00</p>
                          <p className="text-sm text-green-600">Paid</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border-b">
                        <div>
                          <p className="font-medium">Professional Plan - Quarterly</p>
                          <p className="text-sm text-muted-foreground">Oct 1, 2022</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$79.00</p>
                          <p className="text-sm text-green-600">Paid</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Professional Plan - Quarterly</p>
                          <p className="text-sm text-muted-foreground">Jul 1, 2022</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$79.00</p>
                          <p className="text-sm text-green-600">Paid</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
