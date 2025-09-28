'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Target, 
  Flame,
  Gift,
  Truck,
  Star,
  ArrowRight
} from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { CartService } from '@/lib/cart';
import { Retailer } from '@/lib/supabase';
import Link from 'next/link';
import Layout from '@/components/Layout';

const BULK_THRESHOLD = 2000;

export default function DashboardPage() {
  const [user, setUser] = useState<Retailer | null>(null);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setCartTotal(CartService.getCartTotal());
    setCartCount(CartService.getCartCount());
  }, []);

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buynestt-gold"></div>
        </div>
      </Layout>
    );
  }

  const weeklyProgress = (user.weekly_streak / 3) * 100;
  const monthlyProgress = (user.monthly_streak / 12) * 100;
  const remainingForDelivery = Math.max(0, BULK_THRESHOLD - cartTotal);

  const kpis = [
    {
      title: 'Monthly Spend',
      value: `₹${user.total_spent.toLocaleString()}`,
      icon: DollarSign,
      trend: '+12%',
      color: 'text-green-600'
    },
    {
      title: 'Weekly Streak',
      value: `${user.weekly_streak}/3 weeks`,
      icon: Target,
      trend: user.weekly_streak >= 2 ? 'Almost there!' : 'Keep going!',
      color: 'text-buynestt-gold'
    },
    {
      title: 'Cart Total',
      value: `₹${cartTotal}`,
      icon: ShoppingCart,
      trend: `${cartCount} items`,
      color: 'text-blue-600'
    },
    {
      title: 'Monthly Streak',
      value: `${user.monthly_streak} months`,
      icon: TrendingUp,
      trend: user.monthly_streak >= 3 ? 'Great job!' : 'Building up',
      color: 'text-purple-600'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-buynestt-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZG90cyBmaWxsPSJyZ2JhKDI0NSwgMTU4LCAxMSwgMC4xKSIgY3g9IjIiIGN5PSIyIiByPSIxIi8+PC9zdmc+')] opacity-20" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white mb-4">
                Welcome back, <span className="text-buynestt-gold">{user.owner_name}</span>
              </h1>
              <p className="text-xl text-gray-300 mb-2">{user.shop_name}</p>
              <p className="text-gray-400">{user.region}</p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/recommendations">
                  <Button size="lg" className="bg-buynestt-gold hover:bg-yellow-600 text-black font-semibold px-8">
                    <Star className="mr-2 h-5 w-5" />
                    See Recommendations
                  </Button>
                </Link>
                <Link href="/assistant">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8">
                    Talk to Assistant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
          {/* KPI Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <Card key={kpi.title} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                        <p className={`text-sm ${kpi.color} font-medium`}>{kpi.trend}</p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100`}>
                        <Icon className={`h-6 w-6 ${kpi.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Streak Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-2"
            >
              <Card className="bg-gradient-to-br from-buynestt-gold/10 to-yellow-100/20 border-buynestt-gold/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Flame className="h-6 w-6 text-buynestt-gold" />
                    <span className="gradient-text font-cinzel">Streak Rewards</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Weekly Streak (3% discount)</span>
                      <span className="text-sm text-buynestt-gold font-medium">
                        {user.weekly_streak}/3 weeks
                      </span>
                    </div>
                    <Progress value={weeklyProgress} className="h-3" />
                    <p className="text-xs text-gray-600 mt-2">
                      {user.weekly_streak >= 3 
                        ? '🎉 3% discount unlocked!' 
                        : `${3 - user.weekly_streak} more weeks to unlock 3% discount`}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Monthly Streak (2% bonus)</span>
                      <span className="text-sm text-buynestt-gold font-medium">
                        {user.monthly_streak}/12 months
                      </span>
                    </div>
                    <Progress value={monthlyProgress} className="h-3" />
                    <p className="text-xs text-gray-600 mt-2">
                      {user.monthly_streak >= 3 
                        ? '🎉 2% monthly bonus active!' 
                        : `Keep ordering monthly to build your streak`}
                    </p>
                  </div>

                  {(user.weekly_streak >= 3 || user.monthly_streak >= 3) && (
                    <div className="bg-white/80 rounded-lg p-4 border border-buynestt-gold/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <Gift className="h-5 w-5 text-buynestt-gold" />
                        <span className="font-semibold text-gray-900">Discount Available!</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        You have {user.weekly_streak >= 3 && user.monthly_streak >= 3 ? '5%' : user.weekly_streak >= 3 ? '3%' : '2%'} discount ready to apply
                      </p>
                      <Link href="/cart">
                        <Button size="sm" className="bg-buynestt-gold hover:bg-yellow-600 text-black">
                          Apply Discount
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Bulk Delivery Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100/20 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-6 w-6 text-blue-600" />
                    <span className="text-blue-900">Free Delivery</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-900 mb-2">
                      ₹{BULK_THRESHOLD.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-700 mb-4">
                      Minimum order for free delivery
                    </p>
                    
                    {remainingForDelivery > 0 ? (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Add ₹{remainingForDelivery} more for free delivery
                        </p>
                        <Progress 
                          value={(cartTotal / BULK_THRESHOLD) * 100} 
                          className="h-2 mb-3" 
                        />
                        <Link href="/recommendations">
                          <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                            Add More Items
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="text-green-800 font-semibold">
                          🎉 Free delivery unlocked!
                        </p>
                        <Link href="/cart">
                          <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                            Checkout Now
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Link href="/recommendations">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-buynestt-gold">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Star className="h-8 w-8 text-buynestt-gold" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Get Recommendations</h3>
                      <p className="text-sm text-gray-600">Personalized product picks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/orders">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">View Orders</h3>
                      <p className="text-sm text-gray-600">Track your purchase history</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/analytics">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-600">Business insights</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}