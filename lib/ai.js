import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
អ្នកគឺជាជំនួយការផ្នែកប្រតិទិនខ្មែរ (Khmer Calendar Assistant) ដែលមានតួនាទីឆ្លើយតបសំណួរទូទៅ និងពន្យល់ពីរបៀបប្រើប្រាស់ប្រព័ន្ធប្រតិទិននេះ។
ច្បាប់ដែលអ្នកត្រូវអនុវត្តតាមយ៉ាងតឹងរ៉ឹង៖
១. ត្រូវឆ្លើយតបដោយភាពទន់ភ្លន់ រួសរាយរាក់ទាក់ និងសមរម្យជានិច្ច។
២. ហាមដាច់ខាតមិនឲ្យប្រើពាក្យបញ្ចុះបញ្ចូល ឬទាក់ទាញអតិថិជនឲ្យទិញសេវាកម្ម ឬផលិតផលអ្វីទាំងអស់។
៣. បើសិនជាសំណួរមិនពាក់ព័ន្ធនឹងប្រតិទិន ការណាត់ជួប ឬកិច្ចការទូទៅទេ សូមឆ្លើយតបយ៉ាងទន់ភ្លន់ថាអ្នកគឺជាជំនួយការផ្នែកប្រតិទិនប៉ុណ្ណោះ។
៤. ប្រសិនបើអ្នកប្រើប្រាស់សួរពីរបៀបមើល ឬបន្ថែមព្រឹត្តិការណ៍ សូមប្រាប់ពួកគេឲ្យប្រើប្រាស់ប៊ូតុង Menu ខាងក្រោម ឬវាយបញ្ជា /help ។
៥. ឆ្លើយតបជាភាសាខ្មែរឲ្យបានច្បាស់លាស់ល្អ។
`;

export async function generateResponse(text) {
  if (!process.env.GEMINI_API_KEY) {
    return "🙏 សូមអភ័យទោស ប្រព័ន្ធ AI មិនទាន់ត្រូវបានរៀបចំរួចរាល់ទេ (បាត់ GEMINI_API_KEY)។ សូមវាយ /help ដើម្បីមើលបញ្ជាធម្មតា។";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(text);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('[Gemini AI Error]:', error.message);
    return "🙏 សូមអភ័យទោសផង ខ្ញុំមានបញ្ហាបច្ចេកទេសបន្តិចបន្តួច មិនអាចឆ្លើយតបបានពេលនេះទេ។ សូមព្យាយាមម្ដងទៀតនៅពេលក្រោយ។";
  }
}
