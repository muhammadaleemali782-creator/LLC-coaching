import { Course, StudyMaterial, SyllabusItem, Notice, VideoLecture, InstagramPost, GalleryItem, Student, Transaction, MockTest } from '../types';
import { ADMIN_GALLERY_ITEMS } from './adminGallery';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c-1-5',
    title: 'Junior Champs: Class 1 to 5 Foundation',
    category: 'primary',
    targetClass: 'Class 1-5',
    duration: 'Full Academic Year',
    fee: 4500,
    discountFee: 2999,
    rating: 4.9,
    enrolledCount: 142,
    instructor: 'Mrs. Ananya Sharma & Expert Faculty',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    badge: 'Popular Foundation',
    features: ['Maths, EVS, English & Hindi', 'Daily Activity Worksheets', 'Concept Building & Mental Maths', 'Personal Attention (Max 15/batch)'],
    description: 'A nurturing foundational program designed to build strong cognitive, arithmetic, and linguistic skills for young learners with play-way methodology.',
    syllabusHighlights: ['Mental Arithmetic & Number Magic', 'Grammar & Creative Expression', 'Environmental Awareness & Science Fun', 'Handwriting & Reading Fluency'],
    isPaid: true,
    schedule: 'Mon - Fri | 3:30 PM - 5:00 PM'
  },
  {
    id: 'c-6-8',
    title: 'Middle School Mastery: Class 6 to 8',
    category: 'middle',
    targetClass: 'Class 6-8',
    duration: 'Full Academic Year',
    fee: 6500,
    discountFee: 4499,
    rating: 4.8,
    enrolledCount: 210,
    instructor: 'Mr. Rajesh Verma & Team',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80',
    badge: 'Core Strong',
    features: ['Mathematics, Science, SST & English', 'Chapter-wise DPPs & Weekly Tests', 'Olympiad & NTSE Orientation', 'Doubt Solving Clinics'],
    description: 'Comprehensive subject mastery for middle school students, bridging school curriculum with advanced logical reasoning.',
    syllabusHighlights: ['Algebra, Geometry & Mensuration', 'Physics, Chemistry & Biology Fundamentals', 'History, Civics & Geography Insights', 'Advanced Grammar & Writing'],
    isPaid: true,
    schedule: 'Mon - Sat | 4:00 PM - 6:00 PM'
  },
  {
    id: 'c-9-10',
    title: 'Board Exam Ace: Class 9 & 10 Target 95%+',
    category: 'secondary',
    targetClass: 'Class 9-10',
    duration: 'Full Academic Year + Crash Revision',
    fee: 9500,
    discountFee: 6999,
    rating: 5.0,
    enrolledCount: 380,
    instructor: 'Er. R. K. Sharma (Founder) & Senior Mentors',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    badge: 'Topper Choice',
    features: ['CBSE & State Board Syllabus Mastery', '10 Years PYQs with Model Solutions', '5 Full-length Mock Board Exams', 'Answer Writing Skill Workshop'],
    description: 'Our flagship board preparation program renowned for producing district toppers year after year with precise pedagogy and test series.',
    syllabusHighlights: ['Mathematics (NCERT + Exemplar + RD)', 'Science (Concept + Lab Practical Qs)', 'Social Science Mind-Maps', 'English Language & Literature'],
    isPaid: true,
    schedule: 'Mon - Sat | 5:00 PM - 7:30 PM'
  },
  {
    id: 'c-11-12-sci',
    title: 'Class 11 & 12 Science (PCM / PCB) + Target Boards',
    category: 'senior',
    targetClass: 'Class 11-12',
    duration: '1 & 2 Year Target Program',
    fee: 14500,
    discountFee: 9999,
    rating: 4.9,
    enrolledCount: 295,
    instructor: 'Er. R. K. Sharma & Prof. S. N. Mishra',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    badge: 'Rankers Batch',
    features: ['Physics, Chemistry, Maths & Biology', 'Formula Booklets & Derivation Guides', 'Competitive Exam Foundation (JEE/NEET/CUET)', '1-on-1 Mentorship & Test Analysis'],
    description: 'Rigorous conceptual coaching for senior secondary students aiming for top board percentages and strong competitive readiness.',
    syllabusHighlights: ['Mechanics, Electrodynamics & Modern Physics', 'Organic, Inorganic & Physical Chemistry', 'Calculus, Vectors & Algebra', 'Cell Biology, Genetics & Human Physiology'],
    isPaid: true,
    schedule: 'Daily | 6:00 AM - 8:30 AM & 6:00 PM - 8:30 PM'
  },
  {
    id: 'c-computer-diploma',
    title: 'Master Computer Diploma (DCA / ADCA / Tally Prime)',
    category: 'computer',
    targetClass: 'All Students & Job Aspirants',
    duration: '6 Months / 1 Year Certificate',
    fee: 7000,
    discountFee: 4999,
    rating: 4.9,
    enrolledCount: 310,
    instructor: 'Mr. Amit Kumar (Lead Tech Trainer)',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    badge: 'Govt. Recognized Diploma',
    features: ['100% Practical Lab Training (1:1 PC)', 'MS Office, Word, Excel, PowerPoint', 'Tally Prime with GST & Accounting', 'Python Programming & Web Basics', 'Job Placement Support'],
    description: 'Empower yourself with high-demand digital and computational skills. Includes practical lab exposure, projects, and verifiable certification.',
    syllabusHighlights: ['Computer Fundamentals & OS', 'Advanced MS Excel (Formulas, VLOOKUP, Pivots)', 'Tally Prime, GST Billing & Ledger', 'HTML5, CSS3 & Python Basics'],
    isPaid: true,
    schedule: 'Flexible Batches (Morning / Evening / Weekend)'
  },
  {
    id: 'c-english-fluency',
    title: 'Spoken English & Public Speaking Masterclass',
    category: 'spoken',
    targetClass: 'Open for All Age Groups',
    duration: '3 Months Intensive Bootcamp',
    fee: 4000,
    discountFee: 2499,
    rating: 4.8,
    enrolledCount: 185,
    instructor: 'Ms. Priyanshi Saxena (Communication Coach)',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    badge: 'Confidence Booster',
    features: ['Daily Group Discussions & Debates', 'Accent & Vocabulary Enhancement', 'Hesitation Removal & Stage Speech', 'Interview & Resume Prep'],
    description: 'Overcome fear and hesitation. Speak fluent, confident English in public, school, college, and professional job interviews.',
    syllabusHighlights: ['Grammar in Context (Zero Boring Rules)', 'Daily Life Situational Conversations', 'Public Speaking & Presentation Skills', 'Interview Etiquette & Body Language'],
    isPaid: true,
    schedule: 'Mon - Fri | 7:00 PM - 8:15 PM'
  }
];

export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-10-math-real',
    title: 'Class 10 Mathematics: Real Numbers & Polynomials Formula Bank',
    category: 'formulas',
    targetClass: 'Class 10',
    subject: 'Mathematics',
    chapter: 'Real Numbers & Polynomials',
    pages: 14,
    downloadUrl: '/assets/sample_notes.pdf',
    isPremium: false,
    fileType: 'pdf',
    dateAdded: '2026-09-25',
    downloadsCount: 342,
    previewContent: `[CHAPTER 1 & 2 COMPLETE REVISION NOTES]
1. Fundamental Theorem of Arithmetic:
Every composite number can be expressed (factorised) as a product of primes, and this factorisation is unique, apart from the order in which the prime factors occur.
• HCF(a, b) × LCM(a, b) = a × b (Only valid for two positive integers).

2. Irrational Numbers:
A number is irrational if it cannot be written in the form p/q where p, q are integers and q ≠ 0.
• Standard Board Proof: Proof of irrationality for √2, √3, √5, and 3 + 2√5.

3. Polynomials:
• Linear Polynomial: p(x) = ax + b, Degree = 1, Exactly 1 zero: x = -b/a.
• Quadratic Polynomial: p(x) = ax² + bx + c (a ≠ 0).
  - Sum of zeroes: α + β = -b/a = -(coefficient of x)/(coefficient of x²)
  - Product of zeroes: α · β = c/a = (constant term)/(coefficient of x²)
  - Formation: k[x² - (α + β)x + αβ].
• Cubic Polynomial: α + β + γ = -b/a, αβ + βγ + γα = c/a, αβγ = -d/a.`
  },
  {
    id: 'mat-10-sci-reactions',
    title: 'Class 10 Science: Chemical Reactions & Electricity Comprehensive Notes',
    category: 'pdf_notes',
    targetClass: 'Class 10',
    subject: 'Science',
    chapter: 'Chemical Reactions & Electricity',
    pages: 18,
    downloadUrl: '/assets/sample_notes.pdf',
    isPremium: false,
    fileType: 'pdf',
    dateAdded: '2026-09-25',
    downloadsCount: 418,
    previewContent: `[NCERT & BOARD PREPARATION NOTES]
1. Types of Chemical Reactions:
• Combination Reaction: CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat (Slaked lime formation).
• Decomposition Reaction: 2FeSO₄(s) --(Heat)--> Fe₂O₃(s) + SO₂(g) + SO₃(g).
• Displacement Reaction: Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s) (Blue solution turns light green).
• Double Displacement (Precipitation): Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s)↓ (White ppt) + 2NaCl(aq).
• Redox Reactions: Oxidation is gain of O or loss of H. Reduction is loss of O or gain of H.

2. Electricity & Ohm's Law:
• Electric Current: I = Q / t (Unit: Ampere, 1 A = 1 C/s).
• Potential Difference: V = W / Q (Unit: Volt, 1 V = 1 J/C).
• Ohm's Law: At constant temperature, V ∝ I ⇒ V = IR.
• Resistance: R = ρ(l / A), where ρ is resistivity (Unit: Ω·m).
• Resistors in Series: R_eq = R₁ + R₂ + R₃ (Current remains same).
• Resistors in Parallel: 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃ (Voltage remains same).
• Joule's Heating Law: H = I²Rt.`
  },
  {
    id: 'mat-9-math-num',
    title: 'Class 9 Mathematics: Number Systems & Lines and Angles Complete Module',
    category: 'pdf_notes',
    targetClass: 'Class 9',
    subject: 'Mathematics',
    chapter: 'Number Systems & Lines and Angles',
    pages: 12,
    downloadUrl: '/assets/sample_notes.pdf',
    isPremium: false,
    fileType: 'pdf',
    dateAdded: '2026-09-24',
    downloadsCount: 220,
    previewContent: `[CLASS 9 FOUNDATION MASTER NOTES]
1. Number Systems:
• Rational Numbers: Expressible as p/q. Terminating or Non-terminating recurring decimals.
• Irrational Numbers: Non-terminating non-recurring decimals (e.g. π, √2).
• Rationalisation of Denominator: Multiply numerator and denominator by conjugate pair (a - √b) / (a - √b).
• Laws of Exponents: a^m · a^n = a^(m+n), (a^m)^n = a^(mn), a^m / a^n = a^(m-n), a^0 = 1.

2. Lines and Angles:
• Linear Pair Axiom: If a ray stands on a line, the sum of two adjacent angles formed is 180°.
• Vertically Opposite Angles: If two lines intersect, vertically opposite angles are equal.
• Parallel Lines & Transversal: Corresponding angles equal, Alternate interior angles equal, Interior angles on same side of transversal sum to 180°.`
  },
  {
    id: 'mat-12-phys-electro',
    title: 'Class 12 Physics: Electrostatics & Magnetism High-Score Blueprint',
    category: 'formulas',
    targetClass: 'Class 12',
    subject: 'Physics',
    chapter: 'Electrostatics & Current',
    pages: 22,
    downloadUrl: '/assets/sample_notes.pdf',
    isPremium: true,
    fileType: 'pdf',
    dateAdded: '2026-09-22',
    downloadsCount: 290,
    previewContent: `[CBSE & NEET/JEE HIGH YIELD SUMMARY]
1. Coulomb's Law:
• F = (1 / 4πε₀) · (|q₁q₂| / r²), where 1 / 4πε₀ = 9 × 10⁹ N·m²/C².
2. Electric Field & Gauss Law:
• E = F / q₀, E for point charge = (1 / 4πε₀) · (q / r²).
• Electric Flux: Φ = ∮ E · dA = q_enclosed / ε₀.
• Field due to infinite wire: E = λ / (2πε₀r).
• Field due to infinite plane sheet: E = σ / (2ε₀).
3. Capacitance:
• C = Q / V. Parallel plate capacitor: C = ε₀A / d (with dielectric: C = Kε₀A / d).
• Energy stored: U = ½ CV² = ½ Q²/C = ½ QV.`
  },
  {
    id: 'mat-dca-fund',
    title: 'DCA Computer: Hardware, Windows & MS Office Automation Handbook',
    category: 'pdf_notes',
    targetClass: 'Computer / DCA',
    subject: 'Computer Science',
    chapter: 'Computer Fundamentals & MS Office',
    pages: 25,
    downloadUrl: '/assets/sample_notes.pdf',
    isPremium: false,
    fileType: 'pdf',
    dateAdded: '2026-09-21',
    downloadsCount: 512,
    previewContent: `[DCA / ADCA OFFICIAL COURSE SYLLABUS NOTES]
1. Computer Fundamentals:
• CPU Architecture: ALU (Arithmetic Logic Unit), CU (Control Unit), Registers, Cache Memory.
• Memory Hierarchy: Primary (RAM, ROM, Cache) vs Secondary Storage (SSD, HDD, Optical).
• Operating System: Windows 10/11 Architecture, Command Line Interface, Control Panel utilities.

2. MS Office Suite:
• MS Word: Mail Merge, Table formatting, Macro automation, Headers & Footers.
• MS Excel: Essential Formulas: SUM, AVERAGE, IF, VLOOKUP, XLOOKUP, COUNTIF, Pivot Tables & Data Analysis.
• MS PowerPoint: Slide Master, Custom animations, Transition timings, Presentation delivery.
• Tally Prime Basics: Company creation, Ledger accounting, Voucher entries (F4 Contra, F5 Payment, F6 Receipt, F8 Sales, F9 Purchase), GST Invoicing.`
  }
];

export const INITIAL_SYLLABUS: SyllabusItem[] = [
  {
    id: 'syl-10-sci',
    targetClass: 'Class 10',
    subject: 'Science',
    examBoard: 'CBSE & State Board',
    totalMarks: 100,
    academicYear: '2026-2027',
    pdfUrl: '#',
    chapters: [
      { name: 'Chemical Reactions and Equations', subtopics: ['Types of Reactions', 'Balancing Equations', 'Corrosion & Rancidity'], weightage: '6 Marks', estimatedHours: 12 },
      { name: 'Acids, Bases and Salts', subtopics: ['pH Scale', 'Indicators', 'Salts of Sodium & Calcium'], weightage: '6 Marks', estimatedHours: 10 },
      { name: 'Metals and Non-Metals', subtopics: ['Physical & Chemical Properties', 'Reactivity Series', 'Metallurgy basics'], weightage: '7 Marks', estimatedHours: 14 },
      { name: 'Life Processes', subtopics: ['Nutrition', 'Respiration', 'Transportation', 'Excretion'], weightage: '9 Marks', estimatedHours: 16 },
      { name: 'Light - Reflection and Refraction', subtopics: ['Mirrors', 'Lenses', 'Refractive Index', 'Lens Formula & Power'], weightage: '8 Marks', estimatedHours: 15 },
      { name: 'Electricity & Magnetic Effects', subtopics: ['Ohms Law', 'Resistance in Series/Parallel', 'Electric Motor', 'Electromagnetic Induction'], weightage: '11 Marks', estimatedHours: 18 }
    ]
  },
  {
    id: 'syl-10-math',
    targetClass: 'Class 10',
    subject: 'Mathematics',
    examBoard: 'CBSE & State Board',
    totalMarks: 100,
    academicYear: '2026-2027',
    pdfUrl: '#',
    chapters: [
      { name: 'Real Numbers', subtopics: ['Fundamental Theorem of Arithmetic', 'Irrationality Proofs'], weightage: '6 Marks', estimatedHours: 8 },
      { name: 'Polynomials & Quadratic Equations', subtopics: ['Relationship between Zeroes', 'Quadratic Formula', 'Discriminant'], weightage: '10 Marks', estimatedHours: 14 },
      { name: 'Pair of Linear Equations in Two Variables', subtopics: ['Graphical Method', 'Substitution', 'Elimination'], weightage: '8 Marks', estimatedHours: 12 },
      { name: 'Triangles & Coordinate Geometry', subtopics: ['Similarity Theorems', 'BPT Proof', 'Distance & Section Formula'], weightage: '14 Marks', estimatedHours: 20 },
      { name: 'Trigonometry & Applications (Heights and Distances)', subtopics: ['Trigonometric Ratios', 'Identities', 'Angle of Elevation/Depression'], weightage: '12 Marks', estimatedHours: 18 },
      { name: 'Statistics & Probability', subtopics: ['Mean, Median, Mode of Grouped Data', 'Empirical Probability'], weightage: '10 Marks', estimatedHours: 10 }
    ]
  },
  {
    id: 'syl-12-phy',
    targetClass: 'Class 12',
    subject: 'Physics',
    examBoard: 'CBSE & Target Boards',
    totalMarks: 100,
    academicYear: '2026-2027',
    pdfUrl: '#',
    chapters: [
      { name: 'Electrostatics (Charges, Field & Potential)', subtopics: ['Coulombs Law', 'Gauss Theorem', 'Capacitors in Series/Parallel'], weightage: '16 Marks (Unit I & II)', estimatedHours: 22 },
      { name: 'Current Electricity', subtopics: ['Kirchhoffs Laws', 'Wheatstone Bridge', 'Potentiometer/Meter Bridge'], weightage: 'Combined Unit', estimatedHours: 16 },
      { name: 'Magnetic Effects & EMI', subtopics: ['Biot-Savart Law', 'Ampere Circuital', 'Faraday Laws', 'Lenz Law & AC Generator'], weightage: '17 Marks', estimatedHours: 25 },
      { name: 'Optics (Ray & Wave)', subtopics: ['TIR', 'Prisms', 'Telescopes/Microscopes', 'Huygens Principle', 'Young Double Slit'], weightage: '18 Marks', estimatedHours: 28 },
      { name: 'Modern Physics & Semiconductor Devices', subtopics: ['Photoelectric Effect', 'Bohr Model', 'p-n Junction Diode', 'Rectifier'], weightage: '19 Marks', estimatedHours: 24 }
    ]
  },
  {
    id: 'syl-computer',
    targetClass: 'Computer / ADCA',
    subject: 'Computer Applications & Office Management',
    examBoard: 'L.C.C. Certified Diploma',
    totalMarks: 100,
    academicYear: '2026-2027',
    pdfUrl: '#',
    chapters: [
      { name: 'Computer Architecture & OS Mastery', subtopics: ['Hardware & Software', 'Windows 11 / Linux', 'File Management & Security'], weightage: '15 Marks', estimatedHours: 15 },
      { name: 'MS Office Professional Suite', subtopics: ['Word Document Formatting', 'Excel Advanced Formulas & Charts', 'PowerPoint Animations'], weightage: '30 Marks', estimatedHours: 35 },
      { name: 'Tally Prime with GST & Inventory', subtopics: ['Company Creation', 'Ledger & Voucher Entry', 'GST Returns & Balance Sheet'], weightage: '30 Marks', estimatedHours: 40 },
      { name: 'Internet & Web Essentials', subtopics: ['Cyber Hygiene', 'HTML5 & CSS Basics', 'Email Etiquette & Online Portals'], weightage: '25 Marks', estimatedHours: 20 }
    ]
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Admission Open for Session 2026-2027 (Scholarship Test on Sunday)',
    date: '2026-08-20',
    category: 'admission',
    description: 'Admissions are now open for Classes 1 to 12, Computer DCA/ADCA, and Spoken English. Early bird scholarship test offers up to 50% discount on tuition fees. Register at our center or online.',
    isImportant: true,
    badgeText: 'ADMISSIONS OPEN'
  },
  {
    id: 'not-2',
    title: 'Class 10 & 12 Pre-Board Mock Exam Schedule Released',
    date: '2026-08-18',
    category: 'exam',
    description: 'The Phase-1 Mock Board Examination will commence from 5th September. Timing: 9:00 AM to 12:15 PM. Hall tickets can be collected from the administration office.',
    isImportant: true,
    badgeText: 'EXAM ALERT'
  },
  {
    id: 'not-3',
    title: 'New Evening Batch for Spoken English & Personality Development',
    date: '2026-08-16',
    category: 'batch',
    description: 'Starting a brand new interactive evening batch from 1st September. Limited to 20 students per batch to ensure personalized attention and daily stage speech practice.',
    isImportant: false,
    badgeText: 'NEW BATCH'
  },
  {
    id: 'not-4',
    title: 'Parent-Teacher Meeting (PTM) for Term 1 Progress Review',
    date: '2026-08-12',
    category: 'ptm',
    description: 'Mandatory PTM will be held on Saturday, 29th August between 10:00 AM and 2:00 PM. Parents will receive individual test report cards and attendance analytics.',
    isImportant: false,
    badgeText: 'PTM NOTICE'
  },
  {
    id: 'not-5',
    title: 'Holiday Notice: Raksha Bandhan & Janmashtami Celebration',
    date: '2026-08-10',
    category: 'holiday',
    description: 'The coaching institute will remain closed on 28th August. Regular classes will resume as per scheduled timetable from 29th August.',
    isImportant: false,
    badgeText: 'HOLIDAY'
  }
];

export const INITIAL_VIDEOS: VideoLecture[] = [
  {
    id: 'v-1789836144774',
    title: 'This That Detail explaination',
    subject: 'English Grammar & Concept Mastery',
    targetClass: 'All Batches (Classes 1–12)',
    duration: '12:45',
    youtubeId: 't1a9Kmd_cS8',
    videoId: 't1a9Kmd_cS8',
    youtubeUrl: 'https://www.youtube.com/watch?v=t1a9Kmd_cS8',
    thumbnail: 'https://img.youtube.com/vi/t1a9Kmd_cS8/hqdefault.jpg',
    instructor: 'Director Aman Arora',
    views: '1.2K views',
    isFeatured: true,
    notesPdfUrl: '#'
  }
];

export const INITIAL_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'insta-1',
    title: 'Celebration of District Toppers at L.C.C. Annual Felicitation Day! Proud moments ❤️🎉',
    likes: '1,420',
    comments: '88',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    postUrl: 'https://instagram.com',
    type: 'post',
    date: '2 days ago'
  },
  {
    id: 'insta-2',
    title: 'Class 10 Science Live Experiment: Elephant Toothpaste & Exothermic Reactions in Lab! 🧪💥',
    likes: '3,890',
    comments: '215',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    postUrl: 'https://instagram.com',
    type: 'reel',
    date: '4 days ago'
  },
  {
    id: 'insta-3',
    title: 'Confidence speaks! English Speaking students debating enthusiastically on Stage 🎤✨',
    likes: '2,110',
    comments: '64',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80',
    postUrl: 'https://instagram.com',
    type: 'reel',
    date: '1 week ago'
  },
  {
    id: 'insta-4',
    title: 'Computer Lab in full swing! Students creating interactive web pages and Tally ledgers 💻🚀',
    likes: '950',
    comments: '42',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    postUrl: 'https://instagram.com',
    type: 'post',
    date: '2 weeks ago'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = ADMIN_GALLERY_ITEMS;

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-demo',
    name: 'Aarav Patel',
    email: 'student@lcc.edu',
    phone: '+91 98765 43210',
    classEnrolled: 'Class 10',
    enrolledCourses: ['c-9-10', 'c-computer-diploma'],
    courseProgress: {
      'c-9-10': 68,
      'c-computer-diploma': 42
    },
    completedLessons: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4'],
    joinedDate: '2026-06-15',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'stu-2',
    name: 'Sneha Kumari',
    email: 'sneha@gmail.com',
    phone: '+91 98765 11223',
    classEnrolled: 'Class 12 Science',
    enrolledCourses: ['c-11-12-sci'],
    courseProgress: {
      'c-11-12-sci': 85
    },
    completedLessons: ['lesson-1', 'lesson-2'],
    joinedDate: '2026-05-20'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-98421',
    studentName: 'Aarav Patel',
    studentEmail: 'student@lcc.edu',
    studentPhone: '+91 98765 43210',
    courseId: 'c-9-10',
    courseName: 'Board Exam Ace: Class 9 & 10 Target 95%+',
    amount: 6999,
    paymentMethod: 'UPI',
    date: '2026-08-18 14:22',
    status: 'Completed',
    utrNumber: 'UPI/20260818/8892104'
  },
  {
    id: 'TXN-98420',
    studentName: 'Sneha Kumari',
    studentEmail: 'sneha@gmail.com',
    studentPhone: '+91 98765 11223',
    courseId: 'c-11-12-sci',
    courseName: 'Class 11 & 12 Science (PCM / PCB) + Target Boards',
    amount: 9999,
    paymentMethod: 'Card',
    date: '2026-08-16 11:05',
    status: 'Completed',
    utrNumber: 'CARD/HDFC/992147'
  },
  {
    id: 'TXN-98419',
    studentName: 'Vikram Singh',
    studentEmail: 'vikram.singh@gmail.com',
    studentPhone: '+91 94120 55432',
    courseId: 'c-computer-diploma',
    courseName: 'Master Computer Diploma (DCA / ADCA / Tally Prime)',
    amount: 4999,
    paymentMethod: 'QR',
    date: '2026-08-15 16:40',
    status: 'Completed',
    utrNumber: 'UPI/GPAY/331092'
  }
];

export const INITIAL_MOCK_TESTS: MockTest[] = [
  {
    id: 'test-10-sci',
    title: 'Class 10 Science: Chemical Reactions & Acids-Bases Mega Quiz',
    targetClass: 'Class 10',
    subject: 'Science',
    durationMinutes: 15,
    totalMarks: 20,
    passingMarks: 12,
    questions: [
      {
        id: 1,
        question: 'Which of the following is a displacement reaction?',
        options: [
          'CaO + H2O -> Ca(OH)2',
          'Fe + CuSO4 -> FeSO4 + Cu',
          '2KClO3 -> 2KCl + 3O2',
          'NaOH + HCl -> NaCl + H2O'
        ],
        correctOption: 1,
        explanation: 'Iron (Fe) is more reactive than copper (Cu) and displaces it from CuSO4 to form FeSO4 and reddish Cu.'
      },
      {
        id: 2,
        question: 'What is the pH of a neutral aqueous solution at 25°C?',
        options: ['0', '7', '14', '1'],
        correctOption: 1,
        explanation: 'At 25°C, pure neutral water has equal H+ and OH- concentrations corresponding to pH = 7.'
      },
      {
        id: 3,
        question: 'Which gas is released when dilute hydrochloric acid reacts with zinc metal granules?',
        options: ['Oxygen', 'Carbon Dioxide', 'Hydrogen', 'Chlorine'],
        correctOption: 2,
        explanation: 'Zn + 2HCl -> ZnCl2 + H2(g). Hydrogen gas burns with a characteristic pop sound.'
      },
      {
        id: 4,
        question: 'The breakdown of pyruvate to give carbon dioxide, water and energy takes place in:',
        options: ['Cytoplasm', 'Mitochondria', 'Chloroplast', 'Nucleus'],
        correctOption: 1,
        explanation: 'Aerobic respiration and Krebs cycle take place inside the mitochondria to yield ATP energy.'
      }
    ]
  },
  {
    id: 'test-comp-1',
    title: 'Computer Awareness & MS Excel Fundamentals Test',
    targetClass: 'Computer',
    subject: 'Computer Science',
    durationMinutes: 10,
    totalMarks: 15,
    passingMarks: 9,
    questions: [
      {
        id: 1,
        question: 'What is the shortcut key to enter the current date in MS Excel?',
        options: ['Ctrl + ;', 'Ctrl + Shift + :', 'Ctrl + D', 'Alt + Shift + D'],
        correctOption: 0,
        explanation: 'Ctrl + ; inserts the current system date into the selected active cell.'
      },
      {
        id: 2,
        question: 'Which protocol is used for securely transmitting web pages over the internet?',
        options: ['FTP', 'HTTP', 'HTTPS', 'SMTP'],
        correctOption: 2,
        explanation: 'HTTPS (Hypertext Transfer Protocol Secure) encrypts data using SSL/TLS.'
      },
      {
        id: 3,
        question: 'In Tally Prime, which voucher key is used for recording Cash/Bank Payments?',
        options: ['F4 (Contra)', 'F5 (Payment)', 'F6 (Receipt)', 'F7 (Journal)'],
        correctOption: 1,
        explanation: 'F5 is the standard shortcut key for Payment vouchers in Tally.'
      }
    ]
  }
];
