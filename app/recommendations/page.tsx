'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader as Loader2, Star, TrendingUp, Target, Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { CartService } from '@/lib/cart';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

interface RecommendationSection {
  title: string;
  icon: any;
  description: string;
  products: (Product & { reason?: string })[];
  type: string;
}

export default function RecommendationsPage() {
  const [sections, setSections] = useState<RecommendationSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);

      const [frequentRes, trendingRes, personalizedRes] = await Promise.all([
        fetch('/api/recommendations?type=frequent'),
        fetch('/api/recommendations?type=trending'),
        fetch('/api/recommendations?type=personalized')
      ]);

      const [frequentData, trendingData, personalizedData] = await Promise.all([
        frequentRes.json(),
        trendingRes.json(), 
        personalizedRes.json()
      ]);

      setSections([
        {
          title: 'Frequently Bought Again',
          icon: Target,
          description: 'Based on your purchase history',
          products: frequentData.recommendations || [],
          type: 'frequent'
        },
        {
          title: 'Trending in Your Category',
          icon: TrendingUp,
          description: 'Popular among similar retailers',
          products: trendingData.recommendations || [],
          type: 'trending'
        },
        {
          title: 'Recommended for You',
          icon: Star,
          description: 'Personalized picks just for you',
          products: personalizedData.recommendations || [],
          type: 'personalized'
        }
      ]);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load recommendations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    CartService.addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const filteredSections = sections.map(section => ({
    ...section,
    products: section.products.filter(product => 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }));

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-buynestt-gold mx-auto mb-4" />
            <p className="text-gray-600">Loading your personalized recommendations...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-cinzel">Recommendations</h1>
                <p className="text-gray-600 mt-1">Discover products perfect for your store</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredSections.map((section, sectionIndex) => (
            <motion.div
              key={section.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
              className="mb-12"
            >
              <Card className="bg-white shadow-sm border-0">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-buynestt-gold/10 rounded-lg">
                      <section.icon className="h-6 w-6 text-buynestt-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900 flex items-center space-x-2">
                        <span>{section.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {section.products.length}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {section.products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {section.products.slice(0, 8).map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (sectionIndex * 0.1) + (index * 0.05), duration: 0.3 }}
                        >
                          <ProductCard
                            product={product}
                            reason={product.reason}
                            onQuickView={setSelectedProduct}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No products found matching your search.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Product Detail Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl">
            {selectedProduct && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {selectedProduct.name}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {selectedProduct.category}
                      </Badge>
                      <h3 className="text-2xl font-bold text-gray-900">
                        ₹{selectedProduct.price}
                      </h3>
                      <p className="text-gray-600">{selectedProduct.pack_size}</p>
                    </div>

                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(selectedProduct.rating)
                              ? 'fill-buynestt-gold text-buynestt-gold'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        ({selectedProduct.rating})
                      </span>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Available Stock</p>
                        <p className="font-semibold">{selectedProduct.stock} units</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Minimum Order</p>
                        <p className="font-semibold">{selectedProduct.moq} units</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Distributor</p>
                      <p className="font-semibold">{selectedProduct.distributor}</p>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleAddToCart(selectedProduct)}
                        className="flex-1 bg-buynestt-gold hover:bg-yellow-600 text-black"
                        disabled={selectedProduct.stock === 0}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAddToCart(selectedProduct, selectedProduct.moq)}
                        disabled={selectedProduct.stock < selectedProduct.moq}
                      >
                        Add MOQ ({selectedProduct.moq})
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}