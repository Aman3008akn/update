import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { products } from '@/data/products';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Smart search with instant results
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-paper border-b-2 border-black shadow-sm mt-0 pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center border-2 border-black neo-shadow-sm group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-transform">
              <span className="text-white font-heading font-bold text-2xl">M</span>
            </div>
            <span className="text-2xl font-heading font-bold text-foreground tracking-tight">MythManga</span>
          </Link>

          {/* Search Bar - Desktop with Smart Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div ref={searchRef} className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-primary transition-colors z-10" />
              <Input
                type="text"
                placeholder="Search for loot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="pl-10 pr-4 w-full border-2 border-black rounded-lg focus:ring-0 focus:border-primary focus:neo-shadow transition-all font-medium bg-white"
              />
              
              {/* Smart Search Dropdown */}
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 w-full bg-white border-2 border-black rounded-lg neo-shadow-lg overflow-hidden z-50"
                  >
                    {searchResults.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded border border-black"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-foreground truncate">{product.name}</h4>
                          <p className="text-xs text-gray-600">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-primary">₹{product.price.toLocaleString('en-IN')}</p>
                          {product.originalPrice && (
                            <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {searchResults.length === 5 && (
                      <div className="p-3 text-center border-t-2 border-black bg-secondary/20">
                        <button
                          type="submit"
                          className="text-sm font-bold text-primary hover:underline"
                        >
                          View all results →
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex relative hover:bg-transparent group"
              onClick={() => navigate('/wishlist')}
            >
              <Heart className="w-6 h-6 text-foreground group-hover:text-accent group-hover:fill-accent transition-colors" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-transparent group"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-secondary text-black border-2 border-black hover:bg-secondary px-1.5 py-0.5 text-xs font-bold neo-shadow-sm">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent group">
                  <User className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-2 border-black neo-shadow bg-paper rounded-lg p-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-2 py-2 text-sm font-bold text-foreground bg-secondary/20 rounded mb-1">
                      {user?.name}
                    </div>
                    <DropdownMenuSeparator className="bg-black/10" />
                    <DropdownMenuItem className="font-medium cursor-pointer focus:bg-primary/20 focus:text-primary" onClick={() => navigate('/account')}>
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-medium cursor-pointer focus:bg-primary/20 focus:text-primary" onClick={() => navigate('/orders')}>
                      Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-medium cursor-pointer focus:bg-primary/20 focus:text-primary" onClick={() => navigate('/wishlist')}>
                      Wishlist
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator className="bg-black/10" />
                        <DropdownMenuItem className="font-bold text-primary cursor-pointer focus:bg-primary/20" onClick={() => navigate('/admin')}>
                          Admin Dashboard
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-black/10" />
                    <DropdownMenuItem className="text-destructive font-medium cursor-pointer focus:bg-destructive/10" onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem className="font-bold cursor-pointer focus:bg-primary/20" onClick={() => navigate('/login')}>
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-bold cursor-pointer focus:bg-primary/20" onClick={() => navigate('/signup')}>
                      Sign Up
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-paper border-l-2 border-black">
                <div className="flex flex-col space-y-6 mt-8">
                  <form onSubmit={handleSearch} className="w-full">
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-2 border-black rounded-lg"
                    />
                  </form>
                  <Link to="/catalog/figurines" className="text-xl font-heading font-bold text-foreground hover:text-primary transition-colors">
                    Figurines
                  </Link>
                  <Link to="/catalog/manga" className="text-xl font-heading font-bold text-foreground hover:text-primary transition-colors">
                    Manga
                  </Link>
                  <Link to="/catalog/posters" className="text-xl font-heading font-bold text-foreground hover:text-primary transition-colors">
                    Posters
                  </Link>
                  <Link to="/catalog/accessories" className="text-xl font-heading font-bold text-foreground hover:text-primary transition-colors">
                    Accessories
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Category Bar - Desktop */}
      <div className="hidden md:block border-t-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 h-12 text-sm font-heading font-bold tracking-wide uppercase">
            <Link to="/catalog/figurines" className="text-foreground hover:text-primary hover:underline decoration-2 underline-offset-4 transition-all">
              Figurines
            </Link>
            <Link to="/catalog/manga" className="text-foreground hover:text-primary hover:underline decoration-2 underline-offset-4 transition-all">
              Manga
            </Link>
            <Link to="/catalog/posters" className="text-foreground hover:text-primary hover:underline decoration-2 underline-offset-4 transition-all">
              Posters
            </Link>
            <Link to="/catalog/accessories" className="text-foreground hover:text-primary hover:underline decoration-2 underline-offset-4 transition-all">
              Accessories
            </Link>
            <Link to="/catalog/tech-gadgets" className="text-foreground hover:text-primary hover:underline decoration-2 underline-offset-4 transition-all">
              Tech Gadgets
            </Link>
            <Link to="/catalog/apparel" className="text-foreground hover:text-primary hover:underline decoration-2 underline-offset-4 transition-all">
              Apparel
            </Link>
            <Link to="/catalog/mystery-boxes" className="text-secondary-foreground hover:text-accent hover:underline decoration-2 underline-offset-4 transition-all flex items-center">
              <span className="mr-1">🎁</span> Mystery Boxes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}