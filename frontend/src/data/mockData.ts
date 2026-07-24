import { Employee, Project, TaskItem, AttendanceRecord, LeaveRequestItem, Announcement, AuditLogItem, NotificationItem } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 1,
    employeeCode: 'EMP-101',
    firstName: 'Karthik',
    lastName: 'Sundaram',
    email: 'karthik.sundaram@smartcorp.in',
    phone: '+91 98765 43210',
    department: 'Engineering',
    designation: 'Senior Java Backend Specialist',
    salary: 1850000,
    dateOfBirth: '1992-07-25',
    joiningDate: '2021-03-15',
    address: '123 Knowledge Park, Indiranagar, Bengaluru, Karnataka',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 1, name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', issueDate: '2025-03-15', credentialId: 'AWS-99201' },
      { id: 2, name: 'Oracle Certified Professional: Java SE 21', issuer: 'Oracle Corporation', issueDate: '2024-11-10', credentialId: 'OCP-88219' }
    ],
    achievements: [
      { id: 1, title: 'Sprint MVP Q2 2026 🏆', badge: 'MVP', note: 'Delivered core microservices security API 3 days ahead of deadline.' },
      { id: 2, title: 'Code Quality Champion 💻', badge: 'CHAMPION', note: 'Achieved 98% unit test coverage across Spring Boot services.' }
    ]
  },
  {
    id: 2,
    employeeCode: 'EMP-102',
    firstName: 'Lakshmi',
    lastName: 'Narayanan',
    email: 'lakshmi.narayanan@smartcorp.in',
    phone: '+91 98123 45678',
    department: 'Engineering',
    designation: 'Lead DevOps & Cloud Architect',
    salary: 2100000,
    dateOfBirth: '1988-11-12',
    joiningDate: '2020-01-10',
    address: '456 IT Highway, OMR, Chennai, Tamil Nadu',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 3, name: 'Kubernetes Certified Administrator (CKA)', issuer: 'CNCF & Linux Foundation', issueDate: '2025-01-20', credentialId: 'CKA-77120' },
      { id: 4, name: 'HashiCorp Certified Terraform Associate', issuer: 'HashiCorp', issueDate: '2024-08-14', credentialId: 'TA-55104' }
    ],
    achievements: [
      { id: 3, title: 'Innovation Star 🌟', badge: 'STAR', note: 'Designed high-throughput Kafka streaming telemetry pipeline.' },
      { id: 4, title: 'Cloud Infrastructure Pioneer ☁️', badge: 'INFRA', note: 'Migrated legacy monolith to AWS Aurora with zero downtime.' }
    ]
  },
  {
    id: 3,
    employeeCode: 'EMP-103',
    firstName: 'Ashwin',
    lastName: 'Ramachandran',
    email: 'ashwin.ramachandran@smartcorp.in',
    phone: '+91 97890 12345',
    department: 'Product',
    designation: 'Principal Product Lead',
    salary: 2450000,
    dateOfBirth: '1990-07-23',
    joiningDate: '2019-06-01',
    address: '789 HITEC City, Gachibowli, Hyderabad, Telangana',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 5, name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', issueDate: '2023-06-20', credentialId: 'CSPO-44120' },
      { id: 6, name: 'SAFe 6.0 Practice Consultant', issuer: 'Scaled Agile Framework', issueDate: '2025-02-11', credentialId: 'SAFE-33109' }
    ],
    achievements: [
      { id: 5, title: 'Product Excellence Award 🚀', badge: 'LEAD', note: 'Successfully launched SmartHR Mobile App across 4 departments.' },
      { id: 6, title: 'Strategic Visionary 🔮', badge: 'VISION', note: 'Formulated 2026 AI Telemetry product roadmap.' }
    ]
  },
  {
    id: 4,
    employeeCode: 'EMP-104',
    firstName: 'Ananya',
    lastName: 'Subramanian',
    email: 'ananya.subramanian@smartcorp.in',
    phone: '+91 96543 21098',
    department: 'Design',
    designation: 'Senior UI/UX Designer',
    salary: 1500000,
    dateOfBirth: '1994-04-18',
    joiningDate: '2022-02-14',
    address: '101 Gokulam Tech Enclave, Mysuru, Karnataka',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 7, name: 'Figma Enterprise Systems Specialist', issuer: 'Figma Academy', issueDate: '2024-09-05', credentialId: 'FIG-11204' },
      { id: 8, name: 'NN/g UX Master Certification', issuer: 'Nielsen Norman Group', issueDate: '2023-12-01', credentialId: 'NNG-99812' }
    ],
    achievements: [
      { id: 7, title: 'Design System Masterpiece 🎨', badge: 'DESIGN', note: 'Created AA compliant corporate Dark Mode & glassmorphism theme.' },
      { id: 8, title: 'User Advocacy Award 💎', badge: 'USER', note: 'Achieved 95%+ User Satisfaction score on UI design testing.' }
    ]
  },
  {
    id: 5,
    employeeCode: 'EMP-105',
    firstName: 'Suresh',
    lastName: 'Venkatesh',
    email: 'suresh.venkatesh@smartcorp.in',
    phone: '+91 95432 10987',
    department: 'Human Resources',
    designation: 'Head of Talent & Culture',
    salary: 1650000,
    dateOfBirth: '1993-09-05',
    joiningDate: '2021-08-20',
    address: '202 Cyber Park, Infopark, Kochi, Kerala',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 9, name: 'SHRM Senior Certified Professional (SHRM-SCP)', issuer: 'Society for HR Management', issueDate: '2022-10-18', credentialId: 'SHRM-77291' },
      { id: 10, name: 'Senior Professional in HR (SPHR)', issuer: 'HRCI Certification', issueDate: '2021-05-12', credentialId: 'SPHR-66128' }
    ],
    achievements: [
      { id: 9, title: 'Top Talent Strategist 🤝', badge: 'TALENT', note: 'Recruited 25+ senior engineers with zero 90-day attrition.' },
      { id: 10, title: 'Culture Builder 🏆', badge: 'CULTURE', note: 'Pioneered corporate Wellness & Rewards initiative.' }
    ]
  },
  {
    id: 6,
    employeeCode: 'EMP-106',
    firstName: 'Vishnu',
    lastName: 'Prasad',
    email: 'vishnu.prasad@smartcorp.in',
    phone: '+91 94321 09876',
    department: 'Engineering',
    designation: 'Senior React & Mobile Specialist',
    salary: 1750000,
    dateOfBirth: '1993-05-14',
    joiningDate: '2021-11-01',
    address: '55 Brigade Road, Bengaluru, Karnataka',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 11, name: 'AWS Certified Developer Associate', issuer: 'Amazon Web Services', issueDate: '2024-06-10', credentialId: 'AWS-88301' },
      { id: 12, name: 'Meta React Native Specialist Certification', issuer: 'Meta Coursera', issueDate: '2023-09-15', credentialId: 'META-44210' }
    ],
    achievements: [
      { id: 11, title: 'Mobile App Innovation Champion 📱', badge: 'MOBILE', note: 'Architected offline biometric sync engine for SmartHR App.' },
      { id: 12, title: 'Performance Wizard ⚡', badge: 'SPEED', note: 'Reduced initial bundle load time by 42%.' }
    ]
  },
  {
    id: 7,
    employeeCode: 'EMP-107',
    firstName: 'Divya',
    lastName: 'Krishnan',
    email: 'divya.krishnan@smartcorp.in',
    phone: '+91 93210 98765',
    department: 'Engineering',
    designation: 'Frontend Architect & Systems Engineer',
    salary: 1950000,
    dateOfBirth: '1991-08-29',
    joiningDate: '2020-07-15',
    address: '88 Anna Salai, Guindy, Chennai, Tamil Nadu',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 13, name: 'Google Certified Web Developer Lead', issuer: 'Google Developers', issueDate: '2024-03-22', credentialId: 'GCD-99104' },
      { id: 14, name: 'Cypress E2E Testing Automation Master', issuer: 'Cypress.io', issueDate: '2023-11-18', credentialId: 'CYP-33201' }
    ],
    achievements: [
      { id: 13, title: 'Accessibility Champion ♿', badge: 'A11Y', note: 'Achieved WCAG 2.1 AAA compliance across all enterprise portals.' }
    ]
  },
  {
    id: 8,
    employeeCode: 'EMP-108',
    firstName: 'Arvind',
    lastName: 'Swaminathan',
    email: 'arvind.swaminathan@smartcorp.in',
    phone: '+91 92109 87654',
    department: 'Product',
    designation: 'Senior Technical Product Manager',
    salary: 2200000,
    dateOfBirth: '1989-03-17',
    joiningDate: '2019-10-10',
    address: '304 Financial District, Nanakramguda, Hyderabad, Telangana',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 15, name: 'Certified ScrumMaster (CSM)', issuer: 'Scrum Alliance', issueDate: '2023-01-14', credentialId: 'CSM-55190' },
      { id: 16, name: 'Pragmatic Certified Product Manager', issuer: 'Pragmatic Institute', issueDate: '2024-05-30', credentialId: 'PPM-88123' }
    ],
    achievements: [
      { id: 14, title: 'Agile Leadership Excellence 🎯', badge: 'AGILE', note: 'Led 6 cross-functional sprint teams with 99% sprint commitment delivery.' }
    ]
  },
  {
    id: 9,
    employeeCode: 'EMP-109',
    firstName: 'Deepa',
    lastName: 'Rajagopalan',
    email: 'deepa.rajagopalan@smartcorp.in',
    phone: '+91 91098 76543',
    department: 'Design',
    designation: 'Principal Product Experience Designer',
    salary: 1680000,
    dateOfBirth: '1995-12-03',
    joiningDate: '2022-04-18',
    address: '42 MG Road, Mysuru, Karnataka',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 17, name: 'Human Factors International Certified Usability Analyst (CUA)', issuer: 'HFI', issueDate: '2024-02-10', credentialId: 'CUA-10294' }
    ],
    achievements: [
      { id: 15, title: 'UX Research Vanguard 💡', badge: 'RESEARCH', note: 'Conducted user study with 150+ corporate employees to revamp dashboard.' }
    ]
  },
  {
    id: 10,
    employeeCode: 'EMP-110',
    firstName: 'Mahesh',
    lastName: 'Reddy',
    email: 'mahesh.reddy@smartcorp.in',
    phone: '+91 90987 65432',
    department: 'Human Resources',
    designation: 'Senior HR Operations Manager',
    salary: 1550000,
    dateOfBirth: '1992-02-21',
    joiningDate: '2021-09-01',
    address: '12 Jubilee Hills, Hyderabad, Telangana',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 18, name: 'SHRM Certified Professional (SHRM-CP)', issuer: 'SHRM', issueDate: '2023-04-15', credentialId: 'SHRM-44810' }
    ],
    achievements: [
      { id: 16, title: 'HR Analytics Trailblazer 📊', badge: 'ANALYTICS', note: 'Automated leave workflow reducing processing time by 80%.' }
    ]
  },
  {
    id: 11,
    employeeCode: 'EMP-111',
    firstName: 'Kavya',
    lastName: 'Nambiar',
    email: 'kavya.nambiar@smartcorp.in',
    phone: '+91 89876 54321',
    department: 'Engineering',
    designation: 'Lead Quality Assurance Specialist',
    salary: 1600000,
    dateOfBirth: '1994-10-10',
    joiningDate: '2022-01-05',
    address: '99 Technopark Highway, Trivandrum, Kerala',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 19, name: 'ISTQB Advanced Test Automation Engineer', issuer: 'ISTQB', issueDate: '2024-07-20', credentialId: 'ISTQB-88120' }
    ],
    achievements: [
      { id: 17, title: 'Zero Defect Hero 🛡️', badge: 'QA', note: 'Created 450+ automated Playwright integration tests.' }
    ]
  },
  {
    id: 12,
    employeeCode: 'EMP-112',
    firstName: 'Siddharth',
    lastName: 'Rao',
    email: 'siddharth.rao@smartcorp.in',
    phone: '+91 88765 43210',
    department: 'Engineering',
    designation: 'Senior Site Reliability Engineer (SRE)',
    salary: 2050000,
    dateOfBirth: '1990-06-30',
    joiningDate: '2020-03-20',
    address: '77 Koramangala, Bengaluru, Karnataka',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 20, name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', issueDate: '2024-01-15', credentialId: 'CKA-99210' },
      { id: 21, name: 'GCP Professional Cloud Architect', issuer: 'Google Cloud', issueDate: '2023-08-10', credentialId: 'GCP-33190' }
    ],
    achievements: [
      { id: 18, title: '99.99% Uptime Guardian ⚡', badge: 'SRE', note: 'Maintained 99.99% API availability during peak annual traffic.' }
    ]
  },
  {
    id: 13,
    employeeCode: 'EMP-113',
    firstName: 'Soundarya',
    lastName: 'Subrahmanian',
    email: 'soundarya.s@smartcorp.in',
    phone: '+91 87654 32109',
    department: 'Finance',
    designation: 'Head of Corporate Finance & Audit',
    salary: 2300000,
    dateOfBirth: '1987-01-15',
    joiningDate: '2018-05-12',
    address: '15 T. Nagar, Chennai, Tamil Nadu',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 22, name: 'Chartered Accountant (ICAI)', issuer: 'ICAI India', issueDate: '2015-06-18', credentialId: 'ICAI-44102' },
      { id: 23, name: 'Certified Information Systems Auditor (CISA)', issuer: 'ISACA', issueDate: '2021-11-05', credentialId: 'CISA-88190' }
    ],
    achievements: [
      { id: 19, title: 'Financial Stewardship Leader 💎', badge: 'FINANCE', note: 'Streamlined Q2 operational expenditure with 14% savings.' }
    ]
  },
  {
    id: 14,
    employeeCode: 'EMP-114',
    firstName: 'Harish',
    lastName: 'Hegde',
    email: 'harish.hegde@smartcorp.in',
    phone: '+91 86543 21098',
    department: 'Operations',
    designation: 'Director of Business Operations',
    salary: 2500000,
    dateOfBirth: '1986-09-08',
    joiningDate: '2017-08-01',
    address: '63 Hampankatta, Mangaluru, Karnataka',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 24, name: 'Lean Six Sigma Black Belt', issuer: 'ASQ', issueDate: '2019-04-12', credentialId: 'LSSBB-55102' },
      { id: 25, name: 'Project Management Professional (PMP)', issuer: 'PMI', issueDate: '2018-09-20', credentialId: 'PMP-99401' }
    ],
    achievements: [
      { id: 20, title: 'Operations Pinnacle Award 🏢', badge: 'OPS', note: 'Expanded corporate regional centers across 5 South Indian tech hubs.' }
    ]
  },
  {
    id: 15,
    employeeCode: 'EMP-115',
    firstName: 'Revathi',
    lastName: 'Balakrishnan',
    email: 'revathi.b@smartcorp.in',
    phone: '+91 85432 10987',
    department: 'Engineering',
    designation: 'Senior Data & AI Engineer',
    salary: 1900000,
    dateOfBirth: '1993-03-25',
    joiningDate: '2021-06-15',
    address: '51 Beach Road, Visakhapatnam, Andhra Pradesh',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 26, name: 'Databricks Certified Data Engineer Professional', issuer: 'Databricks', issueDate: '2024-05-15', credentialId: 'DB-99120' },
      { id: 27, name: 'TensorFlow Developer Certificate', issuer: 'Google', issueDate: '2023-10-10', credentialId: 'TF-44109' }
    ],
    achievements: [
      { id: 21, title: 'AI Telemetry Pioneer 🤖', badge: 'AI', note: 'Built real-time telemetry model detecting project bottlenecks.' }
    ]
  },
  {
    id: 16,
    employeeCode: 'EMP-116',
    firstName: 'Preeti',
    lastName: 'Sharma',
    email: 'preeti.sharma@smartcorp.in',
    phone: '+91 84321 09876',
    department: 'Engineering',
    designation: 'Cybersecurity & Application Security Lead',
    salary: 1980000,
    dateOfBirth: '1991-11-04',
    joiningDate: '2022-03-01',
    address: '14 Whitefield Main Rd, Bengaluru, Karnataka',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    certifications: [
      { id: 28, name: 'Certified Information Systems Security Professional (CISSP)', issuer: '(ISC)²', issueDate: '2023-01-15', credentialId: 'CISSP-88120' }
    ],
    achievements: [
      { id: 22, title: 'Zero-Trust Champion 🔐', badge: 'SECURITY', note: 'Implemented end-to-end TLS and OAuth2 verification.' }
    ]
  },
  {
    id: 17,
    employeeCode: 'EMP-117',
    firstName: 'Rajesh',
    lastName: 'Nair',
    email: 'rajesh.nair@smartcorp.in',
    phone: '+91 83210 98765',
    department: 'Engineering',
    designation: 'Senior Full Stack Specialist (Node/React)',
    salary: 1800000,
    dateOfBirth: '1993-08-19',
    joiningDate: '2021-10-15',
    address: '88 Panampilly Nagar, Kochi, Kerala',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 18,
    employeeCode: 'EMP-118',
    firstName: 'Meera',
    lastName: 'Joshi',
    email: 'meera.joshi@smartcorp.in',
    phone: '+91 82109 87654',
    department: 'Product',
    designation: 'Senior UX Research Analyst',
    salary: 1620000,
    dateOfBirth: '1995-02-14',
    joiningDate: '2023-01-10',
    address: '202 Viman Nagar, Pune, Maharashtra',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 19,
    employeeCode: 'EMP-119',
    firstName: 'Vikram',
    lastName: 'Choudhury',
    email: 'vikram.choudhury@smartcorp.in',
    phone: '+91 81098 76543',
    department: 'Finance',
    designation: 'Senior Financial Controller & Analyst',
    salary: 1950000,
    dateOfBirth: '1989-12-01',
    joiningDate: '2020-04-01',
    address: '45 Salt Lake Sector V, Kolkata, West Bengal',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 20,
    employeeCode: 'EMP-120',
    firstName: 'Swati',
    lastName: 'Menon',
    email: 'swati.menon@smartcorp.in',
    phone: '+91 80987 65432',
    department: 'Operations',
    designation: 'Lead Supply Chain & Logistics Coordinator',
    salary: 1720000,
    dateOfBirth: '1992-06-18',
    joiningDate: '2021-05-10',
    address: '12 MG Road, Thiruvananthapuram, Kerala',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Smart Corporate Portal 2.0',
    description: 'Enterprise React & Spring Boot microservices platform with OAuth2, JWT authentication and real-time task sync.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    startDate: '2026-06-01',
    deadline: '2026-09-30',
    budget: 2500000,
    assignedEmployeeIds: [1, 2, 3, 4, 6, 7]
  },
  {
    id: 2,
    name: 'AWS Cloud Aurora Migration',
    description: 'Migrating legacy monolithic database to AWS Aurora PostgreSQL and Spring Cloud Gateway.',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    startDate: '2026-05-15',
    deadline: '2026-08-15',
    budget: 4500000,
    assignedEmployeeIds: [2, 1, 12, 15]
  },
  {
    id: 3,
    name: 'Mobile HR Biometric App',
    description: 'Cross-platform mobile application for geolocation check-in, biometric login, and leave approvals.',
    priority: 'MEDIUM',
    status: 'PLANNED',
    startDate: '2026-08-01',
    deadline: '2026-11-30',
    budget: 1800000,
    assignedEmployeeIds: [3, 4, 5, 6, 11]
  },
  {
    id: 4,
    name: 'AI Executive Telemetry Analytics',
    description: 'Machine learning predictive risk dashboard and automated weekly executive report generation.',
    priority: 'HIGH',
    status: 'COMPLETED',
    startDate: '2026-01-10',
    deadline: '2026-06-30',
    budget: 3200000,
    assignedEmployeeIds: [1, 3, 8, 13, 14]
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 101,
    projectId: 1,
    title: 'Sprint Microservices Security OAuth2 Integration',
    description: 'Implement JWT Token verification filter and Spring Security role-based access control annotations.',
    assignedEmployeeId: 1,
    assignedBy: 'Karthik Sundaram (Admin)',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    progressPercentage: 85,
    deadline: '2026-08-10',
    remarks: 'JWT Token filter code complete, proceeding to integration unit tests.'
  },
  {
    id: 102,
    projectId: 1,
    title: 'Design System & Dark Mode Color Token Refinement',
    description: 'Refine Tailwind CSS color palettes, component badges, and dark slate container themes.',
    assignedEmployeeId: 4,
    assignedBy: 'Karthik Sundaram (Admin)',
    priority: 'HIGH',
    status: 'DONE',
    progressPercentage: 100,
    deadline: '2026-07-28',
    remarks: 'Dark mode contrast verified across all viewport breakpoints.'
  },
  {
    id: 103,
    projectId: 2,
    title: 'AWS Aurora DB Replication Pipeline Setup',
    description: 'Configure multi-region read replicas and automated daily backup snapshots.',
    assignedEmployeeId: 2,
    assignedBy: 'Lakshmi Narayanan (DevOps Lead)',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    progressPercentage: 70,
    deadline: '2026-08-05',
    remarks: 'Replication latency under 20ms.'
  },
  {
    id: 104,
    projectId: 3,
    title: 'Mobile Geolocation Check-in API Prototype',
    description: 'Build REST endpoints for GPS coordinates verification and geofencing radius checks.',
    assignedEmployeeId: 3,
    assignedBy: 'Ashwin Ramachandran (Product Lead)',
    priority: 'MEDIUM',
    status: 'TODO',
    progressPercentage: 10,
    deadline: '2026-08-25',
    remarks: 'Initial OpenAPI spec drafted in Swagger.'
  },
  {
    id: 105,
    projectId: 1,
    title: 'Hibernate ORM Entity & Audit Mapping Refactoring',
    description: 'Optimize JPA entity relationships and enable auditing annotations for automatic timestamp tracking.',
    assignedEmployeeId: 1,
    assignedBy: 'Karthik Sundaram (Admin)',
    priority: 'MEDIUM',
    status: 'DONE',
    progressPercentage: 100,
    deadline: '2026-07-20',
    remarks: 'JPA repository performance tests passed cleanly.'
  },
  {
    id: 106,
    projectId: 2,
    title: 'Spring Boot Actuator Health Telemetry Endpoint',
    description: 'Expose Prometheus metrics endpoints for container CPU and JVM memory monitoring.',
    assignedEmployeeId: 12,
    assignedBy: 'Lakshmi Narayanan (DevOps Lead)',
    priority: 'HIGH',
    status: 'REVIEW',
    progressPercentage: 90,
    deadline: '2026-08-02',
    remarks: 'PR opened and waiting for peer security review.'
  },
  {
    id: 107,
    projectId: 3,
    title: 'Biometric Authentication (FaceID & Fingerprint) Interface',
    description: 'Integrate native device biometric prompt APIs for secure passwordless login.',
    assignedEmployeeId: 7,
    assignedBy: 'Ananya Subramanian (Design Lead)',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    progressPercentage: 45,
    deadline: '2026-09-01',
    remarks: 'UI mockups approved by UX team.'
  },
  {
    id: 108,
    projectId: 4,
    title: 'Automated Weekly Executive Email Report Pipeline',
    description: 'Set up cron schedule generator and HTML email renderer for executive summaries.',
    assignedEmployeeId: 8,
    assignedBy: 'Ashwin Ramachandran (Product Lead)',
    priority: 'MEDIUM',
    status: 'DONE',
    progressPercentage: 100,
    deadline: '2026-06-25',
    remarks: 'Email templates verified across mobile mail clients.'
  },
  {
    id: 109,
    projectId: 4,
    title: 'Machine Learning Predictive Risk Analytics Model',
    description: 'Train telemetry classification model to identify sprint delay risks early.',
    assignedEmployeeId: 15,
    assignedBy: 'Karthik Sundaram (Admin)',
    priority: 'HIGH',
    status: 'DONE',
    progressPercentage: 100,
    deadline: '2026-06-15',
    remarks: 'Model accuracy benchmarked at 94.2%.'
  },
  {
    id: 110,
    projectId: 4,
    title: 'Performance Metrics Dashboard & PDF Generator',
    description: 'Implement dynamic POI / PDF report generation for departmental payroll & attendance metrics.',
    assignedEmployeeId: 13,
    assignedBy: 'Karthik Sundaram (Admin)',
    priority: 'HIGH',
    status: 'REVIEW',
    progressPercentage: 90,
    deadline: '2026-06-28',
    remarks: 'PDF layout export operational.'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 1, employeeId: 1, employeeName: 'Karthik Sundaram', date: '2026-07-23', checkIn: '09:14 AM', checkOut: '05:44 PM', status: 'PRESENT', workHours: 8.5, remarks: 'On time' },
  { id: 2, employeeId: 2, employeeName: 'Lakshmi Narayanan', date: '2026-07-23', checkIn: '09:02 AM', checkOut: '05:30 PM', status: 'PRESENT', workHours: 8.4, remarks: 'On time' },
  { id: 3, employeeId: 3, employeeName: 'Ashwin Ramachandran', date: '2026-07-23', checkIn: '09:45 AM', checkOut: '05:45 PM', status: 'LATE', workHours: 8.0, remarks: 'Late check-in due to traffic' },
  { id: 4, employeeId: 4, employeeName: 'Ananya Subramanian', date: '2026-07-23', checkIn: '08:55 AM', checkOut: '05:00 PM', status: 'PRESENT', workHours: 8.0, remarks: 'On time' },
  { id: 5, employeeId: 5, employeeName: 'Suresh Venkatesh', date: '2026-07-23', checkIn: '--:--', checkOut: '--:--', status: 'ON_LEAVE', workHours: 0, remarks: 'Approved casual leave' },
  { id: 6, employeeId: 6, employeeName: 'Vishnu Prasad', date: '2026-07-23', checkIn: '09:05 AM', checkOut: '05:15 PM', status: 'PRESENT', workHours: 8.1, remarks: 'On time' },
  { id: 7, employeeId: 7, employeeName: 'Divya Krishnan', date: '2026-07-23', checkIn: '08:50 AM', checkOut: '05:30 PM', status: 'PRESENT', workHours: 8.6, remarks: 'Overtime' },
  { id: 8, employeeId: 8, employeeName: 'Arvind Swaminathan', date: '2026-07-23', checkIn: '09:30 AM', checkOut: '05:30 PM', status: 'LATE', workHours: 8.0, remarks: 'Traffic delay' },
  { id: 9, employeeId: 9, employeeName: 'Deepa Rajagopalan', date: '2026-07-23', checkIn: '09:00 AM', checkOut: '05:00 PM', status: 'PRESENT', workHours: 8.0, remarks: 'On time' },
  { id: 10, employeeId: 10, employeeName: 'Mahesh Reddy', date: '2026-07-23', checkIn: '09:10 AM', checkOut: '05:10 PM', status: 'PRESENT', workHours: 8.0, remarks: 'On time' },
  { id: 11, employeeId: 11, employeeName: 'Kavya Nambiar', date: '2026-07-23', checkIn: '08:58 AM', checkOut: '05:00 PM', status: 'PRESENT', workHours: 8.0, remarks: 'On time' },
  { id: 12, employeeId: 12, employeeName: 'Siddharth Rao', date: '2026-07-23', checkIn: '09:12 AM', checkOut: '05:12 PM', status: 'PRESENT', workHours: 8.0, remarks: 'On time' },
  { id: 13, employeeId: 13, employeeName: 'Soundarya Subrahmanian', date: '2026-07-23', checkIn: '09:00 AM', checkOut: '05:30 PM', status: 'PRESENT', workHours: 8.5, remarks: 'Overtime' },
  { id: 14, employeeId: 14, employeeName: 'Harish Hegde', date: '2026-07-23', checkIn: '08:45 AM', checkOut: '05:15 PM', status: 'PRESENT', workHours: 8.5, remarks: 'On time' },
  { id: 15, employeeId: 15, employeeName: 'Revathi Balakrishnan', date: '2026-07-23', checkIn: '09:03 AM', checkOut: '05:03 PM', status: 'PRESENT', workHours: 8.0, remarks: 'On time' }
];

export const INITIAL_LEAVES: LeaveRequestItem[] = [
  {
    id: 1,
    employeeId: 5,
    employeeName: 'Suresh Venkatesh',
    leaveType: 'CASUAL',
    startDate: '2026-07-23',
    endDate: '2026-07-24',
    reason: 'Personal family occasion in Kochi',
    status: 'APPROVED',
    appliedDate: '2026-07-20'
  },
  {
    id: 2,
    employeeId: 1,
    employeeName: 'Karthik Sundaram',
    leaveType: 'ANNUAL',
    startDate: '2026-08-15',
    endDate: '2026-08-22',
    reason: 'Annual family vacation to Munnar',
    status: 'PENDING',
    appliedDate: '2026-07-22'
  },
  {
    id: 3,
    employeeId: 6,
    employeeName: 'Vishnu Prasad',
    leaveType: 'CASUAL',
    startDate: '2026-08-01',
    endDate: '2026-08-02',
    reason: 'Festival celebrations in Mysuru',
    status: 'PENDING',
    appliedDate: '2026-07-24'
  },
  {
    id: 4,
    employeeId: 11,
    employeeName: 'Kavya Nambiar',
    leaveType: 'SICK',
    startDate: '2026-07-28',
    endDate: '2026-07-29',
    reason: 'Routine health checkup',
    status: 'APPROVED',
    appliedDate: '2026-07-23'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: 'Q3 Enterprise All-Hands & Technical Townhall',
    content: 'Join us this Friday at 4:00 PM IST for our quarterly executive operational briefing and team awards.',
    priority: 'HIGH',
    postedBy: 'Karthik Sundaram',
    createdAt: '2026-07-22'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 1,
    action: 'USER_LOGIN',
    performedBy: 'Karthik Sundaram (Admin)',
    timestamp: '2026-07-23 09:14:02',
    details: 'Successful JWT authentication from IP 103.21.124.5',
    ipAddress: '103.21.124.5'
  },
  {
    id: 2,
    action: 'PROJECT_UPDATED',
    performedBy: 'Lakshmi Narayanan (DevOps)',
    timestamp: '2026-07-23 10:30:15',
    details: 'Updated AWS Aurora Migration budget to ₹45,00,000',
    ipAddress: '103.21.124.8'
  },
  {
    id: 3,
    action: 'TASK_COMPLETED',
    performedBy: 'Ananya Subramanian (Design)',
    timestamp: '2026-07-23 11:45:00',
    details: 'Task #102 "Design System Refinement" status changed to DONE',
    ipAddress: '103.21.124.12'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: 'Task Assigned: Microservices Security',
    message: 'Karthik, you have been assigned to Sprint OAuth2 Integration (Project #1).',
    type: 'TASK_ASSIGNED',
    isRead: false,
    createdAt: '10 minutes ago'
  },
  {
    id: 2,
    title: 'Leave Request Approved',
    message: 'Suresh Venkatesh casual leave request for 23-Jul to 24-Jul has been approved.',
    type: 'LEAVE_UPDATE',
    isRead: false,
    createdAt: '1 hour ago'
  }
];
