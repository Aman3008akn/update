import { RotateCcw, Package, Clock, FileText } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-4">Returns & Exchanges</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#F7F9FC] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[#F5C842] rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6 text-[#2C3E50]" />
            </div>
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">30-Day Returns</h3>
            <p className="text-gray-600">Return items within 30 days of delivery</p>
          </div>
          
          <div className="bg-[#F7F9FC] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[#F5C842] rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-[#2C3E50]" />
            </div>
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Free Returns</h3>
            <p className="text-gray-600">No return shipping costs for defective items</p>
          </div>
          
          <div className="bg-[#F7F9FC] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[#F5C842] rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-[#2C3E50]" />
            </div>
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Quick Processing</h3>
            <p className="text-gray-600">Refunds processed within 5-7 business days</p>
          </div>
        </div>

        <div className="bg-[#F7F9FC] rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Return Policy</h2>
          
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-3">Eligibility</h3>
            <p className="text-gray-600 mb-4">
              To be eligible for a return, your item must be unused and in the same condition that you received it. 
              It must also be in the original packaging.
            </p>
            
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-3">Non-Returnable Items</h3>
            <ul className="list-disc pl-5 text-gray-600 mb-4 space-y-2">
              <li>Opened manga or light novels</li>
              <li>Custom or personalized merchandise</li>
              <li>Intimate or sanitary goods</li>
              <li>Gift cards</li>
              <li>Downloadable software products</li>
              <li>Some health and wellness items</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-3">Refunds</h3>
            <p className="text-gray-600 mb-4">
              Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. 
              We will also notify you of the approval or rejection of your refund.
            </p>
            <p className="text-gray-600 mb-4">
              If your return is approved, then your refund will be processed, and a credit will automatically be applied to your credit card 
              or original method of payment, within a certain amount of days.
            </p>
            
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-3">Late or Missing Refunds</h3>
            <p className="text-gray-600 mb-4">
              If you haven't received a refund yet, first check your bank account again. Then contact your credit card company, 
              it may take some time before your refund is officially posted. Next contact your bank. There is often some processing time 
              before a refund is posted. If you've done all of this and still have not received your refund yet, please contact us at 
              support@mythmanga.com.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#F7F9FC] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">How to Return</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#F5C842] rounded-full flex items-center justify-center mt-1">
                  <span className="text-[#2C3E50] text-sm font-bold">1</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Contact Customer Service</h3>
                  <p className="text-gray-600">
                    Email us at support@mythmanga.com with your order number and reason for return. 
                    We'll provide you with a return authorization number and shipping instructions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#F5C842] rounded-full flex items-center justify-center mt-1">
                  <span className="text-[#2C3E50] text-sm font-bold">2</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Package Your Item</h3>
                  <p className="text-gray-600">
                    Pack the item securely in its original packaging if possible. Include all accessories, tags, and paperwork. 
                    Attach the return label we provide to your package.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#F5C842] rounded-full flex items-center justify-center mt-1">
                  <span className="text-[#2C3E50] text-sm font-bold">3</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Ship the Package</h3>
                  <p className="text-gray-600">
                    Drop off your package at the nearest shipping carrier location. 
                    Keep your receipt and tracking number for your records.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#F5C842] rounded-full flex items-center justify-center mt-1">
                  <span className="text-[#2C3E50] text-sm font-bold">4</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">Receive Your Refund</h3>
                  <p className="text-gray-600">
                    Once we receive and inspect your return, we'll process your refund. 
                    Refunds typically appear in your account within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#F7F9FC] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Exchanges</h2>
            
            <div className="space-y-6 mb-8">
              <p className="text-gray-600">
                We replace items if they are defective, damaged, or if you received the wrong item. 
                If you wish to exchange an item for a different size, color, or style, please return the original item 
                and place a new order for the replacement.
              </p>
              
              <div>
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-3">Defective or Damaged Items</h3>
                <p className="text-gray-600 mb-4">
                  If you receive a defective or damaged item, please contact us within 7 days of delivery. 
                  We'll arrange for a replacement or refund, including return shipping costs.
                </p>
                
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-3">Wrong Item Received</h3>
                <p className="text-gray-600">
                  If you received the wrong item, please contact us immediately with your order number and photos of the item received. 
                  We'll arrange for the correct item to be sent and the wrong item to be returned at our expense.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-[#2C3E50] mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Return Form
              </h3>
              <p className="text-gray-600 mb-3">
                When returning items, please include the completed return form with your package.
              </p>
              <button className="text-[#F5C842] font-semibold hover:underline">
                Download Return Form (PDF)
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#2C3E50] to-[#1a2530] rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Need Help with a Return?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl">
            Our customer service team is available to assist you with any questions about our return policy 
            or to help process your return. Contact us during business hours for the fastest assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-[#F5C842] text-[#2C3E50] font-semibold py-3 px-6 rounded-lg hover:bg-[#F5C842]/90 transition-colors">
              Contact Support
            </button>
            <button className="border border-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
              Start Return Process
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}