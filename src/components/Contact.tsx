import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { getBoardColumns, createBoardItem, mondayHealthCheck, type MondayColumn } from '../Mondayapi';
import { MondayApiError } from '../utils/errorHandler';
import { validateEmail, validatePhone, sanitizeInput, secureLog } from '../utils/securityConfig';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

interface ConnectionStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastChecked: Date;
  error?: string;
}

function parseLabels(col?: MondayColumn): string[] {
  if (!col?.settings_str) return [];
  try {
    const s = JSON.parse(col.settings_str);
    // status: { labels: { "0":"A","1":"B" } }
    if (s.labels && !Array.isArray(s.labels)) return Object.values(s.labels).filter(Boolean);
    if (Array.isArray(s.labels)) return s.labels.filter(Boolean);
    // dropdown: { options: [{name:"A"}] or [{title:"A"}] }
    if (Array.isArray(s.options)) return s.options.map((o: any) => o.name || o.title).filter(Boolean);
  } catch (error) {
    secureLog('warn', 'Failed to parse column labels', { columnId: col.id, error: error.message });
  }
  return [];
}

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    legalService: '', message: ''
  });

  // Monday integration state
  const [columns, setColumns] = useState<MondayColumn[]>([]);
  const [extraValues, setExtraValues] = useState<Record<string, any>>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitState>('idle');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'healthy',
    lastChecked: new Date()
  });

  // Form validation state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Load Monday columns and check connection on mount
  useEffect(() => {
    const initializeMonday = async () => {
      try {
        secureLog('info', 'Initializing Monday CRM integration');
        
        // Check connection health
        const healthCheck = await mondayHealthCheck();
        setConnectionStatus({
          status: healthCheck.status,
          lastChecked: new Date(),
          error: healthCheck.error
        });

        if (healthCheck.status === 'unhealthy') {
          secureLog('error', 'Monday CRM connection unhealthy', { error: healthCheck.error });
          return;
        }

        // Load board columns
        const boardColumns = await getBoardColumns();
        setColumns(boardColumns);
        secureLog('info', 'Successfully loaded Monday board columns', { count: boardColumns.length });
        
      } catch (error) {
        const errorMessage = error instanceof MondayApiError ? error.message : 'Failed to initialize Monday CRM';
        secureLog('error', 'Monday CRM initialization failed', { error: errorMessage });
        setConnectionStatus({
          status: 'unhealthy',
          lastChecked: new Date(),
          error: errorMessage
        });
      }
    };

    initializeMonday();
  }, []);

  // Find best-fit columns for our fixed fields
  const emailCol = useMemo(() => columns.find(c => c.type === 'email'), [columns]);
  const phoneCol = useMemo(() => columns.find(c => c.type === 'phone'), [columns]);
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
      'Civil and Criminal Litigation',
      'Alternative Dispute Resolution (ADR)',
      'Commercial and Corporate Law',
      'Bank Securities, Conveyancing and Real Estate Law',
      'Employment and Labour Law',
      'Family Law',
      'Consultancy',
      'Energy Law',
      'Engineering, Building and Construction',
      'Health and Medical Law',
      'Finance and Banking Law',
      'Insurance and Personal Injury Law',
      'Agricultural Law',
      'Access to Justice Initiative Kenya'
    ];
  }, [serviceCol]);

  // Additional Monday columns become dynamic fields
  const extraCols = useMemo(() => {
    const skip = new Set([emailCol?.id, phoneCol?.id, messageCol?.id, serviceCol?.id, 'name']);
    return columns.filter(c =>
      !skip.has(c.id) &&
      !['creation_log', 'last_updated', 'world_clock', 'auto_number', 'date_created'].includes(c.type)
    );
  }, [columns, emailCol, phoneCol, messageCol, serviceCol]);

  // Form validation
  useEffect(() => {
    const errors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(formData.email)) errors.email = 'Please enter a valid email address';
    if (!formData.legalService) errors.legalService = 'Please select a legal service';
    if (!formData.message.trim()) errors.message = 'Message is required';
    
    // Validate phone if provided
    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFieldErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [formData]);

  // Animate in on scroll
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
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleExtraChange = (id: string, value: any) => {
    const sanitizedValue = sanitizeInput(value);
    setExtraValues(prev => ({ ...prev, [id]: sanitizedValue }));
  };

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '', legalService: '', message: '' });
    setExtraValues({});
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      secureLog('warn', 'Form submission attempted with validation errors', { errors: fieldErrors });
      return;
    }

    setSubmitStatus('submitting');

    try {
      secureLog('info', 'Starting contact form submission');
      
      // Check Monday connection before submission
      const healthCheck = await mondayHealthCheck();
      if (healthCheck.status === 'unhealthy') {
        throw new MondayApiError(
          'CONNECTION_ERROR',
          'Monday CRM is currently unavailable. Please try again later or contact us directly.',
          healthCheck
        );
      }

      const columnValues: Record<string, any> = {};

      // Map form fields to Monday columns
      if (emailCol && formData.email) {
        columnValues[emailCol.id] = { 
          email: formData.email, 
          text: formData.email 
        };
      }
      
      if (phoneCol && formData.phone) {
        columnValues[phoneCol.id] = { 
          phone: formData.phone,
          countryShortName: 'KE' // Kenya country code
        };
      }
      
      if (serviceCol && formData.legalService) {
        columnValues[serviceCol.id] = { 
          label: formData.legalService 
        };
      }
      
      if (messageCol && formData.message) {
        columnValues[messageCol.id] = formData.message;
      }

      // Add extra dynamic fields
      for (const [id, val] of Object.entries(extraValues)) {
        if (val !== null && val !== undefined && val !== '') {
          columnValues[id] = val;
        }
      }

      // Create item name
      const itemName = `${formData.firstName} ${formData.lastName}`.trim() || 
                      formData.email || 
                      'Website Contact';

      secureLog('info', 'Submitting to Monday CRM', { 
        itemName,
        columnCount: Object.keys(columnValues).length
      });

      const result = await createBoardItem(itemName, columnValues);

      if (result?.create_item?.id) {
        setSubmitStatus('success');
        resetForm();
        secureLog('info', 'Contact form submitted successfully', { 
          itemId: result.create_item.id 
        });
      } else {
        throw new MondayApiError(
          'SUBMISSION_FAILED',
          'Failed to create contact record. Please try again.',
          result
        );
      }
    } catch (error) {
      const errorMessage = error instanceof MondayApiError ? 
        error.message : 
        'An unexpected error occurred. Please try again or contact us directly.';
      
      secureLog('error', 'Contact form submission failed', { 
        error: errorMessage,
        formData: sanitizeInput(formData)
      });
      
      setSubmitStatus('error');
    }
  };

  const getInputClassName = (fieldName: string) => {
    const baseClass = "w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/20";
    const hasError = fieldErrors[fieldName];
    
    if (hasError) {
      return `${baseClass} border-red-300 focus:border-red-500 bg-red-50`;
    }
    
    return `${baseClass} border-gray-200 focus:border-yellow-500 bg-white hover:border-gray-300`;
  };

  const officeInfo = [
    {
      city: 'Nairobi Office',
      address: 'Upperhill Gardens, Block D1, 5th Floor\nRagati Road, Nairobi',
      phone: '+254 700 123 456',
      email: 'info@soklaw.co.ke'
    },
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
              {officeInfo.map((office, i) => (
                <div key={i} className="mb-8 p-6 bg-gray-50 rounded-xl border hover:shadow-lg transition-shadow duration-300">
                  <h4 className="text-xl font-semibold mb-4">{office.city}</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-yellow-600" />
                      <p className="whitespace-pre-line">{office.address}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                      <a href={`tel:${office.phone}`} className="hover:text-yellow-600 transition-colors">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                      <a href={`mailto:${office.email}`} className="hover:text-yellow-600 transition-colors">
                        {office.email}
                      </a>
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
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Request a Consultation</h3>
                
                {/* Connection Status Indicator */}
                <div className="flex items-center space-x-2">
                  {connectionStatus.status === 'healthy' ? (
                    <Wifi className="h-5 w-5 text-green-500" title="CRM Connected" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-500" title="CRM Connection Issue" />
                  )}
                  <span className={`text-xs font-medium ${
                    connectionStatus.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {connectionStatus.status === 'healthy' ? 'Connected' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Connection Error Warning */}
              {connectionStatus.status === 'unhealthy' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium">CRM Connection Issue</p>
                      <p className="text-sm">
                        We're experiencing technical difficulties. Your message will still be sent, 
                        but there may be a delay in our response.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* First/Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name *"
                    required
                    className={getInputClassName('firstName')}
                    aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
                  />
                  {fieldErrors.firstName && (
                    <p id="firstName-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name *"
                    required
                    className={getInputClassName('lastName')}
                    aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
                  />
                  {fieldErrors.lastName && (
                    <p id="lastName-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email/Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com *"
                    required
                    className={getInputClassName('email')}
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  />
                  {fieldErrors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+254 700 000 000"
                    className={getInputClassName('phone')}
                    aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                  />
                  {fieldErrors.phone && (
                    <p id="phone-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Legal Service */}
              <div>
                <select
                  name="legalService"
                  value={formData.legalService}
                  onChange={handleInputChange}
                  required
                  className={getInputClassName('legalService')}
                  aria-describedby={fieldErrors.legalService ? 'legalService-error' : undefined}
                >
                  <option value="">Select a legal service *</option>
                  {legalServiceOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {fieldErrors.legalService && (
                  <p id="legalService-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {fieldErrors.legalService}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please describe your legal matter and how we can help you... *"
                  required
                  rows={5}
                  className={`${getInputClassName('message')} resize-vertical`}
                  aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                />
                {fieldErrors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              {/* Additional Monday Fields */}
              {extraCols.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Additional Information</h4>
                  <div className="space-y-4">
                    {extraCols.map(col => {
                      const labels = parseLabels(col);
                      
                      if (col.type === 'long_text') {
                        return (
                          <div key={col.id}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              {col.title}
                            </label>
                            <textarea
                              value={extraValues[col.id] || ""}
                              onChange={e => handleExtraChange(col.id, e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 resize-vertical"
                            />
                          </div>
                        );
                      }
                      
                      if (col.type === 'status' || col.type === 'dropdown') {
                        return (
                          <div key={col.id}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              {col.title}
                            </label>
                            <select
                              value={extraValues[col.id] || ""}
                              onChange={e => handleExtraChange(col.id, e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 bg-white"
                            >
                              <option value="">Select...</option>
                              {labels.map(label => (
                                <option key={label} value={label}>{label}</option>
                              ))}
                            </select>
                          </div>
                        );
                      }
                      
                      // Default input for other types
                      const inputType = col.type === 'email' ? 'email' : 
                                      col.type === 'phone' ? 'tel' : 'text';
                      return (
                        <div key={col.id}>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {col.title}
                          </label>
                          <input
                            type={inputType}
                            value={extraValues[col.id] || ""}
                            onChange={e => handleExtraChange(col.id, e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || submitStatus === 'submitting'}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:from-amber-700 hover:to-amber-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {submitStatus === 'submitting' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-4 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-0.5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Message sent successfully!</p>
                    <p className="text-sm mt-1">
                      Thank you for contacting us. We'll get back to you within 24 hours during business days.
                    </p>
                  </div>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 mt-0.5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Unable to send message</p>
                    <p className="text-sm mt-1">
                      Please try again or contact us directly at{' '}
                      <a href="mailto:info@soklaw.co.ke" className="underline hover:text-red-900">
                        info@soklaw.co.ke
                      </a>
                      {' '}or{' '}
                      <a href="tel:+254700123456" className="underline hover:text-red-900">
                        +254 700 123 456
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {/* Form Validation Summary */}
              {Object.keys(fieldErrors).length > 0 && submitStatus === 'idle' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Please correct the following errors:</p>
                      <ul className="text-sm mt-1 space-y-1">
                        {Object.entries(fieldErrors).map(([field, error]) => (
                          <li key={field}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;