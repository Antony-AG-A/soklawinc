import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Linkedin, Award, BookOpen, Scale } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { teamMembers, TeamMember } from '../data/teamData';

const TeamPage = () => {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Handle back navigation using browser history
  const handleBackToHome = () => {
    navigate(-1); // Uses browser history without page refresh
  };

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleCloseProfile = () => {
    setSelectedMember(null);
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen brand-section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Back Button */}
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors font-medium group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Legal Team
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Meet our experienced team of legal professionals dedicated to providing 
              exceptional legal services and achieving the best outcomes for our clients.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-600 to-yellow-500 mx-auto mt-6"></div>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => handleMemberClick(member)}
                className="modern-card overflow-hidden transform hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="team-img group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">
                    {member.name}
                  </h3>
                  <p className="font-semibold text-lg mb-3 text-yellow-600">
                    {member.role}
                  </p>
                  <p className="mb-4">
                    {member.specialization}
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    {member.experience}
                  </p>

                  {/* Qualifications */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">Qualifications</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.qualifications.slice(0, 2).map((qual, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Icons */}
                  <div className="flex space-x-4">
                    <a
                      href={`mailto:${member.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-yellow-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                    <a
                      href={`tel:${member.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-800 hover:text-white transition-all duration-300 transform hover:scale-110"
                    >
                      <Phone className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Profile Modal */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="min-h-screen px-4 py-8">
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="relative p-6 border-b border-gray-200">
                  <button
                    onClick={handleCloseProfile}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </button>
                </div>

                {/* Member Profile Content */}
                <div className="p-8">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Image and Basic Info */}
                    <div className="lg:col-span-1">
                      <div className="text-center">
                        <img
                          src={selectedMember.image}
                          alt={selectedMember.name}
                          className="w-48 h-48 rounded-full mx-auto mb-6 object-cover shadow-lg"
                        />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMember.name}</h2>
                        <p className="text-lg font-semibold text-yellow-600 mb-2">{selectedMember.role}</p>
                        <p className="text-gray-600 mb-6">{selectedMember.specialization}</p>
                        
                        {/* Contact Info */}
                        <div className="space-y-3">
                          <a
                            href={`mailto:${selectedMember.email}`}
                            className="flex items-center justify-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors"
                          >
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">{selectedMember.email}</span>
                          </a>
                          <a
                            href={`tel:${selectedMember.phone}`}
                            className="flex items-center justify-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors"
                          >
                            <Phone className="h-4 w-4" />
                            <span className="text-sm">{selectedMember.phone}</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Information */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                        <p className="text-gray-600 leading-relaxed">{selectedMember.description}</p>
                      </div>

                      {/* Experience */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Experience</h3>
                        <p className="text-gray-600">{selectedMember.experience}</p>
                      </div>

                      {/* Expertise */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Areas of Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.expertise.map((area, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Education</h3>
                        <ul className="space-y-2">
                          {selectedMember.education.map((edu, index) => (
                            <li key={index} className="text-gray-600 flex items-start">
                              <BookOpen className="h-4 w-4 mt-1 mr-2 text-yellow-600 flex-shrink-0" />
                              {edu}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Achievements */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Key Achievements</h3>
                        <ul className="space-y-2">
                          {selectedMember.achievements.map((achievement, index) => (
                            <li key={index} className="text-gray-600 flex items-start">
                              <Award className="h-4 w-4 mt-1 mr-2 text-yellow-600 flex-shrink-0" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TeamPage;