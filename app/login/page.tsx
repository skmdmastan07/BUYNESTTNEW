'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AuthService } from '@/lib/auth';
import { isDemoMode } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Loader as Loader2, Store, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    shopName: '',
    ownerName: '',
    region: '',
    categories: '',
  });

  useEffect(() => {
    // Check if user is already logged in
    const user = AuthService.getCurrentUser();
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { user, error } = await AuthService.signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: `Logged in successfully`,
          });
          router.push('/dashboard');
        }
      } else {
        const profile = {
          shop_name: formData.shopName,
          owner_name: formData.ownerName,
          region: formData.region,
          categories: formData.categories.split(',').map(c => c.trim()),
        };
        
        const { user, error } = await AuthService.signUp(formData.email, formData.password, profile);
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome to Buynestt!",
            description: "Account created successfully",
          });
          router.push('/dashboard');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await AuthService.resetPassword(formData.email);
    
    if (error) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reset Link Sent",
        description: "Check your email for password reset instructions",
      });
      setShowForgotPassword(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-buynestt-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZG90cyBmaWxsPSJyZ2JhKDI0NSwgMTU4LCAxMSwgMC4xKSIgY3g9IjIiIGN5PSIyIiByPSIxIi8+PC9zdmc+')] opacity-20" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center mb-4"
          >
            <Store className="h-12 w-12 text-buynestt-gold mr-2" />
            <div>
              <h1 className="font-cinzel text-4xl font-bold text-white">
                Buy<span className="text-buynestt-gold">nestt</span>
              </h1>
              <p className="text-amber-200 text-sm font-light tracking-wide">
                Find it, stock it, sell it
              </p>
            </div>
          </motion.div>

          {isDemoMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3 mb-6"
            >
              <p className="text-amber-200 text-sm">
                <strong>Demo Mode:</strong> Use demo@buynestt.test / password
              </p>
            </motion.div>
          )}
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white font-cinzel">
              {showForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Join Buynestt')}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {showForgotPassword 
                ? 'Enter your email to receive reset instructions'
                : (isLogin 
                  ? 'Sign in to your retailer account' 
                  : 'Create your retailer account'
                )}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {showForgotPassword ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    className="flex-1 bg-buynestt-gold hover:bg-yellow-600 text-black"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Link
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowForgotPassword(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Back
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="shopName" className="text-gray-200">Shop Name</Label>
                      <Input
                        id="shopName"
                        placeholder="Your Shop Name"
                        value={formData.shopName}
                        onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ownerName" className="text-gray-200">Owner Name</Label>
                      <Input
                        id="ownerName"
                        placeholder="Your Full Name"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="region" className="text-gray-200">Region</Label>
                      <Input
                        id="region"
                        placeholder="City, State"
                        value={formData.region}
                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="categories" className="text-gray-200">Categories You Sell</Label>
                      <Input
                        id="categories"
                        placeholder="Groceries, Snacks, Beverages"
                        value={formData.categories}
                        onChange={(e) => setFormData({...formData, categories: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <Label htmlFor="remember" className="text-sm text-gray-300">
                        Remember me
                      </Label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-buynestt-gold hover:text-yellow-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-buynestt-gold hover:bg-yellow-600 text-black font-semibold"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {isLogin 
                      ? "Don't have an account? Sign up" 
                      : 'Already have an account? Sign in'
                    }
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}