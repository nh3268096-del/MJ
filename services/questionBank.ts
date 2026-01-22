
import { QuestionContent } from '../types';

export const questionBank: QuestionContent[] = [
  {
    type: "MCQ",
    subject: "Physics",
    question: "নিউটনের প্রথম সূত্র কী?",
    options: ["ক) F=ma", "খ) E=mc²", "গ) V=IR", "ঘ) P=mv"],
    answer: "ক) F=ma"
  },
  {
    type: "CQ",
    subject: "Biology",
    question: "কোষের মূল অংশ কী?",
    cqParts: {
      ka: "কোষের মূল অংশ হলো নিউক্লিয়াস।",
      kha: "নিউক্লিয়াস কোষের সকল জৈবনিক কার্যাবলী নিয়ন্ত্রণ করে বলে একে কোষের প্রাণকেন্দ্র বলা হয়।",
      ga: "উদ্দীপকের আলোকে একটি আদর্শ উদ্ভিদ কোষের চিত্র অঙ্কন করো।",
      gha: "উন্নত ও অনুন্নত কোষের নিউক্লিয়াসের গঠনের তুলনা করো।"
    }
  },
  {
    type: "Normal",
    subject: "Math",
    question: "একটি বৃত্তের ক্ষেত্রফল বের করার সূত্র বলো।",
    explanation: "বৃত্তের ক্ষেত্রফল বের করার সূত্র হলো: A = πr²\nএখানে, A = ক্ষেত্রফল, r = বৃত্তের ব্যাসার্ধ, এবং π ≈ ৩.১৪১৬।"
  },
  {
    type: "MCQ",
    subject: "Chemistry",
    question: "পানির রাসায়নিক সূত্র কী?",
    options: ["ক) H2O", "খ) CO2", "গ) NaCl", "ঘ) O2"],
    answer: "ক) H2O"
  },
  {
    type: "Normal",
    subject: "ICT",
    question: "Algorithm কী?",
    explanation: "Algorithm (অ্যালগরিদম) হলো কতগুলো ধারাবাহিক ধাপের সমষ্টি, যা কোনো একটি নির্দিষ্ট সমস্যার সমাধান করার জন্য ব্যবহৃত হয়।"
  }
];

export const getRandomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * questionBank.length);
  return questionBank[randomIndex];
};
