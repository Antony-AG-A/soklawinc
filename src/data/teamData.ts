import { Mail, Phone, Linkedin, Award, BookOpen, Users, Scale } from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
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
    role: 'Senior Partner',
    specialization: 'Corporate Law & Commercial Litigation',
    image: 'https://i.postimg.cc/MGfCq6YL/7X2A2792.jpg',
    email: 'sopondo@soklaw.co.ke',
    phone: '+254 700 123 456',
    isPartner: true,
    qualifications: ['LLB (Hons)', 'Diploma in Law', 'Certified Public Secretary'],
    experience: '15+ years of legal practice',
    achievements: [
      'Successfully handled over 200 corporate transactions',
      'Led landmark constitutional cases',
      'Recognized as Leading Lawyer by Legal 500',
      'Member of Law Society of Kenya Council'
    ],
    description: 'Sospeter Opondo is the founding partner of SOK Law Associates with over 15 years of experience in corporate law and commercial litigation. He has successfully represented multinational corporations, government entities, and high-net-worth individuals in complex legal matters.',
    expertise: [
      'Corporate Governance',
      'Mergers & Acquisitions',
      'Commercial Litigation',
      'Constitutional Law',
      'Banking & Finance',
      'Securities Law'
    ],
    education: [
      'University of Nairobi - Bachelor of Laws (LLB)',
      'Kenya School of Law - Diploma in Law',
      'Harvard Law School - Executive Program in Corporate Governance'
    ],
    admissions: [
      'Advocate of the High Court of Kenya',
      'Member of Law Society of Kenya',
      'Certified Public Secretary of Kenya'
    ],
    languages: ['English', 'Swahili', 'Luo']
  },
  {
    id: 'faith-simiyu',
    name: 'Faith Simiyu',
    role: 'Partner',
    specialization: 'Family Law & Real Estate',
    image: 'https://images.pexels.com/photos/3760854/pexels-photo-3760854.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
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
    role: 'Conveyancing Clerk',
    specialization: 'Employment Law & Labor Relations',
    image: 'https://i.postimg.cc/vmrnFQd7/7X2A2838.jpg',
    email: 'Jnjoroge@soklaw.co.ke',
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
    description: 'Mary Wanjiku is a senior associate with extensive experience in employment law and labor relations. She advises both employers and employees on workplace matters and has a strong track record in dispute resolution.',
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
    specialization: 'Intellectual Property & Technology Law',
    image: 'https://i.postimg.cc/Z5KYK43F/7X2A2863.jpg',
    email: 'Lnjoroge@soklaw.co.ke',
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
    description: 'James Mwangi is an associate specializing in intellectual property and technology law. He advises startups, tech companies, and creative professionals on IP protection and technology-related legal matters.',
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
    role: 'Associate',
    specialization: 'Receptionist',
    image: 'https://i.postimg.cc/cChqVtDq/7X2A2882.jpg',
    email: 'gachieng@soklaw.co.ke',
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
    description: 'Grace Achieng is an associate with expertise in banking and finance law. She advises financial institutions, fintech companies, and corporate clients on regulatory compliance and financial transactions.',
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
    languages: ['English', 'Swahili', 'Luo']
  }
];

export const partners = teamMembers.filter(member => member.isPartner);
export const associates = teamMembers.filter(member => !member.isPartner);