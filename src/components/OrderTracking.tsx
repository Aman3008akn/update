import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, MapPin, Clock } from 'lucide-react';

interface OrderTrackingProps {
  orderId: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered';
  orderDate: string;
  estimatedDelivery?: string;
}

const trackingSteps = [
  {
    status: 'confirmed',
    title: 'Order Confirmed',
    description: 'Your order has been placed',
    icon: CheckCircle,
  },
  {
    status: 'shipped',
    title: 'Shipped',
    description: 'Package has been dispatched',
    icon: Package,
  },
  {
    status: 'out_for_delivery',
    title: 'Out for Delivery',
    description: 'Package is on the way',
    icon: Truck,
  },
  {
    status: 'delivered',
    title: 'Delivered',
    description: 'Package has been delivered',
    icon: MapPin,
  },
];

export default function OrderTracking({ 
  orderId, 
  status, 
  orderDate,
  estimatedDelivery 
}: OrderTrackingProps) {
  const getCurrentStepIndex = () => {
    return trackingSteps.findIndex(step => step.status === status);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-white border-2 border-black rounded-lg neo-shadow p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
          Track Your Order
        </h3>
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">
            Order ID: <span className="font-bold text-foreground">{orderId}</span>
          </p>
          {estimatedDelivery && (
            <div className="flex items-center gap-2 text-primary font-bold">
              <Clock className="w-4 h-4" />
              <span>Arriving by {estimatedDelivery}</span>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {trackingSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.status} className="relative flex items-start gap-4 pb-8 last:pb-0">
              {/* Vertical Line */}
              {index < trackingSteps.length - 1 && (
                <div className="absolute left-6 top-14 w-0.5 h-full -translate-x-1/2">
                  <motion.div
                    className="h-full bg-gradient-to-b from-primary to-gray-300"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    style={{ transformOrigin: 'top' }}
                  />
                  {!isCompleted && (
                    <div className="h-full bg-gray-300" />
                  )}
                </div>
              )}

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.1
                }}
                className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 border-black neo-shadow ${
                  isCompleted
                    ? 'bg-primary'
                    : 'bg-gray-200'
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isCompleted ? 'text-white' : 'text-gray-400'
                  }`}
                />
                
                {/* Pulse Animation for Current Step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 0, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex-1 pt-1"
              >
                <div className={`font-bold text-lg ${
                  isCompleted ? 'text-foreground' : 'text-gray-400'
                }`}>
                  {step.title}
                </div>
                <div className={`text-sm ${
                  isCompleted ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </div>
                
                {/* Current Status Badge */}
                {isCurrent && (
                  <motion.div
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    className="inline-block mt-2 px-3 py-1 bg-secondary text-black text-xs font-bold rounded-full border-2 border-black neo-shadow-sm"
                  >
                    Current Status
                  </motion.div>
                )}

                {/* Completion Checkmark Animation */}
                {isCompleted && index < currentStepIndex && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: 'spring',
                      delay: index * 0.2 + 0.3
                    }}
                    className="inline-flex items-center gap-1 mt-2 text-green-600 text-xs font-bold"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed</span>
                  </motion.div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-bold mb-1">Delivery Information</p>
            <p>Your package is being carefully handled and will reach you soon. You'll receive notifications at every step.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
