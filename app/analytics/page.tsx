'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, MousePointer, ShoppingCart, DollarSign, Target, Award, ChartBar as BarChart3 } from 'lucide-react';
import { AuthService } from '@/lib/auth';
import Layout from '@/components/Layout';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

// Mock analytics data
const clickData = [
  { month: 'Jan', recommendations: 45, conversions: 12 },
  { month: 'Feb', recommendations: 52, conversions: 18 },
  { month: 'Mar', recommendations: 38, conversions: 15 },
  { month: 'Apr', recommendations: 61, conversions: 22 },
  { month: 'May', recommendations: 55, conversions: 20 },
  { month: 'Jun', recommendations: 67, conversions: 28 },
];

const savingsData = [
  { month: 'Jan', savings: 450 },
  { month: 'Feb', savings: 680 },
  { month: 'Mar', savings: 520 },
  { month: 'Apr', savings: 890 },
  { month: 'May', savings: 750 },
  { month: 'Jun', savings: 1200 },
];

const categoryData = [
  { name: 'Groceries', value: 40, amount: 12000 },
  { name: 'Snacks', value: 25, amount: 7500 },
  { name: 'Beverages', value: 20, amount: 6000 },
  { name: 'Dairy', value: 10, amount: 3000 },
  { name: 'Spices', value: 5, amount: 1500 },
];

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const metrics = [
    {
      title: 'Recommendations Clicked',
      value: '324',
      change: '+12.5%',
      icon: MousePointer,
      color: 'text-buynestt-gold',
      trend: 'up'
    },
    {
      title: 'Conversion Rate',
      value: '34.2%',
      change: '+3.8%',
      icon: Target,
      color: 'text-green-600',
      trend: 'up'
    },
    {
      title: 'Monthly Savings',
      value: '₹1,200',
      change: '+18.2%',
      icon: DollarSign,
      color: 'text-blue-600',
      trend: 'up'
    },
    {
      title: 'Total Orders',
      value: '47',
      change: '+5.1%',
      icon: ShoppingCart,
      color: 'text-purple-600',
      trend: 'up'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 font-cinzel mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your store's performance and insights</p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.title} className="bg-white shadow-sm border-0 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className={`h-4 w-4 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'} mr-1`} />
                          <p className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {metric.change}
                          </p>
                        </div>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100`}>
                        <Icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recommendations Performance */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white shadow-sm border-0 h-80">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-buynestt-gold" />
                    <span>Recommendations & Conversions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={clickData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px' 
                        }} 
                      />
                      <Bar dataKey="recommendations" fill="#f59e0b" name="Clicks" />
                      <Bar dataKey="conversions" fill="#3b82f6" name="Conversions" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Monthly Savings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white shadow-sm border-0 h-80">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span>Monthly Savings from Discounts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={savingsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px' 
                        }}
                        formatter={(value) => [`₹${value}`, 'Savings']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="savings" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span>Purchase Distribution by Category</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <ResponsiveContainer width="40%" height={200}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="flex-1 ml-8">
                      <div className="space-y-3">
                        {categoryData.map((category, index) => (
                          <div key={category.name} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="text-sm font-medium text-gray-700">{category.name}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">₹{category.amount.toLocaleString()}</p>
                              <p className="text-xs text-gray-600">{category.value}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-buynestt-gold/10 to-yellow-100/20 border-buynestt-gold/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-buynestt-gold" />
                    <span className="gradient-text">Performance Highlights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/80 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-buynestt-gold" />
                      <span className="font-semibold text-gray-900">Top Achievement</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      34% conversion rate this month - above average!
                    </p>
                    <Badge className="mt-2 bg-buynestt-gold text-black">Excellent</Badge>
                  </div>

                  <div className="bg-white/80 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-gray-900">Growth Trend</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Recommendation clicks increased by 12.5% this month
                    </p>
                    <Badge variant="secondary" className="mt-2">+12.5%</Badge>
                  </div>

                  <div className="bg-white/80 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-gray-900">Savings Record</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      ₹1,200 saved through discounts this month
                    </p>
                    <Badge variant="outline" className="mt-2">Best Month</Badge>
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