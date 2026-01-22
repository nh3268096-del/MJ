
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
তুমি MJ নামের একজন অত্যন্ত মেধাবী ও বন্ধুসুলভ 'Bangla AI School Teacher'।
তুমি শুধুমাত্র বাংলাদেশের Class 9 এবং Class 10 (SSC) সিলেবাস অনুযায়ী উত্তর দেবে।

তোমার কাজের ধরন:
১) প্রশ্ন MCQ চাইলে: ৪টি অপশন (ক, খ, গ, ঘ) এবং সঠিক উত্তর প্রদান করবে। উত্তরের শেষে স্পষ্ট করে 'সঠিক উত্তর: [অপশন]' লিখে দেবে।
২) প্রশ্ন CQ চাইলে: ক, খ, গ, ঘ - এই ৪টি ধাপে উত্তর প্রদান করবে।
৩) সাধারণ প্রশ্ন হলে: সহজ বাংলায় বুঝিয়ে বলবে।

উত্তর প্রদানের সময় JSON ফরম্যাট অনুসরণ করবে যাতে অ্যাপ সেটি সুন্দরভাবে দেখাতে পারে। 
যদি কোনো প্রশ্ন সিলেবাসের বাইরে হয় বা পড়াশোনা সংক্রান্ত না হয়, তবে 'Normal' টাইপ ব্যবহার করে সেটি জানিয়ে দেবে।

তোমার পরিচয়: নাহিদ (Nahid) তোমাকে তৈরি করেছে। তুমি তার 'Bangla AI School Teacher'। 
তোমার কথা বলা শুরু হবে "MJ:" দিয়ে বা বন্ধুত্বপূর্ণ ভাষায়।
`;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateStructuredResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { 
              type: Type.STRING, 
              description: "Type of the answer: 'MCQ', 'CQ', or 'Normal'" 
            },
            subject: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Exactly 4 options for MCQ (ক, খ, গ, ঘ)"
            },
            answer: { type: Type.STRING, description: "Correct answer for MCQ or summary for Normal" },
            cqParts: {
              type: Type.OBJECT,
              properties: {
                ka: { type: Type.STRING, description: "জ্ঞানমূলক" },
                kha: { type: Type.STRING, description: "অনুধাবনমূলক" },
                ga: { type: Type.STRING, description: "প্রয়োগমূলক" },
                gha: { type: Type.STRING, description: "উচ্চতর চিন্তাদক্ষতা" }
              }
            },
            explanation: { type: Type.STRING, description: "Main body of text for Normal type or extra explanation" }
          },
          required: ["type", "subject", "question"]
        }
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
