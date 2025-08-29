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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const API_TOKEN = process.env.NEXT_PUBLIC_MONDAY_API_KEY; // store safely
      const BOARD_ID = process.env.NEXT_PUBLIC_MONDAY_BOARD_ID; // your Monday board
      const GROUP_ID = 'topics'; // group inside the board

      const query = `
        mutation {
          create_item(
            board_id: ${BOARD_ID},
            group_id: "${GROUP_ID}",
            item_name: "${formData.firstName} ${formData.lastName}",
            column_values: ${JSON.stringify({
              email: { email: formData.email, text: formData.email },
              phone: formData.phone,
              status: { label: formData.legalService },
              text: formData.message
            }).replace(/"([^"]+)":/g, '$1:')}
          ) {
            id
          }
        }
      `;

      const response = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: API_TOKEN || ''
        },
        body: JSON.stringify({ query })
      });

      const result = await response.json();

      if (result.data?.create_item?.id) {
        setSubmitStatus('success');
        resetForm();
      } else {
        throw new Error('Monday API failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
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
    }
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
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
          {/* Left: Office Info */}
          <div className="space-y-8">
            <div className="animate-on-scroll opacity-0">
              <h3 className="text-2xl font-bold mb-6">Our Office Locations</h3>
              {officeInfo.map((office, index) => (
                <div key={index} className="mb-8 p-6 bg-gray-50 rounded-xl border hover:shadow-lg transition-shadow duration-300">
                  <h4 className="text-xl font-semibold mb-4">{office.city}</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-yellow-600" />
                      <p className="whitespace-pre-line">{office.address}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                      <a href={`tel:${office.phone}`} className="hover:text-yellow-600">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                      <a href={`mailto:${office.email}`} className="hover:text-yellow-600">
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
                <div className="flex justify-between"><span>Mon - Fri</span><span>8:00 AM - 6:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span>9:00 AM - 2:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span>Emergency Only</span></div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="animate-on-scroll opacity-0">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border space-y-4">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Request a Consultation
              </h3>

              {/* First/Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                  placeholder="First Name *" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                  placeholder="Last Name *" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" />
              </div>

              {/* Email/Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                  placeholder="your.email@example.com" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                  placeholder="+254 700 000 000" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" />
              </div>

              {/* Service */}
              <select name="legalService" value={formData.legalService} onChange={handleInputChange} required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white">
                <option value="">Select a service</option>
                <option value="corporate-law">Corporate Law</option>
                <option value="litigation">Litigation</option>
                <option value="real-estate">Real Estate</option>
                <option value="employment-law">Employment Law</option>
                <option value="intellectual-property">Intellectual Property</option>
                <option value="family-law">Family Law</option>
                <option value="other">Other</option>
              </select>

              {/* Message */}
              <textarea name="message" value={formData.message} onChange={handleInputChange}
                placeholder="Please describe your legal matter..." required rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-vertical"></textarea>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>

              {/* Status */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />
                  <p>Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 text-red-600" />
                  <p>Something went wrong. Please try again or email us directly.</p>
                </div>
              )}
            </form>
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

export default Contact;
