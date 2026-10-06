// 100% Free Client-Side All-Subject Academic & Helpdesk AI Agent for L.C.C. Live Chat
// Runs 100% on client-side JavaScript without API keys, zero token fees, and zero latency.
// Fully supports English, Hinglish, and Hindi for:
// 1. Spoken English (Daily Conversations, Translations, Situational Speaking, Hesitation Removal)
// 2. English Grammar (Verbs, Tenses, Active/Passive Voice, Direct/Indirect, Modals, Prepositions)
// 3. Mathematics (BODMAS Arithmetic, Big Numbers, Tables, LCM/HCF, Algebra, Geometry, Trigonometry, Commercial Math)
// 4. Social Studies / SST (Constitution/Samvidhan, History, Civics, Geography)
// 5. Computer & DCA / IT (Hardware, Software, Internet, Excel, Shortcuts)
// 6. Science (Physics, Chemistry, Biology)
// 7. Institute Faculty, Admissions & Fees

export interface AgentResponse {
  type: 'academic' | 'math' | 'counseling' | 'general';
  reply: string;
}

// ─────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────
const formatCommas = (s: string | number | bigint): string => {
  const parts = s.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const gcdBigInt = (a: bigint, b: bigint): bigint => {
  return b === 0n ? a : gcdBigInt(b, a % b);
};

const lcmBigInt = (a: bigint, b: bigint): bigint => {
  if (a === 0n || b === 0n) return 0n;
  const g = gcdBigInt(a, b);
  return (a * b) / (g < 0n ? -g : g);
};

const isPrime = (n: number): boolean => {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
};

// ─────────────────────────────────────────────────────────
// MAIN ACADEMIC QUERY SOLVER
// ─────────────────────────────────────────────────────────
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
      reply: `✨ [L.C.C. AI Study Assistant]\n\nNamaste! 🙏 Kya problem hai aapko? Hamein batayein — Spoken English, Grammar, Mathematics, Science, Computer ya Admission, hum turant step-by-step hal karenge!`
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
  // 3. MATHEMATICS: DYNAMIC ENGINES
  // ══════════════════════════════════════════════

  // A. Multiplication Tables (e.g. "table of 17", "19 ka pahada")
  const tableMatch = q.match(/(?:table\s*of|pahada\s*of|ka\s*pahada)\s*(\d+)/i) || q.match(/(\d+)\s*(?:ka\s*pahada|table)/i);
  if (tableMatch) {
    const num = parseInt(tableMatch[1], 10);
    if (!isNaN(num) && num > 0 && num <= 1000) {
      let tblText = `Multiplication Table of ${num} (${num} का पहाड़ा):\n`;
      for (let i = 1; i <= 10; i++) {
        tblText += `• ${num} × ${i} = ${formatCommas(num * i)}\n`;
      }
      return {
        type: 'math',
        reply: `✨ [L.C.C. AI Study Assistant - Multiplication Table]\n\n🔢 ${tblText}\n💡 Tip: Roz 1 se 20 tak ke pahade revise karein calculation speed badhane ke liye!`
      };
    }
  }

  // B. LCM and HCF / GCD (e.g. "lcm of 12 and 18", "hcf of 24 and 36")
  const lcmHcfMatch = q.match(/(lcm|hcf|gcd)\s*(?:of|nikalo)?\s*(\d+)\s*(?:and|aur|,|&)\s*(\d+)/i);
  if (lcmHcfMatch) {
    const type = lcmHcfMatch[1].toLowerCase();
    const a = BigInt(lcmHcfMatch[2]);
    const b = BigInt(lcmHcfMatch[3]);
    const hcfVal = gcdBigInt(a, b);
    const lcmVal = lcmBigInt(a, b);

    if (type === 'lcm') {
      return {
        type: 'math',
        reply: `✨ [L.C.C. AI Study Assistant - LCM Calculation]\n\n🔢 Numbers: ${a} and ${b}\n• HCF: ${hcfVal}\n• Formula: LCM = (Number 1 × Number 2) ÷ HCF\n\n✅ LCM: ${formatCommas(lcmVal.toString())}`
      };
    } else {
      return {
        type: 'math',
        reply: `✨ [L.C.C. AI Study Assistant - HCF / GCD Calculation]\n\n🔢 Numbers: ${a} and ${b}\n• Highest Common Factor (HCF / महत्तम समापवर्तक): ${formatCommas(hcfVal.toString())}\n• LCM: ${formatCommas(lcmVal.toString())}\n\n✅ HCF: ${formatCommas(hcfVal.toString())}`
      };
    }
  }

  // C. Prime Numbers & Factors
  if (q.includes('prime number') || q.includes('abhyajya sankhya') || q.match(/\bis\s*(\d+)\s*prime\b/i)) {
    const pCheck = q.match(/(\d+)/);
    if (pCheck) {
      const num = parseInt(pCheck[1], 10);
      const isP = isPrime(num);
      return {
        type: 'math',
        reply: `✨ [L.C.C. AI Study Assistant - Prime Number Check]\n\n🔢 Number: ${num}\n${isP ? `✅ ${num} ek Prime Number (अभाज्य संख्या) hai! (Yeh sirf 1 aur khud apne se divide hota hai).` : `❌ ${num} ek Composite Number hai (Prime nahi hai).`}`
      };
    }
    return {
      type: 'math',
      reply: `✨ [L.C.C. AI Study Assistant - Prime Numbers]\n\n🔢 Prime Numbers (अभाज्य संख्याएं):\n• Wah sankhya jo sirf 1 aur swayam se divide hoti hai.\n• 1 se 50 ke beech ke Prime Numbers: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47.\n💡 Note: 2 akeli aisi prime sankhya hai jo Even (सम) hai!`
    };
  }

  // D. Percentage Calculation (e.g., "15% of 1200", "500 ka 10%")
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
      reply: `✨ [L.C.C. AI Study Assistant - Percentage Calculation]\n\nFormula: (${p} / 100) × ${total}\n\n✅ Result: ${formatCommas(result)}\n\nExplanation: ${p}% of ${total} is equal to ${result}.`
    };
  }

  // E. Quadratic Equations (e.g., "x^2 - 5x + 6 = 0")
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

  // F. Linear Equation in One Variable (e.g., "2x + 5 = 25")
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

  // G. Square Root / Cube Root (e.g., "sqrt 144", "square root of 144", "cube root of 125")
  const sqrtMatch = q.match(/(?:sqrt|square\s*root(?:\s*of)?|vargmool)\s*[:=]?\s*(\d+(?:\.\d+)?)/i) ||
                    q.match(/(\d+(?:\.\d+)?)\s*ka\s*(?:sqrt|square\s*root|vargmool)/i);
  if (sqrtMatch) {
    const val = parseFloat(sqrtMatch[1]);
    const ans = Math.sqrt(val);
    return {
      type: 'math',
      reply: `✨ [L.C.C. AI Study Assistant - Square Root]\n\n√${val} = ${ans}\n\n✅ Answer: The square root of ${val} is ${ans} (because ${ans} × ${ans} = ${val}).`
    };
  }

  // H. Trigonometry Ratios (sin 30, cos 60, tan 45, etc.)
  const trigMatch = q.match(/\b(sin|cos|tan|cot|sec|cosec)\s*(0|30|45|60|90|180)\b/i);
  if (trigMatch) {
    const fn = trigMatch[1].toLowerCase();
    const deg = trigMatch[2];
    const table: Record<string, Record<string, string>> = {
      sin: { '0': '0', '30': '1/2 (0.5)', '45': '1/√2 (0.7071)', '60': '√3/2 (0.8660)', '90': '1' },
      cos: { '0': '1', '30': '√3/2 (0.8660)', '45': '1/√2 (0.7071)', '60': '1/2 (0.5)', '90': '0' },
      tan: { '0': '0', '30': '1/√3 (0.5774)', '45': '1', '60': '√3 (1.732)', '90': 'Undefined (∞)' }
    };
    if (table[fn] && table[fn][deg]) {
      return {
        type: 'math',
        reply: `✨ [L.C.C. AI Study Assistant - Trigonometric Ratio]\n\n📐 ${fn.toUpperCase()}(${deg}°) = ${table[fn][deg]}\n\nTrigonometry Standard Table (0°, 30°, 45°, 60°, 90°) L.C.C. Board notes se verified hai.`
      };
    }
  }

  // I. Pythagoras Theorem
  if (q.includes('pythagoras') || (q.includes('hypotenuse') && q.includes('triangle'))) {
    return {
      type: 'math',
      reply: `✨ [L.C.C. AI Study Assistant - Pythagoras Theorem]\n\n📐 Right Triangle Formula:\nH² = P² + B² (Hypotenuse² = Perpendicular² + Base²)\n• H = √(P² + B²)\nExample: 3, 4, 5 (3² + 4² = 9 + 16 = 25 = 5²)`
    };
  }

  // J. Geometry Formulas (Circle, Rectangle, Triangle, Cylinder)
  if (q.includes('area of circle') || q.includes('vrit ka kshetraphal')) {
    return {
      type: 'math',
      reply: `✨ [L.C.C. AI Study Assistant - Circle Geometry]\n\n⭕ Circle Formulas:\n• Area = πr² (Where π ≈ 22/7 or 3.1416)\n• Circumference (Paridhi) = 2πr\n• Diameter = 2r`
    };
  }

  if (q.includes('simple interest') || q.includes('sadharan byaj') || q.includes('compound interest')) {
    return {
      type: 'math',
      reply: `✨ [L.C.C. AI Study Assistant - Commercial Mathematics]\n\n💰 Interest Formulas:\n• Simple Interest (SI) = (P × R × T) / 100\n  (P = Principal, R = Rate%, T = Time in years)\n• Total Amount = P + SI\n• Compound Interest (CI) = P(1 + R/100)^T - P`
    };
  }

  if (q.includes('algebra formula') || q.includes('algebra identities') || q.includes('(a+b)^2') || q.includes('(a-b)^2')) {
    return {
      type: 'math',
      reply: `✨ [L.C.C. AI Study Assistant - Algebraic Identities]\n\n📐 Top Algebraic Formulas:\n1. (a + b)² = a² + 2ab + b²\n2. (a - b)² = a² - 2ab + b²\n3. a² - b² = (a - b)(a + b)\n4. (a + b)³ = a³ + b³ + 3ab(a + b)\n5. (a - b)³ = a³ - b³ - 3ab(a - b)`
    };
  }

  // K. Comprehensive Arithmetic & BODMAS Evaluator
  // Supports Unicode multiplication (×), division (÷), minus (−), powers (^), large BigInts, and natural language surrounding
  const normalizedArithmetic = raw
    .replace(/[\u00d7\u2715\u2716\u00b7]/g, '*')
    .replace(/(\d)\s*[xX]\s*(\d)/g, '$1 * $2')
    .replace(/[\u00f7]/g, '/')
    .replace(/[\u2212\u2013\u2014]/g, '-')
    .replace(/\^/g, '**');

  const mathExprMatch = normalizedArithmetic.match(/[\d\(][\d\s\+\-\*\/\(\)\.\*\*]{1,}[\d\)]/);
  if (mathExprMatch && /[\+\-\*\/]/.test(mathExprMatch[0])) {
    const expr = mathExprMatch[0].trim();
    const cleanExpr = expr.replace(/\s+/g, '');
    const isIntOnly = !cleanExpr.includes('.') && !cleanExpr.includes('/') && !cleanExpr.includes('**');
    let answerStr = '';

    if (isIntOnly) {
      try {
        const bigIntExpr = cleanExpr.replace(/(\d+)/g, '$1n');
        const bigRes = new Function(`'use strict'; return (${bigIntExpr});`)();
        answerStr = bigRes.toString();
      } catch (e) {}
    }

    if (!answerStr) {
      try {
        const numRes = new Function(`'use strict'; return (${cleanExpr});`)();
        if (typeof numRes === 'number' && !isNaN(numRes) && isFinite(numRes)) {
          answerStr = Number.isInteger(numRes) ? numRes.toString() : numRes.toFixed(4).replace(/\.?0+$/, '');
        }
      } catch (e) {}
    }

    if (answerStr) {
      const displayExpr = cleanExpr
        .replace(/\*\*/g, ' ^ ')
        .replace(/\*/g, ' × ')
        .replace(/\//g, ' ÷ ')
        .replace(/\+/g, ' + ')
        .replace(/\-/g, ' - ');

      const formattedAns = formatCommas(answerStr);

      // Build step-by-step BODMAS explanation
      const steps: string[] = [];
      steps.push('📐 Niyam: BODMAS (Bracket, Orders/Powers, Division, Multiplication, Addition, Subtraction)');

      // If expression has multiplication
      const multMatches = [...cleanExpr.matchAll(/(\d+)\*(\d+)/g)];
      if (multMatches.length > 0 && (cleanExpr.includes('+') || cleanExpr.includes('-') || cleanExpr.includes('/'))) {
        steps.push('\nStep 1 (Multiplication / Guna pehle hal karein):');
        for (const m of multMatches) {
          try {
            const prod = (BigInt(m[1]) * BigInt(m[2])).toString();
            steps.push(`• ${formatCommas(m[1])} × ${formatCommas(m[2])} = ${formatCommas(prod)}`);
          } catch (e) {}
        }
      }

      // If expression has division
      const divMatches = [...cleanExpr.matchAll(/(\d+)\/(\d+)/g)];
      if (divMatches.length > 0 && (cleanExpr.includes('+') || cleanExpr.includes('-') || cleanExpr.includes('*'))) {
        steps.push('\nStep (Division / Bhaag pehle hal karein):');
        for (const d of divMatches) {
          try {
            const quot = (parseFloat(d[1]) / parseFloat(d[2])).toFixed(4).replace(/\.?0+$/, '');
            steps.push(`• ${formatCommas(d[1])} ÷ ${formatCommas(d[2])} = ${formatCommas(quot)}`);
          } catch (e) {}
        }
      }

      if (cleanExpr.includes('+') || cleanExpr.includes('-')) {
        steps.push('\nStep 2 (Addition & Subtraction / Jod aur Ghatana):');
        steps.push('• Sabhi sankhyaon ko kramanusar jod aur ghata lene par:');
      }

      return {
        type: 'math',
        reply: [
          `✨ [L.C.C. AI Study Assistant - Step-by-Step Math Solution]`,
          ``,
          `🔢 Diya gaya Sawal (Given Expression):`,
          `${displayExpr}`,
          ``,
          `📝 Step-by-Step Hal (Explanation):`,
          steps.join('\n'),
          ``,
          `✅ Final Answer (Antim Uttar):`,
          `👉 ${formattedAns} (${answerStr})`
        ].join('\n')
      };
    }
  }

  // ══════════════════════════════════════════════
  // 4. SPOKEN ENGLISH TRANSLATIONS & DAILY PHRASES
  // (Instant Translation Engine: Lakho ways of speaking!)
  // ══════════════════════════════════════════════

  const translationDatabase: Array<{ test: RegExp; en: string; alt?: string; tip?: string }> = [
    { test: /pani pina|paani peena|pani peena|paani pina|pani chahiye|paani chahiye|water|drink water/i, en: 'I want to drink water.', alt: 'May I drink water, please? / Could you please give me a glass of water?', tip: 'Classroom me permission ke liye "May I drink water, please?" sabse best hota hai.' },
    { test: /khana khana|bhookh lagi|bhukh lagi|khana chahiye|food/i, en: 'I want to eat food.', alt: 'I am feeling hungry. / May I have something to eat?', tip: '"I am starving" tab bolte hain jab bohot zyada bhookh lagi ho.' },
    { test: /sone ja raha|neend aa rahi|sleep|sleeping/i, en: 'I am going to sleep.', alt: 'I am feeling sleepy. / I am going to bed now.', tip: 'Informal English me "I am hitting the sack" bhi bolte hain.' },
    { test: /padhai karni|padhna hai|study|studying/i, en: 'I have to study.', alt: 'I need to prepare for my exams.', tip: '"Hit the books" ka matlab hota hai dil lagakar padhai shuru karna.' },
    { test: /coaching jana|school jana|college jana|office jana/i, en: 'I have to go to coaching.', alt: 'I am heading to class right now.' },
    { test: /ghar jana|ghar pahunch/i, en: 'I want to go home.', alt: 'I have reached home safely.' },
    { test: /kahan ja rahe|kaha ja rahe|where going/i, en: 'Where are you going?', alt: 'Where are you heading to?' },
    { test: /der ho gayi|late ho gaya|late ho gayi/i, en: 'I got late.', alt: 'I am running late. / Sorry for the delay.', tip: 'Professional English me "Apologies for the delay" bolein.' },
    { test: /andar aa sakta|may i come in/i, en: 'May I come in, sir/ma\'am?', tip: 'Classroom me hamesha "May I..." use karein (permission ke liye).' },
    { test: /samajh nahi aaya|samajh nhi aaya|not understand/i, en: 'I did not understand.', alt: 'Could you please explain that again?' },
    { test: /aap kaise ho|aap kaise hain|how are you/i, en: 'How are you?', alt: 'How have you been? / Hope you are doing well!' },
    { test: /naam kya hai|what is your name/i, en: 'What is your name?', alt: 'May I know your name, please?' },
    { test: /madad chahiye|help chahiye|meri madad/i, en: 'Could you please help me?', alt: 'I need some assistance.' },
    { test: /kya hua|kya baat hai/i, en: 'What happened?', alt: 'What is the matter?' },
    { test: /chalo chalte hain|chalo chalein/i, en: 'Let us go! / Shall we leave?' },
    { test: /mujhe nahi pata|mujhe nhi pta|i dont know/i, en: 'I do not know.', alt: 'I have no idea about it.' },
    { test: /main theek hoon|mai thik hu/i, en: 'I am fine, thank you.', alt: 'Doing great, thanks for asking!' },
    { test: /mujhe jana hai|i have to go/i, en: 'I have to go now.', alt: 'I must leave now.' },
    { test: /firse bolo|dobara bolo/i, en: 'Pardon, please? / Could you please repeat that?' },
    { test: /kitna time hua|kya samay hua/i, en: 'What is the time right now?', alt: 'Could you tell me the time, please?' },
    { test: /kitne ka hai|price kya hai/i, en: 'How much does this cost?', alt: 'What is the price of this item?' },
    { test: /dhanyawad|shukriya|thank you/i, en: 'Thank you very much!', alt: 'I truly appreciate your help.' },
    { test: /maaf kijiye|galti ho gayi|sorry/i, en: 'I am extremely sorry.', alt: 'My sincere apologies for the mistake.' }
  ];

  for (const item of translationDatabase) {
    if (item.test.test(q)) {
      return {
        type: 'academic',
        reply: `✨ [L.C.C. AI Study Assistant - Spoken English Translation]\n\n🗣️ Kaise Bolein (English Translation):\n\n👉 Standard: "${item.en}"\n${item.alt ? `👉 Professional / Fluent: "${item.alt}"\n` : ''}${item.tip ? `\n💡 Fluency Tip: ${item.tip}` : ''}`
      };
    }
  }

  // ══════════════════════════════════════════════
  // 5. SITUATIONAL SPOKEN ENGLISH WAYS
  // ══════════════════════════════════════════════

  // A. Self Introduction
  if (q.includes('intro') || q.includes('introduction') || q.includes('apna parichay') || q.includes('introduce myself')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Self Introduction in English]\n\n🗣️ Best Self-Introduction Format:\n\n1. Greeting: "Good morning/afternoon, Sir/Ma'am."\n2. Name: "My name is [Aapka Naam]."\n3. Location: "I belong to Varanasi, Uttar Pradesh."\n4. Education: "Currently, I am studying in Class [Class] at Learning Coaching Center (L.C.C.)."\n5. Strengths: "I am hardworking, punctual, and eager to learn new skills."\n6. Ambition: "My goal is to achieve 95%+ in my board exams and become a [Career Goal]."\n7. Closing: "Thank you for giving me this opportunity."\n\n💡 Rule: Confidence ke saath eye contact banakar bolein!`
    };
  }

  // B. Job Interview Tips & Answers
  if (q.includes('interview') || q.includes('job interview')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Job Interview Mastery]\n\n💼 Essential Interview Speaking Ways:\n\n1. Entering the Room: "Good morning Sir, may I take a seat?"\n2. "Tell me about yourself": Focus 60% on your skills & achievements, 40% on background.\n3. Handling difficult questions: "That is an interesting question. In my perspective..."\n4. Asking questions back: "What does a typical day in this role look like?"\n5. Thanking: "Thank you very much for your valuable time today."`
    };
  }

  // C. Restaurant / Ordering Food
  if (q.includes('restaurant') || q.includes('hotel me') || q.includes('order kaise karein') || q.includes('food order')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Restaurant & Food Ordering]\n\n🍽️ Restaurant Conversation Phrases:\n\n• Table booking: "A table for two, please."\n• Asking menu: "Could we please see the menu?"\n• Ordering food: "I would like to order a paneer butter masala and butter naans."\n• Asking bill: "Could you please bring the bill / check?"\n• Compliment: "The food was delicious, thank you!"`
    };
  }

  // D. Phone Call Etiquette
  if (q.includes('phone par') || q.includes('phone call') || q.includes('telephonic')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Phone Call Conversation]\n\n📱 Professional Phone Call Phrases:\n\n• Answering: "Hello, this is [Name] speaking. How can I help you today?"\n• Asking who is calling: "May I know who is calling, please?"\n• Putting on hold: "Could you please hold the line for a moment?"\n• Voice not clear: "I am sorry, your voice is breaking up. Could you please repeat?"\n• Ending call: "Thank you for calling. Have a great day ahead!"`
    };
  }

  // E. Hesitation Removal & Overcoming Fear of English
  if (q.includes('hesitation') || q.includes('dar lagta') || q.includes('confidence') || q.includes('sharam')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Overcoming English Speaking Fear]\n\n🚀 5 Golden Rules to Remove Hesitation:\n\n1. Stop Translating in Mind: Hindi se English sochne ke bajaye seedha English me sochna shuru karein.\n2. Do Not Fear Mistakes: Shuruat me har koi galti karta hai. Bolne ki aadat daaliye!\n3. Mirror Practice: Roz 10 minute aaine ke saamne khade hokar kisi bhi topic par bolein.\n4. Loud Reading: Newspaper ya NCERT English book ko 15 minute tez aawaz me padhein.\n5. Partner Practice: L.C.C. classmate ya friend ke saath roz 5-10 minute English me baatcheet karein.`
    };
  }

  // ══════════════════════════════════════════════
  // 6. ENGLISH GRAMMAR: VERBS, TENSES & VOICE
  // ══════════════════════════════════════════════

  // A. Verbs & Kriya
  if (
    q.includes('verb') ||
    q.includes('verbs') ||
    q.includes('kriya') ||
    q.includes('helping verb') ||
    q.includes('modal verb') ||
    q.includes('main verb')
  ) {
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

  // B. Active & Passive Voice
  if (q.includes('active voice') || q.includes('passive voice') || q.includes('voice change')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Active & Passive Voice]\n\n🗣️ Voice Rules in English:\n\n1. Active Voice: Subject kaam karta hai.\n• Structure: Subject + Verb + Object\n• Example: "Rohit wrote a letter."\n\n2. Passive Voice: Object par kaam hota hai.\n• Structure: Object + Helping Verb + V3 (Past Participle) + by + Subject\n• Example: "A letter was written by Rohit."\n\n💡 Golden Rule: Passive Voice me hamesha Verb ki 3rd Form (V3) hi lagti hai!`
    };
  }

  // C. Direct & Indirect Speech
  if (q.includes('direct indirect') || q.includes('narration') || q.includes('reported speech')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Direct & Indirect Speech]\n\n📜 Narration Rules:\n\n1. Direct Speech: Kisi ke kahe hue shabdon ko jaisa ka taisa bolna.\n• Example: He said, "I am happy."\n\n2. Indirect Speech: Uski baat ko apne shabdon me batana.\n• Example: He said that he was happy.\n\n💡 Key Changes:\n• Inverted commas hatakar 'that' lagate hain.\n• Present Tense -> Past Tense me badalta hai (is/am -> was, have -> had).`
    };
  }

  // D. Modals (Can, Could, Should, Would, May, Might, Must)
  if (q.includes('modal') || q.includes('should') || q.includes('could') || q.includes('would') || q.includes('must')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Modal Verbs]\n\n🔑 Common Modal Auxiliary Verbs:\n\n• Can: Ability / Yogyata ("I can speak English fluently.")\n• Could: Past ability ya polite request ("Could you please help me?")\n• Should: Salah / Advice ("You should study 4 hours daily.")\n• Must: Compulsion / Jaruri ("You must attend classes on time.")\n• May: Formal permission ya possibility ("May I come in, sir?")\n• Would: Polite offer ("Would you like some tea?")`
    };
  }

  // E. Tenses (काल)
  if (q.includes('tense') || q.includes('kaal') || q.includes('present tense') || q.includes('past tense') || q.includes('future tense')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - English Grammar]\n\n📖 Tenses in English (काल):\n\nEnglish me 3 main tenses hote hain, aur har tense ke 4 sub-types hote hain (Total 12 Tenses):\n\n1. Present Tense (वर्तमान काल):\n• Simple Present: Subject + V1(s/es) + Object (He plays cricket)\n• Present Continuous: Sub + is/am/are + V1+ing + Obj (He is playing)\n• Present Perfect: Sub + has/have + V3 + Obj (He has played)\n• Present Perfect Continuous: Sub + has/have been + V1+ing + since/for\n\n2. Past Tense (भूतकाल):\n• Simple Past: Sub + V2 + Obj (He played)\n• Past Continuous: Sub + was/were + V1+ing + Obj\n• Past Perfect: Sub + had + V3 + Obj\n\n3. Future Tense (भविष्य काल):\n• Simple Future: Sub + will + V1 + Obj (He will play)\n• Future Continuous: Sub + will be + V1+ing + Obj\n• Future Perfect: Sub + will have + V3 + Obj`
    };
  }

  // F. Articles & Prepositions
  if (q.includes('article') || q.includes('vowel') || q.includes('a an the') || q.includes('preposition')) {
    if (q.includes('preposition')) {
      return {
        type: 'academic',
        reply: `✨ [L.C.C. AI Study Assistant - Prepositions]\n\n📍 Common Prepositions:\n\n• In: Big cities, months, years, inside closed space ("In Varanasi", "In January")\n• On: Days, dates, surfaces ("On Monday", "On the table")\n• At: Exact time, small places ("At 5:00 PM", "At the bus stop")\n• Between: Do vyaktiyon/vastuon ke beech me ("Between Ram and Shyam")\n• Among: Do se adhik logon ke beech me ("Among the students")\n• Since: Fixed starting point of time ("Since 2020", "Since morning")\n• For: Duration of time ("For 2 hours", "For 5 years")`
      };
    }
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - English Grammar]\n\n🔤 Articles (A, An, The) Rules:\n\n1. 'A' ka use: Consonant sound se shuru hone wale singular nouns ke aage (A boy, A car, A university — 'yu' sound).\n2. 'An' ka use: Vowel sound (अ, आ, इ, ई, ए, ओ...) se shuru hone wale singular nouns ke aage (An apple, An honest person — silent 'h').\n3. 'The' (Definite Article): Kisi vishisht vastu, historical monuments, rivers, holy books ke aage (The Sun, The Ganga, The Taj Mahal).`
    };
  }

  // ══════════════════════════════════════════════
  // 7. SOCIAL STUDIES / SOCIAL SCIENCE (SST)
  // ══════════════════════════════════════════════

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

  if (q.includes('democracy') || q.includes('loktantra') || q.includes('prajatantra')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Civics / Pol Science]\n\n🗳️ Loktantra (Democracy):\n\n"Democracy is government of the people, by the people, for the people." — Abraham Lincoln\n\nKey Principles of Indian Democracy:\n1. Universal Adult Suffrage: 18 saal se upar har nagrik ko vote dene ka adhikar.\n2. Fundamental Rights: Samvidhan dwara 6 maulik adhikar pradan kiye gaye hain.\n3. Independent Judiciary: Nishpaksh nyaypalika jo nagrikon ke adhikaron ki raksha karti hai.`
    };
  }

  // ══════════════════════════════════════════════
  // 8. COMPUTER & IT (DCA / TALLY / PROGRAMMING)
  // ══════════════════════════════════════════════

  if (
    q.includes('hardware') ||
    q.includes('software') ||
    q.includes('computer kya hai') ||
    q.includes('computer') ||
    q.includes('dca')
  ) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Computer & DCA]\n\n💻 Computer Hardware vs Software:\n\n1. Hardware (हार्डवेयर): Computer ke wah physical bhag jinhe hum chu aur dekh sakte hain.\n• Examples: CPU, Keyboard, Mouse, Monitor, RAM, Hard Disk.\n\n2. Software (सॉफ्टवेयर): Instructions aur programs ka samuh jo computer ko kaam karna sikhata hai.\n• System Software: Operating System (Windows, Linux, Android).\n• Application Software: MS Office, Tally Prime, Web Browsers.\n\n💡 L.C.C. Campus me full AC computer practical lab available hai!`
    };
  }

  if (q.includes('shortcut') || q.includes('keys') || q.includes('ctrl')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Computer Shortcuts]\n\n⌨️ Top Keyboard Shortcuts:\n\n• Ctrl + C : Copy (कॉपी)\n• Ctrl + V : Paste (पेस्ट)\n• Ctrl + X : Cut (कट)\n• Ctrl + Z : Undo (वापस लाना)\n• Ctrl + S : Save (सुरक्षित करना)\n• Ctrl + A : Select All (सब चुनना)\n• Alt + Tab : Switch Apps\n• Alt + F4 : Close Active Window`
    };
  }

  // ══════════════════════════════════════════════
  // 9. SCIENCE (PHYSICS, CHEMISTRY, BIOLOGY)
  // ══════════════════════════════════════════════

  if (q.includes('photosynthesis') || q.includes('prakash sanshleshan') || q.includes('paudhe khana')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Biology / Science]\n\n🌿 Photosynthesis (प्रकाश-संश्लेषण):\n\nWah prakriya jiske dwara hare paudhe Surya ke prakash (Sunlight), Chlorophyll, Carbon Dioxide (CO₂) aur Paani (H₂O) ki madad se apna bhojan (Glucose) banate hain aur Oxygen (O₂) chhodte hain.\n\nEquation: 6CO₂ + 6H₂O + Sunlight ➔ C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)`
    };
  }

  if (q.includes('reflection') || q.includes('refraction') || q.includes('mirror formula') || q.includes('lens formula')) {
    return {
      type: 'academic',
      reply: `✨ [L.C.C. AI Study Assistant - Physics / Optics]\n\n🔦 Light Formulas:\n\n• Mirror Formula: 1/f = 1/v + 1/u\n• Lens Formula: 1/f = 1/v - 1/u\n• Laws of Reflection: Angle of Incidence (∠i) = Angle of Reflection (∠r).`
    };
  }

  // ══════════════════════════════════════════════
  // 10. ADMISSION, FEES & TIMINGS
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
  // 11. GENERAL SMART HELPDESK
  // ══════════════════════════════════════════════
  return {
    type: 'general',
    reply: `✨ [L.C.C. AI Study Assistant]\n\nAapka sawal mil gaya! Hum turant madad karenge:\n\n1. 🗣️ Spoken English & Sentence Translations (jaise: 'mujhe pani chahiye in english' ya 'self introduction')\n2. 📐 Math & Calculations (jaise: '23833827272+3838-272727272×733873', 'table of 17', 'lcm of 12 and 18', '2x + 5 = 25')\n3. 📚 English Grammar (Verbs, Tenses, Active/Passive Voice, Prepositions)\n4. 🔬 Science, SST & Computer DCA\n\nApna sawal likhein, hum step-by-step answer denge!`
  };
};
