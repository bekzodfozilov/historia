import type { Civilization } from "./types";

const britannica = (t: string) => ({ title: t, publisher: "Encyclopaedia Britannica" });

export const civilizations: Civilization[] = [
  {
    slug: "ancient-egypt", glyph: "𓂀",
    name: { en: "Ancient Egypt", uz: "Qadimgi Misr" },
    start: { year: -3100, precision: "circa" }, end: { year: -30, precision: "year" },
    region: { en: "Nile Valley, North Africa", uz: "Nil vodiysi, Shimoliy Afrika" },
    capital: { en: "Memphis, later Thebes", uz: "Memfis, keyinroq Fiva" },
    summary: {
      en: "From the unification of Upper and Lower Egypt to the Roman annexation after Cleopatra VII — three millennia of pharaonic rule along the Nile.",
      uz: "Yuqori va Quyi Misrning birlashuvidan Kleopatra VII dan so‘ng Rim tomonidan qo‘shib olinishigacha — Nil bo‘yidagi uch ming yillik fir’avnlar hukmronligi.",
    },
    disputed: {
      en: "The exact date of unification is debated; estimates range c. 3200–3000 BCE.",
      uz: "Birlashuvning aniq sanasi bahsli; taxminlar mil. avv. 3200–3000-yillar oralig‘ida.",
    },
    sources: [britannica("Ancient Egypt")],
  },
  {
    slug: "achaemenid-empire", glyph: "Π",
    name: { en: "Achaemenid Persian Empire", uz: "Ahamoniylar saltanati" },
    start: { year: -550, precision: "circa" }, end: { year: -330, precision: "year" },
    region: { en: "Iranian Plateau to the Indus and Aegean", uz: "Eron yassitog‘idan Hind va Egey dengizigacha" },
    capital: { en: "Pasargadae, Persepolis, Susa", uz: "Pasargad, Persepol, Suza" },
    peakAreaMkm2: 5.5,
    summary: {
      en: "Founded by Cyrus the Great, it governed through satrapies and a royal road network, uniting peoples from Egypt to Central Asia.",
      uz: "Kir II (Buyuk Kir) asos solgan saltanat satrapiyalar va shoh yo‘llari orqali Misrdan Markaziy Osiyogacha bo‘lgan xalqlarni birlashtirgan.",
    },
    sources: [britannica("Achaemenian dynasty")],
  },
  {
    slug: "roman-empire", glyph: "SPQR",
    name: { en: "Roman Empire", uz: "Rim imperiyasi" },
    start: { year: -27, precision: "year" }, end: { year: 476, precision: "year" },
    region: { en: "Mediterranean basin", uz: "O‘rta yer dengizi havzasi" },
    capital: { en: "Rome", uz: "Rim" },
    peakAreaMkm2: 5,
    summary: {
      en: "From Augustus to the deposition of the last western emperor; its law, roads and Latin shaped Europe long after its fall.",
      uz: "Avgustdan so‘nggi g‘arbiy imperator taxtdan tushirilgunga qadar; uning huquqi, yo‘llari va lotin tili Yevropani asrlar davomida shakllantirdi.",
    },
    disputed: {
      en: "476 CE marks the end of the Western Empire only; the Eastern (Byzantine) Empire lasted until 1453.",
      uz: "Milodiy 476-yil faqat G‘arbiy imperiyaning tugashini bildiradi; Sharqiy (Vizantiya) imperiyasi 1453-yilgacha davom etgan.",
    },
    sources: [britannica("Roman Empire")],
  },
  {
    slug: "kushan-empire", glyph: "K",
    name: { en: "Kushan Empire", uz: "Kushon podsholigi" },
    start: { year: 30, precision: "circa" }, end: { year: 375, precision: "circa" },
    region: { en: "Bactria, Gandhara, northern India", uz: "Baqtriya, Gandxara, Shimoliy Hindiston" },
    capital: { en: "Purushapura (Peshawar), Mathura", uz: "Purushapura (Peshovar), Matxura" },
    summary: {
      en: "A Silk Road power that connected Han China, Parthia and Rome, and a key patron of Gandharan Buddhist art.",
      uz: "Xan Xitoyi, Parfiya va Rimni bog‘lagan Buyuk ipak yo‘li davlati, Gandxara buddaviy san’atining muhim homiysi.",
    },
    disputed: {
      en: "The chronology of Kanishka's reign is disputed; 127 CE is the most widely cited start.",
      uz: "Kanishka hukmronligi xronologiyasi bahsli; eng ko‘p keltiriladigan boshlanish sanasi — milodiy 127-yil.",
    },
    sources: [britannica("Kushan dynasty")],
  },
  {
    slug: "mongol-empire", glyph: "ᠮ",
    name: { en: "Mongol Empire", uz: "Mo‘g‘ul imperiyasi" },
    start: { year: 1206, precision: "year" }, end: { year: 1368, precision: "year" },
    region: { en: "Eurasian steppe, China to Eastern Europe", uz: "Yevroosiyo dashtlari, Xitoydan Sharqiy Yevropagacha" },
    capital: { en: "Karakorum, later Khanbaliq", uz: "Qoraqurum, keyinroq Xonboliq" },
    peakAreaMkm2: 24,
    summary: {
      en: "The largest contiguous land empire in history, proclaimed under Genghis Khan in 1206.",
      uz: "Tarixdagi eng yirik yaxlit quruqlik imperiyasi; 1206-yilda Chingizxon boshchiligida e’lon qilingan.",
    },
    disputed: {
      en: "End dates vary: 1294 (fragmentation into khanates) or 1368 (fall of the Yuan).",
      uz: "Tugash sanasi turlicha: 1294 (xonliklarga bo‘linish) yoki 1368 (Yuan sulolasining qulashi).",
    },
    sources: [britannica("Mongol empire")],
  },
  {
    slug: "timurid-empire", glyph: "ت",
    name: { en: "Timurid Empire", uz: "Temuriylar davlati" },
    start: { year: 1370, precision: "year" }, end: { year: 1507, precision: "year" },
    region: { en: "Central Asia, Iran, Afghanistan", uz: "Markaziy Osiyo, Eron, Afg‘oniston" },
    capital: { en: "Samarkand, later Herat", uz: "Samarqand, keyinroq Hirot" },
    summary: {
      en: "Founded by Amir Temur; under Shah Rukh and Ulugh Beg, Samarkand and Herat became centres of astronomy, architecture and Persianate art.",
      uz: "Amir Temur asos solgan; Shohrux va Ulug‘bek davrida Samarqand va Hirot astronomiya, me’morchilik va san’at markazlariga aylandi.",
    },
    sources: [britannica("Timurid dynasty")],
  },
  {
    slug: "byzantine-empire", glyph: "Β",
    name: { en: "Byzantine Empire", uz: "Vizantiya imperiyasi" },
    start: { year: 330, precision: "year" }, end: { year: 1453, precision: "year" },
    region: { en: "Eastern Mediterranean, Anatolia, Balkans", uz: "Sharqiy O‘rta yer dengizi, Anadolu, Bolqon" },
    capital: { en: "Constantinople", uz: "Konstantinopol" },
    summary: {
      en: "The eastern continuation of Rome, centred on Constantinople, until its capture by the Ottomans in 1453.",
      uz: "Rimning sharqiy davomchisi; 1453-yilda Usmonlilar tomonidan egallangunga qadar Konstantinopol markaz bo‘lgan.",
    },
    sources: [britannica("Byzantine Empire")],
  },
  {
    slug: "ottoman-empire", glyph: "☾",
    name: { en: "Ottoman Empire", uz: "Usmonli imperiyasi" },
    start: { year: 1299, precision: "circa" }, end: { year: 1922, precision: "year" },
    region: { en: "Anatolia, Balkans, Middle East, North Africa", uz: "Anadolu, Bolqon, Yaqin Sharq, Shimoliy Afrika" },
    capital: { en: "Bursa, Edirne, Constantinople", uz: "Bursa, Edirne, Istanbul" },
    summary: {
      en: "A dynasty that ruled for over six centuries, bridging Europe, Asia and Africa until its abolition in 1922.",
      uz: "Olti asrdan ortiq hukm surgan, 1922-yilda tugatilgunga qadar Yevropa, Osiyo va Afrikani bog‘lagan sulola.",
    },
    sources: [britannica("Ottoman Empire")],
  },
  {
    slug: "mughal-empire", glyph: "م",
    name: { en: "Mughal Empire", uz: "Boburiylar imperiyasi" },
    start: { year: 1526, precision: "year" }, end: { year: 1857, precision: "year" },
    region: { en: "Indian subcontinent", uz: "Hindiston yarimoroli" },
    capital: { en: "Agra, Fatehpur Sikri, Delhi", uz: "Agra, Fatehpur-Sikri, Dehli" },
    summary: {
      en: "Founded by Babur of Andijan after the First Battle of Panipat; patron of the Taj Mahal and Indo-Persian culture.",
      uz: "Andijonlik Bobur tomonidan Panipatdagi birinchi jangdan so‘ng asos solingan; Tojmahal va hind-fors madaniyatining homiysi.",
    },
    sources: [britannica("Mughal dynasty")],
  },
];
