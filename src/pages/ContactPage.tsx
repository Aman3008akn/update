import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or concerns? Our dedicated customer service team is here to help you with any inquiries about your MythManga Store experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="bg-[#F7F9FC] rounded-2xl p-8 h-full">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#F5C842] rounded-lg p-3">
                    <Mail className="w-6 h-6 text-[#2C3E50]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-[#2C3E50]">Email Us</h3>
                    <p className="text-gray-600 mt-1">support@mythmanga.com</p>
                    <p className="text-gray-600">careers@mythmanga.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#F5C842] rounded-lg p-3">
                    <Phone className="w-6 h-6 text-[#2C3E50]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-[#2C3E50]">Call Us</h3>
                    <p className="text-gray-600 mt-1">+91 7084317918</p>
                    <p className="text-gray-600">Monday-Friday, 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#F5C842] rounded-lg p-3">
                    <MapPin className="w-6 h-6 text-[#2C3E50]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-[#2C3E50]">Visit Us</h3>
                    <p className="text-gray-600 mt-1">MythManga Store Headquarters</p>
                    <p className="text-gray-600">123 Anime Street, Manga District</p>
                    <p className="text-gray-600">Tokyo, Japan 100-0001</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-[#F5C842] rounded-lg p-3">
                    <Clock className="w-6 h-6 text-[#2C3E50]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-[#2C3E50]">Business Hours</h3>
                    <p className="text-gray-600 mt-1">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM IST</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-[#2C3E50] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#F5C842] transition-colors">
                    <span className="text-white font-bold">f</span>
                  </div>
                  <div className="w-10 h-10 bg-[#2C3E50] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#F5C842] transition-colors">
                    <span className="text-white font-bold">t</span>
                  </div>
                  <div className="w-10 h-10 bg-[#2C3E50] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#F5C842] transition-colors">
                    <span className="text-white font-bold">in</span>
                  </div>
                  <div className="w-10 h-10 bg-[#2C3E50] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#F5C842] transition-colors">
                    <span className="text-white font-bold">ig</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <div className="bg-[#F7F9FC] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-[#2C3E50]">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-[#2C3E50]">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject" className="text-[#2C3E50]">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-[#2C3E50]">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="mt-1"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#F5C842] hover:bg-[#F5C842]/90 text-[#2C3E50] font-semibold h-12"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}