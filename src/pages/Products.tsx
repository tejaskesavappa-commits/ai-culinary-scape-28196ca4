import { useEffect, useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_LABELS, ProductCategory } from '@/types/database';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Loader2, Search, Filter, Package } from 'lucide-react';

const Products = () => {
  const { products, loading, selectedCategory, filterByCategory, cart } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30">
              Premium Shopping Experience
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Discover Amazing Products
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Shop from thousands of products across multiple categories with fast delivery and great prices
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base bg-card border-2 focus:border-primary"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-primary">{products.length}+</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-secondary">Fast</div>
              <div className="text-sm text-muted-foreground">Delivery</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-accent">Best</div>
              <div className="text-sm text-muted-foreground">Prices</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8 sticky top-20 z-10 bg-background/95 backdrop-blur-sm py-4 -mx-4 px-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-semibold">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => filterByCategory(null)}
              size="sm"
              className="transition-all"
            >
              All Products
            </Button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                onClick={() => filterByCategory(key as ProductCategory)}
                size="sm"
                className="transition-all"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading amazing products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
            <Button onClick={() => { setSearchQuery(''); filterByCategory(null); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
          <Button
            onClick={() => navigate('/checkout')}
            size="lg"
            className="h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform relative group"
          >
            <ShoppingCart className="w-6 h-6" />
            <Badge className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center p-0 rounded-full bg-destructive text-destructive-foreground group-hover:scale-110 transition-transform">
              {totalItems}
            </Badge>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Products;
