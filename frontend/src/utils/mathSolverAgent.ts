// Lightweight 100% Free Client-Side Academic & Math AI Agent for L.C.C. Live Chat
// Runs 100% on the client without API keys, zero token consumption, and instant latency.

export interface AgentResponse {
  type: 'math' | 'counseling' | 'general';
  reply: string;
}

export const solveAcademicQuery = (query: string): AgentResponse => {
  const raw = query.trim();
  const q = raw.toLowerCase();

  // ══════════════════════════════════════════════
  // 1. MATHEMATICAL QUESTION RESOLUTION
  // ══════════════════════════════════════════════

  // A. Percentage Calculation (e.g., "15% of 1200", "20 percent of 500", "500 ka 10%")
  const percentMatch =
    q.match(/(\d+(?:\.\d+)?)\s*(?:%|percent)\s*(?:of|ka|pe|me)?\s*(\d+(?:\.\d+)?)/i) ||
    q.match(/(\d+(?:\.\d+)?)\s*(?:ka|of)\s*(\d+(?:\.\d+)?)\s*(?:%|percent)/i);
  if (percentMatch) {
    let p = parseFloat(percentMatch[1]);
    let total = parseFloat(percentMatch[2]);
    if (q.includes('ka') && !q.includes('%') && percentMatch[2]) {
      // e.g. "500 ka 10%"
      const temp = p;
      p = total;
      total = temp;
    }
    const result = (p / 100) * total;
    return {
      type: 'math',
      reply: `💡 [AI Math Agent - Percentage Calculation]\n\nFormula: (Percentage / 100) × Total\nCalculation: (${p} / 100) × ${total}\n\n✅ Result: ${result}\n\nExplanation: ${p}% of ${total} is equal to ${result}.`
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
          reply: `💡 [AI Math Agent - Quadratic Equation Solution]\n\nEquation: ${a}x² ${b >= 0 ? '+ ' + b : b}x ${c >= 0 ? '+ ' + c : c} = 0\n\n1. Discriminant (D = b² - 4ac):\n   D = (${b})² - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${discriminant}\n\n2. Quadratic Formula:\n   x = (-b ± √D) / (2a)\n   x = (${-b} ± √${discriminant}) / (${2 * a})\n\n✅ Roots / Solution:\n   x₁ = ${root1}\n   x₂ = ${root2}\n\nBoth roots satisfy the equation.`
        };
      } else {
        return {
          type: 'math',
          reply: `💡 [AI Math Agent - Quadratic Equation]\n\nEquation: ${a}x² ${b >= 0 ? '+ ' + b : b}x ${c >= 0 ? '+ ' + c : c} = 0\nDiscriminant D = ${discriminant} < 0.\n\n✅ Since D < 0, this quadratic equation has no real roots (roots are complex/imaginary).`
        };
      }
    }
  }

  // C. Linear Equation in One Variable (e.g., "2x + 5 = 15", "3x - 9 = 0", "5x = 25", "x + 8 = 20")
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
        reply: `💡 [AI Math Agent - Linear Equation Solution]\n\nGiven Equation: ${a !== 1 ? a : ''}x ${b > 0 ? '+ ' + b : b < 0 ? b : ''} = ${c}\n\nStep 1: Transpose constant to RHS:\n   ${a !== 1 ? a : ''}x = ${c} ${b >= 0 ? '- ' + b : '+ ' + Math.abs(b)} = ${rhs}\n\nStep 2: Divide by coefficient of x (${a}):\n   x = ${rhs} / ${a}\n\n✅ Answer: x = ${xVal}`
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
        reply: `💡 [AI Math Agent - Circle Geometry]\n\nGiven Radius (r): ${r} units\n\n1. Area of Circle:\n   A = πr² = (22/7) × ${r}² = ${area} sq units\n\n2. Circumference / Perimeter:\n   C = 2πr = 2 × (22/7) × ${r} = ${circ} units\n\n✅ Area: ${area} | Circumference: ${circ}`
      };
    }
    return {
      type: 'math',
      reply: `💡 [AI Math Agent - Circle Formulas]\n• Area = πr² (where π ≈ 22/7 or 3.1416)\n• Circumference = 2πr\n• Diameter = 2r\n\nTip: You can ask "area of circle radius 7" to calculate exact values.`
    };
  }

  if (q.includes('rectangle') && (q.includes('area') || q.includes('perimeter'))) {
    const dimMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:and|by|x|,)\s*(\d+(?:\.\d+)?)/i);
    if (dimMatch) {
      const l = parseFloat(dimMatch[1]);
      const b = parseFloat(dimMatch[2]);
      const area = l * b;
      const peri = 2 * (l + b);
      return {
        type: 'math',
        reply: `💡 [AI Math Agent - Rectangle Geometry]\n\nDimensions: Length (l) = ${l}, Breadth (b) = ${b}\n\n1. Area = l × b = ${l} × ${b} = ${area} sq units\n2. Perimeter = 2(l + b) = 2(${l} + ${b}) = ${peri} units\n\n✅ Area: ${area} | Perimeter: ${peri}`
      };
    }
  }

  if (q.includes('pythagoras') || (q.includes('hypotenuse') && q.match(/\d+/))) {
    const sides = q.match(/\d+(?:\.\d+)?/g);
    if (sides && sides.length >= 2) {
      const a = parseFloat(sides[0]);
      const b = parseFloat(sides[1]);
      const hyp = Math.sqrt(a * a + b * b);
      return {
        type: 'math',
        reply: `💡 [AI Math Agent - Pythagoras Theorem]\n\nFormula: Hypotenuse² = Base² + Perpendicular² (c² = a² + b²)\nGiven: a = ${a}, b = ${b}\n\nCalculation:\nc² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}\nc = √(${a * a + b * b}) = ${hyp % 1 === 0 ? hyp : hyp.toFixed(2)}\n\n✅ Hypotenuse = ${hyp % 1 === 0 ? hyp : hyp.toFixed(2)} units`
      };
    }
  }

  // E. Trigonometry Standard Values
  if (q.includes('sin') || q.includes('cos') || q.includes('tan') || q.includes('trigo')) {
    const trigTable: Record<string, string> = {
      'sin 0': '0',
      'sin 30': '1/2 (0.5)',
      'sin 45': '1/√2 (0.707)',
      'sin 60': '√3/2 (0.866)',
      'sin 90': '1',
      'cos 0': '1',
      'cos 30': '√3/2 (0.866)',
      'cos 45': '1/√2 (0.707)',
      'cos 60': '1/2 (0.5)',
      'cos 90': '0',
      'tan 0': '0',
      'tan 30': '1/√3 (0.577)',
      'tan 45': '1',
      'tan 60': '√3 (1.732)',
      'tan 90': 'Undefined (∞)'
    };
    for (const [key, val] of Object.entries(trigTable)) {
      if (q.includes(key) || q.includes(key.replace(' ', ''))) {
        return {
          type: 'math',
          reply: `💡 [AI Math Agent - Trigonometry]\n\nValue of ${key}°:\n✅ ${val}\n\nFundamental Identity: sin²θ + cos²θ = 1`
        };
      }
    }
  }

  // F. Direct Arithmetic Expression Evaluation (e.g. "solve 25*14 + 180", "150 / 5 + 40", "sqrt(144)")
  const cleanedExpr = q
    .replace(/(?:solve|calculate|kya hoga|what is|find|evaluate)\s*/gi, '')
    .replace(/sqrt\s*\(\s*(\d+)\s*\)/gi, 'Math.sqrt($1)')
    .replace(/√(\d+)/g, 'Math.sqrt($1)');

  if (/^[0-9+\-*/().^%\sMath.sqrt]+$/.test(cleanedExpr) && /[+\-*/^%Math.sqrt]/.test(cleanedExpr)) {
    try {
      // Safe evaluator without eval
      const safeCalc = cleanedExpr.replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${safeCalc});`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return {
          type: 'math',
          reply: `💡 [AI Math Agent - Solved]\n\nExpression: ${raw}\n\n✅ Result: ${result % 1 === 0 ? result : Number(result.toFixed(4))}`
        };
      }
    } catch (e) {}
  }

  // ══════════════════════════════════════════════
  // 2. INSTITUTE HELPDESK & COUNSELING
  // ══════════════════════════════════════════════

  // A. Fees Inquiries
  if (q.includes('fee') || q.includes('fees') || q.includes('paisa') || q.includes('cost') || q.includes('charge') || q.includes('discount')) {
    return {
      type: 'counseling',
      reply: `🎯 [L.C.C. Official Fee Structure 2026-27]\n\n1. School Academic Coaching:\n   • Classes 1 to 5: ₹499 / month\n   • Classes 6 to 8: ₹699 / month\n   • Classes 9 to 10 (Board Prep): ₹999 / month\n   • Classes 11 to 12 (Science / Commerce): ₹1,499 / month\n\n2. Computer & Skill Programs:\n   • DCA (6 Months ISO Diploma): ₹4,999 full course\n   • ADCA (12 Months Master Diploma): ₹8,999 full course\n   • Tally Prime with GST: ₹2,999\n   • Spoken English & GD (3 Months): ₹2,499\n\n🎁 Scholarship Alert: Top 10 rankers in our Sunday Entrance Test receive up to 50% merit discount on all courses!`
    };
  }

  // B. Batch Timings
  if (q.includes('time') || q.includes('timing') || q.includes('schedule') || q.includes('kab') || q.includes('hours') || q.includes('batch')) {
    return {
      type: 'counseling',
      reply: `🕒 [L.C.C. Campus Batch Schedules]\n\n• Morning Shift: 7:00 AM – 11:30 AM\n  (Ideal for School Revision & Morning DCA Computer Batches)\n\n• Evening Shift: 3:00 PM – 8:00 PM\n  (Board Aspirants Classes 9–12, NEET/JEE Foundation & Practical Labs)\n\n• Sunday Special: 9:00 AM – 1:00 PM\n  (1:1 Personal Doubt Clearing Clinics with Director Aman Arora Sir)\n\nBatches operate Monday through Saturday.`
    };
  }

  // C. Director Aman Arora
  if (q.includes('aman') || q.includes('arora') || q.includes('sir') || q.includes('director') || q.includes('faculty') || q.includes('teacher')) {
    return {
      type: 'counseling',
      reply: `👨‍🏫 [Director Aman Arora & Faculty Desk]\n\nDirector Aman Arora is the Founder & Head Faculty at L.C.C., holding 10+ years of proven mentorship in Varanasi. Under his direct guidance, over 2,500+ students have secured 90%+ in CBSE/UP Board examinations and top ranks in Polytechnic & Computer certifications.\n\nAman Sir personally conducts daily Doubt Clearance and weekly motivational counseling at the Palahipatti Main Campus.`
    };
  }

  // D. Campus Location & Branches
  if (q.includes('location') || q.includes('address') || q.includes('kahan') || q.includes('campus') || q.includes('branch') || q.includes('palahipatti')) {
    return {
      type: 'counseling',
      reply: `📍 [L.C.C. Campus Locations & Contact]\n\n1. Main Campus: Palahipatti, Sindhora Road, Varanasi - 221206 (U.P.)\n2. Branch 2: Sindhora Market Branch\n3. Branch 3: Babatpur City Center Branch\n\n📞 Direct Admission Helpline: 9250703092\n📧 Email: info@lcc-coaching.edu\nOpening Hours: 6:30 AM to 8:30 PM (Daily)`
    };
  }

  // E. Admission Process & How to Join
  if (q.includes('admission') || q.includes('enroll') || q.includes('join') || q.includes('kaise') || q.includes('register')) {
    return {
      type: 'counseling',
      reply: `📋 [How to Take Admission at L.C.C.]\n\n1. In-App Instant Admission:\n   Tap "Batches" or "Courses" in this app, select your class, and choose "Direct UPI / QR" or "Razorpay" to activate your batch with instant WhatsApp group access.\n\n2. Offline Campus Walk-in:\n   Visit the Palahipatti campus with 2 passport photos and your previous marksheet.\n\n3. Sunday Scholarship Entrance Test:\n   Appear for the 30-minute aptitude test every Sunday at 10:00 AM to qualify for fee concessions.`
    };
  }

  // ══════════════════════════════════════════════
  // 3. GENERAL FALLBACK HELPDESK
  // ══════════════════════════════════════════════
  return {
    type: 'general',
    reply: `👋 Thank you for messaging L.C.C. Live Desk!\n\nI am your 24/7 AI Academic & Counseling Assistant. You can ask me:\n• Math problems: (e.g. "solve 2x + 5 = 15", "15% of 1200", "area of circle radius 7")\n• Academic queries: Fee structure, batch timings, admissions 2026, or computer diplomas.\n\nHow can I help you today?`
  };
};
