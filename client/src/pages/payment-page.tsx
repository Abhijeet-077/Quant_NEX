import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, Calendar, Lock } from "lucide-react";

export default function PaymentPage() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment successful!",
        description: "Your subscription has been activated.",
      });
    }, 2000);
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Payment" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Plan Selection */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Your Plan</CardTitle>
                    <CardDescription>
                      Select the subscription plan that works best for you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={selectedPlan} 
                      onValueChange={setSelectedPlan}
                      className="space-y-4"
                    >
                      <div className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${selectedPlan === "basic" ? "border-primary bg-primary/5" : ""}`}>
                        <div className="flex items-start">
                          <RadioGroupItem value="basic" id="basic" className="mt-1" />
                          <div className="ml-3">
                            <Label htmlFor="basic" className="text-lg font-medium">Basic Plan</Label>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-bold">$39</span>
                              <span className="text-muted-foreground ml-1">/month</span>
                            </div>
                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Up to 50 patient records</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Basic quantum analysis</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Standard support</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${selectedPlan === "professional" ? "border-primary bg-primary/5" : ""}`}>
                        <div className="flex items-start">
                          <RadioGroupItem value="professional" id="professional" className="mt-1" />
                          <div className="ml-3">
                            <div className="flex items-center">
                              <Label htmlFor="professional" className="text-lg font-medium">Professional Plan</Label>
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">Popular</span>
                            </div>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-bold">$79</span>
                              <span className="text-muted-foreground ml-1">/quarter</span>
                            </div>
                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Unlimited patient records</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Advanced quantum analysis</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Priority support</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Custom reporting</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${selectedPlan === "enterprise" ? "border-primary bg-primary/5" : ""}`}>
                        <div className="flex items-start">
                          <RadioGroupItem value="enterprise" id="enterprise" className="mt-1" />
                          <div className="ml-3">
                            <Label htmlFor="enterprise" className="text-lg font-medium">Enterprise Plan</Label>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-bold">$99</span>
                              <span className="text-muted-foreground ml-1">/month</span>
                            </div>
                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Everything in Professional</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Multi-user access</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Advanced analytics</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Dedicated account manager</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>API access</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {selectedPlan === "basic" && "Basic Plan (Monthly)"}
                          {selectedPlan === "professional" && "Professional Plan (Quarterly)"}
                          {selectedPlan === "enterprise" && "Enterprise Plan (Monthly)"}
                        </span>
                        <span>
                          {selectedPlan === "basic" && "$39.00"}
                          {selectedPlan === "professional" && "$79.00"}
                          {selectedPlan === "enterprise" && "$99.00"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>$0.00</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-primary">
                          {selectedPlan === "basic" && "$39.00"}
                          {selectedPlan === "professional" && "$79.00"}
                          {selectedPlan === "enterprise" && "$99.00"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Payment Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>
                      Enter your payment details to complete your subscription
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Payment Method</Label>
                          <RadioGroup 
                            value={paymentMethod} 
                            onValueChange={setPaymentMethod}
                            className="flex space-x-4 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="credit-card" id="credit-card" />
                              <Label htmlFor="credit-card" className="flex items-center">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Credit Card
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="paypal" id="paypal" />
                              <Label htmlFor="paypal">PayPal</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {paymentMethod === "credit-card" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="card-name">Name on Card</Label>
                              <Input id="card-name" placeholder="John Smith" required />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="card-number">Card Number</Label>
                              <div className="relative">
                                <Input 
                                  id="card-number" 
                                  placeholder="1234 5678 9012 3456" 
                                  required 
                                  className="pl-10"
                                />
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="expiry">Expiration Date</Label>
                                <div className="relative">
                                  <Input 
                                    id="expiry" 
                                    placeholder="MM/YY" 
                                    required 
                                    className="pl-10"
                                  />
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <div className="relative">
                                  <Input 
                                    id="cvc" 
                                    placeholder="123" 
                                    required 
                                    className="pl-10"
                                  />
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor="billing-country">Billing Country</Label>
                          <Select defaultValue="us">
                            <SelectTrigger id="billing-country">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="au">Australia</SelectItem>
                              <SelectItem value="de">Germany</SelectItem>
                              <SelectItem value="fr">France</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="billing-address">Billing Address</Label>
                          <Input id="billing-address" placeholder="123 Main St" required />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="New York" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postal-code">Postal Code</Label>
                            <Input id="postal-code" placeholder="10001" required />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <span className="spinner mr-2"></span>
                              Processing...
                            </>
                          ) : (
                            `Pay ${selectedPlan === "basic" ? "$39.00" : selectedPlan === "professional" ? "$79.00" : "$99.00"}`
                          )}
                        </Button>
                      </div>
                      
                      <div className="text-center text-sm text-muted-foreground">
                        <div className="flex items-center justify-center">
                          <Lock className="h-4 w-4 mr-1" />
                          <span>Secure payment processing</span>
                        </div>
                        <p className="mt-1">
                          Your payment information is encrypted and secure. We never store your full credit card details.
                        </p>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
