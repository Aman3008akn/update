import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { X } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function WhatsAppSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { settings } = useSiteSettings();

  // If WhatsApp is disabled in settings, don't render
  if (settings.whatsapp_enabled === false) {
    return null;
  }

  // Get WhatsApp number and message from settings
  const whatsappNumber = settings.whatsapp_number || '919876543210';
  const defaultMessage = settings.whatsapp_message || 'Hi! I need help with...';
  const position = settings.whatsapp_position || 'bottom-right';
  
  const handleSendMessage = () => {
    const text = message || defaultMessage;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  const quickMessages = [
    'I need help with my order',
    'Product information needed',
    'Payment issue',
    'Shipping & delivery query',
  ];

  // Dynamic position classes
  const positionClasses = position === 'bottom-left' 
    ? 'left-6' 
    : 'right-6';
  
  const chatPositionClasses = position === 'bottom-left'
    ? 'left-6'
    : 'right-6';
  
  const tooltipPositionClasses = position === 'bottom-left'
    ? 'left-full ml-3'
    : 'right-full mr-3';
  
  const tooltipArrowClasses = position === 'bottom-left'
    ? 'left-0 -translate-x-full border-r-8 border-r-black'
    : 'right-0 translate-x-full border-l-8 border-l-black';

  return (
    <>
      {/* Floating WhatsApp Button */}
      <motion.div
        className={`fixed bottom-6 ${positionClasses} z-50`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#25D366] text-white rounded-full p-4 shadow-2xl border-2 border-black neo-shadow hover:neo-shadow-lg transition-shadow relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <FaWhatsapp className="w-8 h-8" />
          
          {/* Notification Pulse */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
        </motion.button>

        {/* Tooltip */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: position === 'bottom-left' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 }}
            className={`absolute ${tooltipPositionClasses} top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-lg border-2 border-black neo-shadow whitespace-nowrap`}
          >
            <p className="font-bold text-sm">Need help? Chat with us!</p>
            <div className={`absolute ${position === 'bottom-left' ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent ${position === 'bottom-left' ? 'border-r-8 border-r-black' : 'border-l-8 border-l-black'}`} />
            <div className={`absolute ${position === 'bottom-left' ? 'left-0 -translate-x-[calc(100%-4px)]' : 'right-0 translate-x-[calc(100%-4px)]'} top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ${position === 'bottom-left' ? 'border-r-[6px] border-r-white' : 'border-l-[6px] border-l-white'}`} />
          </motion.div>
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed bottom-24 ${chatPositionClasses} w-80 bg-white border-2 border-black rounded-lg neo-shadow-lg z-50 overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 flex items-center justify-between border-b-2 border-black">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-full p-2 border-2 border-black">
                  <FaWhatsapp className="w-6 h-6 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Customer Support</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    <span className="text-xs text-white">Online now</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-[#ECE5DD] min-h-[200px]">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-3 border-2 border-black neo-shadow-sm mb-4 relative"
              >
                <p className="text-sm text-gray-700">
                  👋 Hi! How can we help you today?
                </p>
                <div className="absolute -left-2 top-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black" />
                <div className="absolute -left-[6px] top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-white" />
              </motion.div>

              {/* Quick Messages */}
              <div className="space-y-2 mb-4">
                {quickMessages.map((msg, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    onClick={() => {
                      setMessage(msg);
                      handleSendMessage();
                    }}
                    className="w-full text-left text-sm bg-white border-2 border-black rounded-lg p-2 hover:bg-primary/10 transition-colors neo-shadow-sm hover:neo-shadow font-medium"
                  >
                    {msg}
                  </motion.button>
                ))}
              </div>

              {/* Custom Message Input */}
              <div className="space-y-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full p-3 border-2 border-black rounded-lg resize-none focus:outline-none focus:border-primary font-medium text-sm"
                  rows={3}
                />
                <button
                  onClick={handleSendMessage}
                  className="w-full bg-[#25D366] text-white font-bold py-3 rounded-lg border-2 border-black neo-shadow hover:neo-shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Start Chat on WhatsApp
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 p-2 text-center border-t-2 border-black">
              <p className="text-xs text-gray-600">
                Usually replies within minutes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
