import { ChevronDown, ShoppingCart, Package, CreditCard, Shield, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      category: "Ordering & Payment",
      icon: <ShoppingCart className="w-5 h-5" />,
      questions: [
        {
          question: "How do I place an order?",
          answer: "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or log in if you already have one. Enter your shipping and payment information, review your order, and click 'Place Order'. You'll receive a confirmation email with your order details."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, and UPI payments. All transactions are secured with SSL encryption for your protection."
        },
        {
          question: "Is it safe to use my credit card on your site?",
          answer: "Absolutely. We use industry-standard SSL encryption to protect your personal and payment information. We do not store your credit card details on our servers. All payment processing is handled by trusted third-party payment processors."
        },
        {
          question: "Can I change or cancel my order after placing it?",
          answer: "You can cancel your order within 1 hour of placement by contacting our customer service team. After that, if the order has been processed, you'll need to follow our return policy for a refund."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      icon: <Package className="w-5 h-5" />,
      questions: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 3-7 business days within India, 5-10 business days to the United States, 7-14 business days to Europe, and 10-20 business days to the rest of the world. Express shipping options are available at checkout for faster delivery."
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes, we ship worldwide to over 100 countries. International shipping rates and delivery times vary by destination. Please check our Shipping Information page for detailed rates."
        },
        {
          question: "How much does shipping cost?",
          answer: "Shipping costs depend on your location and the weight of your order. We offer free standard shipping on orders over ₹999 in India, $49 in the US, €49 in Europe, and $79 for the rest of the world. Exact rates are calculated at checkout."
        },
        {
          question: "Will I receive tracking information?",
          answer: "Yes, once your order ships, you'll receive an email with tracking information and a link to monitor your package's journey to your doorstep."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      icon: <RotateCcw className="w-5 h-5" />,
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for most items. Items must be unused, in original packaging, and in the same condition as received. Certain items like opened manga or personalized merchandise are non-returnable. Please visit our Returns & Exchanges page for complete details."
        },
        {
          question: "How do I initiate a return?",
          answer: "To initiate a return, contact our customer service team at support@mythmanga.com with your order number and reason for return. We'll provide a return authorization number and shipping instructions. Refunds are processed within 5-7 business days after we receive the item."
        },
        {
          question: "Who pays for return shipping?",
          answer: "For defective or damaged items, we cover return shipping costs. For other returns, the customer is responsible for return shipping unless otherwise specified. Exchanges are treated as a return and new order."
        }
      ]
    },
    {
      category: "Products & Inventory",
      icon: <Shield className="w-5 h-5" />,
      questions: [
        {
          question: "Are all products officially licensed?",
          answer: "Yes, all our anime and manga merchandise is officially licensed from the respective copyright holders. We work directly with publishers and licensors to ensure authenticity."
        },
        {
          question: "How can I know if an item is in stock?",
          answer: "Product availability is displayed on each product page. If an item shows 'In Stock', it's available for immediate shipment. 'Out of Stock' items may be available for pre-order if they're upcoming releases."
        },
        {
          question: "Do you offer pre-orders?",
          answer: "Yes, we offer pre-orders for upcoming releases. Pre-ordered items will be shipped as soon as they become available. You'll receive email updates on the status of your pre-order."
        },
        {
          question: "What if I receive a damaged or defective item?",
          answer: "If you receive a damaged or defective item, please contact us within 7 days of delivery with photos of the damage. We'll arrange for a replacement or refund, including return shipping costs."
        }
      ]
    },
    {
      category: "Account & Privacy",
      icon: <Shield className="w-5 h-5" />,
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click the 'Sign Up' button at the top of any page. Enter your email address, create a password, and provide some basic information. You'll receive a confirmation email to verify your account."
        },
        {
          question: "How do you protect my personal information?",
          answer: "We take your privacy seriously. We use industry-standard security measures to protect your personal information. We do not sell or rent your personal information to third parties. For more details, please review our Privacy Policy."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account by contacting our customer service team. Please note that this will remove all your order history and saved information from our system."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about ordering, shipping, returns, and more.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-[#F7F9FC] rounded-2xl overflow-hidden">
              <div className="bg-[#2C3E50] text-white p-6">
                <h2 className="text-xl font-bold flex items-center">
                  <span className="mr-3 p-2 bg-[#F5C842] rounded-lg text-[#2C3E50]">
                    {category.icon}
                  </span>
                  {category.category}
                </h2>
              </div>
              
              <div className="p-6">
                {category.questions.map((faq, index) => {
                  const globalIndex = categoryIndex * 100 + index;
                  return (
                    <div key={index} className="border-b border-gray-200 last:border-b-0">
                      <button
                        className="flex justify-between items-center w-full py-4 text-left font-semibold text-[#2C3E50] hover:text-[#F5C842] transition-colors"
                        onClick={() => toggleAccordion(globalIndex)}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown 
                          className={`w-5 h-5 transition-transform duration-300 ${openIndex === globalIndex ? 'transform rotate-180' : ''}`} 
                        />
                      </button>
                      
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          openIndex === globalIndex ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="pb-4 text-gray-600">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-[#2C3E50] to-[#1a2530] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Our customer service team is ready to help you with any questions that aren't covered here. 
            We're available during business hours to provide you with the assistance you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#F5C842] text-[#2C3E50] font-semibold py-3 px-6 rounded-lg hover:bg-[#F5C842]/90 transition-colors">
              Contact Support
            </button>
            <button className="border border-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}