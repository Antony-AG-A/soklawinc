import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Linkedin, Mail, Phone, Users, Award, MapPin } from 'lucide-react';
import { partners, getTeamByCategory } from '../data/teamData';

const Team = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const teamByCategory = getTeamByCategory();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.team-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-fade-in-up');
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePartnerClick = (partner: any) => {
    setSelectedPartner(partner);
  };

  const handleCloseProfile = () => {
    setSelectedPartner(null);
  };

  // Navigate to dedicated team page using client-side routing
  const handleViewAllTeam = () => {
    navigate('/team'); // No page refresh, uses React Router
  };

  return (
    <section ref={sectionRef} id="team" className="py-20 brand-section-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Our Legal Team
          </h2>
          <p className="text-xl max-w-3xl mx-auto animate-fade-in-delay">
            Meet our experienced team of legal professionals dedicated to providing 
            exceptional legal services and achieving the best outcomes for our clients.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-600 to-yellow-500 mx-auto mt-6 animate-scale-in"></div>
        </div>

        {/* Partner Profiles Modal */}
        {selectedPartner && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="min-h-screen px-4 py-8 flex items-center justify-center">
              <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 relative">
                <button
                  onClick={handleCloseProfile}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
                
                <div className="text-center">
                  <img
                    src={selectedPartner.image}
                    alt={selectedPartner.name}
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-lg"
                  />
                  <h3 className="text-2xl font-bold mb-2">{selectedPartner.name}</h3>
                  <p className="font-semibold text-lg mb-3 text-yellow-600">{selectedPartner.role}</p>
                  <p className="mb-6 text-gray-600">{selectedPartner.specialization}</p>
                  <p className="text-gray-700 leading-relaxed mb-6">{selectedPartner.description}</p>
                  
                  {/* Experience and Expertise */}
                  <div className="text-left space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                      <p className="text-gray-600">{selectedPartner.experience}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Areas of Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPartner.expertise?.map((area: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact */}
                  <div className="flex justify-center space-x-4 mt-6">
                    <a
                      href={`mailto:${selectedPartner.email}`}
                      className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-yellow-600 hover:text-white transition-all duration-300"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                    <a
                      href={`tel:${selectedPartner.phone}`}
                      className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-800 hover:text-white transition-all duration-300"
                    >
                      <Phone className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {partners.slice(0, 3).map((member, index) => (
            <div
              key={index}
              className="team-card opacity-0 group cursor-pointer"
              onClick={() => handlePartnerClick(member)}
            >
              {/* Professional Card Design */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-3 border border-gray-100">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10 flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white/20 group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1 text-white">
                        {member.name}
                      </h3>
                      <p className="text-yellow-300 font-semibold text-sm mb-1">
                        {member.role}
                      </p>
                      <p className="text-blue-100 text-sm">
                        {member.experience}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Specialization */}
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Award className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-700">Specialization</span>
                    </div>
                    <p className="text-gray-800 font-medium">
                      {member.specialization}
                    </p>
                  </div>

                  {/* Key Expertise */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.expertise.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{member.expertise.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-3">
                        <a
                          href={`mailto:${member.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                        <a
                          href={`tel:${member.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
                          title="Call"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                        <a
                          href="#"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                          title="LinkedIn"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center group/btn">
                        View Profile
                        <svg className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-lg mb-8 animate-fade-in">
            Meet our complete legal team organized by expertise and experience levels
          </p>
          <button 
            className="btn-primary transform hover:scale-105 shadow-lg animate-fade-in-delay flex items-center space-x-2 mx-auto"
            onClick={handleViewAllTeam}
          >
            <Users className="h-5 w-5" />
            <span>View All Team Members</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Team;