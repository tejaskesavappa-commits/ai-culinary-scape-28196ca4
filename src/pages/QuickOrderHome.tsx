import { useState } from 'react';
import { Search, Clock, Zap, Package, TrendingUp, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/contexts/ProductContext';
import { ProductCard } from '@/components/ProductCard';
import { CATEGORY_LABELS, ProductCategory } from '@/types/database';

const QuickOrderHome = () => {
  const { products, loading, filterByCategory, selectedCategory } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Object.keys(CATEGORY_LABELS) as ProductCategory[];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary opacity-95" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              New: Free delivery on orders above ₹499
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              Everything You Need, Delivered Fast
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              From groceries to gadgets - thousands of products at your doorstep
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
              <Input
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-16 text-lg bg-white shadow-lg border-0 rounded-xl"
              />
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center gap-2 text-white">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Fast Delivery</div>
                  <div className="text-sm text-white/80">10-20 minutes</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Best Prices</div>
                  <div className="text-sm text-white/80">Guaranteed deals</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Daily Offers</div>
                  <div className="text-sm text-white/80">Up to 50% off</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-6 border-b shadow-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-4">Shop by Category</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => filterByCategory(null)}
              className="whitespace-nowrap shadow-sm"
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => filterByCategory(category)}
                className="whitespace-nowrap shadow-sm"
              >
                {CATEGORY_LABELS[category]}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory
                ? CATEGORY_LABELS[selectedCategory]
                : searchQuery
                ? 'Search Results'
                : 'All Products'}
            </h2>
            <span className="text-muted-foreground">
              {filteredProducts.length} items
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No products found
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default QuickOrderHome;
