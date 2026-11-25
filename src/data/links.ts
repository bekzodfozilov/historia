/** Cross-entity relationships (the `relations` table in the backend). */
export const personCountry: Record<string, string> = {
  "ulugh-beg": "UZB", "al-khwarizmi": "UZB", "ibn-sina": "UZB", "amir-temur": "UZB",
  "cyrus-the-great": "IRN", "leonardo-da-vinci": "ITA",
};

export const personCiv: Record<string, string> = {
  "ulugh-beg": "timurid-empire", "amir-temur": "timurid-empire", "cyrus-the-great": "achaemenid-empire",
};

export const relatedPeople: Record<string, string[]> = {
  "ulugh-beg": ["amir-temur", "al-khwarizmi"],
  "amir-temur": ["ulugh-beg"],
  "al-khwarizmi": ["ibn-sina", "ulugh-beg"],
  "ibn-sina": ["al-khwarizmi"],
  "cyrus-the-great": [],
  "leonardo-da-vinci": [],
};

/** Context paragraph for each person. */
export const personContext: Record<string, { en: string; uz: string }> = {
  "ulugh-beg": { en: "Grandson of Timur, he governed Samarkand for about four decades during the reign of his father Shah Rukh.", uz: "Temurning nabirasi; otasi Shohrux hukmronligi davrida qariyb qirq yil Samarqandni boshqargan." },
  "al-khwarizmi": { en: "Worked in Abbasid Baghdad during the translation movement under Caliph al-Ma'mun.", uz: "Xalifa al-Ma’mun davridagi tarjima harakati paytida Abbosiylar Bag‘dodida ishlagan." },
  "ibn-sina": { en: "Lived through the decline of the Samanid state and served several rulers in Iran.", uz: "Somoniylar davlatining tanazzuli davrida yashab, Erondagi bir necha hukmdorga xizmat qilgan." },
  "cyrus-the-great": { en: "Rose in the 6th century BCE when Media, Lydia and Babylon were the region's great powers.", uz: "Mil. avv. VI asrda, Midiya, Lidiya va Bobil mintaqaning yirik davlatlari bo‘lgan paytda yuksalgan." },
  "amir-temur": { en: "Emerged from the fragmented Chagatai Khanate in the 1360s.", uz: "1360-yillarda parchalangan Chig‘atoy ulusi sharoitida maydonga chiqqan." },
  "leonardo-da-vinci": { en: "Worked in Florence, Milan and Rome during the Italian Renaissance, and died in France.", uz: "Italiya Uyg‘onish davrida Florensiya, Milan va Rimda ishlagan, Fransiyada vafot etgan." },
};

/** Events tied to each civilization. */
export const civEvents: Record<string, string[]> = {
  "ancient-egypt": ["unification-of-egypt"],
  "achaemenid-empire": ["founding-of-achaemenid"],
  "roman-empire": ["augustus"],
  "mongol-empire": ["genghis-khan"],
  "timurid-empire": ["samarkand-observatory", "battle-of-ankara"],
  "byzantine-empire": ["fall-of-constantinople", "council-of-nicaea"],
  "ottoman-empire": ["fall-of-constantinople", "battle-of-ankara"],
  "mughal-empire": ["first-battle-of-panipat"],
  "kushan-empire": [],
};
