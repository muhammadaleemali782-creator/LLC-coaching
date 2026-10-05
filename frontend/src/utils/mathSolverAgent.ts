// 100% Free Client-Side All-Subject Academic & Helpdesk AI Agent for L.C.C. Live Chat
// Runs 100% on client-side JavaScript without API keys, zero token fees, and zero latency.
// Fully supports English, Hinglish, and Hindi for Mathematics, Science, English, Computer/DCA, Faculty, and Admissions.

export interface AgentResponse {
  type: 'academic' | 'math' | 'counseling' | 'general';
  reply: string;
}

export const solveAcademicQuery = (query: string): AgentResponse => {
  const raw = query.trim();
  const q = raw.toLowerCase();

  // ══════════════════════════════════════════════
  // 1. TEACHERS & FACULTY INQUIRIES (Hinglish, Hindi, English)
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
      reply: `✨ [L.C.C. AI Study Assistant - Our Distinguished Faculty]\n\nL.C.C. coaching me expert mentors ki team padhati hai:\n\n1. 👨‍🏫 Aman Arora (Managing Director & Senior Mentor)\n   • Mathematics, Physics & Academic Strategy (15+ Years Exp.)\n\n2. 👨‍🏫 Rajesh Verma (Senior Faculty)\n   • Class 9–10 Mathematics & Logical Reasoning\n\n3. 👩‍🏫 Mrs. Ananya Sharma (Senior Faculty)\n   • Science (Physics, Chemistry & Biology) & Junior Champs\n\n4. 👨‍🏫 Amit Kumar (Computer Faculty)\n   • DCA Computer Diploma, Tally Prime with GST & Commerce\n\n📍 Sabhi teachers daily 1-on-1 doubt clearing session dete hain taaki koi bhi concept adhoora na rahe.`
    };
  }

  // ══════════════════════════════════════════════
  // 2. SCIENCE (Physics, Chemistry, Biology) in Hinglish / Hindi / English
  // ══════════════════════════════════════════════

  // A. Photosynthesis (प्रकाश संश्लेषण)
  if (q.includes('photosynthesis') || q.includes('prakash') || q.includes('sanshleshan') || (q.includes('paudhe') && q.includes('khana'))) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Biology / Science]\n\n🌿 Photosynthesis (प्रकाश संश्लेषण):\n\nPhotosynthesis wah biological process hai jisme hare paudhe (green plants) sunlight aur chlorophyll ki presence me Carbon Dioxide (CO₂) aur Water (H₂O) ka upyog karke apna bhojan (Glucose) banate hain aur Oxygen (O₂) release karte hain.\n\n🧪 Chemical Equation:\n6CO₂ + 6H₂O ──[Sunlight / Chlorophyll]──> C₆H₁₂O₆ + 6O₂\n\n🔑 Key Requirements:\n1. Sunlight (सौर ऊर्जा)\n2. Chlorophyll (हरित लवक - leaves me moujood pigment)\n3. Carbon Dioxide (CO₂ - stomata ke zariye)\n4. Water (H₂O - roots ke zariye absorb hota hai)\n\n💡 Result: Glucose (Food) + Oxygen (Life gas).`
    };
  }

  // B. Newton's Laws of Motion (न्यूटन के गति के नियम)
  if (q.includes('newton') || q.includes('gati ke niyam') || q.includes('laws of motion') || q.includes('motion law')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Physics / Science]\n\n🍎 Newton's Three Laws of Motion (गति के तीन नियम):\n\n1️⃣ First Law (Law of Inertia / जड़त्व का नियम):\nHar object apni rest ya uniform motion ki state me tab tak rehta hai jab tak uspar koi external unbalanced force na lagaya jaye.\n\n2️⃣ Second Law (Force Formula / संवेग परिवर्तन का नियम):\nKisi vastu par lagne wala force uske mass aur acceleration ke multiplication ke barabar hota hai:\n👉 Formula: F = m × a (Force = Mass × Acceleration)\nUnit: Newton (N).\n\n3️⃣ Third Law (Action-Reaction / क्रिया-प्रतिक्रिया का नियम):\nEvery action has an equal and opposite reaction (Har kriya ki barabar aur viprit pratikriya hoti hai).\nExample: Bandook se goli chalne par peechhe jhatka lagna; rocket propulsion.`
    };
  }

  // C. Ohm's Law (ओम का नियम) & Resistance
  if (q.includes('ohm') || q.includes('resistance') || q.includes('pratirodh') || q.includes('v = ir') || q.includes('v=ir')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Physics / Science]\n\n⚡ Ohm's Law (ओम का नियम):\n\nConstant temperature par kisi metallic conductor me flow hone wala electric current (I) uske ends ke across apply kiye gaye Potential Difference (V) ke directly proportional hota hai.\n\n👉 Formula:\nV = I × R\n\n• V = Potential Difference / Voltage (Unit: Volt - V)\n• I = Electric Current (Unit: Ampere - A)\n• R = Electrical Resistance / प्रतिरोध (Unit: Ohm - Ω)\n\n💡 Variations:\n• I = V / R\n• R = V / I`
    };
  }

  // D. Acids, Bases & pH Scale (अम्ल और क्षार)
  if (q.includes('acid') || q.includes('base') || q.includes('aml') || q.includes('kshar') || q.includes('ph value') || q.includes('ph scale')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Chemistry / Science]\n\n🧪 Acids, Bases & Salts (अम्ल, क्षार और लवण):\n\n1. Acids (अम्ल):\n• Taste me khatte hote hain.\n• Aqueous solution me H⁺ ions release karte hain.\n• Blue litmus paper ko RED kar dete hain.\n• pH value: 0 se 7 ke beech (e.g. HCl, H₂SO₄, Lemon juice).\n\n2. Bases (क्षार):\n• Taste me kadve aur soapy feel hote hain.\n• Aqueous solution me OH⁻ ions release karte hain.\n• Red litmus paper ko BLUE kar dete hain.\n• pH value: 7 se 14 ke beech (e.g. NaOH, KOH, Baking soda).\n\n3. Neutral (उदासीन):\n• pH = 7 (Pure water).\n\n💡 Reaction: Acid + Base ──> Salt + Water (Neutralization Reaction).`
    };
  }

  // E. Cell & Mitochondria (कोशिका)
  if (q.includes('cell') || q.includes('koshika') || q.includes('mitochondria') || q.includes('powerhouse')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Biology / Science]\n\n🔬 Cell & Organelles (कोशिका):\n\n• Cell Definition: Sabhi jeevon ki structural aur functional basic unit ko Cell (कोशिका) kehte hain. Iski khoj Robert Hooke ne 1665 me ki thi.\n\n⚡ Mitochondria (Powerhouse of the Cell / कोशिका का ऊर्जा गृह):\n• Mitochondria ko cell ka powerhouse kehte hain kyunki ye cellular respiration ke dwara energy ko ATP (Adenosine Triphosphate) ke roop me produce aur store karta hai.\n• ATP ko "Energy Currency of Cell" kaha jata hai.`
    };
  }

  // F. Reflection, Refraction, Optics (प्रकाश का परावर्तन और अपवर्तन)
  if (q.includes('reflection') || q.includes('refraction') || q.includes('paravartan') || q.includes('apravartan') || q.includes('mirror formula') || q.includes('lens formula')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Physics / Optics]\n\n🔦 Light Reflection & Refraction (प्रकाश का परावर्तन व अपवर्तन):\n\n1. Laws of Reflection (परावर्तन के नियम):\n• Angle of Incidence = Angle of Reflection (∠i = ∠r)\n• Incident ray, Reflected ray aur Normal sabhi ek hi plane me hote hain.\n\n2. Mirror Formula (दर्पण सूत्र):\n👉 1/f = 1/v + 1/u\n\n3. Lens Formula (लेंस सूत्र):\n👉 1/f = 1/v - 1/u\n\n• f = Focal length, v = Image distance, u = Object distance.`
    };
  }

  // G. Gravitation (गुरुत्वाकर्षण)
  if (q.includes('gravity') || q.includes('gravitation') || q.includes('gurutva') || q.includes('universal law')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Physics / Science]\n\n🌍 Universal Law of Gravitation (गुरुत्वाकर्षण का सार्वत्रिक नियम):\n\nUniverse me har do vastu ek dusre ko aakarshit karti hain. Yeh gravitational force dono ke mass ke multiplication ke directly proportional aur unke beech ki distance ke square ke inversely proportional hota hai.\n\n👉 Formula: F = G × (m₁ × m₂) / r²\n• G = Universal Gravitational Constant (6.67 × 10⁻¹¹ N·m²/kg²)\n• Acceleration due to gravity on Earth: g = 9.8 m/s²`
    };
  }

  // ══════════════════════════════════════════════
  // 3. ENGLISH GRAMMAR & SPOKEN ENGLISH (Hinglish / Hindi / English)
  // ══════════════════════════════════════════════

  // A. Specific Verb Forms & Past Tense (e.g., "past tense of go", "forms of eat", "v2 of write")
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
    if (q.includes(verbKey) && (q.includes('past') || q.includes('tense') || q.includes('v2') || q.includes('v3') || q.includes('form') || q.includes('second form') || q.includes('third form'))) {
      return {
        type: 'academic',
        reply: `✨ [L.C.C. AI Study Assistant - English Verb Forms]\n\n📖 Verb Forms for "${info.v1}" (${info.meaning}):\n\n• V1 (Present Form): ${info.v1}\n• V2 (Past Tense): ${info.v2} ✅\n• V3 (Past Participle): ${info.v3}\n• V4 (Present Participle / ing): ${info.v1}ing\n\n💡 Example in Sentence:\n👉 Present: I ${info.v1.toLowerCase()} to school.\n👉 Past Tense: I ${info.v2.toLowerCase()} to school yesterday. (कल मैं स्कूल गया था)`
      };
    }
  }

  // B. Tenses (काल)
  if (q.includes('tense') || q.includes('kaal') || q.includes('present tense') || q.includes('past tense') || q.includes('future tense')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - English Grammar]\n\n📖 Tenses in English (काल):\n\nEnglish me 3 main tenses hote hain, aur har tense ke 4 sub-types hote hain (Total 12 Tenses):\n\n1. Present Tense (वर्तमान काल):\n• Simple Present: Subject + V1(s/es) + Object (e.g. He plays cricket / वह क्रिकेट खेलता है)\n• Present Continuous: Sub + is/am/are + V1+ing + Obj (He is playing)\n• Present Perfect: Sub + has/have + V3 + Obj (He has played)\n• Present Perfect Continuous: Sub + has/have been + V1+ing + since/for\n\n2. Past Tense (भूतकाल):\n• Simple Past: Sub + V2 + Obj (He played)\n• Past Continuous: Sub + was/were + V1+ing + Obj\n• Past Perfect: Sub + had + V3 + Obj\n\n3. Future Tense (भविष्य काल):\n• Simple Future: Sub + will/shall + V1 + Obj (He will play)\n• Future Continuous: Sub + will be + V1+ing + Obj\n• Future Perfect: Sub + will have + V3 + Obj`
    };
  }

  // B. Articles (A, An, The) & Vowels
  if (q.includes('article') || q.includes('vowel') || q.includes('consonant') || q.includes('a an the') || q.includes('an kab lagta')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - English Grammar]\n\n🔤 Articles (A, An, The) ka Rule:\n\n1. "A" ka use:\n• Consonant sound (व्यंजन ध्वनि - क, ख, ग...) se shuru hone wale singular countable nouns ke aage.\n• Example: A boy, A car, A university (sound 'yu' hai isliye 'A' aayega).\n\n2. "An" ka use:\n• Vowel sound (स्वर ध्वनि - अ, आ, इ, ई, ए, ओ...) se shuru hone wale singular nouns ke aage.\n• Example: An apple, An umbrella, An honest man (silent 'h', sound 'ऑ' hai isliye 'An' aayega).\n\n3. "The" (Definite Article):\n• Kisi specific/khaas vastu, historical monuments, rivers, oceans, holy books ke aage.\n• Example: The Sun, The Ganga, The Taj Mahal, The Gita.`
    };
  }

  // C. Parts of Speech & Noun / Pronoun
  if (q.includes('parts of speech') || q.includes('noun') || q.includes('sangya') || q.includes('pronoun') || q.includes('sarvanam')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - English Grammar]\n\n📚 8 Parts of Speech in English:\n\n1. Noun (संज्ञा): Person, place, thing ya idea ka naam (e.g. Ram, Varanasi, Book, Honesty).\n2. Pronoun (सर्वनाम): Noun ki jagah use hone wale shabd (e.g. He, She, It, They, We).\n3. Verb (क्रिया): Action ya state darshane wale shabd (e.g. Run, Eat, Teach, Learn).\n4. Adjective (विशेषण): Noun ya pronoun ki visheshta batane wale (e.g. Good, Smart, Tall, Red).\n5. Adverb (क्रिया विशेषण): Verb, adjective ya doosre adverb ko modify karne wale (e.g. Quickly, Very).\n6. Preposition (संबंधबोधक): Relation batane wale (e.g. In, On, Under, At, Between).\n7. Conjunction (समुच्चयबोधक): Do words ya sentences ko jodne wale (e.g. And, But, Because).\n8. Interjection (विस्मयादिबोधक): Feelings express karne wale (e.g. Wow!, Alas!, Hurrah!).`
    };
  }

  // ══════════════════════════════════════════════
  // 4. COMPUTER & DCA / TALLY CONCEPTS (Hinglish / Hindi / English)
  // ══════════════════════════════════════════════

  // A. Computer Full Forms & Memory
  if (q.includes('cpu') || q.includes('ram') || q.includes('rom') || q.includes('http') || q.includes('html') || q.includes('computer full form') || q.includes('full form')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Computer & DCA]\n\n💻 Essential Computer Full Forms & Concepts:\n\n• CPU: Central Processing Unit (Brain of Computer)\n• RAM: Random Access Memory (Volatile / Temporary memory - power cut hone par data erase ho jata hai)\n• ROM: Read Only Memory (Non-volatile / Permanent memory - BIOS/Booting instructions)\n• ALU: Arithmetic Logic Unit\n• CU: Control Unit\n• HTTP: Hypertext Transfer Protocol\n• HTTPS: Hypertext Transfer Protocol Secure\n• HTML: Hypertext Markup Language\n• URL: Uniform Resource Locator\n• OS: Operating System (e.g. Windows, Linux, Android)`
    };
  }

  // B. Shortcuts & Operating System
  if (q.includes('shortcut') || q.includes('ctrl') || q.includes('copy paste') || q.includes('ms office')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Computer & DCA]\n\n⌨️ Most Important Keyboard Shortcuts:\n\n• Ctrl + C: Copy (टेक्स्ट या फाइल कॉपी करना)\n• Ctrl + X: Cut\n• Ctrl + V: Paste\n• Ctrl + Z: Undo (पिछला एक्शन वापस लाना)\n• Ctrl + Y: Redo\n• Ctrl + S: Save file\n• Ctrl + A: Select All\n• Ctrl + P: Print document\n• Alt + F4: Close active program / Shut down\n• Win + D: Show Desktop`
    };
  }

  // C. Tally Prime & Accounting Golden Rules
  if (q.includes('tally') || q.includes('golden rule') || q.includes('ledger') || q.includes('voucher') || q.includes('debit') || q.includes('credit')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Commerce & Tally Prime]\n\n📊 Golden Rules of Accounting (गोल्डन रूल्स):\n\n1. Personal Account (व्यक्तिगत खाता):\n👉 Debit the Receiver (पाने वाले को नाम करो)\n👉 Credit the Giver (देने वाले को जमा करो)\n\n2. Real Account (वास्तविक खाता - Assets/Cash):\n👉 Debit what comes in (जो वस्तु व्यापार में आए उसे नाम करो)\n👉 Credit what goes out (जो वस्तु व्यापार से जाए उसे जमा करो)\n\n3. Nominal Account (नाममात्र खाता - Expenses/Incomes):\n👉 Debit all expenses and losses (सभी खर्च और हानि को नाम करो)\n👉 Credit all incomes and gains (सभी आय और लाभ को जमा करो)\n\n💡 Key Tally Vouchers: F4 (Contra), F5 (Payment), F6 (Receipt), F8 (Sales), F9 (Purchase).`
    };
  }

  // ══════════════════════════════════════════════
  // 5. MATHEMATICAL QUESTION RESOLUTION
  // ══════════════════════════════════════════════

  // A. Percentage Calculation (e.g., "15% of 1200", "20 percent of 500", "500 ka 10%")
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
      reply: `✨ [L.C.C. AI Study Assistant - Percentage Calculation]\n\nFormula: (Percentage / 100) × Total\nCalculation: (${p} / 100) × ${total}\n\n✅ Result: ${result}\n\nExplanation: ${p}% of ${total} is equal to ${result}.`
    };
  }

  // B. Quadratic Equations (e.g., "x^2 - 5x + 6 = 0", "x2 + 7x + 12 = 0")
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
          reply: `✨ [L.C.C. AI Study Assistant - Quadratic Equation Solution]\n\nEquation: ${a}x² ${b >= 0 ? '+ ' + b : b}x ${c >= 0 ? '+ ' + c : c} = 0\n\n1. Discriminant (D = b² - 4ac):\n   D = (${b})² - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${discriminant}\n\n2. Quadratic Formula:\n   x = (-b ± √D) / (2a)\n   x = (${-b} ± √${discriminant}) / (${2 * a})\n\n✅ Roots / Solution:\n   x₁ = ${root1}\n   x₂ = ${root2}\n\nBoth roots satisfy the equation.`
        };
      } else {
        return {
          type: 'math',
          reply: `✨ [L.C.C. AI Study Assistant - Quadratic Equation]\n\nEquation: ${a}x² ${b >= 0 ? '+ ' + b : b}x ${c >= 0 ? '+ ' + c : c} = 0\nDiscriminant D = ${discriminant} < 0.\n\n✅ Since D < 0, this quadratic equation has no real roots (roots are complex/imaginary).`
        };
      }
    }
  }

  // C. Linear Equation in One Variable (e.g., "2x + 5 = 25", "3x - 9 = 0", "5x = 25")
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
        reply: `✨ [L.C.C. AI Study Assistant - Linear Equation Solution]\n\nGiven Equation: ${a !== 1 ? a : ''}x ${b > 0 ? '+ ' + b : b < 0 ? b : ''} = ${c}\n\nStep 1: Transpose constant to RHS:\n   ${a !== 1 ? a : ''}x = ${c} ${b >= 0 ? '- ' + b : '+ ' + Math.abs(b)} = ${rhs}\n\nStep 2: Divide by coefficient of x (${a}):\n   x = ${rhs} / ${a}\n\n✅ Answer: x = ${xVal}`
      };
    }
  }

  // D. Geometry & Mensuration Formulas
  if (q.includes('circle') && (q.includes('area') || q.includes('radius') || q.includes('perimeter') || q.includes('circumference'))) {
    const rMatch = q.match(/(?:radius|r\s*=)\s*(\d+(?:\.\d+)?)/i);
    if (rMatch) {
      const r = parseFloat(rMatch[1]);
      const area = (Math.PI * r * r).toFixed(2);
      const circ = (2 * Math.PI * r).toFixed(2);
      return {
        type: 'math',
        reply: `✨ [L.C.C. AI Study Assistant - Circle Geometry]\n\nGiven Radius (r): ${r} units\n\n1. Area of Circle:\n   A = πr² = (22/7) × ${r}² = ${area} sq units\n\n2. Circumference / Perimeter:\n   C = 2πr = 2 × (22/7) × ${r} = ${circ} units\n\n✅ Area: ${area} | Circumference: ${circ}`
      };
    }
    return {
      type: 'math',
      reply: `✨ [L.C.C. AI Study Assistant - Circle Formulas]\n\n• Area = πr² (where r is radius, π ≈ 22/7 or 3.14159)\n• Circumference = 2πr = πd (where d is diameter)\n• Diameter = 2r`
    };
  }

  // E. Pythagorean Theorem (पाइथागोरस प्रमेय)
  if (q.includes('pythagoras') || q.includes('pythagorean') || (q.includes('hypotenuse') && q.includes('triangle'))) {
    return {
      type: 'math',
      reply: `✨ [L.C.C. AI Study Assistant - Geometry / Mathematics]\n\n📐 Pythagoras Theorem (पाइथागोरस प्रमेय):\n\nRight-angled triangle (समकोण त्रिभुज) me hypotenuse (कर्ण) ka square baki dono sides (आधार व लम्ब) ke squares ke sum ke barabar hota hai:\n\n👉 Formula: H² = P² + B² (or c² = a² + b²)\n• Hypotenuse (H) = √(P² + B²)\n• Perpendicular (P) = √(H² - B²)\n• Base (B) = √(H² - P²)\n\nExample Triplet: 3, 4, 5 (3² + 4² = 9 + 16 = 25 = 5²)`
    };
  }

  // F. Trigonometry Formulas (त्रिकोणमिति)
  if (q.includes('trigonometry') || q.includes('sin') || q.includes('cos') || q.includes('tan') || q.includes('trikonmiti')) {
    return {
      type: 'math',
      reply: `✨ [L.C.C. AI Study Assistant - Trigonometry / त्रिकोणमिति]\n\n📐 Fundamental Trigonometric Ratios:\n\n• sin θ = Perpendicular / Hypotenuse (लम्ब / कर्ण)\n• cos θ = Base / Hypotenuse (आधार / कर्ण)\n• tan θ = Perpendicular / Base (लम्ब / आधार) = sin θ / cos θ\n• cosec θ = 1 / sin θ\n• sec θ = 1 / cos θ\n• cot θ = 1 / tan θ\n\n🔑 Key Pythagorean Trigonometric Identities:\n1. sin²θ + cos²θ = 1\n2. 1 + tan²θ = sec²θ\n3. 1 + cot²θ = cosec²θ`
    };
  }

  // G. Standard Arithmetic Expression Evaluation (e.g. "4+5", "25 * 4", "100 / 5", "50 - 15")
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
  // 6. ADMISSION, FEES, TIMINGS & LOCATIONS (Counseling)
  // ══════════════════════════════════════════════

  if (q.includes('fee') || q.includes('fees') || q.includes('paisa') || q.includes('kitna lagta') || q.includes('cost')) {
    return {
      type: 'counseling',
      reply: `✨ [L.C.C. AI Study Assistant - Official Fee Structure 2026–27]\n\nL.C.C. Coaching me transparent and affordable fee structure hai:\n\n1. 📘 Class 9 & 10 Board Target:\n   • Annual Fee: ₹6,999 (Special Scholarship Rate)\n   • Monthly Installment: ₹999/month\n   • Includes: Full NCERT + Science Practicals + Weekly Mock Tests + Revision Vault\n\n2. 🎓 Class 11 & 12 Science / Commerce:\n   • Annual Fee: ₹8,499\n   • Monthly Installment: ₹1,299/month\n   • Includes: Physics, Chem, Math/Bio, Commerce + Board & CUET Prep\n\n3. 💻 Computer DCA Diploma (ISO 9001:2015):\n   • 6-Month Full Course: ₹4,999\n   • Includes: MS Office, Tally Prime + GST, Typing & Govt-recognized Certificate\n\n4. 🗣️ Spoken English & Public Speaking:\n   • 3-Month Mastery: ₹2,499\n\nDirect UPI QR payment par instant discount available hai!`
    };
  }

  if (q.includes('admission') || q.includes('dakhila') || q.includes('enroll') || q.includes('join')) {
    return {
      type: 'counseling',
      reply: `✨ [L.C.C. AI Study Assistant - Admission Procedure]\n\n🎯 Session 2026–2027 Admissions Open Hain!\n\nAdmission lene ke aasan steps:\n1. App me "Enroll Now" par click karein.\n2. Apna branch aur class choose karein.\n3. Direct UPI QR scan karke fee transfer karein aur UTR number submit karein.\n4. Admin Director verify karke aapka batch unlock kar denge.\n\n📍 Offline Admissions: Palahipatti Main Campus desk par 9:00 AM se 5:00 PM tak form bhara ja sakta hai.`
    };
  }

  if (q.includes('timing') || q.includes('time') || q.includes('samay') || q.includes('kab chalta')) {
    return {
      type: 'counseling',
      reply: `✨ [L.C.C. AI Study Assistant - Batch Timings]\n\n⏰ Official Coaching Timings:\n\n• 🌅 Morning Batch: 6:30 AM – 11:30 AM (School & Intermediate Students)\n• 🌇 Evening Batch: 3:30 PM – 7:30 PM (Classes 6–10 & DCA Computer Lab)\n• 💻 Computer Practical Lab: 8:00 AM – 6:00 PM (Flexible slots available)\n•  Sunday: Weekly Mega Mock Tests & Doubt Counters (8:00 AM – 12:00 PM).`
    };
  }

  if (q.includes('location') || q.includes('address') || q.includes('kahan hai') || q.includes('campus') || q.includes('branch')) {
    return {
      type: 'counseling',
      reply: `✨ [L.C.C. AI Study Assistant - Institute Campuses]\n\n🏫 Learning Coaching Center (L.C.C.) Varanasi Campuses:\n\n1. 🏢 Palahipatti Main Campus (Head Office):\n   Sindhora Road, Near Union Bank, Palahipatti, Varanasi - 221208\n   📞 Helpline: +91 9250703092 / +91 9876543210\n\n2. 🏢 Sindhora Market Branch: Sindhora Main Bazar\n3. 🏢 Babatpur City Center: Near Airport Road Crossing`
    };
  }

  // ══════════════════════════════════════════════
  // 7. DEFAULT ALL-SUBJECT HELPDESK RESPONSE
  // ══════════════════════════════════════════════
  return {
    type: 'general',
    reply: `✨ [L.C.C. AI Study Assistant]\n\nAapka sawal mil gaya! Main sabhi academic vishayon me madad kar sakta hoon:\n\n• 🧮 Mathematics: Linear & Quadratic Equations, Percentages, Geometry, Formulas\n• 🔬 Science: Physics (Ohm's Law, Newton's Laws), Chemistry (Acids, Bases), Biology (Photosynthesis, Cells)\n• 📖 English: Tenses, Grammar rules, Articles, Voice\n• 💻 Computer: DCA, Tally Prime, Full Forms, Shortcuts\n• 👨‍🏫 Faculty: Director Aman Arora aur Senior Mentors ki jankari\n• 🎯 Admissions & Fees: Classes 1–12, DCA & Batch Timings\n\nAap apna specific question likhein (Hindi, Hinglish, ya English me), aur turant step-by-step answer payein!`
  };
};
