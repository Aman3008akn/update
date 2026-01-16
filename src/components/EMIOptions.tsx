import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Check, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EMIOptionsProps {
  amount: number;
  onSelectEMI: (months: number, monthlyPayment: number) => void;
}

const emiPlans = [
  { months: 3, interestRate: 0 },
  { months: 6, interestRate: 0 },
  { months: 9, interestRate: 12 },
  { months: 12, interestRate: 12 },
];

export default function EMIOptions({ amount, onSelectEMI }: EMIOptionsProps) {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const calculateEMI = (principal: number, months: number, rate: number) => {
    if (rate === 0) {
      return principal / months;
    }
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                 (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  };

  const handleSelectPlan = (months: number) => {
    const plan = emiPlans.find(p => p.months === months);
    if (plan) {
      const monthlyPayment = calculateEMI(amount, months, plan.interestRate);
      setSelectedPlan(months);
      onSelectEMI(months, monthlyPayment);
    }
  };

  // Only show EMI if amount is above ₹3000
  if (amount < 3000) {
    return null;
  }

  return (
    <div className="border-2 border-black rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50 neo-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-full p-2 border-2 border-black">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Buy Now, Pay Later</h3>
            <p className="text-sm text-gray-600">No Cost EMI available</p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* EMI Plans */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {emiPlans.map((plan) => {
          const monthlyPayment = calculateEMI(amount, plan.months, plan.interestRate);
          const isSelected = selectedPlan === plan.months;
          const isNoCost = plan.interestRate === 0;

          return (
            <motion.button
              key={plan.months}
              onClick={() => handleSelectPlan(plan.months)}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 neo-shadow'
                  : 'border-black bg-white hover:border-primary hover:bg-primary/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isNoCost && (
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white border-2 border-black text-xs">
                  No Cost
                </Badge>
              )}
              
              <div className="text-left">
                <div className="font-bold text-2xl text-foreground mb-1">
                  ₹{Math.round(monthlyPayment).toLocaleString('en-IN')}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  for {plan.months} months
                </div>
                {plan.interestRate > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {plan.interestRate}% p.a.
                  </div>
                )}
              </div>

              {/* Checkmark */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-2 right-2 bg-primary rounded-full p-1 border-2 border-black"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Plan Details */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-2 border-black rounded-lg p-4 neo-shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-600">Monthly Payment</span>
              <span className="text-lg font-bold text-primary">
                ₹{Math.round(calculateEMI(
                  amount,
                  selectedPlan,
                  emiPlans.find(p => p.months === selectedPlan)?.interestRate || 0
                )).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-600">Duration</span>
              <span className="text-sm font-medium">{selectedPlan} months</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-600">Total Amount</span>
              <span className="text-sm font-medium">
                ₹{Math.round(calculateEMI(
                  amount,
                  selectedPlan,
                  emiPlans.find(p => p.months === selectedPlan)?.interestRate || 0
                ) * selectedPlan).toLocaleString('en-IN')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EMI Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-sm text-gray-700"
          >
            <p className="font-bold text-blue-900 mb-2">How EMI Works:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Pay a small amount every month instead of full payment</li>
              <li>3 & 6 months EMI available at 0% interest</li>
              <li>Instant approval with eligible cards</li>
              <li>Powered by Razorpay secure payments</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bank Logos */}
      <div className="mt-4 pt-4 border-t border-gray-300">
        <p className="text-xs text-gray-500 mb-2 font-medium">Available on cards from:</p>
        <div className="flex items-center gap-3 flex-wrap">
          {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak'].map((bank) => (
            <div
              key={bank}
              className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700"
            >
              {bank}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
