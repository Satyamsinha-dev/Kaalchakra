import type { Lang } from "./dictionary";
import type { Section } from "./edition";

type Text = {
  tagline: string;
  motto: string;
  edition: string;
  newYear: string;
  alsoIn: string;
  readFull: string;
  readMore: string;
  briefs: string;
  quote: string;
  back: string;
  related: string;
  highlights: string;
  means: string;
  prev: string;
  next: string;
  minRead: string;
  loading: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
  another: string;
  hindiNote: string;
  fiction: string;
  notFound: string;
  sections: Record<Section, string>;
  travel: {
    imagining: string;
    writing: string;
    slow: string;
    opening: string;
    failed: string;
  };
};

export const newspaperText: Record<Lang, Text> = {
  en: {
    tagline: "A Wheel of Time. A World of Tomorrow.",
    motto: "Global Futuristic Daily",
    edition: "Edition",
    newYear: "← Choose a new year",
    alsoIn: "Also in this Edition",
    readFull: "Read Full Story →",
    readMore: "Read More →",
    briefs: "Quick Briefs",
    quote: "The future is not something we predict, but something we build together.",
    back: "← Back to Newspaper",
    related: "Related Articles",
    highlights: "In 30 Seconds",
    means: "Why This Matters To You",
    prev: "Previous Article",
    next: "Next Article",
    minRead: "min read",
    loading: "Opening the edition…",
    errorTitle: "This edition couldn't be opened.",
    errorBody:
      "The AI service may be busy, or today's free limit may be used up. Please try again in a little while, or choose another year.",
    retry: "Try again",
    another: "← Choose another year",
    hindiNote: "Newspaper stories are in English for now. Hindi editions are coming soon.",
    fiction: "A fictional edition, imagined by AI. Not a prediction.",
    notFound: "This article could not be found.",
    sections: {
      India: "India",
      World: "World",
      "Science & Technology": "Science & Tech",
      Society: "Society",
      "Beyond Earth": "Beyond Earth",
    },
    travel: {
      imagining: "Imagining the world of this year…",
      writing: "Writing the front page…",
      slow: "This one is taking longer than usual. Please stay with us.",
      opening: "The portal is opening…",
      failed: "The portal couldn't open just now.",
    },
  },
  hi: {
    tagline: "एक समय का चक्र। आने वाले कल की दुनिया।",
    motto: "वैश्विक भविष्य का दैनिक",
    edition: "संस्करण",
    newYear: "← नया वर्ष चुनें",
    alsoIn: "इस संस्करण में और",
    readFull: "पूरी खबर पढ़ें →",
    readMore: "और पढ़ें →",
    briefs: "संक्षिप्त खबरें",
    quote: "भविष्य कोई ऐसी चीज़ नहीं जिसकी हम भविष्यवाणी करें, बल्कि वह है जिसे हम मिलकर बनाते हैं।",
    back: "← अखबार पर वापस",
    related: "संबंधित लेख",
    highlights: "30 सेकंड में",
    means: "आपके लिए इसका मतलब",
    prev: "पिछला लेख",
    next: "अगला लेख",
    minRead: "मिनट पढ़ने में",
    loading: "संस्करण खुल रहा है…",
    errorTitle: "यह संस्करण खुल नहीं सका।",
    errorBody:
      "AI सेवा व्यस्त हो सकती है या आज की मुफ़्त सीमा पूरी हो गई हो सकती है। थोड़ी देर बाद फिर कोशिश कीजिए, या कोई और वर्ष चुनिए।",
    retry: "फिर कोशिश करें",
    another: "← कोई और वर्ष चुनें",
    hindiNote: "अखबार की खबरें फ़िलहाल अंग्रेज़ी में हैं। हिन्दी संस्करण जल्द आ रहे हैं।",
    fiction: "यह एक काल्पनिक संस्करण है, AI की कल्पना। कोई भविष्यवाणी नहीं।",
    notFound: "यह लेख नहीं मिला।",
    sections: {
      India: "भारत",
      World: "विश्व",
      "Science & Technology": "विज्ञान व तकनीक",
      Society: "समाज",
      "Beyond Earth": "पृथ्वी से परे",
    },
    travel: {
      imagining: "इस वर्ष की दुनिया की कल्पना हो रही है…",
      writing: "पहला पन्ना लिखा जा रहा है…",
      slow: "इस बार थोड़ा ज़्यादा समय लग रहा है। कृपया रुके रहिए।",
      opening: "पोर्टल खुल रहा है…",
      failed: "पोर्टल अभी नहीं खुल सका।",
    },
  },
};