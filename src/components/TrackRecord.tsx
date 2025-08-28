import React, { useEffect, useRef, useState } from 'react';

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [countTrigger, setCountTrigger] = useState(0);

  const reasons = [
    {
      title: 'Expert Legal Team',
      description: 'Our seasoned attorneys bring decades of combined experience and specialized knowledge to every case.',
      image: 'https://static.vecteezy.com/system/resources/previews/027/581/574/non_2x/legal-advisor-glyph-icon-for-personal-and-commercial-use-free-vector.jpg',
      color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      stat: '25+',
      statLabel: 'Years Experience'
    },
    {
      title: '24/7 Client Support',
      description: 'Round-the-clock availability ensures you always have access to legal guidance when you need it most.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5G_lXK5cROdWBjbkK6h3rghuHW1pcfFwDfg&s',
      color: 'bg-gradient-to-br from-green-400 to-blue-500',
      stat: '24/7',
      statLabel: 'Availability'
    },
    {
      title: 'Proven Track Record',
      description: 'Consistently delivering favorable outcomes through strategic litigation and skilled negotiation.',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
      color: 'bg-gradient-to-br from-purple-400 to-pink-500',
      stat: '95%',
      statLabel: 'Success Rate'
    },
    {
      title: 'Personalized Approach',
      description: 'Every client receives individualized attention with legal strategies tailored to their unique situation.',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop',
      color: 'bg-gradient-to-br from-blue-400 to-indigo-500',
      stat: '1:1',
      statLabel: 'Personal Attention'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          setVisible(isVisible);
          if (isVisible) {
            setCountTrigger((prev) => prev + 1);
            const cards = entry.target.querySelectorAll('.reason-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-fade-in-up');
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Why Choose Us
          </h2>
          <p className="text-xl max-w-3xl mx-auto animate-fade-in-delay">
            Discover the reasons why clients trust us with their most important legal matters
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-600 to-yellow-500 mx-auto mt-6 animate-scale-in"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => {
            const displayStat = typeof reason.stat === 'string' ? reason.stat : 
                               (reason.stat === 95 ? `${Math.round(visible ? 95 : 0)}%` : 
                                reason.stat === 25 ? `${Math.round(visible ? 25 : 0)}+` : reason.stat);
            
            return (
              <div key={index} className="reason-card opacity-0 relative group">
                <div className="modern-card overflow-hidden transform hover:-translate-y-2 transition-all duration-500 group-hover:shadow-2xl">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={reason.image} 
                      alt={reason.title}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.backgroundImage = `linear-gradient(135deg, ${reason.color.includes('yellow') ? '#f59e0b, #ea580c' : reason.color.includes('green') ? '#10b981, #3b82f6' : reason.color.includes('purple') ? '#a855f7, #ec4899' : '#3b82f6, #6366f1'})`;
                        e.target.parentElement.style.display = 'flex';
                        e.target.parentElement.style.alignItems = 'center';
                        e.target.parentElement.style.justifyContent = 'center';
                        const placeholder = document.createElement('div');
                        placeholder.className = 'text-white text-6xl font-bold';
                        placeholder.textContent = reason.title.charAt(0);
                        e.target.parentElement.appendChild(placeholder);
                      }}
                    />
                    <div className={`absolute inset-0 ${reason.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    
                    {/* Stat Overlay */}
                    <div className="absolute top-4 right-4 bg-white/95 rounded-lg px-3 py-2 backdrop-blur-sm shadow-lg border border-white/20">
                      <div className="text-2xl font-bold text-gray-900">{displayStat}</div>
                      <div className="text-xs text-gray-600 font-medium">{reason.statLabel}</div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">
                      {reason.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .modern-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.3s both;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 1s ease-out 0.6s both;
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;