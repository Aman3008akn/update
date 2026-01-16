import { useState, useEffect } from 'react';

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const announcements = [
    "🌟 Web Designed By Aman Shukla 🌟",
    "🔥 Flat 50% OFF On New Collection 🔥",
    "🚚 Free Shipping On Orders Above ₹999 🚚"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        setIsFading(false);
      }, 500); // Half a second for fade out
    }, 3000); // 3 seconds per announcement

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#2C3E50] text-white py-3 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="relative h-6 w-full max-w-2xl overflow-hidden">
            <div 
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              <p className="font-bold text-sm md:text-base text-center text-white whitespace-nowrap">
                {announcements[currentIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}