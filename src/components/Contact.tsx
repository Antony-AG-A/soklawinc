import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { getBoardColumns, createBoardItem, type MondayColumn } from '../Mondayapi';

type SubmitState = 'idle' | 'success' | 'error';

function parseLabels(col?: MondayColumn): string[] {
  if (!col?.settings_str) return [];
  try {
    const s = JSON.parse(col.settings_str);
    // status: { labels: { "0":"A","1":"B" } }
    if (s.labels && !Array.isArray(s.labels)) return Object.values(s.labels).filter(Boolean);
    if (Array.isArray(s.labels)) return s.labels.filter(Boolean);
    // dropdown: { options: [{name:"A"}] or [{title:"A"}] }
    if (Array.isArray(s.options)) return s.options.map((o: any) => o.name || o.title).filter(Boolean);
  } catch {}
  return [];
}

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Fixed UI fields (keeps your design)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    legalService: '', message: ''
  });

  // Monday-driven bits
  const [columns, setColumns] = useState<MondayColumn[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitState>('idle');
  const [extraValues, setExtraValues] = useState<Record<string, any>>({});

  // Load Monday columns on mount
  useEffect(() => {
    getBoardColumns().then(setColumns).catch(console.error);
  }, []);

  // Find best-fit columns for our fixed fields
  const emailCol   = useMemo(() => columns.find(c => c.type === 'email'), [columns]);
  const phoneCol   = useMemo(() => columns.find(c => c.type === 'phone'), [columns]);
  const messageCol = useMemo(
    () => columns.find(c => c.type === 'long_text' || /message|details|notes/i.test(c.title)),
    [columns]
  );
  const serviceCol = useMemo(
    () => columns.find(c => (c.type === 'status' || c.type === 'dropdown') && /service|practice|matter|type/i.test(c.title)),
    [columns]
  );

  const legalServiceOptions = useMemo(() => {
    const opts = parseLabels(serviceCol);
    return opts.length ? opts : [
      'Corporate Law', 'Litigation', 'Real Estate',
      'Employment Law', 'Intellectual Property', 'Family Law', 'Other'
    ];
  }, [serviceCol]);

  // Any other Monday columns become "Additional Details" fields
  const extraCols = useMemo(() => {
    const skip = new Set([emailCol?.id, phoneCol?.id, messageCol?.id, serviceCol?.id, 'name']);
    return columns.filter(c =>
      !skip.has(c.id) &&
      !['creation_log', 'last_updated', 'world_clock', 'auto_number', 'date_created'].includes(c.type)
    );
  }, [columns, emailCol, phoneCol, messageCol, serviceCol]);

  // Animate in (your existing effect)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const els = entry.target.querySelectorAll('.animate-on-scroll');
          els.forEach((el, i) => setTimeout(() => el.classList.add('animate-fade-in-up'), i * 100));
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExtraChange = (id: string, value: any) => {
    setExtraValues(prev => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '', legalService: '', message: '' });
    setExtraValues({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const columnValues: Record<string, any> = {};

      if (emailCol && formData.email) {
        columnValues[emailCol.id] = { email: formData.email, text: formData.email };
      }
      if (phoneCol && formData.phone) {
        columnValues[phoneCol.id] = { phone: formData.phone };
      }
      if (serviceCol && formData.legalService) {
        columnValues[serviceCol.id] = { label: formData.legalService };
      }
      if (messageCol && formData.message) {
        columnValues[messageCol.id] = formData.message;
      }

      // add any extra dynamic fields
      for (const [id, val] of Object.entries(extraValues)) {
        columnValues[id] = val;
      }

      const itemName =
        `${formData.firstName} ${formData.lastName}`.trim() ||
        formData.email ||
        'Website Lead';

      const result = await createBoardItem(itemName, columnValues);

      if (result?.create_item?.id) {
        setSubmitStatus('success');
        resetForm();
      } else {
        throw new Error('Create item failed');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="animate-on-scroll opacity-0 text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
          <p className="animate-on-scroll opacity-0 text-xl max-w-3xl mx-auto">
            Ready to discuss your legal needs? Contact us today for a consultation with our experienced legal team.
          </p>
          <div className="animate-on-scroll opacity-0 w-24 h-1 bg-gradient-to-r from-yellow-600 to-yellow-500 mx-auto mt-6"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Office Info */}
          <div className="space-y-8">
            <div className="animate-on-scroll opacity-0">
              <h3 className="text-2xl font-bold mb-6">Our Office Locations</h3>
              {officeInfo.map((o, i) => (
                <div key={i} className="mb-8 p-6 bg-gray-50 rounded-xl border hover:shadow-lg transition-shadow duration-300">
                  <h4 className="text-xl font-semibold mb-4">{o.city}</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-yellow-600" />
                      <p className="whitespace-pre-line">{o.address}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                      <a href={`tel:${o.phone}`} className="hover:text-yellow-600">{o.phone}</a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                      <a href={`mailto:${o.email}`} className="hover:text-yellow-600">{o.email}</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="animate-on-scroll opacity-0 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="text-xl font-semibold mb-4 flex items-center text-yellow-800">
                <Clock className="h-5 w-5 mr-2 text-yellow-600" /> Business Hours
              </h4>
              <div className="space-y-2 text-yellow-700">
                <div className="flex justify-between"><span>Monday - Friday</span><span>8:00 AM - 6:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span>9:00 AM - 2:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span>Emergency Only</span></div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="animate-on-scroll opacity-0">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border space-y-4">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Request a Consultation</h3>

              {/* First/Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                  placeholder="First Name *" required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                />
                <input
                  type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                  placeholder="Last Name *" required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                />
              </div>

              {/* Email/Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email" name="email" value={formData.email} onChange={handleInputChange}
                  placeholder="your.email@example.com" required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                />
                <input
                  type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                  placeholder="+254 700 000 000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                />
              </div>

              {/* Legal Service (filled from Monday if available) */}
              <div>
                <select
                  name="legalService" value={formData.legalService} onChange={handleInputChange} required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white"
                >
                  <option value="">Select a service</option>
                  {legalServiceOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="message" value={formData.message} onChange={handleInputChange}
                  placeholder="Please describe your legal matter and how we can help you..." required rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-vertical"
                />
              </div>

              {/* Additional Details (auto from Monday) */}
              {extraCols.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Additional details</h4>
                  <div className="space-y-3">
                    {extraCols.map(col => {
                      const labels = parseLabels(col);
                      if (col.type === 'long_text') {
                        return (
                          <div key={col.id}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">{col.title}</label>
                            <textarea
                              value={extraValues[col.id] || ""}
                              onChange={e => handleExtraChange(col.id, e.target.value)}
                              rows={4}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-vertical"
                            />
                          </div>
                        );
                      }
                      if (col.type === 'status' || col.type === 'dropdown') {
                        return (
                          <div key={col.id}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">{col.title}</label>
                            <select
                              value={extraValues[col.id] || ""}
                              onChange={e => handleExtraChange(col.id, e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white"
                            >
                              <option value="">Select...</option>
                              {labels.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                          </div>
                        );
                      }
                      // email/phone/text fallback
                      const inputType =
                        col.type === 'email' ? 'email' :
                        col.type === 'phone' ? 'tel' : 'text';
                      return (
                        <div key={col.id}>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">{col.title}</label>
                          <input
                            type={inputType}
                            value={extraValues[col.id] || ""}
                            onChange={e => handleExtraChange(col.id, e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit" disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
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

              {/* Status */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />
                  <div>
                    <p className="font-medium">Message sent successfully!</p>
                    <p className="text-sm">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 text-red-600" />
                  <div>
                    <p className="font-medium">Something went wrong.</p>
                    <p className="text-sm">Please try again or contact us directly at Info@soklaw.co.ke</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-on-scroll { transition: all 0.6s ease-out; transform: translateY(20px); }
        .animate-fade-in-up { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </section>
  );
};

export default Contact;
