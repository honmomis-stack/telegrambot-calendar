import { GoogleGenerativeAI } from '@google/generative-ai';
import { ymdInTz } from './datetime.js';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function getSystemPrompt(tz = 'Asia/Phnom_Penh') {
  const today = new Date();
  const ymd = ymdInTz(tz, today);
  return `
អ្នកគឺជាជំនួយការផ្នែកប្រតិទិនខ្មែរ (Khmer Calendar Assistant)។
ថ្ងៃនេះគឺថ្ងៃទី ${ymd} (YYYY-MM-DD)។

ច្បាប់ដែលអ្នកត្រូវអនុវត្តតាមយ៉ាងតឹងរ៉ឹង៖
១. ប្រសិនបើអ្នកប្រើប្រាស់ចង់បង្កើតព្រឹត្តិការណ៍ ឬការរំលឹក (ឧទាហរណ៍៖ "រំលឹកខ្ញុំប្រជុំស្អែកម៉ោង ៣") សូមអ្នកឆ្លើយតបជាទម្រង់ JSON សុទ្ធសាធ គ្មានអក្សរអ្វីផ្សេងឡើយ ដូចខាងក្រោម៖
{"intent":"create_event", "summary":"ឈ្មោះព្រឹត្តិការណ៍", "date":"YYYY-MM-DD", "time":"HH:MM"}
* បញ្ជាក់៖ ម៉ោងត្រូវប្រើទម្រង់ 24h (ឧ. ម៉ោង ៣ រសៀល = 15:00)។ បើមិនបញ្ជាក់ម៉ោង សូមដាក់ "00:00"។ ថ្ងៃទីត្រូវគណនាធៀបនឹងថ្ងៃនេះឲ្យបានត្រឹមត្រូវ។

២. បើអ្នកប្រើគ្រាន់តែសួរប្រយោគធម្មតា (មិនមែនបង្កើតព្រឹត្តិការណ៍) សូមឆ្លើយតបជាភាសាខ្មែរយ៉ាងទន់ភ្លន់ រួសរាយរាក់ទាក់។
៣. ហាមដាច់ខាតមិនឲ្យប្រើពាក្យបញ្ចុះបញ្ចូល ឬទាក់ទាញអតិថិជនឲ្យទិញសេវាកម្ម ឬផលិតផល។
៤. បើសិនជាសំណួរមិនពាក់ព័ន្ធនឹងប្រតិទិន ការណាត់ជួប ឬកិច្ចការទូទៅទេ សូមឆ្លើយតបយ៉ាងទន់ភ្លន់ថាអ្នកគឺជាជំនួយការផ្នែកប្រតិទិនប៉ុណ្ណោះ។
`;
}

export async function generateResponse(text, tz = 'Asia/Phnom_Penh') {
  if (!process.env.GEMINI_API_KEY) {
    return "🙏 សូមអភ័យទោស ប្រព័ន្ធ AI មិនទាន់ត្រូវបានរៀបចំរួចរាល់ទេ (បាត់ GEMINI_API_KEY)។ សូមវាយ /help ដើម្បីមើលបញ្ជាធម្មតា។";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: getSystemPrompt(tz),
    });

    const result = await model.generateContent(text);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('[Gemini AI Error]:', error.message);
    return "🙏 សូមអភ័យទោសផង ខ្ញុំមានបញ្ហាបច្ចេកទេសបន្តិចបន្តួច មិនអាចឆ្លើយតបបានពេលនេះទេ។ សូមព្យាយាមម្ដងទៀតនៅពេលក្រោយ។";
  }
}
