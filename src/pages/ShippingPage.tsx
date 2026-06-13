import { Truck, Clock, Shield, MapPin } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-4">Shipping Information</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get your favorite anime merchandise delivered to your doorstep with our reliable shipping services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#F7F9FC] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[#F5C842] rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-[#2C3E50]" />
            </div>
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Get your orders within 3-7 business days</p>
          </div>
          
          <div className="bg-[#F7F9FC] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[#F5C842] rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-[#2C3E50]" />
            </div>
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Real-time Tracking</h3>
            <p className="text-gray-600">Track your package every step of the way</p>
          </div>
          
          <div className="bg-[#F7F9FC] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[#F5C842] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-[#2C3E50]" />
            </div>
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Secure Packaging</h3>
            <p className="text-gray-600">Premium packaging to protect your items</p>
          </div>
          
          <div className="bg-[#F7F9FC] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[#F5C842] rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-[#2C3E50]" />
            </div>
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Worldwide Shipping</h3>
            <p className="text-gray-600">We ship to over 100 countries</p>
          </div>
        </div>

        <div className="bg-[#F7F9FC] rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Shipping Rates & Delivery Times</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-[#2C3E50]">Destination</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#2C3E50]">Standard Shipping</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#2C3E50]">Express Shipping</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#2C3E50]">Delivery Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">India</td>
                  <td className="py-4 px-4 text-gray-600">₹99</td>
                  <td className="py-4 px-4 text-gray-600">₹199</td>
                  <td className="py-4 px-4 text-gray-600">3-5 business days</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">United States</td>
                  <td className="py-4 px-4 text-gray-600">$4.99</td>
                  <td className="py-4 px-4 text-gray-600">$9.99</td>
                  <td className="py-4 px-4 text-gray-600">5-10 business days</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">Europe</td>
                  <td className="py-4 px-4 text-gray-600">€4.99</td>
                  <td className="py-4 px-4 text-gray-600">€9.99</td>
                  <td className="py-4 px-4 text-gray-600">7-14 business days</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">Asia (excluding India)</td>
                  <td className="py-4 px-4 text-gray-600">$3.99</td>
                  <td className="py-4 px-4 text-gray-600">$7.99</td>
                  <td className="py-4 px-4 text-gray-600">5-10 business days</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-600">Rest of World</td>
                  <td className="py-4 px-4 text-gray-600">$7.99</td>
                  <td className="py-4 px-4 text-gray-600">$14.99</td>
                  <td className="py-4 px-4 text-gray-600">10-20 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              <span className="font-semibold">Free Shipping:</span> Enjoy free standard shipping on orders over ₹999 in India, $49 in the US, €49 in Europe, and $79 for the rest of the world.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#F7F9FC] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Order Processing</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-[#F5C842] rounded-full flex items-center justify-center mt-1">
                  <span className="text-[#2C3E50] text-xs font-bold">1</span>
                </div>
                <p className="ml-4 text-gray-600">Orders are processed within 1-2 business days after payment confirmation</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-[#F5C842] rounded-full flex items-center justify-center mt-1">
                  <span className="text-[#2C3E50] text-xs font-bold">2</span>
                </div>
                <p className="ml-4 text-gray-600">You will receive a confirmation email with tracking information</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-[#F5C842] rounded-full flex items-center justify-center mt-1">
                  <span className="text-[#2C3E50] text-xs font-bold">3</span>
                </div>
                <p className="ml-4 text-gray-600">Delivery times may vary during peak seasons or holidays</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-[#F5C842] rounded-full flex items-center justify-center mt-1">
                  <span className="text-[#2C3E50] text-xs font-bold">4</span>
                </div>
                <p className="ml-4 text-gray-600">International orders may be subject to customs duties and taxes</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#F7F9FC] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Special Handling</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Fragile Items</h3>
                <p className="text-gray-600">
                  Figurines and other fragile items are specially packaged with extra protection. 
                  A handling fee of ₹49/ $2.99 may apply for additional packaging.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Limited Edition Items</h3>
                <p className="text-gray-600">
                  Limited edition merchandise may have extended processing times of 3-5 business days 
                  due to special handling requirements.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Bulk Orders</h3>
                <p className="text-gray-600">
                  For orders with more than 10 items, please contact our customer service team for 
                  special shipping arrangements and discounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}