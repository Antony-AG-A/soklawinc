import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    legalService: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.animate-on-scroll');
            elements.forEach((element, index) => {
              setTimeout(() => {
                element.classList.add('animate-fade-in-up');
              }, index * 100);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Instant form submission with multiple fallback strategies
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Strategy 1: Try EngageBay if available
      if (typeof window !== 'undefined' && window.EhForms && typeof window.EhForms.submitForm === 'function') {
        try {
          await window.EhForms.submitForm('6351369855041536', formData);
          setSubmitStatus('success');
          resetForm();
          setIsSubmitting(false);
          return;
        } catch (error) {
          console.warn('EngageBay submission failed, trying fallbacks:', error);
        }
      }

      // Strategy 2: Direct API call to EngageBay
      try {
        const response = await fetch('https://app.engagebay.com/dev/api/panel/subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            form_id: '6351369855041536',
            ...formData,
            source: 'website_form'
          })
        });
        
        if (response.ok) {
          setSubmitStatus('success');
          resetForm();
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        console.warn('Direct API call failed, trying email fallback:', error);
      }

      // Strategy 3: Email fallback using mailto
      const emailBody = `
New Contact Form Submission:

Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Legal Service: ${formData.legalService}

Message:
${formData.message}
      `.trim();

      const mailtoUrl = `mailto:Info@soklaw.co.ke?subject=New Contact Form Submission&body=${encodeURIComponent(emailBody)}`;
      window.open(mailtoUrl, '_blank');
      
      setSubmitStatus('success');
      resetForm();
      setIsSubmitting(false);

    } catch (error) {
      console.error('All submission strategies failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      legalService: '',
      message: ''
    });
  };

  const officeInfo = [
    {
      city: 'Nairobi Office',
      address: 'Upper Hill, ABC Place, 5th Floor\nWaiyaki Way, Nairobi',
      phone: '+254 700 123 456',
      email: 'Info@soklaw.co.ke'
    },
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll opacity-0 text-4xl md:text-5xl font-bold mb-6">
            Get In Touch
          </h2>
          <p className="animate-on-scroll opacity-0 text-xl max-w-3xl mx-auto">
            Ready to discuss your legal needs? Contact us today for a consultation 
            with our experienced legal team.
          </p>
          <div className="animate-on-scroll opacity-0 w-24 h-1 bg-gradient-to-r from-yellow-600 to-yellow-500 mx-auto mt-6"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="animate-on-scroll opacity-0">
              <h3 className="text-2xl font-bold mb-6">
                Our Office Locations
              </h3>
              
              {officeInfo.map((office, index) => (
                <div key={index} className="mb-8 p-6 bg-gray-50 rounded-xl border hover:shadow-lg transition-shadow duration-300">
                  <h4 className="text-xl font-semibold mb-4">
                    {office.city}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-yellow-600" />
                      <p className="whitespace-pre-line">
                        {office.address}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                      <a href={`tel:${office.phone}`} className="transition-colors hover:text-yellow-600">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                      <a href={`mailto:${office.email}`} className="transition-colors hover:text-yellow-600">
                        {office.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="animate-on-scroll opacity-0 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="text-xl font-semibold mb-4 flex items-center text-yellow-800">
                <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                Business Hours
              </h4>
              <div className="space-y-2 text-yellow-700">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Emergency Only</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-on-scroll opacity-0">
            <div className="bg-white p-8 rounded-2xl shadow-xl border">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Request a Consultation
              </h3>
              
              <div className="space-y-4">
                {/* First Name and Last Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Your first name"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Your last name"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Email and Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254 700 000 000"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Legal Service Required */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Legal Service Required *
                  </label>
                  <select
                    name="legalService"
                    value={formData.legalService}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white"
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                      paddingRight: '48px'
                    }}
                  >
                    <option value="">Select a service</option>
                    <option value="corporate-law">Corporate Law</option>
                    <option value="litigation">Litigation</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="employment-law">Employment Law</option>
                    <option value="intellectual-property">Intellectual Property</option>
                    <option value="family-law">Family Law</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please describe your legal matter and how we can help you..."
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-vertical"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                {/* Success/Error Messages */}
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Message sent successfully!</p>
                      <p className="text-sm">We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Something went wrong.</p>
                      <p className="text-sm">Please try again or contact us directly at Info@soklaw.co.ke</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .animate-on-scroll {
          transition: all 0.6s ease-out;
          transform: translateY(20px);
        }
        
        .animate-fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
};

// Declare global EngageBay variables for TypeScript
declare global {
  interface Window {
    EhForms: any;
  }
}

export default Contact;