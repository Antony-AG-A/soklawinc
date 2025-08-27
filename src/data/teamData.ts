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
    name: 'Sospeter Opondo Aming\'a',
    role: 'Co-Founder & Managing Partner',
    category: 'Partners',
    specialization: 'Litigation & Dispute Resolution',
    image: 'https://i.postimg.cc/MGfCq6YL/7X2A2792.jpg',
    email: 'sospeter@soklaw.co.ke',
    phone: '0205285048',
    isPartner: true,
    qualifications: ['LLB (Hons)', 'Diploma in Law', 'Certified Public Secretary', 'Management & Customer Care Training'],
    experience: '10+ years of legal practice',
    achievements: [
      'Successfully led high-profile litigation and dispute resolution matters',
      'Headed legal departments in top organizations (KTDA, REAL Insurance, UAP Insurance)',
      'Published articles in professional and corporate magazines',
      'Founder of County Legal Aid Bureau (CLAB) CSR initiative',
      'Active member of the Law Society of Kenya and East African Law Society'
    ],
    description: 'Sospeter Opondo Aming\'a is the Co-Founder and Managing Partner of the Firm, where he leads the Litigation and Dispute Resolution department with a steadfast commitment to justice and the best interests of his clients. With over a decade of experience in legal practice and a strong corporate background, he brings both strategic insight and genuine compassion to every case he handles. His expertise spans litigation and out-of-court settlements in employment disputes, commercial matters, and personal injury claims. Before establishing the firm, Sospeter held senior positions in leading organizations, including Kenya Tea Development Agency (KTDA), REAL Insurance Company Ltd, and UAP Insurance Company Ltd, where he rose to head the legal department. This blend of corporate and legal experience equips him with a deep understanding of both the technical and human aspects of complex disputes. Beyond the courtroom, Sospeter is passionate about mentorship and giving back. He founded the County Legal Aid Bureau (CLAB), the firm\'s flagship Corporate Social Responsibility program, which works to make legal support accessible to underserved communities.',
    expertise: [
      'Litigation & Dispute Resolution',
      'Employment Law',
      'Commercial Law',
      'Personal Injury Claims',
      'Out-of-Court Settlements',
      'Corporate Legal Advisory'
    ],
    education: [
      'University of Nairobi - Bachelor of Laws (LLB)',
      'Kenya School of Law - Postgraduate Diploma in Law',
      'Certified Public Secretary (CPS-K)',
      'Specialized Training - Management & Customer Care'
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
    id: 'paul-kiranga',
    name: 'Paul Kiranga',
    role: 'Co-Founder & Partner',
    category: 'Partners',
    specialization: 'Bank Securities and Conveyancing',
    image: 'https://i.postimg.cc/v8KZvBN1/Whats-App-Image-2025-07-20-at-03-11-55.jpg',
    email: 'paul@soklaw.co.ke',
    phone: '020 528 5048',
    isPartner: true,
    qualifications: ['LLB (Hons)', 'Diploma in Law'],
    experience: '5+ years in real estate, conveyancing, and bank securities practice',
    achievements: [
      'Perfected securities for leading banks, including Bank of Baroda, Standard Chartered, and Guardian Bank',
      'Successfully advised on high-value mergers, acquisitions, and joint ventures',
      'Provided legal advisory on complex corporate and financing transactions',
      'Acted for both Kenyan and international corporate clients across diverse sectors'
    ],
    description: 'Paul Kiranga is a Co-Founder and the Partner in charge of the Bank Securities and Conveyancing Department at SOKLaw. He holds a Bachelor of Laws (LL.B) degree from the University of Nairobi (2009) and a Postgraduate Diploma in Law from the Kenya School of Law (2010). He was admitted to the Roll of Advocates in 2011. Paul has gained extensive experience in real estate and conveyancing practice, as well as the perfection of securities. He previously served as an associate in charge of the Conveyancing and Bank Securities Department at Mucheru-Oyatta & Associates Advocates, where he perfected security documents on behalf of major banks in Kenya, including Bank of Baroda (K) Limited, Standard Chartered Bank (K) Limited, and Guardian Bank Kenya Limited. In addition to banking and conveyancing, Paul has significant experience in corporate and commercial law, advising on mergers and acquisitions, joint ventures, capital markets, structured financing, intellectual property, aircraft leasing & financing, and energy law. He has successfully acted for leading Kenyan and international corporate clients.',
    expertise: [
      'Bank Securities & Conveyancing',
      'Real Estate Transactions',
      'Corporate & Commercial Law',
      'Mergers & Acquisitions',
      'Joint Ventures',
      'Capital Markets & Structured Financing',
      'Intellectual Property Law',
      'Aircraft Leasing & Financing',
      'Energy Law'
    ],
    education: [
      'University of Nairobi - Bachelor of Laws (LL.B), 2009',
      'Kenya School of Law - Postgraduate Diploma in Law, 2010'
    ],
    admissions: [
      'Advocate of the High Court of Kenya (2011)',
      'Member of Law Society of Kenya'
    ],
    languages: ['English', 'Swahili', 'Kikuyu']
  },
  {
    id: 'angela-omuya',
    name: 'Angela Omuya',
    role: 'Partner',
    category: 'Partners',
    specialization: 'Legal Audits, Compliance & Data Protection Consultancy',
    image: 'https://i.postimg.cc/SKQKDtNL/7X2A2822.jpg',
    email: 'angela@soklaw.co.ke',
    phone: '+254 700 123 457',
    isPartner: true,
    qualifications: ['LLB (Hons)', 'CPA-K'],
    experience: '10+ years of legal and compliance practice',
    achievements: [
      'Led legal audits and compliance reviews for SMEs, start-ups, NGOs, and government bodies',
      'Guided County Governments on constitutional and regulatory compliance',
      'Served as Legal Counsel to the Judiciary for 7 years, advising on complex disputes and tribunal appeals',
      'Contributed to national law reform and governance through work with Transparency International',
      'Active mentor, children\'s ministry worker, and volunteer life coach'
    ],
    description: 'Angela Omuya is a Partner at the Firm, where she leads the Legal Audits and Compliance practice. An Advocate of the High Court of Kenya and a Certified Public Accountant (CPA-K), she brings a rare blend of legal precision and regulatory insight to help non-profits, SMEs, start-ups, and government entities stay compliant while achieving their goals. Her work ranges from legal audits, data protection compliance, and due diligence to contract negotiation, dispute resolution, and governance advisory. Whether reviewing HR manuals, guiding County Governments on constitutional compliance, or helping organizations strengthen their operational frameworks, Angela delivers practical solutions that work in the real world. Her decade-long career includes seven years as Legal Counsel to the Judiciary, where she supported judges in resolving complex commercial, employment, and contractual disputes, and advised on tribunal appeals and arbitral award enforcement. This experience sharpened her analytical skills, deepened her grasp of compliance risks, and gave her unique insight into Kenya\'s legal landscape. Earlier, she worked with Transparency International, contributing to the review and reform of laws aimed at strengthening governance and accountability. Passionate about protecting and empowering children, Angela serves as a children\'s ministry worker at her church and volunteers as a life coach at MCE Children\'s Centre. Outside the office, she is an avid reader, mentor, and lifelong learner, happiest when spending quality time with family and friends.',
    expertise: [
      'Legal Audits & Compliance',
      'Data Protection & Privacy',
      'Due Diligence & Governance Advisory',
      'Contract Negotiation',
      'Dispute Resolution',
      'Regulatory & Constitutional Compliance'
    ],
    education: [
      'Bachelor of Laws (LLB)',
      'Certified Public Accountant (CPA-K)'
    ],
    admissions: [
      'Advocate of the High Court of Kenya',
      'Certified Public Accountant (CPA-K)',
      'Member of Law Society of Kenya'
    ],
    languages: ['English', 'Swahili']
  },
  {
    id: 'kennedy-muriuki',
    name: 'Kennedy Muriuki Kiranga',
    role: 'Senior Associate',
    category: 'Associates',
    specialization: 'Litigation Management & Corporate Law',
    image: 'https://i.postimg.cc/c4q4VJLL/Whats-App-Image-2025-08-13-at-04-23-09.jpg',
    email: 'kennedy@soklaw.co.ke',
    phone: '+254 700 123 458',
    isPartner: false,
    qualifications: ['LLB (Hons)', 'Diploma in Law', 'Notary Public', 'Commissioner for Oaths'],
    experience: '7+ years of legal experience, 5+ years in active practice',
    achievements: [
      'Successfully managed litigation processes and improved turnaround times through technology adoption',
      'Led high-value commercial and corporate transactions, including post-COVID-19 tourism recovery debenture registration',
      'Contributed to policy development, treaty review, and constitutional litigation at the Office of the Attorney General',
      'Strong corporate grounding through treasury operations internship at Citi N.A. Kenya'
    ],
    description: 'Kennedy Muriuki Kiranga is an Advocate of the High Court of Kenya, Notary Public, and Commissioner for Oaths with over seven years of legal experience and more than five years in active practice. As a Senior Associate at Simiyu, Opondo, Kiranga & Co. Advocates, he has built a solid track record in litigation, conveyancing, corporate law, and commercial transactions, serving a diverse clientele across Kenya. Kennedy\'s expertise spans litigation management, contract drafting and negotiation, perfection of securities for lending institutions, and corporate compliance. He has successfully driven process improvements through technology adoption, improved turnaround times in litigation, and played a pivotal role in high-impact transactions, including debenture registration that supported the tourism sector\'s recovery post-COVID-19. He has also worked with the Office of the Attorney General, contributing to policy development, treaty review, and constitutional litigation, and gained early corporate exposure through a treasury operations internship at Citi N.A. Kenya.',
    expertise: [
      'Litigation Management',
      'Corporate Law',
      'Conveyancing',
      'Commercial Transactions',
      'Contract Drafting & Negotiation',
      'Securities & Banking Compliance',
      'Corporate Governance'
    ],
    education: [
      'University of Nairobi - Bachelor of Laws (LLB)',
      'Kenya School of Law - Diploma in Law'
    ],
    admissions: [
      'Advocate of the High Court of Kenya',
      'Notary Public',
      'Commissioner for Oaths',
      'Member of Law Society of Kenya'
    ],
    languages: ['English', 'Swahili', 'Kikuyu']
  },
  {
    id: 'geoffrey-otieno',
    name: 'Geoffrey Otieno',
    role: 'Associate Advocate',
    category: 'Associates',
    specialization: 'Civil, Criminal, Family & Corporate Law',
    image: 'https://i.postimg.cc/PqFdKX7h/7X2A2896.jpg',
    email: 'geoffrey@soklaw.co.ke',
    phone: '+254 700 123 459',
    isPartner: false,
    qualifications: ['LLB (Hons)'],
    experience: '4 years of legal practice',
    achievements: [
      'Provided legal drafting and research support in diverse practice areas',
      'Assisted in litigation and case preparation across civil and criminal matters',
      'Delivered reliable legal opinions and document reviews for clients',
      'Recognized for clarity and precision in complex legal drafting'
    ],
    description: 'Geoffrey Otieno is a charismatic lawyer with a Bachelor of Laws (LLB) from Kenyatta University. At Simiyu, Opondo, Kiranga & Co. Advocates, he specializes in legal research, drafting, and reviewing across a broad range of practice areas, including civil, criminal, succession, family and children, contract, land, and company law matters. With four years of legal experience, Geoffrey is committed to turning legal complexity into strategic advantage, offering clients practical and well-structured legal solutions.',
    expertise: [
      'Civil Law',
      'Criminal Law',
      'Succession Law',
      'Family & Children Law',
      'Contract Law',
      'Land Law',
      'Company Law',
      'Legal Research & Drafting'
    ],
    education: [
      'Kenyatta University - Bachelor of Laws (LLB)'
    ],
    admissions: [
      'Advocate of the High Court of Kenya',
      'Member of Law Society of Kenya'
    ],
    languages: ['English', 'Swahili']
  },
  {
    id: 'loise-njoroge',
    name: 'Loise Njeri Njoroge',
    role: 'Associate Advocate',
    category: 'Associates',
    specialization: 'Litigation, Corporate & Commercial Law',
    image: 'https://i.postimg.cc/Z5KYK43F/7X2A2863.jpg',
    email: 'loise@soklaw.co.ke',
    phone: '+254 700 123 460',
    isPartner: false,
    qualifications: ['LLB (Hons)'],
    experience: '4+ years of legal practice',
    achievements: [
      'Successfully managed diverse litigation matters',
      'Provided expert legal drafting and contract preparation',
      'Skilled in negotiations and case management',
      'Recognized for professionalism and client-focused solutions'
    ],
    description: 'Loise Njeri Njoroge is a dedicated Kenyan lawyer with a Bachelor of Laws degree and over four years of experience in legal practice. She is currently part of the legal team at SOK Law Advocates, where she specializes in litigation, legal drafting, corporate, and commercial law. At SOK Law Advocates, Loise has successfully handled diverse legal matters, providing expert advice, contract preparation, pleadings, negotiations, case management, and drafting legal documents with professionalism and diligence. She is committed to upholding the highest standards of integrity and delivering practical, results-driven legal solutions to meet clients\' needs.',
    expertise: [
      'Litigation',
      'Corporate Law',
      'Commercial Law',
      'Legal Drafting',
      'Contract Negotiation',
      'Case Management'
    ],
    education: [
      'Bachelor of Laws (LLB)'
    ],
    admissions: [
      'Advocate of the High Court of Kenya',
      'Member of Law Society of Kenya'
    ],
    languages: ['English', 'Swahili', 'Kikuyu']
  },
  {
    id: 'justus-njoroge',
    name: 'Justus Njoroge',
    role: 'Conveyancing Clerk',
    category: 'Consultants',
    specialization: 'Conveyancing & Property Documentation',
    image: 'https://i.postimg.cc/ncYZgYW3/7X2A2853.jpg',
    email: 'justus@soklaw.co.ke',
    phone: '+254 700 123 461',
    isPartner: false,
    qualifications: ['Diploma in Legal Studies', 'Certificate in Conveyancing Practice'],
    experience: '3+ years in conveyancing and property documentation',
    achievements: [
      'Managed efficient processing of property transfer documents',
      'Assisted in complex conveyancing transactions and due diligence',
      'Maintained accurate property records and client documentation',
      'Supported attorneys in property law matters with precision and attention to detail'
    ],
    description: 'Justus Njoroge serves as a Conveyancing Clerk at SOK Law Advocates, bringing specialized expertise in property documentation and conveyancing processes. With a strong background in legal studies and focused training in conveyancing practice, he plays a crucial role in ensuring smooth property transactions for the firm\'s clients. His attention to detail and thorough understanding of property law procedures make him an invaluable asset to the conveyancing department. Justus works closely with the legal team to prepare, review, and process all property-related documentation, ensuring compliance with legal requirements and timely completion of transactions.',
    expertise: [
      'Conveyancing Procedures',
      'Property Documentation',
      'Title Search & Verification',
      'Property Transfer Processing',
      'Legal Document Preparation',
      'Property Records Management'
    ],
    education: [
      'Diploma in Legal Studies',
      'Certificate in Conveyancing Practice'
    ],
    admissions: [
      'Registered Conveyancing Clerk',
      'Member of Professional Legal Clerks Association'
    ],
    languages: ['English', 'Swahili', 'Kikuyu']
  },
  {
    id: 'shallet-katiku',
    name: 'Shallet Wangui Katiku',
    role: 'Receptionist',
    category: 'Assistants',
    specialization: 'Client Relations & Administrative Support',
    image: 'https://i.postimg.cc/FFVBQW9k/7-X2-A2882-1.jpg',
    email: 'shallet@soklaw.co.ke',
    phone: '+254 700 123 462',
    isPartner: false,
    qualifications: ['Certificate in Customer Service', 'Diploma in Business Administration'],
    experience: '2+ years in client service and administrative support',
    achievements: [
      'Maintained excellent client satisfaction through professional front-desk service',
      'Efficiently managed appointment scheduling and client communications',
      'Provided multilingual support to diverse clientele',
      'Streamlined office administrative processes for improved efficiency'
    ],
    description: 'Shallet Wangui Katiku is the welcoming face of SOK Law Advocates, serving as the firm\'s Receptionist and first point of contact for clients. With her warm personality and professional approach, she ensures that every client receives exceptional service from the moment they walk through the door or call the office. Shallet brings strong administrative skills and customer service expertise to her role, managing appointment scheduling, client inquiries, and general office coordination with efficiency and care. Her multilingual abilities and cultural sensitivity make her particularly effective in serving the firm\'s diverse clientele, contributing significantly to the positive client experience that SOK Law is known for.',
    expertise: [
      'Client Relations',
      'Administrative Support',
      'Appointment Scheduling',
      'Multi-line Phone Management',
      'Office Coordination',
      'Customer Service Excellence'
    ],
    education: [
      'Diploma in Business Administration',
      'Certificate in Customer Service'
    ],
    admissions: [
      'Certified Customer Service Professional'
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