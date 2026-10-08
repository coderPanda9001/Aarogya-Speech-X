import type {
  AdminUser,
  AiModelCard,
  Appointment,
  Assessment,
  AuditLog,
  Child,
  GameRound,
  Parent,
  PhonemeObservation,
  ProgressPoint,
  Story,
  TherapyMaterial,
  TherapistAccount,
} from "../types";

/* ------------------------------------------------------------------ */
/*  NOTE: All data below is CURATED DEMO DATA for a hackathon MVP.    */
/*  It is not clinically validated and is not derived from real users. */
/* ------------------------------------------------------------------ */

export const CHILDREN: Child[] = [
  {
    id: "c1",
    name: "Aarav",
    hindiName: "आरव",
    age: 6,
    avatar: "🧒",
    targetSound: "र",
    level: "Words",
    progress: 72,
    streakDays: 7,
    therapistId: "t1",
    parentId: "p1",
    needsReview: true,
    sessionsThisWeek: 5,
    weeklyGoal: 6,
  },
  {
    id: "c2",
    name: "Siya",
    hindiName: "सिया",
    age: 5,
    avatar: "👧",
    targetSound: "स",
    level: "Syllables",
    progress: 64,
    streakDays: 4,
    therapistId: "t1",
    parentId: "p2",
    needsReview: false,
    sessionsThisWeek: 4,
    weeklyGoal: 6,
  },
  {
    id: "c3",
    name: "Riya",
    hindiName: "रिया",
    age: 7,
    avatar: "🧑",
    targetSound: "क",
    level: "Sentences",
    progress: 81,
    streakDays: 9,
    therapistId: "t1",
    parentId: "p3",
    needsReview: false,
    sessionsThisWeek: 6,
    weeklyGoal: 6,
  },
  {
    id: "c4",
    name: "Vivaan",
    hindiName: "विवान",
    age: 4,
    avatar: "👶",
    targetSound: "श",
    level: "Sound",
    progress: 45,
    streakDays: 2,
    therapistId: "t2",
    parentId: "p4",
    needsReview: true,
    sessionsThisWeek: 3,
    weeklyGoal: 5,
  },
  {
    id: "c5",
    name: "Meera",
    hindiName: "मीरा",
    age: 8,
    avatar: "👧",
    targetSound: "ल",
    level: "Story",
    progress: 58,
    streakDays: 5,
    therapistId: "t1",
    parentId: "p5",
    needsReview: false,
    sessionsThisWeek: 4,
    weeklyGoal: 5,
  },
];

export const PARENTS: Parent[] = [
  { id: "p1", name: "Sunita Sharma", phone: "+91 98••• ••231", childIds: ["c1"] },
  { id: "p2", name: "Rahul Verma", phone: "+91 99••• ••112", childIds: ["c2"] },
  { id: "p3", name: "Priya Nair", phone: "+91 97••• ••884", childIds: ["c3"] },
  { id: "p4", name: "Amit Chauhan", phone: "+91 96••• ••345", childIds: ["c4"] },
  { id: "p5", name: "Kavita Rao", phone: "+91 95••• ••776", childIds: ["c5"] },
];

export const THERAPISTS: TherapistAccount[] = [
  {
    id: "t1",
    name: "Dr. Neha Kulkarni",
    qualification: "MASLP, Speech-Language Pathologist",
    city: "Pune",
    activeChildren: 4,
  },
  {
    id: "t2",
    name: "Rakesh Menon",
    qualification: "BASLP, Pediatric Therapy",
    city: "Jaipur",
    activeChildren: 1,
  },
];

export const CURRENT_CHILD_ID = "c1";
export const CURRENT_PARENT_ID = "p1";
export const CURRENT_THERAPIST_ID = "t1";

export const MATERIAL_CATEGORIES = [
  { name: "स्वर", emoji: "🔤", count: 21, blurb: "Vowel sounds — अ, आ, इ, ई, उ, ऊ, ऋ, ए, ऐ, ओ, औ dataset" },
  { name: "व्यंजन", emoji: "🧩", count: 60, blurb: "Consonants — Complete क से ह & positional drills dataset" },
  { name: "चित्र अभ्यास", emoji: "🖼️", count: 8, blurb: "Picture naming & visual articulation cards" },
  { name: "शब्द अभ्यास", emoji: "📝", count: 6, blurb: "Targeted initial, medial & final sound drills" },
  { name: "वाक्य अभ्यास", emoji: "💬", count: 5, blurb: "Sentence-level carryover practice" },
  { name: "कहानी", emoji: "📖", count: 4, blurb: "Story-based carryover" },
  { name: "सुनो और बोलो", emoji: "👂", count: 4, blurb: "Listen & repeat acoustic drills" },
  { name: "खेल", emoji: "🎲", count: 5, blurb: "Gamified practice" },
] as const;

export const MATERIALS: TherapyMaterial[] = [
  // --- SWAR (स्वर - Vowels अ से औ) ---
  { id: "m1", word: "अनानास", meaning: "Pineapple [/ə/ vowel initial]", emoji: "🍍", targetSound: "अ", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m2", word: "अनार", meaning: "Pomegranate [/ə/ vowel initial]", emoji: "🍎", targetSound: "अ", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m3", word: "अदरक", meaning: "Ginger [/ə/ vowel initial]", emoji: "🫚", targetSound: "अ", position: "Initial", difficulty: "Medium", category: "स्वर", level: "Words" },
  { id: "m4", word: "आम", meaning: "Mango [/aː/ vowel initial]", emoji: "🥭", targetSound: "आ", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m5", word: "आलू", meaning: "Potato [/aː/ vowel initial]", emoji: "🥔", targetSound: "आ", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m6", word: "इमली", meaning: "Tamarind [/ɪ/ vowel initial]", emoji: "🟤", targetSound: "इ", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m7", word: "इमारत", meaning: "Building [/ɪ/ vowel initial]", emoji: "🏢", targetSound: "इ", position: "Initial", difficulty: "Medium", category: "स्वर", level: "Words" },
  { id: "m8", word: "ईख", meaning: "Sugarcane [/iː/ vowel initial]", emoji: "🎋", targetSound: "ई", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m9", word: "ईंट", meaning: "Brick [/iː/ vowel initial]", emoji: "🧱", targetSound: "ई", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m10", word: "उल्लू", meaning: "Owl [/ʊ/ vowel initial]", emoji: "🦉", targetSound: "उ", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m11", word: "उपहार", meaning: "Gift [/ʊ/ vowel initial]", emoji: "🎁", targetSound: "उ", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m12", word: "ऊन", meaning: "Wool [/uː/ vowel initial]", emoji: "🧶", targetSound: "ऊ", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m13", word: "ऊँट", meaning: "Camel [/uː/ vowel initial]", emoji: "🐪", targetSound: "ऊ", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m14", word: "ऋषि", meaning: "Sage [/r̩/ vocalic r]", emoji: "🧘", targetSound: "ऋ", position: "Initial", difficulty: "Medium", category: "स्वर", level: "Words" },
  { id: "m15", word: "एक", meaning: "One [/eː/ vowel initial]", emoji: "1️⃣", targetSound: "ए", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m16", word: "एड़ी", meaning: "Heel [/eː/ vowel initial]", emoji: "🦶", targetSound: "ए", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m17", word: "ऐनक", meaning: "Spectacles [/ɛː/ vowel initial]", emoji: "👓", targetSound: "ऐ", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m18", word: "ओखली", meaning: "Mortar [/oː/ vowel initial]", emoji: "🥣", targetSound: "ओ", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m19", word: "ओस", meaning: "Dewdrop [/oː/ vowel initial]", emoji: "💧", targetSound: "ओ", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m20", word: "औरत", meaning: "Woman [/ɔː/ vowel initial]", emoji: "👩", targetSound: "औ", position: "Initial", difficulty: "Easy", category: "स्वर", level: "Words" },
  { id: "m21", word: "औजार", meaning: "Tool [/ɔː/ vowel initial]", emoji: "🛠️", targetSound: "औ", position: "Initial", difficulty: "Medium", category: "स्वर", level: "Words" },

  // --- VYANJAN (व्यंजन - Consonants क से ह) ---
  { id: "m22", word: "कबूतर", meaning: "Pigeon [/k/ voiceless velar stop]", emoji: "🐦", targetSound: "क", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m23", word: "कमल", meaning: "Lotus [/k/ voiceless velar stop]", emoji: "🪷", targetSound: "क", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m24", word: "कागज़", meaning: "Paper [/k/ voiceless velar stop]", emoji: "📄", targetSound: "क", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m25", word: "खरगोश", meaning: "Rabbit [/kʰ/ aspirated velar stop]", emoji: "🐇", targetSound: "ख", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m26", word: "खिड़की", meaning: "Window [/kʰ/ aspirated velar stop]", emoji: "🪟", targetSound: "ख", position: "Initial", difficulty: "Medium", category: "व्यंजन", level: "Words" },
  { id: "m27", word: "गमला", meaning: "Flower pot [/ɡ/ voiced velar stop]", emoji: "🪴", targetSound: "ग", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m28", word: "गाजर", meaning: "Carrot [/ɡ/ voiced velar stop]", emoji: "🥕", targetSound: "ग", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m29", word: "घड़ी", meaning: "Clock [/ɡʱ/ aspirated voiced velar]", emoji: "⌚", targetSound: "घ", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m30", word: "घर", meaning: "House [/ɡʱ/ aspirated voiced velar]", emoji: "🏠", targetSound: "घ", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m31", word: "चम्मच", meaning: "Spoon [/c/ voiceless palatal affricate]", emoji: "🥄", targetSound: "च", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m32", word: "चाबी", meaning: "Key [/c/ voiceless palatal affricate]", emoji: "🔑", targetSound: "च", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m33", word: "छाता", meaning: "Umbrella [/cʰ/ aspirated palatal]", emoji: "☂️", targetSound: "छ", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m34", word: "जहाज", meaning: "Ship [/ɟ/ voiced palatal affricate]", emoji: "🚢", targetSound: "ज", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m35", word: "जूता", meaning: "Shoe [/ɟ/ voiced palatal affricate]", emoji: "👞", targetSound: "ज", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m36", word: "झंडा", meaning: "Flag [/ɟʱ/ aspirated voiced palatal]", emoji: "🚩", targetSound: "झ", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m37", word: "टमाटर", meaning: "Tomato [/ʈ/ retroflex stop]", emoji: "🍅", targetSound: "ट", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m38", word: "टोकरी", meaning: "Basket [/ʈ/ retroflex stop]", emoji: "🧺", targetSound: "ट", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m39", word: "ठठेरा", meaning: "Coppersmith [/ʈʰ/ aspirated retroflex]", emoji: "🔨", targetSound: "ठ", position: "Initial", difficulty: "Medium", category: "व्यंजन", level: "Words" },
  { id: "m40", word: "डमरू", meaning: "Pellet drum [/ɖ/ voiced retroflex]", emoji: "🥁", targetSound: "ड", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m41", word: "डिब्बा", meaning: "Box [/ɖ/ voiced retroflex]", emoji: "📦", targetSound: "ड", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m42", word: "ढोलक", meaning: "Dholak [/ɖʱ/ aspirated voiced retroflex]", emoji: "🪘", targetSound: "ढ", position: "Initial", difficulty: "Medium", category: "व्यंजन", level: "Words" },
  { id: "m43", word: "तरबूज", meaning: "Watermelon [/t̪/ dental stop]", emoji: "🍉", targetSound: "त", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m44", word: "तारा", meaning: "Star [/t̪/ dental stop]", emoji: "⭐", targetSound: "त", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m45", word: "थरमस", meaning: "Flask [/t̪ʰ/ aspirated dental]", emoji: "🧴", targetSound: "थ", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m46", word: "दवात", meaning: "Inkpot [/d̪/ voiced dental]", emoji: "✒️", targetSound: "द", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m47", word: "दरवाजा", meaning: "Door [/d̪/ voiced dental]", emoji: "🚪", targetSound: "द", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m48", word: "धनुष", meaning: "Bow [/d̪ʱ/ aspirated voiced dental]", emoji: "🏹", targetSound: "ध", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m49", word: "नल", meaning: "Water Tap [/n/ dental nasal]", emoji: "🚰", targetSound: "न", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m50", word: "नारियल", meaning: "Coconut [/n/ dental nasal]", emoji: "🥥", targetSound: "न", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m51", word: "पतंग", meaning: "Kite [/p/ bilabial stop]", emoji: "🪁", targetSound: "प", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m52", word: "पपीता", meaning: "Papaya [/p/ bilabial stop]", emoji: "🫛", targetSound: "प", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m53", word: "फल", meaning: "Fruits [/pʰ/ aspirated bilabial]", emoji: "🍎", targetSound: "फ", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m54", word: "फूल", meaning: "Flower [/pʰ/ aspirated bilabial]", emoji: "🌸", targetSound: "फ", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m55", word: "बस", meaning: "Bus [/b/ voiced bilabial]", emoji: "🚌", targetSound: "ब", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m56", word: "बिल्ली", meaning: "Cat [/b/ voiced bilabial]", emoji: "🐱", targetSound: "ब", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m57", word: "भालू", meaning: "Bear [/bʱ/ aspirated voiced bilabial]", emoji: "🐻", targetSound: "भ", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m58", word: "मछली", meaning: "Fish [/m/ bilabial nasal]", emoji: "🐟", targetSound: "म", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m59", word: "मोर", meaning: "Peacock [/m/ bilabial nasal]", emoji: "🦚", targetSound: "म", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m60", word: "यज्ञ", meaning: "Yajna [/j/ palatal approximant]", emoji: "🛕", targetSound: "य", position: "Initial", difficulty: "Medium", category: "व्यंजन", level: "Words" },
  { id: "m61", word: "रथ", meaning: "Chariot [/r/ alveolar trill/tap]", emoji: "🛞", targetSound: "र", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m62", word: "राजा", meaning: "King [/r/ alveolar trill/tap]", emoji: "👑", targetSound: "र", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m63", word: "रोटी", meaning: "Flatbread [/r/ alveolar trill]", emoji: "🫓", targetSound: "र", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m64", word: "रस", meaning: "Juice [/r/ alveolar trill]", emoji: "🥤", targetSound: "र", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m65", word: "रुपया", meaning: "Rupee [/r/ initial sound]", emoji: "🪙", targetSound: "र", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m66", word: "रस्सी", meaning: "Rope [/r/ initial sound]", emoji: "🪢", targetSound: "र", position: "Initial", difficulty: "Medium", category: "व्यंजन", level: "Words" },
  { id: "m67", word: "लट्टू", meaning: "Spinning top [/l/ alveolar lateral]", emoji: "🪀", targetSound: "ल", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m68", word: "लड़का", meaning: "Boy [/l/ alveolar lateral]", emoji: "👦", targetSound: "ल", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m69", word: "लोमड़ी", meaning: "Fox [/l/ alveolar lateral]", emoji: "🦊", targetSound: "ल", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m70", word: "लड्डू", meaning: "Sweet treat [/l/ initial]", emoji: "🧆", targetSound: "ल", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m71", word: "वक", meaning: "Crane bird [/v/ labiodental approximant]", emoji: "🦩", targetSound: "व", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m72", word: "वर्षा", meaning: "Rain [/v/ labiodental approximant]", emoji: "🌧️", targetSound: "व", position: "Initial", difficulty: "Medium", category: "व्यंजन", level: "Words" },
  { id: "m73", word: "शलजम", meaning: "Turnip [/ʃ/ voiceless palato-alveolar fricative]", emoji: "🧅", targetSound: "श", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m74", word: "शेर", meaning: "Lion [/ʃ/ palato-alveolar fricative]", emoji: "🦁", targetSound: "श", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m75", word: "षट्कोण", meaning: "Hexagon [/ʂ/ retroflex fricative]", emoji: "🛑", targetSound: "ष", position: "Initial", difficulty: "Medium", category: "व्यंजन", level: "Words" },
  { id: "m76", word: "सपेरा", meaning: "Snake charmer [/s/ alveolar fricative]", emoji: "🐍", targetSound: "स", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m77", word: "सूरज", meaning: "Sun [/s/ alveolar fricative]", emoji: "☀️", targetSound: "स", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m78", word: "सड़क", meaning: "Road [/s/ alveolar fricative]", emoji: "🛣️", targetSound: "स", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m79", word: "सेब", meaning: "Apple [/s/ alveolar fricative]", emoji: "🍎", targetSound: "स", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m80", word: "हाथी", meaning: "Elephant [/ɦ/ glottal fricative]", emoji: "🐘", targetSound: "ह", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },
  { id: "m81", word: "हिरन", meaning: "Deer [/ɦ/ glottal fricative]", emoji: "🦌", targetSound: "ह", position: "Initial", difficulty: "Easy", category: "व्यंजन", level: "Words" },

  // --- CHITRA ABHYAS (चित्र अभ्यास - Picture Naming) ---
  { id: "m82", word: "गुब्बारा", meaning: "Balloon [Visual naming]", emoji: "🎈", targetSound: "ब", position: "Medial", difficulty: "Easy", category: "चित्र अभ्यास", level: "Words" },
  { id: "m83", word: "तितली", meaning: "Butterfly [Visual naming]", emoji: "🦋", targetSound: "ल", position: "Final", difficulty: "Medium", category: "चित्र अभ्यास", level: "Words" },
  { id: "m84", word: "बकरी", meaning: "Goat [Visual naming]", emoji: "🐐", targetSound: "र", position: "Medial", difficulty: "Medium", category: "चित्र अभ्यास", level: "Words" },
  { id: "m85", word: "साइकिल", meaning: "Bicycle [Visual naming]", emoji: "🚲", targetSound: "स", position: "Initial", difficulty: "Medium", category: "चित्र अभ्यास", level: "Words" },
  { id: "m86", word: "किताब", meaning: "Book [Visual naming]", emoji: "📚", targetSound: "क", position: "Initial", difficulty: "Easy", category: "चित्र अभ्यास", level: "Words" },
  { id: "m87", word: "गेंद", meaning: "Ball [Visual naming]", emoji: "⚽", targetSound: "ग", position: "Initial", difficulty: "Easy", category: "चित्र अभ्यास", level: "Words" },
  { id: "m88", word: "जूता", meaning: "Shoes [Visual naming]", emoji: "👟", targetSound: "ज", position: "Initial", difficulty: "Easy", category: "चित्र अभ्यास", level: "Words" },
  { id: "m89", word: "पेड़", meaning: "Tree [Visual naming]", emoji: "🌳", targetSound: "प", position: "Initial", difficulty: "Easy", category: "चित्र अभ्यास", level: "Words" },

  // --- SHABD ABHYAS (शब्द अभ्यास - Targeted Drills) ---
  { id: "m90", word: "अमरूद", meaning: "Guava [/r/ medial sound drill]", emoji: "🍐", targetSound: "र", position: "Medial", difficulty: "Hard", category: "शब्द अभ्यास", level: "Words" },
  { id: "m91", word: "रास्ता", meaning: "Pathway [/r/ initial sound drill]", emoji: "🗺️", targetSound: "र", position: "Initial", difficulty: "Medium", category: "शब्द अभ्यास", level: "Words" },
  { id: "m92", word: "सागर", meaning: "Ocean [/s/ initial & /r/ final]", emoji: "🌊", targetSound: "स", position: "Initial", difficulty: "Medium", category: "शब्द अभ्यास", level: "Words" },
  { id: "m93", word: "पानी", meaning: "Water [/p/ initial sound drill]", emoji: "🚰", targetSound: "प", position: "Initial", difficulty: "Easy", category: "शब्द अभ्यास", level: "Words" },
  { id: "m94", word: "बादल", meaning: "Cloud [/b/ initial & /l/ final]", emoji: "☁️", targetSound: "ल", position: "Final", difficulty: "Medium", category: "शब्द अभ्यास", level: "Words" },
  { id: "m95", word: "कागज", meaning: "Paper [/k/ initial sound drill]", emoji: "📑", targetSound: "क", position: "Initial", difficulty: "Easy", category: "शब्द अभ्यास", level: "Words" },

  // --- VAKYA ABHYAS (वाक्य अभ्यास - Sentences) ---
  { id: "m96", word: "शेर जंगल में रहता है।", meaning: "The lion lives in the forest. [/ʃ/ target]", emoji: "🦁", targetSound: "श", position: "Initial", difficulty: "Hard", category: "वाक्य अभ्यास", level: "Sentences" },
  { id: "m97", word: "रिया रोटी खाती है।", meaning: "Riya eats roti. [/r/ carryover sentence]", emoji: "🍽️", targetSound: "र", position: "Initial", difficulty: "Hard", category: "वाक्य अभ्यास", level: "Sentences" },
  { id: "m98", word: "सूरज पूर्व में उगता है।", meaning: "The sun rises in the east. [/s/ carryover sentence]", emoji: "🌅", targetSound: "स", position: "Initial", difficulty: "Hard", category: "वाक्य अभ्यास", level: "Sentences" },
  { id: "m99", word: "मोर बारिश में खुशी से नाचता है।", meaning: "Peacock dances happily in rain. [/r/ final sentence]", emoji: "🦚", targetSound: "र", position: "Final", difficulty: "Hard", category: "वाक्य अभ्यास", level: "Sentences" },
  { id: "m100", word: "कबूतर ऊँचे आसमान में उड़ता है।", meaning: "Pigeon flies high in the sky.", emoji: "🕊️", targetSound: "क", position: "Initial", difficulty: "Hard", category: "वाक्य अभ्यास", level: "Sentences" },

  // --- SUNO AUR BOLO (सुनो और बोलो - Auditory Repeat) ---
  { id: "m101", word: "स्कूल", meaning: "School [Cluster /sk/ acoustic drill]", emoji: "🏫", targetSound: "स", position: "Initial", difficulty: "Medium", category: "सुनो और बोलो", level: "Words" },
  { id: "m102", word: "घर", meaning: "House [/r/ final acoustic drill]", emoji: "🏠", targetSound: "र", position: "Final", difficulty: "Easy", category: "सुनो और बोलो", level: "Words" },
  { id: "m103", word: "खिलौना", meaning: "Toy [Multisyllabic acoustic drill]", emoji: "🧸", targetSound: "ख", position: "Initial", difficulty: "Medium", category: "सुनो और बोलो", level: "Words" },
  { id: "m104", word: "दोस्त", meaning: "Friend [End cluster drill]", emoji: "🤝", targetSound: "स", position: "Medial", difficulty: "Medium", category: "सुनो और बोलो", level: "Words" }
];

export const PHONEME_OBSERVATIONS: PhonemeObservation[] = [
  { id: "o1", childId: "c1", expected: "र", observed: "ल", errorType: "substitution", confidence: 0.04, word: "रथ", position: "Initial", date: "2026-02-14", needsTherapistReview: true, isDemo: true },
  { id: "o2", childId: "c1", expected: "स", observed: "श", errorType: "substitution", confidence: 0.03, word: "सूरज", position: "Initial", date: "2026-02-13", needsTherapistReview: false, isDemo: true },
  { id: "o3", childId: "c1", expected: "क", observed: "क", errorType: "match", confidence: 0.98, word: "कमल", position: "Initial", date: "2026-02-12", needsTherapistReview: false, isDemo: true },
  { id: "o4", childId: "c2", expected: "स", observed: "श", errorType: "substitution", confidence: 0.04, word: "स्कूल", position: "Initial", date: "2026-02-14", needsTherapistReview: false, isDemo: true },
  { id: "o5", childId: "c2", expected: "ल", observed: "य", errorType: "substitution", confidence: 0.02, word: "मछली", position: "Medial", date: "2026-02-11", needsTherapistReview: false, isDemo: true },
  { id: "o6", childId: "c3", expected: "र", observed: "र", errorType: "match", confidence: 0.97, word: "राजा", position: "Initial", date: "2026-02-14", needsTherapistReview: false, isDemo: true },
  { id: "o7", childId: "c4", expected: "श", observed: "स", errorType: "substitution", confidence: 0.01, word: "शेर", position: "Initial", date: "2026-02-13", needsTherapistReview: true, isDemo: true },
  { id: "o8", childId: "c5", expected: "ल", observed: "न", errorType: "substitution", confidence: 0.03, word: "गमला", position: "Final", date: "2026-02-10", needsTherapistReview: false, isDemo: true },
];

export const CONFUSION_LABELS = ["र", "ल", "स"];

export const CONFUSION_MATRIX: number[][] = [
  [8, 3, 0],
  [1, 7, 0],
  [0, 1, 9],
];

export const PROGRESS_HISTORY: ProgressPoint[] = [
  { label: "Week 1", accuracy: 38, attempts: 12, minutes: 44 },
  { label: "Week 2", accuracy: 45, attempts: 16, minutes: 52 },
  { label: "Week 3", accuracy: 51, attempts: 21, minutes: 61 },
  { label: "Week 4", accuracy: 58, attempts: 25, minutes: 70 },
  { label: "Week 5", accuracy: 62, attempts: 28, minutes: 66 },
  { label: "Week 6", accuracy: 69, attempts: 33, minutes: 78 },
  { label: "Week 7", accuracy: 72, attempts: 36, minutes: 84 },
];

export const WEEKLY_PRACTICE = [
  { day: "सोम", minutes: 12, score: 58 },
  { day: "मंगल", minutes: 18, score: 64 },
  { day: "बुध", minutes: 9, score: 61 },
  { day: "गुरु", minutes: 22, score: 71 },
  { day: "शुक्र", minutes: 16, score: 74 },
  { day: "शनि", minutes: 24, score: 78 },
  { day: "रवि", minutes: 14, score: 72 },
];

export const ASSESSMENTS: Assessment[] = [
  { id: "a1", childId: "c1", name: "Initial Consonant Inventory (Hindi)", score: 34, maxScore: 50, date: "2026-02-14", status: "In Progress" },
  { id: "a2", childId: "c1", name: "र Sound Baseline Screener", score: 22, maxScore: 30, date: "2026-01-28", status: "Completed" },
  { id: "a3", childId: "c3", name: "Sentence Repetition Task", score: 41, maxScore: 50, date: "2026-02-09", status: "Completed" },
  { id: "a4", childId: "c4", name: "श Sound Baseline Screener", score: 12, maxScore: 30, date: "2026-02-02", status: "Completed" },
];

export const APPOINTMENTS: Appointment[] = [
  { id: "ap1", childId: "c1", therapistId: "t1", date: "16 Feb 2026", time: "05:00 PM", mode: "Video", status: "Confirmed" },
  { id: "ap2", childId: "c2", therapistId: "t1", date: "16 Feb 2026", time: "06:15 PM", mode: "In-clinic", status: "Confirmed" },
  { id: "ap3", childId: "c3", therapistId: "t1", date: "17 Feb 2026", time: "04:30 PM", mode: "Video", status: "Pending" },
  { id: "ap4", childId: "c1", therapistId: "t1", date: "23 Feb 2026", time: "05:00 PM", mode: "Video", status: "Pending" },
];

export const STORIES: Story[] = [
  {
    id: "s1",
    title: "रिया और लाल रथ",
    targetSound: "र",
    level: "Story",
    emoji: "🛞",
    sentences: [
      { hi: "रिया के पास एक लाल रथ है।", transliteration: "Riya ke paas ek laal rath hai.", targetWords: ["रिया", "रथ"] },
      { hi: "रथ बहुत सुंदर और मज़ेदार है।", transliteration: "Rath bahut sundar aur mazedaar hai.", targetWords: ["रथ"] },
      { hi: "रिया रोज़ रथ से खेलती है।", transliteration: "Riya roz rath se khelti hai.", targetWords: ["रिया", "रोज़", "रथ"] },
      { hi: "रोटी खाने के बाद रिया रथ चलाती है।", transliteration: "Roti khaane ke baad Riya rath chalati hai.", targetWords: ["रोटी", "रिया", "रथ"] },
      { hi: "सूरज ढलने पर रिया रथ रोक देती है।", transliteration: "Sooraj dhalne par Riya rath rok deti hai.", targetWords: ["सूरज", "रिया", "रथ", "रोक"] },
      { hi: "रिया अपने रथ से बहुत खुश रहती है।", transliteration: "Riya apne rath se bahut khush rahti hai.", targetWords: ["रिया", "रथ"] },
    ],
  },
  {
    id: "s2",
    title: "सोनी और सूरजमुखी",
    targetSound: "स",
    level: "Story",
    emoji: "🌻",
    sentences: [
      { hi: "सोनी के आँगन में सूरजमुखी उगी।", transliteration: "Soni ke aangan mein soorajmukhi ugi.", targetWords: ["सोनी", "सूरजमुखी"] },
      { hi: "सुबह सूरज निकलता है।", transliteration: "Subah sooraj nikalta hai.", targetWords: ["सुबह", "सूरज"] },
      { hi: "सोनी रोज़ पानी देती है।", transliteration: "Soni roz paani deti hai.", targetWords: ["सोनी", "रोज़"] },
    ],
  },
];

export const GAME_ROUNDS: GameRound[] = [
  {
    id: "g1",
    word: "रथ",
    emoji: "🛞",
    targetSound: "र",
    options: [
      { emoji: "🚗", label: "गाड़ी", correct: false },
      { emoji: "🐎", label: "घोड़ा", correct: true },
      { emoji: "🛒", label: "गाड़ी", correct: false },
    ],
  },
  {
    id: "g2",
    word: "सूरज",
    emoji: "☀️",
    targetSound: "स",
    options: [
      { emoji: "🌙", label: "चाँद", correct: false },
      { emoji: "⭐", label: "तारा", correct: false },
      { emoji: "☀️", label: "सूरज", correct: true },
    ],
  },
  {
    id: "g3",
    word: "शेर",
    emoji: "🦁",
    targetSound: "श",
    options: [
      { emoji: "🦁", label: "शेर", correct: true },
      { emoji: "🐘", label: "हाथी", correct: false },
      { emoji: "🐒", label: "बंदर", correct: false },
    ],
  },
  {
    id: "g4",
    word: "कमल",
    emoji: "🪷",
    targetSound: "क",
    options: [
      { emoji: "🌹", label: "गुलाब", correct: false },
      { emoji: "🪷", label: "कमल", correct: true },
      { emoji: "🌻", label: "सूरजमुखी", correct: false },
    ],
  },
  {
    id: "g5",
    word: "मछली",
    emoji: "🐟",
    targetSound: "ल",
    options: [
      { emoji: "🐟", label: "मछली", correct: true },
      { emoji: "🐢", label: "कछुआ", correct: false },
      { emoji: "🦆", label: "बतख", correct: false },
    ],
  },
];

export const SPEECH_PROFILE_RADAR = [
  { skill: "Sound Production", score: 72 },
  { skill: "Word Practice", score: 78 },
  { skill: "Sentence Practice", score: 61 },
  { skill: "Story Practice", score: 54 },
  { skill: "Conversation", score: 47 },
  { skill: "Consistency", score: 68 },
];

export const ADMIN_STATS = {
  children: 1284,
  parents: 1109,
  therapists: 46,
  sessions: 8341,
  contentItems: 320,
  assessments: 2176,
};

export const ADMIN_ACTIVITY = [
  { label: "सोम", sessions: 210, assessments: 42 },
  { label: "मंगल", sessions: 265, assessments: 51 },
  { label: "बुध", sessions: 198, assessments: 38 },
  { label: "गुरु", sessions: 312, assessments: 66 },
  { label: "शुक्र", sessions: 340, assessments: 71 },
  { label: "शनि", sessions: 402, assessments: 88 },
  { label: "रवि", sessions: 288, assessments: 54 },
];

export const MOST_PRACTICED_SOUNDS = [
  { sound: "र", count: 1840, percent: 92 },
  { sound: "स", count: 1430, percent: 78 },
  { sound: "क", count: 1120, percent: 66 },
  { sound: "श", count: 880, percent: 54 },
  { sound: "ल", count: 640, percent: 41 },
];

export const CONTENT_USAGE = [
  { name: "चित्र अभ्यास", value: 32, color: "#0d8d8a" },
  { name: "शब्द अभ्यास", value: 26, color: "#38cbc4" },
  { name: "कहानी", value: 18, color: "#7c9cf5" },
  { name: "खेल", value: 14, color: "#f59e0b" },
  { name: "वाक्य अभ्यास", value: 10, color: "#a78bfa" },
];

export const ADMIN_USERS: AdminUser[] = [
  { id: "u1", name: "Aarav Sharma", role: "child", email: "aarav@demo.in", status: "Active", joined: "12 Jan 2026" },
  { id: "u2", name: "Sunita Sharma", role: "parent", email: "sunita@demo.in", status: "Active", joined: "12 Jan 2026" },
  { id: "u3", name: "Dr. Neha Kulkarni", role: "therapist", email: "neha@demo.in", status: "Active", joined: "04 Jan 2026" },
  { id: "u4", name: "Rakesh Menon", role: "therapist", email: "rakesh@demo.in", status: "Invited", joined: "01 Feb 2026" },
  { id: "u5", name: "Kavita Rao", role: "parent", email: "kavita@demo.in", status: "Active", joined: "22 Jan 2026" },
  { id: "u6", name: "Vivaan Chauhan", role: "child", email: "vivaan@demo.in", status: "Suspended", joined: "02 Feb 2026" },
];

export const AI_MODELS: AiModelCard[] = [
  {
    id: "ai1",
    name: "Phoneme Recognizer (Hindi)",
    purpose: "Audio → phoneme sequence for Hindi syllables and words",
    status: "Demo / simulated",
    accuracy: "— (not measured)",
    version: "demo-0.1",
  },
  {
    id: "ai2",
    name: "Misarticulation Classifier",
    purpose: "Flag substitution / omission / distortion patterns",
    status: "Prototype",
    accuracy: "— (not measured)",
    version: "demo-0.1",
  },
  {
    id: "ai3",
    name: "Recommendation Engine",
    purpose: "Rule-based therapy ladder recommendation (no LLM)",
    status: "Planned",
    accuracy: "rule-based",
    version: "0.1",
  },
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: "l1", actor: "Dr. Neha Kulkarni", action: "Reviewed AI analysis", target: "Aarav • रथ (र → ल)", at: "Today, 4:12 PM" },
  { id: "l2", actor: "System", action: "Practice attempt recorded", target: "Aarav • सूरज", at: "Today, 3:48 PM" },
  { id: "l3", actor: "Sunita Sharma", action: "Viewed child progress", target: "Aarav", at: "Today, 1:05 PM" },
  { id: "l4", actor: "Admin", action: "Published Hindi content", target: "कहानी • रिया और लाल रथ", at: "Yesterday, 6:20 PM" },
  { id: "l5", actor: "System", action: "Assessment scheduled", target: "Vivaan • श baseline", at: "Yesterday, 11:02 AM" },
];

export const RECOMMENDED_ACTIVITIES = [
  { title: "चित्र अभ्यास", detail: "Picture naming with target sound", emoji: "🖼️", route: "/child/materials" },
  { title: "सुनो और बोलो", detail: "Listen & repeat with model voice", emoji: "👂", route: "/child/therapy" },
  { title: "टार्गेट साउंड चैलेंज", detail: "Target sound challenge game", emoji: "🎯", route: "/child/game" },
  { title: "हिंदी कहानी", detail: "Story carryover practice", emoji: "📖", route: "/child/story" },
];
