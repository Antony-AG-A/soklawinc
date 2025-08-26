import { Mail, Phone, Linkedin, Award, BookOpen, Users, Scale } from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: 'Partners' | 'Associates' | 'Consultants' | 'Assistants';
  specialization: string;
  image: string;
  email: string;
  phone: string;
  isPartner: boolean;
  qualifications: string[];
  experience: string;
  achievements: string[];
  description: string;
  expertise: string[];
  education: string[];
  admissions: string[];
  languages: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'sospeter-opondo',
    name: 'Sospeter Opondo',
    role: 'Co-founder & Managing Partner',
    category: 'Partners',
    specialization: 'International Commercial Law & Corporate Governance',
    image: 'https://i.postimg.cc/MGfCq6YL/7X2A2792.jpg',
    email: 'sospeter@soklaw.co.ke',
    phone: '0205285048',
    isPartner: true,
    qualifications: ['LLB (Hons)', 'Diploma in Law', 'Certified Public Secretary', 'LLM (in progress)'],
    experience: '10+ years of legal and corporate experience',
    achievements: [
      'Co-founder and Managing Partner at SOKLaw',
      'Former Head of Legal Department at UAP Insurance Company Ltd',
      'Over 7 years corporate experience at KTDA, REAL Insurance, and UAP',
      'Currently pursuing LLM in International Commercial Law - University of Edinburgh',
      'Published author in professional and corporate magazines',
      'Member of Law Society of Kenya and East African Law Society'
    ],
    description: 'Sospeter is a co-founder and the Managing partner at SOKLaw. He is an advocate of the High Court of Kenya with over three (3) years post-admission experience in legal practice. Prior to founding the firm, he had worked for seven (7) years in various reputable corporate organizations i.e Kenya Tea Development Authority(KTDA), REAL Insurance Company Ltd and UAP Insurance Company Ltd where he rose through the ranks to head the legal department at UAP. He holds an undergraduate degree in Law from the University of Nairobi and a post graduate diploma from Kenya School of law. He is also a Certified Public Secretary and has undergone management and customer care training at various institutions in Kenya. Sospeter is currently pursuing an LLM Degree in International Commercial Law with the University of Edinburgh. He has also authored several publications in professional and corporate magazines and digests. His legal and administrative background adds great value to the firm\'s services. He is a member of the Law Society of Kenya and the East African Law Society.',
    expertise: [
      'International Commercial Law',
      'Corporate Governance',
      'Insurance Law',
      'Commercial Litigation',
      'Banking & Finance',
      'Securities Law',
      'Corporate Strategy',
      'Risk Management'
    ],
    education: [
      'University of Nairobi - Bachelor of Laws (LLB)',
      'Kenya School of Law - Diploma in Law',
      'University of Edinburgh - LLM in International Commercial Law (in progress)',
      'Certified Public Secretary of Kenya',
      'Management and Customer Care Training - Various Institutions'
    ],
    admissions: [
      'Advocate of the High Court of Kenya',
      'Member of Law Society of Kenya',
      'Member of East African Law Society',
      'Certified Public Secretary of Kenya'
    ],
    languages: ['English', 'Swahili', 'Luo']
  },
  {
    id: 'faith-simiyu',
    name: 'Faith Simiyu',
    role: 'Partner',
    category: 'Partners',
    specialization: 'Family Law & Real Estate',
    image: 'https://i.postimg.cc/6QCW50zn/Whats-App-Image-2025-08-13-at-04-23-08.jpg',
    email: 'fsimiyu@soklaw.co.ke',
    phone: '+254 700 123 457',
    isPartner: true,
    qualifications: ['LLB (Hons)', 'Diploma in Law', 'Master of Laws (LLM)'],
    experience: '12+ years of legal practice',
    achievements: [
      'Handled over 150 family law cases',
      'Expert in property conveyancing',
      'Women Lawyer of the Year 2022',
      'Published author on family law matters'
    ],
    description: 'Faith Simiyu is a partner at SOK Law Associates specializing in family law and real estate matters. She is known for her compassionate approach to family disputes and her expertise in property transactions.',
    expertise: [
      'Family Law',
      'Real Estate Law',
      'Property Conveyancing',
      'Succession Law',
      'Matrimonial Property',
      'Child Custody'
    ],
    education: [
      'University of Nairobi - Bachelor of Laws (LLB)',
      'Kenya School of Law - Diploma in Law',
      'University of Cape Town - Master of Laws (LLM) in Family Law'
    ],
    admissions: [
      'Advocate of the High Court of Kenya',
      'Member of Law Society of Kenya',
      'Member of International Association of Family Lawyers'
    ],
    languages: ['English', 'Swahili', 'Bukusu']
  },
  {
    id: 'paul-kiranga',
    name: 'Paul Kiranga',
    role: 'Associate Partner',
    category: 'Partners',
    specialization: 'Criminal Defense & Constitutional Law',
    image: 'https://i.postimg.cc/v8KZvBN1/Whats-App-Image-2025-07-20-at-03-11-55.jpg',
    email: 'pkiranga@soklaw.co.ke',
    phone: '+254 700 123 458',
    isPartner: true,
    qualifications: ['LLB (Hons)', 'Diploma in Law', 'Certificate in Human Rights'],
    experience: '10+ years of legal practice',
    achievements: [
      'Successfully defended over 100 criminal cases',
      'Constitutional law expert',
      'Human rights advocate',
      'Pro bono legal services champion'
    ],
    description: 'Paul Kiranga is an associate partner specializing in criminal defense and constitutional law. He is passionate about protecting individual rights and has successfully handled numerous high-profile criminal and constitutional cases.',
    expertise: [
      'Criminal Defense',
      'Constitutional Law',
      'Human Rights',
      'Public Interest Litigation',
      'Appeals',
      'Judicial Review'
    ],
    education: [
      'University of Nairobi - Bachelor of Laws (LLB)',
      'Kenya School of Law - Diploma in Law',
      'University of Pretoria - Certificate in Human Rights Law'
    ],
    admissions: [
      'Advocate of the High Court of Kenya',
      'Member of Law Society of Kenya',
      'Member of Kenya Human Rights Commission'
    ],
    languages: ['English', 'Swahili', 'Kikuyu']
  },
  {
    id: 'justus-njoroge',
    name: 'Justus Njoroge',
    role: 'Senior Associate',
    category: 'Associates',
    specialization: 'Employment Law & Labor Relations',
    image: 'https://i.postimg.cc/vmrnFQd7/7X2A2838.jpg',
    email: 'jnjoroge@soklaw.co.ke',
    phone: '+254 700 123 459',
    isPartner: false,
    qualifications: ['LLB (Hons)', 'Diploma in Law', 'Certificate in Labor Relations'],
    experience: '8+ years of legal practice',
    achievements: [
      'Employment law specialist',
      'Successfully mediated 50+ labor disputes',
      'Corporate training expert',
      'Published researcher on employment matters'
    ],
    description: 'Justus Njoroge is a senior associate with extensive experience in employment law and labor relations. He advises both employers and employees on workplace matters and has a strong track record in dispute resolution.',
    expertise: [
      'Employment Law',
      'Labor Relations',
      'Workplace Disputes',
      'Employment Contracts',
      'Disciplinary Procedures',
      'Workers Compensation'
    ],
    education: [
      'Kenyatta University - Bachelor of Laws (LLB)',
      'Kenya School of Law - Diploma in Law',
      'University of Witwatersrand - Certificate in Labor Relations'
    ],
    admissions: [
      'Advocate of the High Court of Kenya',
      'Member of Law Society of Kenya',
      'Certified Labor Relations Officer'
    ],
    languages: ['English', 'Swahili', 'Kikuyu']
  },
  {
    id: 'loise-njoroge',
    name: 'Loise Njoroge',
    role: 'Associate Advocate',
    category: 'Associates',
    specialization: 'Intellectual Property & Technology Law',
    image: 'https://i.postimg.cc/Z5KYK43F/7X2A2863.jpg',
    email: 'lnjoroge@soklaw.co.ke',
    phone: '+254 700 123 460',
    isPartner: false,
    qualifications: ['LLB (Hons)', 'Diploma in Law', 'Certificate in IP Law'],
    experience: '6+ years of legal practice',
    achievements: [
      'IP law specialist',
      'Technology law expert',
      'Registered patent agent',
      'Startup legal advisor'
    ],
    description: 'Loise Njoroge is an associate specializing in intellectual property and technology law. She advises startups, tech companies, and creative professionals on IP protection and technology-related legal matters.',
    expertise: [
      'Intellectual Property',
      'Technology Law',
      'Patent Law',
      'Trademark Law',
      'Copyright Law',
      'Data Protection'
    ],
    education: [
      'Strathmore University - Bachelor of Laws (LLB)',
      'Kenya School of Law - Diploma in Law',
      'World Intellectual Property Organization - Certificate in IP Law'
    ],
    admissions: [
      'Advocate of the High Court of Kenya',
      'Member of Law Society of Kenya',
      'Registered Patent Agent'
    ],
    languages: ['English', 'Swahili', 'Kikuyu']
  },
  {
    id: 'shallet-wangui',
    name: 'Shallet Wangui Katiku',
    role: 'Legal Consultant',
    category: 'Consultants',
    specialization: 'Banking & Finance Law',
    image: 'https://i.postimg.cc/cChqVtDq/7X2A2882.jpg',
    email: 'swangui@soklaw.co.ke',
    phone: '+254 700 123 461',
    isPartner: false,
    qualifications: ['LLB (Hons)', 'Diploma in Law', 'Certificate in Banking Law'],
    experience: '5+ years of legal practice',
    achievements: [
      'Banking law specialist',
      'Financial services expert',
      'Regulatory compliance advisor',
      'Fintech legal consultant'
    ],
    description: 'Shallet Wangui is a legal consultant with expertise in banking and finance law. She advises financial institutions, fintech companies, and corporate clients on regulatory compliance and financial transactions.',
    expertise: [
      'Banking Law',
      'Finance Law',
      'Regulatory Compliance',
      'Fintech Law',
      'Securities Law',
      'Capital Markets'
    ],
    education: [
      'University of Nairobi - Bachelor of Laws (LLB)',
      'Kenya School of Law - Diploma in Law',
      'London School of Economics - Certificate in Banking Law'
    ],
    admissions: [
      'Advocate of the High Court of Kenya',
      'Member of Law Society of Kenya',
      'Certified Financial Services Lawyer'
    ],
    languages: ['English', 'Swahili', 'Kikuyu']
  },
  {
    id: 'mary-assistant',
    name: 'Mary Wanjiku',
    role: 'Legal Assistant',
    category: 'Assistants',
    specialization: 'Administrative Support & Client Relations',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    email: 'mwanjiku@soklaw.co.ke',
    phone: '+254 700 123 462',
    isPartner: false,
    qualifications: ['Diploma in Legal Studies', 'Certificate in Office Administration'],
    experience: '4+ years of legal support experience',
    achievements: [
      'Expert in client relations',
      'Efficient case file management',
      'Multilingual communication skills',
      'Administrative excellence award recipient'
    ],
    description: 'Mary Wanjiku provides essential administrative support and maintains excellent client relations. Her attention to detail and organizational skills ensure smooth operations across all departments.',
    expertise: [
      'Client Relations',
      'Case File Management',
      'Legal Documentation',
      'Administrative Support',
      'Court Filing',
      'Appointment Scheduling'
    ],
    education: [
      'Kenya Institute of Legal Studies - Diploma in Legal Studies',
      'Technical University of Kenya - Certificate in Office Administration'
    ],
    admissions: [
      'Certified Legal Assistant',
      'Member of Kenya Legal Assistants Association'
    ],
    languages: ['English', 'Swahili', 'Kikuyu']
  },
  {
    id: 'james-assistant',
    name: 'James Mwangi',
    role: 'Research Assistant',
    category: 'Assistants',
    specialization: 'Legal Research & Documentation',
    image: 'https://images.pexels.com/photos/3184430/pexels-photo-3184430.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    email: 'jmwangi@soklaw.co.ke',
    phone: '+254 700 123 463',
    isPartner: false,
    qualifications: ['Bachelor of Laws (LLB)', 'Certificate in Legal Research'],
    experience: '3+ years of legal research experience',
    achievements: [
      'Legal research specialist',
      'Case law analysis expert',
      'Published legal articles',
      'Database management proficiency'
    ],
    description: 'James Mwangi supports the legal team with comprehensive research and documentation services. His analytical skills and attention to detail contribute significantly to case preparation and legal strategy development.',
    expertise: [
      'Legal Research',
      'Case Law Analysis',
      'Legal Writing',
      'Database Management',
      'Statutory Interpretation',
      'Precedent Analysis'
    ],
    education: [
      'University of Nairobi - Bachelor of Laws (LLB)',
      'Kenya School of Law - Certificate in Legal Research Methods'
    ],
    admissions: [
      'Certified Legal Researcher',
      'Member of Kenya Legal Research Association'
    ],
    languages: ['English', 'Swahili', 'Kikuyu']
  }
];

// Helper functions to categorize team members
export const partners = teamMembers.filter(member => member.category === 'Partners');
export const associates = teamMembers.filter(member => member.category === 'Associates');
export const consultants = teamMembers.filter(member => member.category === 'Consultants');
export const assistants = teamMembers.filter(member => member.category === 'Assistants');

// Get all team members by category
export const getTeamByCategory = () => {
  return {
    Partners: partners,
    Associates: associates,
    Consultants: consultants,
    Assistants: assistants
  };
};