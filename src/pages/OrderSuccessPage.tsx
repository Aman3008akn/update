import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F7F9FC] px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </motion.div>

        <h1 className="text-3xl font-bold text-[#2C3E50] mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your Cash on Delivery order has been successfully placed and is being processed.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <ShoppingBag className="w-4 h-4 mr-2" />
            What happens next?
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• You will receive an email confirmation shortly.</li>
            <li>• We will process your order within 24 hours.</li>
            <li>• Pay the delivery executive in cash when your order arrives.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link to="/">
            <Button className="w-full bg-[#F5C842] hover:bg-[#F5C842]/90 text-[#2C3E50] font-bold h-12 rounded-xl text-lg">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/orders">
            <Button variant="outline" className="w-full h-12 rounded-xl text-gray-600 font-semibold border-gray-200">
              View Order History
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
