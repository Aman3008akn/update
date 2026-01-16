import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--primary-color,#2C3E50)] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[var(--secondary-color,#F5C842)] rounded-lg flex items-center justify-center">
                <span className="text-[var(--primary-color,#2C3E50)] font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold">MythManga</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your ultimate destination for anime and manga merchandise. Quality products for passionate fans.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/catalog/figurines" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Figurines</Link></li>
              <li><Link to="/catalog/manga" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Manga</Link></li>
              <li><Link to="/catalog/posters" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Posters</Link></li>
              <li><Link to="/catalog/apparel" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Apparel</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/contact" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[var(--secondary-color,#F5C842)] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[var(--secondary-color,#F5C842)] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/aman_shukla___14" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[var(--secondary-color,#F5C842)] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[var(--secondary-color,#F5C842)] transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 MythManga. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}