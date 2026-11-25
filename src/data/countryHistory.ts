import type { Localized, Source } from "./types";

export interface CountryHistory {
  overview: Localized;
  sections: { key: "origins" | "ancient" | "medieval" | "modern" | "contemporary"; text: Localized }[];
  places: Localized[];
  disputed?: Localized;
  sources: Source[];
}

const L = (en: string, uz: string): Localized => ({ en, uz });
const b = (t: string): Source[] => [{ title: t, publisher: "Encyclopaedia Britannica" }];

/** Curated profiles. Countries not listed show their geography and an honest "not yet written" state. */
export const countryHistory: Record<string, CountryHistory> = {
  UZB: {
    overview: L("At the heart of Central Asia, the lands of modern Uzbekistan — Sogdiana, Bactria and Khwarazm — sat on the Silk Road for over two millennia.", "Markaziy Osiyoning qoq markazida joylashgan bugungi O‘zbekiston hududi — So‘g‘d, Baqtriya va Xorazm — ikki ming yildan ortiq Ipak yo‘lida bo‘lgan."),
    sections: [
      { key: "origins", text: L("Bronze Age oasis settlements developed in the Amu Darya and Zarafshan valleys.", "Bronza davrida Amudaryo va Zarafshon vodiylarida voha manzilgohlari rivojlangan.") },
      { key: "ancient", text: L("Sogdiana and Bactria were Achaemenid satrapies, later conquered by Alexander (329–327 BCE) and partly ruled by the Kushans.", "So‘g‘d va Baqtriya Ahamoniylar satrapiyalari bo‘lgan, keyin Aleksandr tomonidan bosib olingan (mil. avv. 329–327) va qisman Kushonlar hukmronligida bo‘lgan.") },
      { key: "medieval", text: L("After the Arab conquest, Bukhara flourished under the Samanids; Samarkand became Timur's capital in 1370.", "Arab istilosidan so‘ng Buxoro Somoniylar davrida gullab-yashnagan; Samarqand 1370-yilda Temur poytaxtiga aylangan.") },
      { key: "modern", text: L("The khanates of Bukhara, Khiva and Kokand were absorbed by the Russian Empire in the 1860s–1870s.", "Buxoro, Xiva va Qo‘qon xonliklari 1860–1870-yillarda Rossiya imperiyasi tarkibiga qo‘shilgan.") },
      { key: "contemporary", text: L("The Uzbek SSR was formed in 1924; independence was declared on 1 September 1991.", "O‘zbekiston SSR 1924-yilda tuzilgan; mustaqillik 1991-yil 1-sentabrda e’lon qilingan.") },
    ],
    places: [L("Registan, Samarkand", "Registon, Samarqand"), L("Itchan Kala, Khiva", "Ichan qal’a, Xiva"), L("Historic Centre of Bukhara", "Buxoroning tarixiy markazi"), L("Shakhrisabz", "Shahrisabz")],
    sources: [...b("Uzbekistan"), { title: "Samarkand – Crossroad of Cultures", publisher: "UNESCO World Heritage Centre" }],
  },
  EGY: {
    overview: L("Egypt hosts one of the world's oldest continuous civilizations, organised around the Nile.", "Misr Nil atrofida shakllangan dunyodagi eng qadimiy uzluksiz sivilizatsiyalardan biriga ega."),
    sections: [
      { key: "origins", text: L("Predynastic cultures such as Naqada developed along the Nile in the 4th millennium BCE.", "Mil. avv. IV ming yillikda Nil bo‘yida Naqada kabi sulolagacha madaniyatlar rivojlangan.") },
      { key: "ancient", text: L("Pharaonic Egypt lasted from c. 3100 BCE until Roman annexation in 30 BCE.", "Fir’avnlar Misri taxm. mil. avv. 3100-yildan mil. avv. 30-yilda Rimga qo‘shilgunga qadar davom etgan.") },
      { key: "medieval", text: L("Arab conquest (641) was followed by the Fatimids, who founded Cairo in 969, and the Mamluks.", "Arab istilosidan (641) keyin 969-yilda Qohirani barpo etgan Fotimiylar va Mamluklar hukm surgan.") },
      { key: "modern", text: L("Ottoman province from 1517; the Suez Canal opened in 1869; British occupation from 1882.", "1517-yildan Usmonli viloyati; Suvaysh kanali 1869-yilda ochilgan; 1882-yildan Britaniya istilosi.") },
      { key: "contemporary", text: L("Nominal independence in 1922; a republic since 1953.", "1922-yilda rasmiy mustaqillik; 1953-yildan respublika.") },
    ],
    places: [L("Pyramids of Giza", "Giza ehromlari"), L("Karnak, Luxor", "Karnak, Luksor"), L("Historic Cairo", "Tarixiy Qohira")],
    sources: b("Egypt"),
  },
  ITA: {
    overview: L("The Italian peninsula was the centre of the Roman world and later the cradle of the Renaissance.", "Italiya yarimoroli Rim dunyosining markazi, keyinroq esa Uyg‘onish davrining beshigi bo‘lgan."),
    sections: [
      { key: "origins", text: L("Etruscan, Italic and Greek colonial cultures shared the peninsula in the 1st millennium BCE.", "Mil. avv. I ming yillikda yarimorolda etrusk, italik va yunon mustamlaka madaniyatlari mavjud bo‘lgan.") },
      { key: "ancient", text: L("Rome grew from a city-state to rule the Mediterranean; the western empire ended in 476 CE.", "Rim shahar-davlatdan O‘rta yer dengizini boshqaruvchi davlatga aylangan; g‘arbiy imperiya milodiy 476-yilda tugagan.") },
      { key: "medieval", text: L("Divided among Lombards, Byzantines, the Papal States and city republics like Venice and Florence.", "Langobardlar, Vizantiya, Papa davlati hamda Venetsiya va Florensiya kabi shahar-respublikalar o‘rtasida bo‘lingan.") },
      { key: "modern", text: L("The Renaissance began in Florence; unification (Risorgimento) produced the Kingdom of Italy in 1861.", "Uyg‘onish davri Florensiyada boshlangan; birlashuv (Risorjimento) natijasida 1861-yilda Italiya qirolligi tuzilgan.") },
      { key: "contemporary", text: L("Fascist rule 1922–1943; a republic by referendum in 1946; founding member of the EEC.", "1922–1943-yillar fashistlar hukmronligi; 1946-yilda referendum orqali respublika; YEIH asoschilaridan biri.") },
    ],
    places: [L("Colosseum, Rome", "Kolizey, Rim"), L("Pompeii", "Pompey"), L("Historic Centre of Florence", "Florensiyaning tarixiy markazi")],
    sources: b("Italy"),
  },
  IRN: {
    overview: L("Iran's plateau has been home to empires from the Achaemenids to the Safavids, with a rich Persian literary tradition.", "Eron yassitog‘i Ahamoniylardan Safaviylargacha bo‘lgan imperiyalar vatani, boy fors adabiy an’anasiga ega."),
    sections: [
      { key: "origins", text: L("Elam, centred at Susa, was among the earliest states of the region.", "Suza markazli Elam mintaqadagi eng qadimgi davlatlardan biri bo‘lgan.") },
      { key: "ancient", text: L("Achaemenid, Parthian and Sasanian empires ruled from the 6th century BCE to 651 CE.", "Mil. avv. VI asrdan milodiy 651-yilgacha Ahamoniylar, Parfiya va Sosoniylar imperiyalari hukm surgan.") },
      { key: "medieval", text: L("After the Arab conquest, Persian culture revived; Seljuks, Mongols and Timurids followed.", "Arab istilosidan so‘ng fors madaniyati qayta tiklangan; keyin Saljuqiylar, mo‘g‘ullar va Temuriylar kelgan.") },
      { key: "modern", text: L("The Safavids (from 1501) made Twelver Shi'ism the state religion; Qajars ruled 1789–1925.", "Safaviylar (1501-yildan) o‘n ikki imomli shialikni davlat diniga aylantirgan; Qojorlar 1789–1925-yillarda hukm surgan.") },
      { key: "contemporary", text: L("Pahlavi monarchy 1925–1979; the Islamic Republic was established after the 1979 revolution.", "1925–1979-yillar Pahlaviylar monarxiyasi; 1979-yilgi inqilobdan so‘ng Islom Respublikasi tashkil topgan.") },
    ],
    places: [L("Persepolis", "Persepol"), L("Naqsh-e Jahan Square, Isfahan", "Naqshi Jahon maydoni, Isfahon"), L("Pasargadae", "Pasargad")],
    sources: b("Iran"),
  },
  MNG: {
    overview: L("Mongolia's steppe gave rise to successive nomadic empires, culminating in the empire of Genghis Khan.", "Mo‘g‘uliston dashtlari ketma-ket ko‘chmanchi imperiyalarni, eng avvalo Chingizxon imperiyasini vujudga keltirgan."),
    sections: [
      { key: "origins", text: L("Bronze Age herding cultures left deer stones and burial mounds across the steppe.", "Bronza davri chorvador madaniyatlari dasht bo‘ylab bug‘u toshlari va qo‘rg‘onlar qoldirgan.") },
      { key: "ancient", text: L("The Xiongnu confederation (from the 3rd century BCE) rivalled Han China.", "Xunnu ittifoqi (mil. avv. III asrdan) Xan Xitoyi bilan raqobatlashgan.") },
      { key: "medieval", text: L("Temujin united the tribes in 1206; the Mongol Empire became the largest contiguous empire.", "Temuchin 1206-yilda qabilalarni birlashtirgan; Mo‘g‘ul imperiyasi eng yirik yaxlit imperiyaga aylangan.") },
      { key: "modern", text: L("Under Qing rule from the late 17th century; declared independence in 1911.", "XVII asr oxiridan Sin sulolasi hukmronligida; 1911-yilda mustaqillik e’lon qilingan.") },
      { key: "contemporary", text: L("Mongolian People's Republic from 1924; democratic transition in 1990.", "1924-yildan Mo‘g‘uliston Xalq Respublikasi; 1990-yilda demokratik o‘tish.") },
    ],
    places: [L("Orkhon Valley", "O‘rxon vodiysi"), L("Karakorum (Kharkhorin)", "Qoraqurum (Xarxorin)")],
    sources: b("Mongolia"),
  },
  TUR: {
    overview: L("Anatolia bridges Europe and Asia; it was home to the Hittites, Byzantium and the Ottoman Empire.", "Anadolu Yevropa va Osiyoni bog‘laydi; u xettlar, Vizantiya va Usmonli imperiyasi vatani bo‘lgan."),
    sections: [
      { key: "origins", text: L("Göbekli Tepe and Çatalhöyük are among the earliest monumental and urban sites known.", "Go‘bekli-Tepa va Chatalxo‘yuk ma’lum bo‘lgan eng qadimgi monumental va shahar yodgorliklaridan.") },
      { key: "ancient", text: L("The Hittite kingdom, Greek cities of Ionia, and later Roman provinces.", "Xett podsholigi, Ioniya yunon shaharlari, keyinroq Rim viloyatlari.") },
      { key: "medieval", text: L("Byzantine heartland; Seljuk victory at Manzikert (1071); Ottoman rise from c. 1299.", "Vizantiya markazi; Saljuqiylarning Malazgirtdagi g‘alabasi (1071); taxm. 1299-yildan Usmonlilarning yuksalishi.") },
      { key: "modern", text: L("Ottoman capital at Constantinople from 1453; reform and decline in the 19th century.", "1453-yildan Usmonli poytaxti Konstantinopolda; XIX asrda islohotlar va tanazzul.") },
      { key: "contemporary", text: L("The Republic of Turkey was proclaimed on 29 October 1923.", "Turkiya Respublikasi 1923-yil 29-oktabrda e’lon qilingan.") },
    ],
    places: [L("Hagia Sophia, Istanbul", "Ayasofya, Istanbul"), L("Göbekli Tepe", "Go‘bekli-Tepa"), L("Ephesus", "Efes")],
    sources: b("Turkey"),
  },
};
