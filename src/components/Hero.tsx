import React, { useState, useEffect } from 'react';
import { ArrowRight, Phone } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image:
        'https://i.postimg.cc/Px2cZQf5/7-X2-A2923-1.jpg',
      title: 'YOUR TRUSTED LEGAL PARTNERS',
      description:
        "Providing exceptional legal services with integrity and expertise.",
    },
    {
      image:
        'https://i.postimg.cc/d09SPjyj/7-X2-A2913-1.jpg',
      title: 'STRENGTH THROUGH COLLABORATION',
      description:
        "Our experienced team delivers comprehensive legal solutions.",
    },
    {
      image:
        'https://i.postimg.cc/Wzd9ZRf5/7X2A2982.jpg',
      title: 'COMPASSIONATE ADVOCACY',
      description:
        'Professional excellence combined with genuine care for clients.',
    },
    {
      image:
        'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'JUSTICE FOR EVERYONE',
      description:
        'Making quality legal representation accessible to all.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      id="home"
      className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-full h-full relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              style={{
                objectPosition: 'center center',
                minHeight: '100%',
                minWidth: '100%'
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
        </div>
      ))}

      {/* Invisible Navigation Buttons (Only top 60%) */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-0 w-1/2 h-[60%] z-20 opacity-0"
        aria-label="Previous Slide"
      />
      <button
        onClick={nextSlide}
        className="absolute right-0 top-0 w-1/2 h-[60%] z-20 opacity-0"
        aria-label="Next Slide"
      />

        {/* Hero Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 md:mt-16 lg:mt-20">
        <div className="animate-fade-in-up">
          <div className="min-h-[100px] sm:min-h-[120px] flex flex-col justify-center mb-4 sm:mb-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 transition-all duration-500 drop-shadow-2xl tracking-wide leading-tight" 
                style={{ fontFamily: 'Georgia, serif', color: '#FFFFFF', textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}>
              {slides[currentSlide].title}
            </h3>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-yellow-100 mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed transition-all duration-500 drop-shadow-xl font-medium" 
               style={{ fontFamily: 'system-ui, -apple-system, sans-serif', textShadow: '2px 2px 0px #654321, 3px 3px 6px rgba(0,0,0,0.9)' }}>
              {slides[currentSlide].description}
            </p>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up-delay">
          <button
            onClick={scrollToContact}
            className="group flex items-center space-x-3 transform hover:scale-105 shadow-2xl px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 border-2 border-blue-500 hover:border-blue-400"
          >
            <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
            <span>Get Legal Consultation</span>
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={scrollToServices}
            className="group flex items-center space-x-3 transform hover:scale-105 shadow-2xl px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm"
          >
            <span>Our Services</span>
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }
        .animate-fade-in-up-delay {
          animation: fadeInUp 1s ease-out 0.3s both;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;