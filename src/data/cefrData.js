/**
 * CEFR English Phrase Repository & Daily Lessons Data (B1 -> C2)
 */

export const CEFR_LEVELS = [
  { id: 'B1', name: 'B1 - Intermediate', color: 'from-blue-500 to-indigo-600', badge: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'B2', name: 'B2 - Upper Intermediate', color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'C1', name: 'C1 - Advanced', color: 'from-amber-500 to-orange-600', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'C2', name: 'C2 - Proficient / Native', color: 'from-purple-600 to-pink-600', badge: 'bg-purple-100 text-purple-800 border-purple-300' }
];

export const LEVEL_DESCRIPTIONS = {
  B1: {
    title: 'Intermediate (Trung cấp)',
    desc: 'Hiểu các điểm chính trong công việc, học tập, đời sống. Tự tin diễn đạt ý kiến và kế hoạch cơ bản.'
  },
  B2: {
    title: 'Upper Intermediate (Trung cao cấp)',
    desc: 'Thuyết trình mạch lạc, viết bài luận tranh luận, giao tiếp tự nhiên với người bản xứ trong hầu hết tình huống.'
  },
  C1: {
    title: 'Advanced (Cao cấp)',
    desc: 'Sử dụng ngôn ngữ linh hoạt cho các mục đích xã hội, học thuật và chuyên môn. Hiểu các hàm ý ẩn sâu.'
  },
  C2: {
    title: 'Proficient / Native (Thành thạo bản xứ)',
    desc: 'Làm chủ hoàn toàn Tiếng Anh ở mức độ bản xứ. Tự nhiên sử dụng ẩn dụ, tục ngữ và thuật ngữ chuyên gia.'
  }
};

/**
 * Auto-classify CEFR Level based on English phrase features & patterns
 */
export function autoClassifyCEFR(phraseText = '', phraseType = '') {
  if (!phraseText || typeof phraseText !== 'string') return 'B1';
  const text = phraseText.trim().toLowerCase();
  if (!text) return 'B1';

  const words = text.split(/\s+/);

  // Advanced / Native Keywords
  const c2Keywords = ['notwithstanding', 'exacerbate', 'paramount', 'caveat', 'quintessential', 'synergy', 'dichotomy', 'ubiquitous', 'vicissitude', 'anomaly'];
  const c1Keywords = ['double-edged', 'spearhead', 'underpin', 'scrutiny', 'paradigm', 'leverage', 'bottleneck', 'resilience', 'mitigate', 'discrepancy', 'pivot'];

  if (c2Keywords.some(kw => text.includes(kw))) return 'C2';
  if (c1Keywords.some(kw => text.includes(kw))) return 'C1';

  if (phraseType === 'Idiom') {
    return words.length >= 4 ? 'C2' : 'C1';
  }
  if (phraseType === 'Academic Phrase') {
    return words.length >= 3 ? 'C1' : 'B2';
  }

  // Length and Complexity Heuristics
  if (words.length >= 4 || text.length >= 22) return 'C1';
  if (words.length === 3 || text.length >= 14 || phraseType === 'Phrasal Verb') return 'B2';

  return 'B1';
}

/**
 * English to Vietnamese Phonetic Transliteration Engine (Phát âm bồi Tiếng Việt)
 */
const PHONETIC_DICT = {
  "i'm": "Ai-m", "im": "Ai-m", "i": "Ai", "my": "Mai", "you": "Yu", "your": "Yor", "we": "Wi", "our": "Au-ơ",
  "he": "Hi", "his": "Hiz", "she": "Shi", "her": "Hơ", "they": "Đei", "them": "Đem", "it": "It", "its": "It-s",
  "having": "ha-ving", "have": "ha-v", "has": "ha-z", "had": "ha-đ",
  "second": "Se-kần", "thoughts": "thót-s", "thought": "thót",
  "come": "Kâm", "up": "ấp", "with": "wít", "keep": "Kíp", "in": "in", "mind": "mai-nd",
  "look": "Luk", "forward": "for-wợt", "to": "tu", "make": "Meik", "a": "ơ", "an": "an", "the": "đơ",
  "decision": "đơ-si-giần", "run": "Rân", "out": "aut", "of": "ơ-v",
  "take": "Teik", "into": "in-tu", "account": "ơ-kaun-t", "double": "đă-bồ", "edged": "ed-gd", "sword": "so-d",
  "double-edged": "đă-bồ ed-gd", "play": "Plei", "vital": "vai-tồ", "role": "râu",
  "cut": "Kắt", "down": "daun", "on": "on", "pave": "Peiv", "way": "wei", "for": "for",
  "shed": "Sét", "light": "lai-t", "strike": "Sơ-trai-k", "balance": "ba-lần-s",
  "at": "Ẹt", "expense": "ik-spen-s", "call": "Kô", "question": "ques-giần",
  "stem": "Sơ-tem", "from": "frơm", "tipping": "Ti-ping", "point": "poin-t",
  "part": "Pa-t", "and": "ền", "parcel": "pa-sồ", "lieu": "liu",
  "wreak": "Rik", "havoc": "ha-vơ-k", "bear": "Be", "fruit": "fru-t",
  "idea": "ai-đi-ơ", "project": "pro-ject", "deadline": "đét-lai-n", "time": "tai-m",
  "problem": "pro-blầm", "solution": "sơ-lu-shần", "change": "chein-g", "people": "pi-pồ",
  "world": "uơ-ld", "life": "lai-f", "work": "uơ-k", "job": "tróp", "business": "bít-nịt",
  "best": "bét-st", "good": "gút", "great": "grei-t", "new": "niu", "old": "âu-ld",
  "fast": "fát-st", "slow": "slâu", "easy": "i-zi", "hard": "ha-đ"
};

export function autoGeneratePhonetic(phraseText = '', customPhrases = []) {
  if (!phraseText || typeof phraseText !== 'string') return '';
  const text = phraseText.trim();
  if (!text) return '';

  // Extract user-learned word pronunciations from custom / edited phrases
  const userLearnedDict = {};
  if (Array.isArray(customPhrases) && customPhrases.length > 0) {
    customPhrases.forEach(item => {
      if (item && item.phrase && item.phonetic) {
        const pWords = item.phrase.trim().split(/\s+/);
        const pPhonetics = item.phonetic.trim().split(/\s+/);
        if (pWords.length === pPhonetics.length) {
          pWords.forEach((w, idx) => {
            const cleanKey = w.toLowerCase().replace(/[^a-z']/g, '');
            if (cleanKey && pPhonetics[idx]) {
              userLearnedDict[cleanKey] = pPhonetics[idx];
            }
          });
        }
      }
    });
  }

  const words = text.split(/\s+/);
  
  const phonetics = words.map((w, idx) => {
    const rawClean = w.toLowerCase().replace(/[^a-z']/g, '');
    if (!rawClean) return '';

    // 1. Highest Priority: User's customized word pronunciation memory
    if (userLearnedDict[rawClean]) {
      return userLearnedDict[rawClean];
    }

    // 2. Second Priority: System default dictionary match
    if (PHONETIC_DICT[rawClean]) {
      return PHONETIC_DICT[rawClean];
    }

    // 3. Fallback: Algorithmic transliteration for English -> Vietnamese
    let p = rawClean;

    // Prefixes & Sound clusters
    p = p.replace(/^str/, 'sơ-tr')
         .replace(/^thr/, 'thr')
         .replace(/^sh/, 'sh')
         .replace(/^ch/, 'ch')
         .replace(/^ph/, 'f')
         .replace(/^wh/, 'w')
         .replace(/^qu/, 'kw');

    // Endings & Suffixes
    p = p.replace(/tion$/, '-shần')
         .replace(/sion$/, '-giần')
         .replace(/ment$/, '-mần-t')
         .replace(/ness$/, '-nẹt-s')
         .replace(/able$/, '-ơ-bồ')
         .replace(/ible$/, '-ơ-bồ')
         .replace(/ful$/, '-phun')
         .replace(/less$/, '-lét')
         .replace(/ing$/, '-ing')
         .replace(/ed$/, '-đ');

    if (p.length > 0) {
      // Capitalize first word or proper parts
      if (idx === 0) {
        p = p.charAt(0).toUpperCase() + p.slice(1);
      }
    }

    return p;
  });

  return phonetics.filter(Boolean).join(' ');
}

export const INITIAL_PHRASES = [
  // B1 Level Phrases
  {
    id: 'b1-1',
    phrase: 'come up with',
    meaning: 'Nảy ra, nghĩ ra (ý tưởng, kế hoạch)',
    context: '💡 Họp công việc & Sáng tạo giải pháp',
    phonetic: 'Kâm ấp wít',
    level: 'B1',
    type: 'Phrasal Verb',
    example: 'She came up with a brilliant idea for the project during lunch.',
    vietnameseTranslation: 'Cô ấy đã nảy ra một ý tưởng tuyệt vời cho dự án trong giờ ăn trưa.',
    tags: ['Daily Work', 'Creative'],
    masteryLevel: 1, // 0 to 5 SRS level
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'b1-2',
    phrase: 'keep in mind',
    meaning: 'Ghi nhớ, lưu ý rằng',
    context: '📌 Giao tiếp công việc & Nhắc nhở',
    phonetic: 'Kíp in mai-nd',
    level: 'B1',
    type: 'Collocation',
    example: 'Please keep in mind that the deadline is this Friday at 5 PM.',
    vietnameseTranslation: 'Xin lưu ý rằng hạn chót là 5 giờ chiều Thứ Sáu tuần này.',
    tags: ['Work', 'Reminder'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'b1-3',
    phrase: 'look forward to',
    meaning: 'Rất mong chờ điều gì đó',
    context: '✉️ Viết Email & Trao đổi chính thức',
    phonetic: 'Luk for-wợt tu',
    level: 'B1',
    type: 'Phrasal Verb',
    example: 'I look forward to hearing from you soon.',
    vietnameseTranslation: 'Tôi rất mong sớm nhận được phản hồi từ bạn.',
    tags: ['Email', 'Formal'],
    masteryLevel: 2,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'b1-4',
    phrase: 'make a decision',
    meaning: 'Đưa ra quyết định',
    context: '⚖️ Thảo luận & Đưa ra lựa chọn',
    phonetic: 'Meik ơ đơ-si-giần',
    level: 'B1',
    type: 'Collocation',
    example: 'Take your time before you make a decision.',
    vietnameseTranslation: 'Hãy dành thời gian suy nghĩ trước khi bạn đưa ra quyết định.',
    tags: ['Daily Life'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'b1-5',
    phrase: 'run out of',
    meaning: 'Cạn kiệt, hết (tiền, thời gian, nguyên liệu)',
    context: '⏳ Tình huống khẩn cấp & Quản lý thời gian',
    phonetic: 'Rân aut ơ-v',
    level: 'B1',
    type: 'Phrasal Verb',
    example: 'We are running out of time, so we need to hurry.',
    vietnameseTranslation: 'Chúng ta đang sắp hết thời gian rồi, nên cần phải nhanh lên.',
    tags: ['Daily Life', 'Urgent'],
    masteryLevel: 1,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'b1-6',
    phrase: "I'm having second thoughts",
    meaning: 'Tôi đang suy nghĩ lại / Tôi không còn chắc suy nghĩ đó nữa',
    context: '🤔 Dùng khi bắt đầu do dự điều mình định làm',
    phonetic: 'Ai-m ha-ving Se-kần-thót-s',
    level: 'B1',
    type: 'Idiom',
    example: "I was going to buy that expensive car, but now I'm having second thoughts.",
    vietnameseTranslation: 'Tôi đã định mua chiếc xe đắt tiền đó, nhưng bây giờ tôi đang suy nghĩ lại.',
    tags: ['Daily Life', 'Decision'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },

  // B2 Level Phrases
  {
    id: 'b2-1',
    phrase: 'take into account',
    meaning: 'Cân nhắc, tính đến một yếu tố nào đó',
    context: '📊 Báo cáo tài chính & Lập kế hoạch',
    phonetic: 'Teik in-tu ơ-kaun-t',
    level: 'B2',
    type: 'Collocation',
    example: 'You should take inflation into account when planning your long-term budget.',
    vietnameseTranslation: 'Bạn nên cân nhắc yếu tố lạm phát khi lập ngân sách dài hạn.',
    tags: ['Finance', 'Business'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'b2-2',
    phrase: 'a double-edged sword',
    meaning: 'Con dao hai lưỡi (vừa có lợi vừa có hại)',
    context: '🗣️ Thuyết trình & Tranh luận lập luận',
    phonetic: 'Ơ đă-bồ ed-gd so-d',
    level: 'B2',
    type: 'Idiom',
    example: 'Social media is a double-edged sword; it connects people but wastes time.',
    vietnameseTranslation: 'Mạng xã hội là con dao hai lưỡi; nó kết nối mọi người nhưng cũng làm lãng phí thời gian.',
    tags: ['Debate', 'Writing'],
    masteryLevel: 1,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'b2-3',
    phrase: 'play a vital role in',
    meaning: 'Đóng vai trò quan trọng trong việc gì',
    context: '🏆 Thuyết trình & Viết bài luận IELTS',
    phonetic: 'Pleik ơ vai-tồ râu in',
    level: 'B2',
    type: 'Collocation',
    example: 'Education plays a vital role in the economic development of a nation.',
    vietnameseTranslation: 'Giáo dục đóng một vai trò quan trọng trong sự phát triển kinh tế của một quốc gia.',
    tags: ['IELTS Writing', 'Academic'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'b2-4',
    phrase: 'cut down on',
    meaning: 'Cắt giảm (tiêu dùng, lượng đường, chi phí)',
    context: '🥗 Lối sống sức khỏe & Quản lý chi tiêu',
    phonetic: 'Kắt daun on',
    level: 'B2',
    type: 'Phrasal Verb',
    example: 'The doctor advised him to cut down on sugar and processed foods.',
    vietnameseTranslation: 'Bác sĩ khuyên anh ấy nên cắt giảm lượng đường và thực phẩm chế biến sẵn.',
    tags: ['Health', 'Daily'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'b2-5',
    phrase: 'pave the way for',
    meaning: 'Mở đường cho, tạo điều kiện thuận lợi cho',
    context: '🚀 Phát minh công nghệ & Đổi mới sáng tạo',
    phonetic: 'Peiv đơ wei for',
    level: 'B2',
    type: 'Collocation',
    example: 'This breakthrough technological discovery paved the way for modern AI.',
    vietnameseTranslation: 'Phát minh công nghệ đột phá này đã mở đường cho trí tuệ nhân tạo hiện đại.',
    tags: ['Tech', 'Academic'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },

  // C1 Level Phrases
  {
    id: 'c1-1',
    phrase: 'shed light on',
    meaning: 'Làm sáng tỏ, rọi ánh sáng vào (vấn đề phức tạp)',
    context: '🔬 Nghiên cứu khoa học & Báo cáo chuyên sâu',
    phonetic: 'Sét lai-t on',
    level: 'C1',
    type: 'Idiomatic Collocation',
    example: 'The newly released scientific research sheds light on how memories are stored.',
    vietnameseTranslation: 'Nghiên cứu khoa học vừa công bố đã làm sáng tỏ cách ký ức được lưu trữ.',
    tags: ['Academic', 'Research'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'c1-2',
    phrase: 'strike a balance',
    meaning: 'Đạt được sự cân bằng hợp lý giữa hai bên',
    context: '⚖️ Quản trị doanh nghiệp & Đời sống',
    phonetic: 'Sơ-trai-k ơ ba-lần-s',
    level: 'C1',
    type: 'Collocation',
    example: 'It is crucial to strike a delicate balance between economic growth and environmental preservation.',
    vietnameseTranslation: 'Điều quan trọng là phải đạt được sự cân bằng khéo léo giữa phát triển kinh tế và bảo tồn môi trường.',
    tags: ['Writing Task 2', 'Formal'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'c1-3',
    phrase: 'at the expense of',
    meaning: 'Phải trả giá bằng, dựa trên sự tổn hại của điều gì',
    context: '📈 Phân tích kinh tế & Triết lý sống',
    phonetic: 'Ẹt đi ik-spen-s ơ-v',
    level: 'C1',
    type: 'Prepositional Phrase',
    example: 'He achieved rapid professional success at the expense of his physical health.',
    vietnameseTranslation: 'Anh ấy đạt được thành công sự nghiệp nhanh chóng nhưng phải trả giá bằng sức khỏe thể chất.',
    tags: ['Academic', 'Philosophy'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'c1-4',
    phrase: 'call into question',
    meaning: 'Đưa vào nghi vấn, nghi ngờ độ tin cậy của điều gì',
    context: '🔍 Kiểm toán doanh nghiệp & Tranh tụng',
    phonetic: 'Kô in-tu ques-giần',
    level: 'C1',
    type: 'Idiom',
    example: 'The audit results called into question the accuracy of the financial statements.',
    vietnameseTranslation: 'Kết quả kiểm toán đã đặt ra nghi vấn về tính chính xác của các báo cáo tài chính.',
    tags: ['Business', 'Formal'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'c1-5',
    phrase: 'stem from',
    meaning: 'Bắt nguồn từ, là hệ quả của',
    context: '🧩 Phân tích nguyên nhân & Mâu thuẫn',
    phonetic: 'Sơ-tem frơm',
    level: 'C1',
    type: 'Phrasal Verb',
    example: 'Most of the current misunderstandings stem from a lack of clear communication.',
    vietnameseTranslation: 'Hầu hết các hiểu lầm hiện tại đều bắt nguồn từ việc thiếu giao tiếp rõ ràng.',
    tags: ['Academic', 'Cause & Effect'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },

  // C2 Level Phrases
  {
    id: 'c2-1',
    phrase: 'tipping point',
    meaning: 'Điểm bùng phát / Ngưỡng không thể đảo ngược',
    context: '🌍 Diễn đàn toàn cầu & Biến đổi khí hậu',
    phonetic: 'Ti-ping poin-t',
    level: 'C2',
    type: 'Advanced Noun Phrase',
    example: 'The climate system is approaching a critical tipping point that could trigger cascading disasters.',
    vietnameseTranslation: 'Hệ thống khí hậu đang tiến tới một điểm bùng phát tới hạn có thể kích hoạt chuỗi thảm họa liên hoàn.',
    tags: ['C2 Academic', 'Global Issues'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'c2-2',
    phrase: 'part and parcel of',
    meaning: 'Phần thiết yếu, không thể tách rời của điều gì',
    context: '🌟 Trải nghiệm đời sống & Quan hệ công chúng',
    phonetic: 'Pa-t ền pa-sồ ơ-v',
    level: 'C2',
    type: 'Idiom',
    example: 'Dealing with unexpected criticism is part and parcel of being a public figure.',
    vietnameseTranslation: 'Đối mặt với những lời chỉ trích bất ngờ là một phần không thể tách rời khi trở thành người của công chúng.',
    tags: ['Native Expression', 'C2'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'c2-3',
    phrase: 'in lieu of',
    meaning: 'Thay cho, thay vì (thường dùng trong văn phong pháp lý / trang trọng)',
    context: '📜 Hợp đồng pháp lý & Chính sách nhân sự',
    phonetic: 'In liu ơ-v',
    level: 'C2',
    type: 'Formal Prepositional',
    example: 'The company offered employees additional equity in lieu of an annual cash bonus.',
    vietnameseTranslation: 'Công ty đã đề nghị cấp thêm cổ phần cho nhân viên thay vì thưởng tiền mặt hàng năm.',
    tags: ['Legal', 'C2 Business'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'c2-4',
    phrase: 'wreak havoc on',
    meaning: 'Gây ra sự tàn phá khủng khiếp, làm hỗn loạn',
    context: '⚡ Khủng hoảng chuỗi cung ứng & Thiên tai',
    phonetic: 'Rik ha-vơ-k on',
    level: 'C2',
    type: 'Collocation',
    example: 'The unseasonal frost wreaked havoc on the local agriculture supply chain.',
    vietnameseTranslation: 'Đợt sương muối trái mùa đã gây ra sự tàn phá khủng khiếp đối với chuỗi cung ứng nông nghiệp địa phương.',
    tags: ['C2 Vocabulary', 'High Impact'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  },
  {
    id: 'c2-5',
    phrase: 'bear fruit',
    meaning: 'Đơm hoa kết trái, gặt hái thành quả sau nỗ lực dài',
    context: '🎯 Đầu tư dài hạn & Đạt thành quả sự nghiệp',
    phonetic: 'Be fru-t',
    level: 'C2',
    type: 'Idiom',
    example: 'Years of relentless dedication to research finally bore fruit when the patent was granted.',
    vietnameseTranslation: 'Nhiều năm tận tụy kiên trì nghiên cứu cuối cùng đã gặt hái thành quả khi bằng sáng chế được cấp.',
    tags: ['Native Idiom', 'Success'],
    masteryLevel: 0,
    nextReviewDate: new Date().toISOString()
  }
];

export const DAILY_LESSONS = {
  B1: [
    {
      dayId: 1,
      title: 'Mastering Workplace Collocations',
      level: 'B1',
      focusPhraseId: 'b1-1',
      grammarNote: 'Sử dụng phrasal verb "come up with" đi kèm với từ chỉ ý tưởng/giải pháp.',
      storySnippet: 'During yesterday’s brainstorming session, Sarah came up with a project plan that impressed the entire board. She urged everyone to keep in mind that timing is essential.',
      quiz: [
        {
          id: 'q1',
          question: 'Fill in the blank: "We need to ______ a strategy before the meeting begins."',
          options: ['come up with', 'run out of', 'keep in mind', 'look forward to'],
          correctIndex: 0,
          explanation: '"come up with" nghĩa là nảy ra / nghĩ ra một chiến lược.'
        },
        {
          id: 'q2',
          question: 'Nghĩa tiếng Việt chuẩn của cụm "keep in mind" là gì?',
          options: ['Ghi nhớ, lưu ý', 'Quên đi', 'Đưa ra quyết định', 'Bắt đầu làm'],
          correctIndex: 0,
          explanation: '"keep in mind" là ghi nhớ hoặc lưu ý một điều quan trọng.'
        }
      ]
    },
    {
      dayId: 2,
      title: 'Time Management & Swift Decisions',
      level: 'B1',
      focusPhraseId: 'b1-5',
      grammarNote: 'Cấu trúc "run out of + Noun" biểu thị sự cạn kiệt tài nguyên.',
      storySnippet: 'If we run out of budget, we cannot make a decision to hire more developers this quarter. Take your time, but stay focused.',
      quiz: [
        {
          id: 'q3',
          question: 'Complete the sentence: "Don’t rush, take your time before you ______ a decision."',
          options: ['make', 'do', 'take', 'give'],
          correctIndex: 0,
          explanation: 'Collocation chuẩn trong Tiếng Anh là "make a decision".'
        }
      ]
    }
  ],
  B2: [
    {
      dayId: 1,
      title: 'Critical Thinking & Analytical Writing',
      level: 'B2',
      focusPhraseId: 'b2-2',
      grammarNote: 'Dùng "a double-edged sword" để phân tích luận điểm có hai mặt lợi và hại trong IELTS Essay.',
      storySnippet: 'Artificial intelligence is undoubtedly a double-edged sword. While it automates tedious labor, we must take into account its impact on workforce dynamics.',
      quiz: [
        {
          id: 'q4',
          question: 'Which phrase means "a situation with both positive and negative consequences"?',
          options: ['A double-edged sword', 'Pave the way for', 'Cut down on', 'Play a vital role'],
          correctIndex: 0,
          explanation: '"A double-edged sword" chỉ con dao 2 lưỡi.'
        }
      ]
    }
  ],
  C1: [
    {
      dayId: 1,
      title: 'Academic & Formal Argumentation',
      level: 'C1',
      focusPhraseId: 'c1-1',
      grammarNote: 'Cấu trúc "shed light on + Noun/Clause" cực kỳ ấn tượng trong bài thuyết trình và bài viết học thuật.',
      storySnippet: 'The breakthrough study sheds light on neuroplasticity, while forcing scholars to strike a balance between theoretical models and practical applications.',
      quiz: [
        {
          id: 'q5',
          question: 'Choose the best synonym for "shed light on":',
          options: ['Clarify / Make clear', 'Hide / Conceal', 'Ignore', 'Destroy'],
          correctIndex: 0,
          explanation: '"Shed light on" có nghĩa làm sáng tỏ hoặc giải thích rõ ràng điều gì.'
        }
      ]
    }
  ],
  C2: [
    {
      dayId: 1,
      title: 'Native-level Proficiency & Metaphors',
      level: 'C2',
      focusPhraseId: 'c2-1',
      grammarNote: 'Khái niệm "tipping point" mô tả thời điểm một thay đổi nhỏ làm chuyển biến hoàn toàn cục cục.',
      storySnippet: 'Environmental scientists warn we are at a catastrophic tipping point. Adaptability is part and parcel of surviving rapid global climate shifts.',
      quiz: [
        {
          id: 'q6',
          question: 'What does "part and parcel of" mean in formal English?',
          options: ['An essential and unavoidable part', 'A temporary bonus', 'An illegal action', 'A separate item'],
          correctIndex: 0,
          explanation: '"part and parcel of" nghĩa là một phần thiết yếu không thể tách rời.'
        }
      ]
    }
  ]
};
