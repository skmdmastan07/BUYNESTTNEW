'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Store, Award, CreditCard as Edit, Save, X, Download } from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { Retailer } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

export default function ProfilePage() {
  const [user, setUser] = useState<Retailer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    shop_name: '',
    owner_name: '',
    region: '',
    categories: '',
  });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        shop_name: currentUser.shop_name,
        owner_name: currentUser.owner_name,
        region: currentUser.region,
        categories: currentUser.categories.join(', '),
      });
    }
  }, []);

  const handleSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        shop_name: formData.shop_name,
        owner_name: formData.owner_name,
        region: formData.region,
        categories: formData.categories.split(',').map(c => c.trim()),
      };
      
      setUser(updatedUser);
      localStorage.setItem('buynestt_user', JSON.stringify(updatedUser));
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        shop_name: user.shop_name,
        owner_name: user.owner_name,
        region: user.region,
        categories: user.categories.join(', '),
      });
    }
    setIsEditing(false);
  };

  const generateOrderSummary = () => {
    toast({
      title: "Generating report",
      description: "Your monthly order summary will be ready shortly",
    });
    
    setTimeout(() => {
      toast({
        title: "Report ready!",
        description: "Your monthly order summary has been generated",
      });
    }, 2000);
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buynestt-gold"></div>
        </div>
      </Layout>
    );
  }

  const getStreakStatus = (weeklyStreak: number, monthlyStreak: number) => {
    if (weeklyStreak >= 3 && monthlyStreak >= 3) return { label: 'Elite Member', color: 'bg-purple-100 text-purple-800' };
    if (weeklyStreak >= 3) return { label: 'Weekly Champion', color: 'bg-buynestt-gold text-black' };
    if (monthlyStreak >= 3) return { label: 'Loyal Customer', color: 'bg-blue-100 text-blue-800' };
    return { label: 'Growing', color: 'bg-green-100 text-green-800' };
  };

  const streakStatus = getStreakStatus(user.weekly_streak, user.monthly_streak);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 font-cinzel mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white shadow-sm border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-6 w-6 text-buynestt-gold" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <Button
                    variant={isEditing ? "ghost" : "outline"}
                    size="sm"
                    onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                  >
                    {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="owner_name">Owner Name</Label>
                      <Input
                        id="owner_name"
                        value={formData.owner_name}
                        onChange={(e) => setFormData({...formData, owner_name: e.target.value})}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="shop_name">Shop Name</Label>
                      <Input
                        id="shop_name"
                        value={formData.shop_name}
                        onChange={(e) => setFormData({...formData, shop_name: e.target.value})}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>

                  <div>
                    <Label htmlFor="categories">Categories You Sell</Label>
                    <Input
                      id="categories"
                      value={formData.categories}
                      onChange={(e) => setFormData({...formData, categories: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Groceries, Snacks, Beverages"
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>

                  <div>
                    <Label>Email Address</Label>
                    <Input
                      value={user.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-4">
                      <Button 
                        onClick={handleSave}
                        className="bg-buynestt-gold hover:bg-yellow-600 text-black"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Stats */}
              <Card className="bg-white shadow-sm border-0 mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-6 w-6 text-buynestt-gold" />
                    <span>Account Statistics</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-buynestt-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                        <Store className="h-8 w-8 text-buynestt-gold" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {new Date(user.created_at).getFullYear()}
                      </p>
                      <p className="text-sm text-gray-600">Member Since</p>
                    </div>

                    <div className="text-center">
                      <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                        <Award className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{user.weekly_streak}</p>
                      <p className="text-sm text-gray-600">Weekly Streak</p>
                    </div>

                    <div className="text-center">
                      <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                        <Award className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{user.monthly_streak}</p>
                      <p className="text-sm text-gray-600">Monthly Streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Status & Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Status Card */}
              <Card className="bg-gradient-to-br from-buynestt-gold/10 to-yellow-100/20 border-buynestt-gold/20">
                <CardHeader>
                  <CardTitle className="text-lg">Member Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Badge className={`${streakStatus.color} text-sm px-3 py-1 mb-3`}>
                      {streakStatus.label}
                    </Badge>
                    <p className="text-sm text-gray-700">
                      Based on your ordering consistency and engagement
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Spend</span>
                      <span className="font-semibold">₹{user.total_spent.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Categories</span>
                      <span className="font-semibold">{user.categories.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Account Age</span>
                      <span className="font-semibold">
                        {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={generateOrderSummary}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Order Summary
                  </Button>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Your Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.categories.map((category, index) => (
                      <Badge key={index} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}