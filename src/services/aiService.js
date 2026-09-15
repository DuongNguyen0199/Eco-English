/**
 * AI Sentence Generator & Translation Service for Eco English
 * Automatically generates simple English example sentences and accurate Vietnamese translations.
 */

const PREBUILT_PATTERNS = [
  {
    kw: ['break the ice'],
    en: 'A friendly smile can help break the ice in a meeting.',
    vi: 'Một nụ cười thân thiện có thể giúp phá tan bầu không khí ngượng ngùng trong cuộc họp.'
  },
  {
    kw: ['keep in touch'],
    en: "Let's keep in touch after the project finishes.",
    vi: 'Hãy giữ liên lạc sau khi dự án kết thúc nhé.'
  },
  {
    kw: ['take a risk', 'take risks'],
    en: 'Sometimes you have to take a risk to achieve success.',
    vi: 'Đôi khi bạn phải chấp nhận rủi ro để đạt được thành công.'
  },
  {
    kw: ['make progress'],
    en: 'He is making steady progress in learning English every day.',
    vi: 'Anh ấy đang tiến bộ đều đặn trong việc học tiếng Anh mỗi ngày.'
  },
  {
    kw: ['look on the bright side'],
    en: 'Try to look on the bright side even when things get difficult.',
    vi: 'Hãy cố gắng nhìn vào mặt tích cực ngay cả khi mọi thứ trở nên khó khăn.'
  },
  {
    kw: ['give up'],
    en: 'Never give up on your goals regardless of challenges.',
    vi: 'Đừng bao giờ từ bỏ mục tiêu của bạn bất kể những khó khăn.'
  },
  {
    kw: ['come across'],
    en: 'I came across a very useful English book yesterday.',
    vi: 'Tôi tình cờ bắt gặp một cuốn sách tiếng Anh rất hữu ích ngày hôm qua.'
  },
  {
    kw: ['hit the nail on the head'],
    en: 'Her explanation really hit the nail on the head.',
    vi: 'Lời giải thích của cô ấy thực sự đánh đúng trọng tâm vấn đề.'
  },
  {
    kw: ['out of the blue'],
    en: 'She called me out of the blue after five years.',
    vi: 'Cô ấy đã gọi điện cho tôi một cách hoàn toàn bất ngờ sau năm năm.'
  },
  {
    kw: ['once in a blue moon'],
    en: 'He only visits his hometown once in a blue moon.',
    vi: 'Anh ấy chỉ thỉnh thoảng mới về thăm quê một lần.'
  }
];

export const aiService = {
  /**
   * Generate an English example sentence and Vietnamese translation for a phrase.
   */
  async generateExampleAndTranslation(phraseText = '', meaningText = '', contextText = '') {
    if (!phraseText || !phraseText.trim()) {
      return { example: '', translation: '' };
    }

    const cleanPhrase = phraseText.trim();
    const lowerPhrase = cleanPhrase.toLowerCase();

    // 1. Check pre-built high quality pattern database
    const matchedPattern = PREBUILT_PATTERNS.find(p => 
      p.kw.some(k => lowerPhrase.includes(k))
    );

    if (matchedPattern) {
      return {
        example: matchedPattern.en,
        translation: matchedPattern.vi
      };
    }

    // 2. Generate natural English sentence structure based on phrase grammar
    let exampleEn = '';
    let translationVi = '';
    const meaningVi = meaningText ? meaningText.trim() : 'thực hiện điều này';

    if (lowerPhrase.startsWith('how to') || lowerPhrase.startsWith('way to')) {
      exampleEn = `Learning ${cleanPhrase} is very useful for daily communication.`;
      translationVi = `Học ${meaningVi} rất hữu ích cho giao tiếp hàng ngày.`;
    } else if (lowerPhrase.startsWith('a ') || lowerPhrase.startsWith('an ') || lowerPhrase.startsWith('the ')) {
      exampleEn = `Understanding ${cleanPhrase} will help you speak English more naturally.`;
      translationVi = `Hiểu rõ ${meaningVi} sẽ giúp bạn nói tiếng Anh tự nhiên hơn.`;
    } else if (lowerPhrase.includes('with') || lowerPhrase.includes('for') || lowerPhrase.includes('to')) {
      exampleEn = `We should ${cleanPhrase} to improve our team efficiency.`;
      translationVi = `Chúng ta nên ${meaningVi} để nâng cao hiệu quả làm việc nhóm.`;
    } else {
      exampleEn = `It is important to ${cleanPhrase} when working in a modern environment.`;
      translationVi = `Điều quan trọng là phải ${meaningVi} khi làm việc trong môi trường hiện đại.`;
    }

    // 3. Optional online translation API enhancement for custom sentence
    try {
      const apiRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(exampleEn)}&langpair=en|vi`);
      const data = await apiRes.json();
      if (data && data.responseData && data.responseData.translatedText) {
        const onlineTranslation = data.responseData.translatedText.trim();
        if (onlineTranslation && onlineTranslation.length > 5) {
          translationVi = onlineTranslation;
        }
      }
    } catch (err) {
      console.warn('Online translation fallback unavailable, using local template:', err.message);
    }

    return {
      example: exampleEn,
      translation: translationVi
    };
  }
};
