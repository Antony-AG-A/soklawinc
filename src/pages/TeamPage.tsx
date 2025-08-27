import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Linkedin, Award, BookOpen, Scale } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { teamMembers, TeamMember, getTeamByCategory } from '../data/teamData';

const TeamPage = () => {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const teamByCategory = getTeamByCategory();

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

          {/* Team Categories */}
          {Object.entries(teamByCategory).map(([category, members]) => (
            <div key={category} className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {members.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => handleMemberClick(member)}
                    className="group cursor-pointer"
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
            </div>
          ))}
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