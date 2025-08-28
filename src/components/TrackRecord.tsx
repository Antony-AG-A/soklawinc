import React, { useEffect, useRef, useState } from 'react';

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [countTrigger, setCountTrigger] = useState(0);

  const reasons = [
    {
      title: 'Expert Legal Team',
      description: 'Our seasoned attorneys bring decades of combined experience and specialized knowledge to every case.',
      image: 'data:image/png;base64,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',
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