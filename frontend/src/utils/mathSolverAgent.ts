// 100% Free Client-Side All-Subject Academic & Helpdesk AI Agent for L.C.C. Live Chat
// Runs 100% on client-side JavaScript without API keys, zero token fees, and zero latency.
// Fully supports English, Hinglish, and Hindi for:
// 1. English (Verbs, Spoken English, Grammar, Tenses, Vocabulary)
// 2. Social Studies / SST (History, Civics, Samvidhan, Geography, Economics)
// 3. Computer & DCA / Tally / IT (Hardware, Software, Internet, Excel, Shortcuts)
// 4. Science (Physics, Chemistry, Biology)
// 5. Mathematics (Formulas, Equations, Percentages, Calculations)
// 6. Institute Faculty, Admissions & Fees

export interface AgentResponse {
  type: 'academic' | 'math' | 'counseling' | 'general';
  reply: string;
}

export const solveAcademicQuery = (query: string): AgentResponse => {
  const raw = query.trim();
  const q = raw.toLowerCase();

  // ══════════════════════════════════════════════
  // 1. GREETINGS & DIRECT HELP INQUIRY
  // ══════════════════════════════════════════════
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'namaste' ||
    q === 'hey' ||
    q === 'kya problem hai' ||
    q.includes('kaise ho') ||
    q.includes('madad') ||
    q.includes('help me')
  ) {
    return {
      type: 'general',
      reply: `✨ [L.C.C. AI Study Assistant]\n\nNamaste! 🙏 Kya problem hai aapko? Hamein batayein — English, SST, Computer, Science, Math ya Admission, hum turant hal karenge!`
    };
  }

  // ══════════════════════════════════════════════
  // 2. TEACHERS & FACULTY INQUIRIES
  // ══════════════════════════════════════════════
  if (
    q.includes('teacher') ||
    q.includes('faculty') ||
    q.includes('padhata') ||
    q.includes('padhate') ||
    q.includes('sir') ||
    q.includes('mam') ||
    q.includes('maam') ||
    q.includes('mentor') ||
    q.includes('kaun hai') ||
    q.includes('aman arora') ||
    q.includes('rajesh') ||
    q.includes('ananya') ||
    q.includes('amit')
  ) {
    if (q.includes('aman') || q.includes('director')) {
      return {
        type: 'counseling',
        reply: `✨ [L.C.C. AI Study Assistant - Director & Faculty]\n\n👨‍🏫 Aman Arora (Managing Director & Senior Mentor)\n• Subjects: Mathematics, Physics & Board Exam Mastery\n• Experience: 15+ years of dedicated coaching in Varanasi\n• Specialization: Conceptual clarity, shortcuts for competitive entrance, and personalized student mentoring.\n• Location: Palahipatti Main Campus.\n\n"Director Aman Arora sir personally mentors Class 9–12 students and monitors academic progress weekly."`
      };
    }
    if (q.includes('rajesh')) {
      return {
        type: 'counseling',
        reply: `✨ [L.C.C. AI Study Assistant - Faculty Profile]\n\n👨‍🏫 Rajesh Verma (Senior Mathematics Faculty)\n• Subjects: Class 9–10 Mathematics, Quantitative Aptitude & Reasoning\n• Specialization: Board exam NCERT questions, geometry proofs, and algebra speed techniques.\n• Availability: Daily doubt counter at Palahipatti and Sindhora campuses.`
      };
    }
    if (q.includes('ananya')) {
      return {
        type: 'counseling',
        reply: `✨ [L.C.C. AI Study Assistant - Faculty Profile]\n\n👩‍🏫 Mrs. Ananya Sharma (Senior Science Faculty)\n• Subjects: Physics, Chemistry & Biology (Classes 6–10) & Junior Foundation\n• Specialization: Practical science demonstrations, chemistry reaction mechanisms, and biology diagrams.`
      };
    }
    if (q.includes('amit')) {
      return {
        type: 'counseling',
        reply: `✨ [L.C.C. AI Study Assistant - Faculty Profile]\n\n👨‍🏫 Amit Kumar (Computer & Commerce Faculty)\n• Subjects: DCA Diploma, Tally Prime with GST, MS Office Suite, Python/C basics\n• Specialization: Hands-on practical computer training in L.C.C. air-conditioned lab.`
      };
    }

    return {
      type: 'counseling',
      reply: `✨ [L.C.C. AI Study Assistant - Our Distinguished Faculty]\n\nL.C.C. coaching me expert mentors ki team padhati hai:\n\n1. 👨‍🏫 Aman Arora (Managing Director & Senior Mentor) — Mathematics, Physics & Strategy\n2. 👨‍🏫 Rajesh Verma (Senior Faculty) — Class 9–10 Mathematics & Aptitude\n3. 👩‍🏫 Mrs. Ananya Sharma (Senior Faculty) — Science (Physics, Chemistry, Biology)\n4. 👨‍🏫 Amit Kumar (Computer Faculty) — DCA Diploma & Tally Prime with GST\n\nDaily 1-on-1 doubt clearing counters available hain.`
    };
  }

  // ══════════════════════════════════════════════
  // 3. ENGLISH GRAMMAR, SPOKEN ENGLISH & VERBS
  // ══════════════════════════════════════════════

  // A. Verbs & Kriya (Definition, Types, Examples)
  if (
    q.includes('verb') ||
    q.includes('verbs') ||
    q.includes('kriya') ||
    q.includes('helping verb') ||
    q.includes('modal verb') ||
    q.includes('main verb')
  ) {
    // Specific irregular verb past tense lookups
    const verbMap: Record<string, { v1: string; v2: string; v3: string; meaning: string }> = {
      'go': { v1: 'Go', v2: 'Went', v3: 'Gone', meaning: 'जाना' },
      'eat': { v1: 'Eat', v2: 'Ate', v3: 'Eaten', meaning: 'खाना' },
      'come': { v1: 'Come', v2: 'Came', v3: 'Come', meaning: 'आना' },
      'see': { v1: 'See', v2: 'Saw', v3: 'Seen', meaning: 'देखना' },
      'write': { v1: 'Write', v2: 'Wrote', v3: 'Written', meaning: 'लिखना' },
      'read': { v1: 'Read', v2: 'Read (red)', v3: 'Read (red)', meaning: 'पढ़ना' },
      'do': { v1: 'Do / Does', v2: 'Did', v3: 'Done', meaning: 'करना' },
      'take': { v1: 'Take', v2: 'Took', v3: 'Taken', meaning: 'लेना' },
      'give': { v1: 'Give', v2: 'Gave', v3: 'Given', meaning: 'देना' },
      'teach': { v1: 'Teach', v2: 'Taught', v3: 'Taught', meaning: 'सिखाना / पढ़ाना' },
      'run': { v1: 'Run', v2: 'Ran', v3: 'Run', meaning: 'दौड़ना' },
      'speak': { v1: 'Speak', v2: 'Spoke', v3: 'Spoken', meaning: 'बोलना' },
      'buy': { v1: 'Buy', v2: 'Bought', v3: 'Bought', meaning: 'खरीदना' }
    };

    for (const [verbKey, info] of Object.entries(verbMap)) {
      if (q.includes(verbKey) && (q.includes('past') || q.includes('v2') || q.includes('v3') || q.includes('form') || q.includes('second') || q.includes('third'))) {
        return {
          type: 'academic',
          reply: `✨ [L.C.C. AI Study Assistant - English Verb Forms]\n\n📖 Verb Forms for "${info.v1}" (${info.meaning}):\n\n• V1 (Present Form): ${info.v1}\n• V2 (Past Tense): ${info.v2} ✅\n• V3 (Past Participle): ${info.v3}\n• V4 (Present Participle / ing): ${info.v1}ing\n\n💡 Example in Sentence:\n👉 Present: I ${info.v1.toLowerCase()} to school.\n👉 Past Tense: I ${info.v2.toLowerCase()} to school yesterday. (कल मैं स्कूल गया था)`
        };
      }
    }

    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - English Grammar]\n\n🔤 Verbs (क्रिया) Kya Hote Hain:\n\nVerb wah shabd hota hai jo kisi subject ke kaam karne (action), sthiti (state), ya hone (occurrence) ko darshata hai. Verb ke bina koi sentence poora nahi hota.\n\nExamples: Play (खेलना), Study (पढ़ना), Eat (खाना), Go (जाना), Teach (पढ़ाना).\n\n📚 Types of Verbs (क्रिया के प्रकार):\n1. Main Verbs (मुख्य क्रिया): Jo mukhya action batate hain (e.g. He runs fast, She writes a letter).\n2. Helping / Auxiliary Verbs (सहायक क्रिया): Jo tense banane me madad karte hain (is, am, are, was, were, has, have, had, will).\n3. Modal Verbs: Jo ability, permission ya obligation dikhate hain (can, could, may, might, should, must).\n4. Transitive (सकर्मक - jisme object chahiye) vs Intransitive (अकर्मक - jisme direct object nahi hota).\n\n💡 Example: 'Aman sir teaches mathematics' me 'teaches' Main Verb hai!`
    };
  }

  // B. Spoken English & English Speaking Sentences
  if (
    q.includes('spoken english') ||
    q.includes('english speaking') ||
    q.includes('english bolna') ||
    q.includes('english bolne') ||
    q.includes('kaise bole') ||
    q.includes('conversation') ||
    q.includes('daily use sentence') ||
    q.includes('speaking tips')
  ) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Spoken English & Conversation]\n\n🗣️ Daily Use English Sentences (रोजमर्रा के जरूरी वाक्य):\n\n1. Greetings & Introductions:\n• How are you? = Aap kaise hain? (Reply: I am good, thank you!)\n• What is your name? = Aapka naam kya hai? (Reply: My name is Rohit.)\n• Where do you study? = Aap kahan padhte hain? (Reply: I study at L.C.C. Coaching.)\n• Nice to meet you! = Aapse milkar bohot khushi hui!\n\n2. Daily Requests & Polite Phrases:\n• Could you please help me? = Kya aap kripya meri madad karenge?\n• What are you doing right now? = Aap abhi kya kar rahe hain?\n• I didn't understand, please repeat. = Mujhe samajh nahi aaya, kripya dobara batayein.\n\n💡 Spoken English Rule: Roz 15-20 minute loud reading karein aur galti hone se bilkul mat dariye!`
    };
  }

  // C. Tenses (काल)
  if (q.includes('tense') || q.includes('kaal') || q.includes('present tense') || q.includes('past tense') || q.includes('future tense')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - English Grammar]\n\n📖 Tenses in English (काल):\n\nEnglish me 3 main tenses hote hain, aur har tense ke 4 sub-types hote hain (Total 12 Tenses):\n\n1. Present Tense (वर्तमान काल):\n• Simple Present: Subject + V1(s/es) + Object (He plays cricket)\n• Present Continuous: Sub + is/am/are + V1+ing + Obj (He is playing)\n• Present Perfect: Sub + has/have + V3 + Obj (He has played)\n• Present Perfect Continuous: Sub + has/have been + V1+ing + since/for\n\n2. Past Tense (भूतकाल):\n• Simple Past: Sub + V2 + Obj (He played)\n• Past Continuous: Sub + was/were + V1+ing + Obj\n• Past Perfect: Sub + had + V3 + Obj\n\n3. Future Tense (भविष्य काल):\n• Simple Future: Sub + will + V1 + Obj (He will play)\n• Future Continuous: Sub + will be + V1+ing + Obj\n• Future Perfect: Sub + will have + V3 + Obj`
    };
  }

  // D. Articles (A, An, The) & Vowels
  if (q.includes('article') || q.includes('vowel') || q.includes('consonant') || q.includes('a an the') || q.includes('an kab lagta')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - English Grammar]\n\n🔤 Articles (A, An, The) Rules:\n\n1. 'A' ka use: Consonant sound (व्यंजन ध्वनि - क, ख, ग...) se shuru hone wale singular nouns ke aage (e.g. A boy, A car, A university — 'yu' sound).\n\n2. 'An' ka use: Vowel sound (स्वर ध्वनि - अ, आ, इ, ई, ए, ओ...) se shuru hone wale singular nouns ke aage (e.g. An apple, An umbrella, An honest person — silent 'h', 'ऑ' sound).\n\n3. 'The' (Definite Article): Kisi vishisht vastu, historical monuments, rivers, holy books ke aage (e.g. The Sun, The Ganga, The Taj Mahal).`
    };
  }

  // E. Parts of Speech & Noun / Pronoun / Adjective / Preposition
  if (
    q.includes('parts of speech') ||
    q.includes('noun') ||
    q.includes('sangya') ||
    q.includes('pronoun') ||
    q.includes('sarvanam') ||
    q.includes('adjective') ||
    q.includes('preposition') ||
    q.includes('conjunction')
  ) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - English Grammar]\n\n📚 8 Parts of Speech:\n\n1. Noun (संज्ञा): Person, place ya thing ka naam (Ram, Varanasi, Book).\n2. Pronoun (सर्वनाम): Noun ki jagah aane wale shabd (He, She, It, They).\n3. Verb (क्रिया): Action ya state darshane wale shabd (Play, Learn, Eat).\n4. Adjective (विशेषण): Noun/Pronoun ki visheshta batane wale (Smart, Tall, Blue).\n5. Adverb (क्रिया विशेषण): Verb ko modify karne wale (Quickly, Very, Well).\n6. Preposition (संबंधबोधक): Relation darshane wale (In, On, At, Under, Between).\n7. Conjunction (समुच्चयबोधक): Do sentences ya words ko jodne wale (And, But, Because).\n8. Interjection (विस्मयादिबोधक): Feelings express karne wale (Wow!, Alas!).`
    };
  }

  // ══════════════════════════════════════════════
  // 4. SOCIAL STUDIES / SOCIAL SCIENCE (SST)
  // ══════════════════════════════════════════════

  // A. Samvidhan (Constitution) & Dr. Ambedkar
  if (
    q.includes('samvidhan') ||
    q.includes('constitution') ||
    q.includes('ambedkar') ||
    q.includes('ganatantra') ||
    q.includes('republic')
  ) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Social Studies / Civics]\n\n📜 Bhartiya Samvidhan (Indian Constitution):\n\n• Samvidhan Bharat ka sarvochha kanoon (Supreme Law) hai.\n• Iska praroop Dr. B.R. Ambedkar ji ki adhyakshata me Drafting Committee dwara banaya gaya.\n• Samvidhan banne me kul 2 saal 11 mahine aur 18 din ka samay laga.\n• 26 November 1949 ko samvidhan apnaya gaya (Samvidhan Diwas).\n• 26 January 1950 ko yeh poore desh me lagu hua (Ganatantra Diwas / Republic Day).\n• Bharat ka samvidhan vishwa ka sabse bada likhit samvidhan hai.`
    };
  }

  // B. Fundamental Rights (मौलिक अधिकार)
  if (
    q.includes('maulik adhikar') ||
    q.includes('fundamental right') ||
    q.includes('fundamental rights') ||
    q.includes('adhikar')
  ) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Social Studies / Civics]\n\n🇮🇳 6 Fundamental Rights (मौलिक अधिकार - Part III, Articles 12-35):\n\n1. Right to Equality (समानता का अधिकार - Art 14-18)\n2. Right to Freedom (स्वतंत्रता का अधिकार - Art 19-22)\n3. Right against Exploitation (शोषण के विरुद्ध अधिकार - Art 23-24)\n4. Right to Freedom of Religion (धार्मिक स्वतंत्रता - Art 25-28)\n5. Cultural & Educational Rights (संस्कृति व शिक्षा का अधिकार - Art 29-30)\n6. Right to Constitutional Remedies (संवैधानिक उपचारों का अधिकार - Art 32 - Samvidhan ki Aatma).`
    };
  }

  // C. 1857 Revolt / Freedom Movement (इतिहास)
  if (
    q.includes('1857') ||
    q.includes('kranti') ||
    q.includes('mangal pandey') ||
    q.includes('swatantrata sangram')
  ) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Social Studies / History]\n\n⚔️ 1857 Ka Swatantrata Sangram (Revolt of 1857):\n\n• Shuruat: 10 May 1857 ko Meerut chhavni se hui.\n• Nayak: Mangal Pandey (Barrackpore), Rani Lakshmibai (Jhansi), Nana Saheb (Kanpur), Kunwar Singh (Bihar), Bahadur Shah Zafar (Delhi).\n• Tatkalik Kaaran: Enfiled rifle ke kartoos me charbi hone ki khabar.\n• Parinaam: British East India Company ka shasan samapt hua aur Bharat seedhe British Crown ke adhikar me aa gaya.`
    };
  }

  // D. Mahatma Gandhi & Freedom Movements
  if (
    q.includes('gandhi') ||
    q.includes('mahatma') ||
    q.includes('dandi') ||
    q.includes('satyagraha') ||
    q.includes('andolan')
  ) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Social Studies / History]\n\n🕊️ Mahatma Gandhi & Swatantrata Andolan:\n\n• Sidhhant: Satya aur Ahimsa (Truth & Non-Violence).\n• Pramukh Jan-Andolan:\n1. Champaran Satyagraha (1917) - Bihar me Neel kisaano ke haq me.\n2. Asahayoga Andolan (Non-Cooperation Movement - 1920).\n3. Dandi Yatra / Namak Satyagraha (Salt March - 1930 - 240 miles paidal yatra).\n4. Bharat Chhodo Andolan (Quit India Movement - 1942 - 'Karo ya Maro' naara).`
    };
  }

  // E. Solar System & Geography (भूगोल)
  if (
    q.includes('saurmandal') ||
    q.includes('solar system') ||
    q.includes('graha') ||
    q.includes('planet') ||
    q.includes('prithvi') ||
    q.includes('earth') ||
    q.includes('mitti') ||
    q.includes('soil')
  ) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Social Studies / Geography]\n\n🪐 Saurmandal & Prithvi (Solar System & Earth):\n\n• Total 8 Graha (Planets): Mercury (Budh - sabse chhota), Venus (Shukra - sabse chamkila/garm), Earth (Prithvi - Neela grah), Mars (Mangal - Laal grah), Jupiter (Brihaspati - sabse bada), Saturn (Shani), Uranus, Neptune.\n\n🌍 Prithvi Ki Partien (Layers):\n1. Crust (भूपर्पटी - upari satah)\n2. Mantle (मेंटल - madhya parat)\n3. Core (क्रोड - sabse bheetri loha/nickel parat).\n\n🌱 Bharat ki Mitti: Alluvial (जलोढ़ - sabse upjau), Black Soil (काली मिट्टी - कपास के लिए उत्तम).`
    };
  }

  // F. Economics (GDP, RBI, Mehengai)
  if (
    q.includes('gdp') ||
    q.includes('arthashastra') ||
    q.includes('economics') ||
    q.includes('mehengai') ||
    q.includes('inflation') ||
    q.includes('rbi') ||
    q.includes('sst') ||
    q.includes('social science') ||
    q.includes('social study') ||
    q.includes('samajik')
  ) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Social Studies / Economics]\n\n📊 Economy & Commerce Fundamentals:\n\n• GDP (Gross Domestic Product / सकल घरेलू उत्पाद): Ek saal me desh ke andar utpadit sabhi antim goods aur services ki total monetary value.\n• RBI (Reserve Bank of India): Bharat ka central bank (est. 1935). Ye currency notes issue karta hai aur monetary policy control karta hai.\n• Inflation (महंगाई): Jab goods aur services ke daam lagatar badhte hain aur rupee ki purchasing power ghatti hai.`
    };
  }

  // ══════════════════════════════════════════════
  // 5. COMPUTER & DCA / IT CONCEPTS
  // ══════════════════════════════════════════════

  // A. Computer Definition, Hardware vs Software
  if (
    q.includes('computer kya hai') ||
    q.includes('what is computer') ||
    q.includes('hardware') ||
    q.includes('software') ||
    q.includes('input device') ||
    q.includes('output device') ||
    (q.includes('computer') && (q.includes('kya') || q.includes('batao') || q.includes('notes')))
  ) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Computer & DCA Fundamentals]\n\n💻 Computer Kya Hai:\nComputer ek high-speed electronic machine hai jo user se Data (Input) leti hai, use CPU me Process karti hai, aur useful Information (Output) pradaan karti hai.\n👉 IPO Cycle: Input ──> Process ──> Output ──> Storage.\n• Father of Computer: Charles Babbage.\n\n🖥️ Hardware vs Software:\n• Hardware: Physical parts jinhe chhoo sakte hain (Keyboard, Mouse, Monitor, RAM, Hard Disk).\n• Software: Programs aur instructions ka set (Windows 11, MS Office, Chrome, Tally).\n\n🔌 Input vs Output Devices:\n• Input: Keyboard, Mouse, Scanner, Microphone.\n• Output: Monitor, Printer, Speaker, Projector.`
    };
  }

  // B. Operating System, Internet & Browsers
  if (
    q.includes('operating system') ||
    q.includes('os kya hai') ||
    q.includes('internet') ||
    q.includes('browser') ||
    q.includes('search engine')
  ) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Computer & Networking]\n\n🌐 OS & Internet Concepts:\n\n• Operating System (OS): Software jo user aur hardware ke beech interface banata hai (e.g. Windows 10/11, Linux, macOS, Android).\n• Internet: Puri duniya ke computers ka aapas me juda global interconnected network.\n• Web Browser: Websites access karne ka software (Google Chrome, Microsoft Edge, Mozilla Firefox).\n• Search Engine: Internet par kisi bhi jankari ko dhoondhne wala portal (Google, Bing).`
    };
  }

  // C. MS Excel Formulas & MS Office
  if (
    q.includes('excel') ||
    q.includes('ms word') ||
    q.includes('powerpoint') ||
    q.includes('spreadsheet')
  ) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - MS Office Mastery]\n\n📊 Key MS Excel Formulas:\n\nExcel me sabhi formula '=' sign se shuru hote hain:\n• =SUM(A1:A10) : Cells ka kul jod (Total) nikalna.\n• =AVERAGE(A1:A10) : Ausat (Average) nikalna.\n• =MAX(A1:A10) & =MIN(A1:A10) : Maximum aur Minimum value.\n• =COUNT(A1:A10) : Entries ki sankhya ginna.\n• =IF(Condition, True, False) : Shart ke aadhar par result dena.`
    };
  }

  // D. Full Forms (CPU, RAM, ROM, etc.)
  if (
    q.includes('cpu') ||
    q.includes('ram') ||
    q.includes('rom') ||
    q.includes('http') ||
    q.includes('html') ||
    q.includes('full form')
  ) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Computer Full Forms]\n\n💻 Essential Computer Full Forms:\n\n• CPU: Central Processing Unit (Brain of Computer)\n• RAM: Random Access Memory (Temporary/Volatile)\n• ROM: Read Only Memory (Permanent/Non-volatile)\n• ALU: Arithmetic Logic Unit\n• HTTP: Hypertext Transfer Protocol\n• HTML: Hypertext Markup Language\n• URL: Uniform Resource Locator\n• OS: Operating System`
    };
  }

  // E. Keyboard Shortcuts
  if (q.includes('shortcut') || q.includes('ctrl') || q.includes('copy paste')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Keyboard Shortcuts]\n\n⌨️ Most Important Keyboard Shortcuts:\n\n• Ctrl + C : Copy (कॉपी करना)\n• Ctrl + X : Cut (काटना)\n• Ctrl + V : Paste (पेस्ट करना)\n• Ctrl + Z : Undo (पिछला काम वापस लाना)\n• Ctrl + Y : Redo\n• Ctrl + S : Save (फाइल सेव करना)\n• Ctrl + A : Select All\n• Ctrl + P : Print document\n• Alt + F4 : Close active window / Shut down`
    };
  }

  // F. Tally Prime & Accounting Golden Rules
  if (q.includes('tally') || q.includes('golden rule') || q.includes('ledger') || q.includes('debit') || q.includes('credit')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Commerce & Tally Prime]\n\n📊 Golden Rules of Accounting:\n\n1. Personal Account: Debit the Receiver | Credit the Giver\n2. Real Account (Assets/Cash): Debit what comes in | Credit what goes out\n3. Nominal Account (Expenses/Income): Debit all expenses and losses | Credit all incomes and gains\n\n💡 Key Tally Keys: F4 (Contra), F5 (Payment), F6 (Receipt), F8 (Sales), F9 (Purchase).`
    };
  }

  // ══════════════════════════════════════════════
  // 6. SCIENCE (Physics, Chemistry, Biology)
  // ══════════════════════════════════════════════

  // A. Photosynthesis (प्रकाश संश्लेषण)
  if (q.includes('photosynthesis') || q.includes('prakash') || q.includes('sanshleshan') || (q.includes('paudhe') && q.includes('khana'))) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Biology / Science]\n\n🌿 Photosynthesis (प्रकाश संश्लेषण):\n\nHare paudhe sunlight aur chlorophyll ki presence me Carbon Dioxide (CO₂) aur Water (H₂O) ka upyog karke apna bhojan (Glucose) banate hain aur Oxygen (O₂) release karte hain.\n\n🧪 Chemical Equation:\n6CO₂ + 6H₂O ──[Sunlight / Chlorophyll]──> C₆H₁₂O₆ + 6O₂\n\n1. Sunlight\n2. Chlorophyll (leaves ka hara rang)\n3. CO₂ (hava se)\n4. H₂O (roots se)\n\nResult: Glucose + Oxygen.`
    };
  }

  // B. Newton's Laws of Motion
  if (q.includes('newton') || q.includes('gati ke niyam') || q.includes('laws of motion') || q.includes('motion law')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Physics / Science]\n\n🍎 Newton's Three Laws of Motion (गति के तीन नियम):\n\n1️⃣ First Law (Law of Inertia / जड़त्व का नियम):\nHar object apni rest ya uniform motion me tab tak rehta hai jab tak uspar koi external force na lagaya jaye.\n\n2️⃣ Second Law (Force Formula):\nF = m × a (Force = Mass × Acceleration). Unit: Newton (N).\n\n3️⃣ Third Law (Action-Reaction / क्रिया-प्रतिक्रिया):\nEvery action has an equal and opposite reaction (Har kriya ki barabar aur viprit pratikriya hoti hai).`
    };
  }

  // C. Ohm's Law (ओम का नियम)
  if (q.includes('ohm') || q.includes('resistance') || q.includes('pratirodh') || q.includes('v = ir') || q.includes('v=ir')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Physics / Science]\n\n⚡ Ohm's Law (ओम का नियम):\n\nConstant temperature par conductor me flow hone wala current (I) uske ends ke potential difference (V) ke directly proportional hota hai.\n\n👉 Formula: V = I × R\n• V = Potential Difference (Volt - V)\n• I = Electric Current (Ampere - A)\n• R = Electrical Resistance / प्रतिरोध (Ohm - Ω)`
    };
  }

  // D. Acids & Bases (अम्ल और क्षार)
  if (q.includes('acid') || q.includes('base') || q.includes('aml') || q.includes('kshar') || q.includes('ph value') || q.includes('ph scale')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Chemistry / Science]\n\n🧪 Acids, Bases & pH Scale:\n\n1. Acids (अम्ल): Swad me khatte, H⁺ ions dete hain, Blue litmus ko RED karte hain, pH < 7 (e.g. HCl, Lemon juice).\n2. Bases (क्षार): Swad me kadve aur soapy, OH⁻ ions dete hain, Red litmus ko BLUE karte hain, pH > 7 (e.g. NaOH, Baking soda).\n3. Neutral: pH = 7 (Pure water).\nReaction: Acid + Base ──> Salt + Water (Neutralization).`
    };
  }

  // E. Cell & Mitochondria (कोशिका)
  if (q.includes('cell') || q.includes('koshika') || q.includes('mitochondria') || q.includes('powerhouse')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Biology / Science]\n\n🔬 Cell & Mitochondria:\n\n• Cell Definition: Sabhi jeevon ki structural aur functional basic unit ko Cell kehte hain. Khoj: Robert Hooke (1665).\n• Mitochondria (Powerhouse of the Cell): Cellular respiration ke zariye ATP (Adenosine Triphosphate) ke roop me energy produce karta hai. ATP ko 'Energy Currency' kehte hain.`
    };
  }

  // F. Light, Optics, Gravitation
  if (q.includes('reflection') || q.includes('refraction') || q.includes('mirror formula') || q.includes('lens formula')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Physics / Optics]\n\n🔦 Light Formulas:\n\n• Mirror Formula: 1/f = 1/v + 1/u\n• Lens Formula: 1/f = 1/v - 1/u\n• Laws of Reflection: Angle of Incidence (∠i) = Angle of Reflection (∠r).`
    };
  }

  // ══════════════════════════════════════════════
  // 7. MATHEMATICS CALCULATIONS & EQUATIONS
  // ══════════════════════════════════════════════

  // A. Percentage Calculation (e.g., "15% of 1200", "500 ka 10%")
  const percentMatch =
    q.match(/(\d+(?:\.\d+)?)\s*(?:%|percent)\s*(?:of|ka|pe|me)?\s*(\d+(?:\.\d+)?)/i) ||
    q.match(/(\d+(?:\.\d+)?)\s*(?:ka|of)\s*(\d+(?:\.\d+)?)\s*(?:%|percent)/i);
  if (percentMatch) {
    let p = parseFloat(percentMatch[1]);
    let total = parseFloat(percentMatch[2]);
    if (q.includes('ka') && !q.includes('%') && percentMatch[2]) {
      const temp = p;
      p = total;
      total = temp;
    }
    const result = (p / 100) * total;
    return {
      type: 'math',
      reply: `✨ [L.C.C. AI Study Assistant - Percentage Calculation]\n\nFormula: (${p} / 100) × ${total}\n\n✅ Result: ${result}\n\nExplanation: ${p}% of ${total} is equal to ${result}.`
    };
  }

  // B. Quadratic Equations (e.g., "x^2 - 5x + 6 = 0")
  const quadMatch = q.match(/([+-]?\s*\d*)\s*x(?:\^2|2)\s*([+-]\s*\d*)\s*x\s*([+-]\s*\d+)\s*=\s*0/i);
  if (quadMatch) {
    let aStr = quadMatch[1].replace(/\s+/g, '');
    let bStr = quadMatch[2].replace(/\s+/g, '');
    let cStr = quadMatch[3].replace(/\s+/g, '');

    let a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
    let b = bStr === '' || bStr === '+' ? 1 : bStr === '-' ? -1 : parseFloat(bStr);
    let c = parseFloat(cStr);

    if (!isNaN(a) && !isNaN(b) && !isNaN(c)) {
      const discriminant = b * b - 4 * a * c;
      if (discriminant >= 0) {
        const sqrtD = Math.sqrt(discriminant);
        const root1 = (-b + sqrtD) / (2 * a);
        const root2 = (-b - sqrtD) / (2 * a);
        return {
          type: 'math',
          reply: `✨ [L.C.C. AI Study Assistant - Quadratic Equation]\n\nEquation: ${a}x² ${b >= 0 ? '+ ' + b : b}x ${c >= 0 ? '+ ' + c : c} = 0\nDiscriminant D = b² - 4ac = ${discriminant}\n\n✅ Roots: x₁ = ${root1}, x₂ = ${root2}`
        };
      }
    }
  }

  // C. Linear Equation in One Variable (e.g., "2x + 5 = 25")
  const linearMatch = q.match(/([+-]?\s*\d*)\s*x\s*([+-]\s*\d+)?\s*=\s*([+-]?\s*\d+)/i);
  if (linearMatch && !q.includes('^') && !q.includes('x2')) {
    let aStr = linearMatch[1].replace(/\s+/g, '');
    let bStr = linearMatch[2] ? linearMatch[2].replace(/\s+/g, '') : '0';
    let cStr = linearMatch[3].replace(/\s+/g, '');

    let a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
    let b = parseFloat(bStr);
    let c = parseFloat(cStr);

    if (!isNaN(a) && !isNaN(b) && !isNaN(c) && a !== 0) {
      const rhs = c - b;
      const xVal = rhs / a;
      return {
        type: 'math',
        reply: `✨ [L.C.C. AI Study Assistant - Linear Equation Solution]\n\nGiven Equation: ${a !== 1 ? a : ''}x ${b > 0 ? '+ ' + b : b < 0 ? b : ''} = ${c}\nStep 1: ${a !== 1 ? a : ''}x = ${c} - ${b} = ${rhs}\nStep 2: x = ${rhs} / ${a}\n\n✅ Answer: x = ${xVal}`
      };
    }
  }

  // D. Pythagoras Theorem
  if (q.includes('pythagoras') || (q.includes('hypotenuse') && q.includes('triangle'))) {
    return {
      type: 'math',
      reply: `✨ [L.C.C. AI Study Assistant - Pythagoras Theorem]\n\n📐 Right Triangle Formula:\nH² = P² + B² (Hypotenuse² = Perpendicular² + Base²)\n• H = √(P² + B²)\nExample: 3, 4, 5 (3² + 4² = 9 + 16 = 25 = 5²)`
    };
  }

  // E. Arithmetic Expression Evaluation (e.g. "4+5", "25*4", "100/5")
  const cleanArithmetic = q.replace(/^(?:solve|calculate|what is|batao|karo|result of)\s+/i, '').trim();
  if (/^[\d\s\+\-\*\/\(\)\.\^]+$/.test(cleanArithmetic) && /[\+\-\*\/]/.test(cleanArithmetic)) {
    try {
      const sanitized = cleanArithmetic.replace(/\^/g, '**');
      const evaluated = Function(`'use strict'; return (${sanitized});`)();
      if (typeof evaluated === 'number' && !isNaN(evaluated) && isFinite(evaluated)) {
        return {
          type: 'math',
          reply: `✨ [L.C.C. AI Study Assistant - Calculation]\n\nExpression: ${cleanArithmetic}\n\n✅ Result: ${evaluated}`
        };
      }
    } catch (e) {}
  }

  // ══════════════════════════════════════════════
  // 8. ADMISSION, FEES & TIMINGS
  // ══════════════════════════════════════════════
  if (q.includes('fee') || q.includes('fees') || q.includes('paisa') || q.includes('kitna lagta') || q.includes('cost')) {
    return {
      type: 'counseling',
      reply: `✨ [L.C.C. AI Study Assistant - Fee Structure 2026–27]\n\n• Class 9 & 10: ₹6,999/year (₹999/month)\n• Class 11 & 12: ₹8,499/year (₹1,299/month)\n• Computer DCA Diploma: ₹4,999 (6 months full practical)\n• Spoken English: ₹2,499 (3 months mastery)\n\nDirect UPI QR payment par fee evidence submit kar sakte hain.`
    };
  }

  if (q.includes('admission') || q.includes('dakhila') || q.includes('enroll') || q.includes('join')) {
    return {
      type: 'counseling',
      reply: `✨ [L.C.C. AI Study Assistant - Admission Procedure]\n\n🎯 Admissions Open for 2026–27!\n1. App me "Enroll Now" par click karein.\n2. Course choose karke UPI QR se fee transfer karein.\n3. UTR number submit karein — Director verify karke access unlock karenge.\nCampus: Palahipatti Main Desk par 9:00 AM se 5:00 PM.`
    };
  }

  if (q.includes('timing') || q.includes('time') || q.includes('samay') || q.includes('kab chalta')) {
    return {
      type: 'counseling',
      reply: `✨ [L.C.C. AI Study Assistant - Batch Timings]\n\n• 🌅 Morning: 6:30 AM – 11:30 AM (School & Intermediate)\n• 🌇 Evening: 3:30 PM – 7:30 PM (Classes 6–10 & DCA Lab)\n• 💻 Computer Lab: 8:00 AM – 6:00 PM flexible slots.`
    };
  }

  if (q.includes('location') || q.includes('address') || q.includes('kahan hai') || q.includes('campus') || q.includes('branch')) {
    return {
      type: 'counseling',
      reply: `✨ [L.C.C. AI Study Assistant - Campuses]\n\n1. 🏢 Palahipatti Main Campus (Head Office): Sindhora Road, Near Union Bank, Palahipatti, Varanasi. Helpline: +91 9250703092\n2. 🏢 Sindhora Market Branch\n3. 🏢 Babatpur City Center`
    };
  }

  // ══════════════════════════════════════════════
  // 9. CLEAN, CONCISE DEFAULT GUIDANCE
  // (No 12-line boilerplate essay!)
  // ══════════════════════════════════════════════
  return {
    type: 'general',
    reply: `✨ [L.C.C. AI Study Assistant]\n\nAapka sawal mil gaya! Kya problem hai aapko? Kripya apna topic thoda vistaar se batayein (jaise English Grammar/Verbs, SST, Computer, Science, ya Math) — hum turant step-by-step hal karenge!`
  };
};
