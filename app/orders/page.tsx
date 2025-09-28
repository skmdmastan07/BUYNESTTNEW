'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Truck, CircleCheck as CheckCircle, Clock, Eye } from 'lucide-react';
import { DataService } from '@/lib/data';
import { AuthService } from '@/lib/auth';
import { Order, Product } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderProducts, setOrderProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) return;

      const userOrders = await DataService.getOrders(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    
    const products = await Promise.all(
      order.products.map(async (item) => {
        const product = await DataService.getProductById(item.product_id);
        return product;
      })
    );
    
    setOrderProducts(products.filter(Boolean) as Product[]);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <Package className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Package className="h-12 w-12 animate-pulse text-buynestt-gold mx-auto mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 font-cinzel mb-2">Order History</h1>
            <p className="text-gray-600">Track your past and current orders</p>
          </motion.div>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
              <p className="text-gray-600 mb-8">
                You haven't placed any orders yet. Start shopping to see your order history here.
              </p>
              <Button className="bg-buynestt-gold hover:bg-yellow-600 text-black">
                Start Shopping
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white shadow-sm border-0 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Badge className={`${getStatusColor(order.status)} border-0`}>
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(order.status)}
                              <span className="capitalize">{order.status}</span>
                            </span>
                          </Badge>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Items:</span>
                          <span className="ml-2 font-semibold">
                            {order.products.reduce((sum, item) => sum + item.quantity, 0)} items
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="ml-2 font-semibold">
                            ₹{order.total_amount.toLocaleString()}
                          </span>
                        </div>

                        {order.discount_applied > 0 && (
                          <div>
                            <span className="text-gray-600">Discount:</span>
                            <span className="ml-2 font-semibold text-buynestt-gold">
                              -₹{order.discount_applied.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Order Detail Modal */}
          <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="max-w-2xl">
              {selectedOrder && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <Package className="h-6 w-6" />
                      <span>Order #{selectedOrder.id}</span>
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-semibold">
                          {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      <Badge className={`${getStatusColor(selectedOrder.status)} border-0`}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(selectedOrder.status)}
                          <span className="capitalize">{selectedOrder.status}</span>
                        </span>
                      </Badge>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {selectedOrder.products.map((item, index) => {
                          const product = orderProducts[index];
                          return (
                            <div key={item.product_id} className="flex items-center justify-between py-2">
                              <div className="flex-1">
                                <p className="font-medium">{product?.name || 'Product'}</p>
                                <p className="text-sm text-gray-600">
                                  {product?.pack_size} × {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{selectedOrder.total_amount.toLocaleString()}</span>
                      </div>
                      
                      {selectedOrder.discount_applied > 0 && (
                        <div className="flex justify-between text-buynestt-gold">
                          <span>Discount</span>
                          <span>-₹{selectedOrder.discount_applied.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>₹{(selectedOrder.total_amount - selectedOrder.discount_applied).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}