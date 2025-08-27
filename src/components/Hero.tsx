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
      className="relative h-[70vh] sm:h-screen flex items-center justify-center overflow-hidden"
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
            className="w-full h-full object-cover object-center max-h-[70vh] sm:max-h-full"
          />
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
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up">
          <div className="min-h-[140px] flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl lg:text-4xl font-bold mb-4 transition-all duration-500 drop-shadow-2xl tracking-wide" 
                style={{ fontFamily: 'Georgia, serif', color: '#FFFFFF', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              {slides[currentSlide].title}
            </h3>
            <p className="text-base md:text-lg lg:text-xl text-yellow-200 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-500 drop-shadow-xl font-semibold" 
               style={{ fontFamily: 'system-ui, -apple-system, sans-serif', textShadow: '2px 2px 0px #654321, 3px 3px 6px rgba(0,0,0,0.9)' }}>
              {slides[currentSlide].description}
            </p>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delay">
          <button
            onClick={scrollToContact}
            className="group btn-primary flex items-center space-x-2 transform hover:scale-105 shadow-lg"
          >
            <Phone className="h-5 w-5" />
            <span>Get Legal Consultation</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={scrollToServices}
            className="group btn-outline flex items-center space-x-2 transform hover:scale-105 shadow-lg"
          >
            <span>Our Services</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;