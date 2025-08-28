import React, { useState, useEffect } from 'react';
import { ArrowRight, Phone, Scale } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://i.postimg.cc/Px2cZQf5/7-X2-A2923-1.jpg',
      title: 'YOUR TRUSTED LEGAL PARTNERS',
      description: 'Providing exceptional legal services with integrity and expertise.',
    },
    {
      image: 'https://i.postimg.cc/d09SPjyj/7-X2-A2913-1.jpg',
      title: 'STRENGTH THROUGH COLLABORATION',
      description: 'Our experienced team delivers comprehensive legal solutions.',
    },
    {
      image: 'https://i.postimg.cc/Wzd9ZRf5/7X2A2982.jpg',
      title: 'COMPASSIONATE ADVOCACY',
      description: 'Professional excellence combined with genuine care for clients.',
    },
    {
      image: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'JUSTICE FOR EVERYONE',
      description: 'Making quality legal representation accessible to all.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
        </div>
      ))}

      {/* Navigation Areas */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-0 w-1/2 h-[60%] z-20 opacity-0 cursor-pointer"
        aria-label="Previous Slide"
      />
      <button
        onClick={nextSlide}
        className="absolute right-0 top-0 w-1/2 h-[60%] z-20 opacity-0 cursor-pointer"
        aria-label="Next Slide"
      />

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up">
          {/* Logo/Icon */}
          <div className="mb-6 md:mb-8">
            <Scale className="h-16 w-16 md:h-20 md:w-20 text-yellow-400 mx-auto mb-4" />
          </div>

          {/* Main Heading */}
          <div className="min-h-[120px] md:min-h-[140px] flex flex-col justify-center mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 transition-all duration-500 drop-shadow-2xl tracking-wide leading-tight" 
                style={{ 
                  fontFamily: 'Georgia, serif', 
                  color: '#FFFFFF', 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)' 
                }}>
              {slides[currentSlide].title}
            </h1>
            
            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-yellow-200 max-w-4xl mx-auto leading-relaxed transition-all duration-500 drop-shadow-xl font-semibold px-4" 
               style={{ 
                 fontFamily: 'system-ui, -apple-system, sans-serif', 
                 textShadow: '2px 2px 0px #654321, 3px 3px 6px rgba(0,0,0,0.9)' 
               }}>
              {slides[currentSlide].description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center animate-fade-in-up-delay px-4">
          <button
            onClick={scrollToContact}
            className="group w-full sm:w-auto bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-semibold py-4 px-8 md:py-5 md:px-10 rounded-xl transition-all duration-300 transform hover:scale-105 hover:from-yellow-700 hover:to-yellow-600 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 min-h-[56px] md:min-h-[64px]"
          >
            <Phone className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-base md:text-lg">Get Legal Consultation</span>
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={scrollToServices}
            className="group w-full sm:w-auto bg-transparent border-2 border-white text-white font-semibold py-4 px-8 md:py-5 md:px-10 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-gray-900 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 min-h-[56px] md:min-h-[64px]"
          >
            <span className="text-base md:text-lg">Our Services</span>
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 md:mt-16 animate-fade-in-delay">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/90">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm md:text-base font-medium">15+ Years Experience</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm md:text-base font-medium">500+ Cases Won</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm md:text-base font-medium">98% Success Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 md:space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 z-20 animate-bounce">
        <div className="w-6 h-10 md:w-8 md:h-12 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/75 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;