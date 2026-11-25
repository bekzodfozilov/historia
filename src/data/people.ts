import type { Person } from "./types";

const b = (t: string) => [{ title: t, publisher: "Encyclopaedia Britannica" }];

export const people: Person[] = [
  {
    slug: "ulugh-beg", category: "scientists",
    name: { en: "Ulugh Beg", uz: "Mirzo Ulug‘bek" },
    born: { year: 1394, precision: "year" }, died: { year: 1449, precision: "year" },
    role: { en: "Astronomer, ruler", uz: "Astronom, hukmdor" },
    summary: {
      en: "Timurid ruler of Samarkand who built a great observatory and compiled the Zij-i Sultani star catalogue.",
      uz: "Samarqandda buyuk rasadxona qurgan va «Ziji Ko‘ragoniy» yulduzlar jadvalini tuzgan temuriy hukmdor.",
    },
    sources: b("Ulugh Beg"),
  },
  {
    slug: "al-khwarizmi", category: "scientists",
    name: { en: "Al-Khwarizmi", uz: "Muhammad al-Xorazmiy" },
    born: { year: 780, precision: "circa" }, died: { year: 850, precision: "circa" },
    role: { en: "Mathematician", uz: "Matematik" },
    summary: {
      en: "Scholar of Baghdad's House of Wisdom whose treatise gave us the word 'algebra'; 'algorithm' derives from his name.",
      uz: "Bag‘doddagi «Bayt ul-hikma» olimi; uning risolasi «algebra» so‘ziga, ismi esa «algoritm» atamasiga asos bo‘ldi.",
    },
    sources: b("al-Khwārizmī"),
  },
  {
    slug: "ibn-sina", category: "philosophers",
    name: { en: "Ibn Sina (Avicenna)", uz: "Abu Ali ibn Sino" },
    born: { year: 980, precision: "year" }, died: { year: 1037, precision: "year" },
    role: { en: "Physician, philosopher", uz: "Tabib, faylasuf" },
    summary: {
      en: "Born near Bukhara; his Canon of Medicine remained a standard medical text in Europe and the Islamic world for centuries.",
      uz: "Buxoro yaqinida tug‘ilgan; uning «Tib qonunlari» asari asrlar davomida Yevropa va Islom olamida asosiy tibbiy darslik bo‘lgan.",
    },
    sources: b("Avicenna"),
  },
  {
    slug: "cyrus-the-great", category: "rulers",
    name: { en: "Cyrus the Great", uz: "Kir II (Buyuk Kir)" },
    born: { year: -600, precision: "circa" }, died: { year: -530, precision: "circa" },
    role: { en: "Founder of the Achaemenid Empire", uz: "Ahamoniylar saltanati asoschisi" },
    summary: {
      en: "Conquered Media, Lydia and Babylon; his reign is known from the Cyrus Cylinder and Greek historians.",
      uz: "Midiya, Lidiya va Bobilni zabt etgan; hukmronligi «Kir silindri» va yunon tarixchilari orqali ma’lum.",
    },
    sources: b("Cyrus the Great"),
  },
  {
    slug: "amir-temur", category: "military",
    name: { en: "Timur (Tamerlane)", uz: "Amir Temur" },
    born: { year: 1336, precision: "year" }, died: { year: 1405, precision: "year" },
    role: { en: "Conqueror, founder of the Timurid dynasty", uz: "Sarkarda, Temuriylar sulolasi asoschisi" },
    summary: {
      en: "Built an empire from Samarkand across Central and Western Asia; his campaigns were also among the most destructive of the era.",
      uz: "Samarqanddan Markaziy va G‘arbiy Osiyo bo‘ylab davlat barpo etgan; yurishlari o‘z davrining eng vayronkorlaridan ham bo‘lgan.",
    },
    sources: b("Timur"),
  },
  {
    slug: "leonardo-da-vinci", category: "artists",
    name: { en: "Leonardo da Vinci", uz: "Leonardo da Vinchi" },
    born: { year: 1452, month: 4, day: 15, precision: "day" }, died: { year: 1519, month: 5, day: 2, precision: "day" },
    role: { en: "Painter, engineer", uz: "Rassom, muhandis" },
    summary: {
      en: "Renaissance polymath of the Mona Lisa and The Last Supper, whose notebooks span anatomy, flight and hydraulics.",
      uz: "«Mona Liza» va «So‘nggi kechlik» muallifi, daftarlarida anatomiya, parvoz va gidravlikani o‘rgangan Uyg‘onish davri qomusiy olimi.",
    },
    sources: b("Leonardo da Vinci"),
  },
];
