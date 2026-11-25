import type { Localized } from "./types";

export interface CivProfile {
  countries: string[]; // modern states (ISO alpha-3) covering the core territory — approximate
  rulers: Localized[];
  political: Localized; economy: Localized; culture: Localized;
  military: Localized; achievements: Localized; decline: Localized;
}

const L = (en: string, uz: string): Localized => ({ en, uz });

export const civProfiles: Record<string, CivProfile> = {
  "ancient-egypt": {
    countries: ["EGY", "SDN"],
    rulers: [L("Narmer", "Narmer"), L("Khufu", "Xufu"), L("Hatshepsut", "Xatshepsut"), L("Ramesses II", "Ramzes II"), L("Cleopatra VII", "Kleopatra VII")],
    political: L("Divine kingship: the pharaoh ruled as intermediary between gods and people, supported by viziers and provincial nomarchs.", "Ilohiy podsholik: fir’avn xudolar va xalq o‘rtasidagi vositachi sifatida vazirlar va nomarxlar yordamida boshqargan."),
    economy: L("Irrigated agriculture on the annual Nile flood; grain stored and redistributed by the state.", "Nilning yillik toshqiniga tayangan sug‘orma dehqonchilik; g‘alla davlat tomonidan saqlanib, taqsimlangan."),
    culture: L("Hieroglyphic writing, monumental temples and tombs, an elaborate belief in the afterlife.", "Iyeroglif yozuvi, ulkan ibodatxona va maqbaralar, oxiratga oid murakkab e’tiqod."),
    military: L("Chariot armies of the New Kingdom extended power into the Levant and Nubia.", "Yangi podsholik davridagi jang aravalari qo‘shini hokimiyatni Levant va Nubiyagacha kengaytirgan."),
    achievements: L("The pyramids of Giza, a 365-day civil calendar, advances in medicine and surveying.", "Giza ehromlari, 365 kunlik fuqarolik taqvimi, tibbiyot va yer o‘lchash sohasidagi yutuqlar."),
    decline: L("Foreign rule by Persians and Macedonians; the Ptolemaic line ended with Roman annexation in 30 BCE.", "Forslar va makedoniyaliklar hukmronligi; Ptolemeylar sulolasi mil. avv. 30-yilda Rim tomonidan qo‘shib olinishi bilan tugagan."),
  },
  "achaemenid-empire": {
    countries: ["IRN", "IRQ", "TUR", "EGY", "AFG", "UZB", "TKM", "TJK", "PAK", "SYR", "JOR", "ISR", "LBN", "ARM", "AZE"],
    rulers: [L("Cyrus II", "Kir II"), L("Cambyses II", "Kambiz II"), L("Darius I", "Doro I"), L("Xerxes I", "Kserks I"), L("Darius III", "Doro III")],
    political: L("Provinces (satrapies) governed by satraps, linked by the Royal Road and royal inspectors.", "Satraplar boshqargan viloyatlar (satrapiyalar), Shoh yo‘li va qirol nozirlari orqali bog‘langan."),
    economy: L("Standardised coinage (the daric), tribute in kind and silver, long-distance trade.", "Yagona tanga (darik), natura va kumush shaklidagi soliq, uzoq masofali savdo."),
    culture: L("Multilingual administration (Old Persian, Elamite, Aramaic); palaces of Persepolis.", "Ko‘p tilli boshqaruv (qadimgi fors, elam, oromiy); Persepol saroylari."),
    military: L("Core of Persian infantry and cavalry with contingents from subject peoples.", "Fors piyoda va otliq askarlari hamda tobe xalqlar qo‘shinlaridan iborat armiya."),
    achievements: L("The Royal Road, qanat irrigation, a model of governing diverse peoples.", "Shoh yo‘li, koriz sug‘orish tizimi, turli xalqlarni boshqarish namunasi."),
    decline: L("Conquered by Alexander of Macedon; Darius III died in 330 BCE.", "Makedoniyalik Aleksandr tomonidan bosib olingan; Doro III mil. avv. 330-yilda halok bo‘lgan."),
  },
  "roman-empire": {
    countries: ["ITA", "FRA", "ESP", "PRT", "GRC", "TUR", "EGY", "TUN", "GBR", "SYR", "DEU", "HRV", "BGR", "ROU"],
    rulers: [L("Augustus", "Avgust"), L("Trajan", "Trayan"), L("Hadrian", "Adrian"), L("Diocletian", "Diokletian"), L("Constantine I", "Konstantin I")],
    political: L("An emperor (princeps) ruling alongside a Senate, with provinces under governors.", "Senat bilan birga hukm surgan imperator (prinseps), viloyatlar esa noiblar boshqaruvida."),
    economy: L("Mediterranean trade, slavery-based agriculture, a common silver and gold coinage.", "O‘rta yer dengizi savdosi, qul mehnatiga asoslangan dehqonchilik, umumiy kumush va oltin tangalar."),
    culture: L("Latin literature, Roman law, urban life with forums, baths and amphitheatres.", "Lotin adabiyoti, Rim huquqi, forum, hammom va amfiteatrlarga ega shahar hayoti."),
    military: L("Professional legions and auxiliaries guarding fortified frontiers (limes).", "Mustahkam chegaralarni (limes) qo‘riqlagan professional legionlar va yordamchi qo‘shinlar."),
    achievements: L("Roads, aqueducts, concrete architecture, a legal tradition still taught today.", "Yo‘llar, akveduklar, beton me’morchiligi, bugungacha o‘qitiladigan huquq an’anasi."),
    decline: L("Internal crises and migrations; the western empire ended in 476 CE.", "Ichki inqirozlar va ko‘chishlar; g‘arbiy imperiya milodiy 476-yilda tugagan."),
  },
  "kushan-empire": {
    countries: ["AFG", "PAK", "IND", "UZB", "TJK"],
    rulers: [L("Kujula Kadphises", "Kujula Kadfiz"), L("Vima Kadphises", "Vima Kadfiz"), L("Kanishka I", "Kanishka I"), L("Huvishka", "Xuvishka"), L("Vasudeva I", "Vasudeva I")],
    political: L("A monarchy of Yuezhi origin with kings using titles from Greek, Indian and Iranian traditions.", "Yuechji kelib chiqishli monarxiya; podsholar yunon, hind va eron an’analaridagi unvonlardan foydalangan."),
    economy: L("Control of Silk Road routes; abundant gold coinage.", "Ipak yo‘li yo‘nalishlari ustidan nazorat; ko‘p miqdorda oltin tangalar."),
    culture: L("Gandharan and Mathura art; spread of Mahayana Buddhism towards Central Asia and China.", "Gandxara va Matxura san’ati; Mahayana buddizmining Markaziy Osiyo va Xitoyga tarqalishi."),
    military: L("Cavalry-based armies drawing on steppe traditions.", "Dasht an’analariga tayangan otliq qo‘shinlar."),
    achievements: L("Early images of the Buddha; the Rabatak inscription in the Bactrian language.", "Buddaning ilk tasvirlari; baqtriya tilidagi Rabatak bitigi."),
    decline: L("Lost western territories to the Sasanians in the 3rd century; later fragmented.", "III asrda g‘arbiy hududlarini Sosoniylarga boy bergan; keyinroq parchalangan."),
  },
  "mongol-empire": {
    countries: ["MNG", "CHN", "RUS", "KAZ", "UZB", "IRN", "IRQ", "KOR", "AFG", "UKR", "TKM", "KGZ"],
    rulers: [L("Genghis Khan", "Chingizxon"), L("Ögedei", "O‘qtoy"), L("Möngke", "Munke"), L("Kublai", "Xubilay")],
    political: L("A great khan elected by the kurultai; later divided into the Yuan, Ilkhanate, Chagatai and Golden Horde.", "Qurultoy saylagan buyuk xon; keyinroq Yuan, Elxoniylar, Chig‘atoy ulusi va Oltin O‘rdaga bo‘lingan."),
    economy: L("Tribute, protected trade across Eurasia, the yam relay-post system.", "O‘lpon, Yevroosiyo bo‘ylab himoyalangan savdo, yam pochta tizimi."),
    culture: L("Religious tolerance, exchange of artisans and scholars across the empire.", "Diniy bag‘rikenglik, imperiya bo‘ylab hunarmand va olimlar almashinuvi."),
    military: L("Mounted archers in decimal units, mobility and siege expertise from conquered peoples.", "O‘nlik tizimdagi otliq kamonchilar, harakatchanlik va bosib olingan xalqlardan olingan qamal mahorati."),
    achievements: L("Integration of Eurasian trade (the 'Pax Mongolica').", "Yevroosiyo savdosining birlashuvi («Pax Mongolica»)."),
    decline: L("Succession disputes split the empire; the Yuan fell in 1368.", "Taxt uchun nizolar imperiyani bo‘lib yuborgan; Yuan 1368-yilda qulagan."),
  },
  "timurid-empire": {
    countries: ["UZB", "IRN", "AFG", "TKM", "TJK"],
    rulers: [L("Timur", "Amir Temur"), L("Shah Rukh", "Shohrux"), L("Ulugh Beg", "Mirzo Ulug‘bek"), L("Husayn Bayqara", "Husayn Boyqaro")],
    political: L("Rule by Timur's descendants as amirs and sultans, legitimised through Chinggisid marriage ties.", "Temur avlodlari amir va sultonlar sifatida hukm surgan; chingiziylar bilan qarindoshlik orqali qonuniylashtirilgan."),
    economy: L("Caravan trade and craft production concentrated in Samarkand and Herat.", "Samarqand va Hirotda jamlangan karvon savdosi va hunarmandchilik."),
    culture: L("Persian and Chagatai literature, miniature painting, the poetry of Alisher Navoi.", "Fors va chig‘atoy adabiyoti, miniatyura san’ati, Alisher Navoiy she’riyati."),
    military: L("Timur's campaigns reached Delhi, Damascus and Ankara (1402).", "Temur yurishlari Dehli, Damashq va Anqaragacha (1402) yetgan."),
    achievements: L("Registan-era architecture, Gur-e-Amir, Ulugh Beg's star catalogue.", "Registon me’morchiligi, Go‘ri Amir, Ulug‘bek yulduzlar jadvali."),
    decline: L("Fragmentation among princes; Herat fell to the Shaybanids in 1507.", "Shahzodalar o‘rtasida parchalanish; Hirot 1507-yilda Shayboniylarga o‘tgan."),
  },
  "byzantine-empire": {
    countries: ["TUR", "GRC", "BGR", "EGY", "SYR", "ITA"],
    rulers: [L("Constantine I", "Konstantin I"), L("Justinian I", "Yustinian I"), L("Basil II", "Vasiliy II"), L("Constantine XI", "Konstantin XI")],
    political: L("An autocratic emperor with a large bureaucracy, closely tied to the Orthodox Church.", "Pravoslav cherkovi bilan chambarchas bog‘liq, katta byurokratiyaga ega mutlaq imperator."),
    economy: L("Constantinople as a trade hub; the gold solidus as a stable currency for centuries.", "Konstantinopol savdo markazi; oltin solid asrlar davomida barqaror valyuta bo‘lgan."),
    culture: L("Greek-language scholarship, icons and mosaics, Hagia Sophia.", "Yunon tilidagi ilm, ikona va mozaikalar, Ayasofya."),
    military: L("Thematic armies, fortifications and 'Greek fire' at sea.", "Fema qo‘shinlari, istehkomlar va dengizda «yunon olovi»."),
    achievements: L("The Justinian Code; preservation of classical Greek texts.", "Yustinian kodeksi; mumtoz yunon matnlarini saqlab qolish."),
    decline: L("Losses to Seljuks, the Fourth Crusade (1204), and the Ottoman conquest in 1453.", "Saljuqiylarga yo‘qotishlar, To‘rtinchi salib yurishi (1204) va 1453-yildagi Usmonli istilosi."),
  },
  "ottoman-empire": {
    countries: ["TUR", "GRC", "BGR", "SRB", "EGY", "SYR", "IRQ", "SAU", "DZA", "TUN", "LBY", "HUN", "BIH", "ROU"],
    rulers: [L("Osman I", "Usmon I"), L("Mehmed II", "Mehmed II"), L("Suleiman I", "Sulaymon I"), L("Mahmud II", "Mahmud II")],
    political: L("Sultanate with a grand vizier and provincial governors; late reforms (Tanzimat) modernised the state.", "Buyuk vazir va viloyat hokimlariga ega sultonlik; kech davr islohotlari (Tanzimat) davlatni zamonaviylashtirgan."),
    economy: L("Control of routes between Europe and Asia; timar land grants.", "Yevropa va Osiyo o‘rtasidagi yo‘llar nazorati; timar yer berish tizimi."),
    culture: L("Architecture of Sinan, calligraphy, a multi-confessional millet system.", "Me’mor Sinan asarlari, xattotlik, ko‘p konfessiyali millat tizimi."),
    military: L("Janissary infantry and early gunpowder artillery.", "Yangicheri piyoda qo‘shini va ilk o‘qotar artilleriya."),
    achievements: L("Süleymaniye Mosque; a legal code (kanun) alongside Islamic law.", "Sulaymoniya masjidi; shariat bilan bir qatorda qonunnoma (qonun)."),
    decline: L("Territorial losses in the 19th century; defeat in WWI; sultanate abolished in 1922.", "XIX asrdagi hududiy yo‘qotishlar; Birinchi jahon urushidagi mag‘lubiyat; sultonlik 1922-yilda bekor qilingan."),
  },
  "mughal-empire": {
    countries: ["IND", "PAK", "BGD", "AFG"],
    rulers: [L("Babur", "Zahiriddin Muhammad Bobur"), L("Akbar", "Akbar"), L("Jahangir", "Jahongir"), L("Shah Jahan", "Shoh Jahon"), L("Aurangzeb", "Avrangzeb")],
    political: L("Centralised rule through the mansabdari ranking of nobles.", "Zodagonlarni mansabdorlik darajalari orqali markazlashgan boshqaruv."),
    economy: L("A large agrarian economy; textiles traded across the Indian Ocean.", "Katta agrar iqtisodiyot; to‘qimachilik mahsulotlari Hind okeani bo‘ylab savdo qilingan."),
    culture: L("Indo-Persian painting and architecture; Babur's memoir, the Baburnama.", "Hind-fors rangtasviri va me’morchiligi; Boburning «Boburnoma» asari."),
    military: L("Cavalry combined with field artillery, used decisively at Panipat in 1526.", "Otliq qo‘shin va dala artilleriyasi; 1526-yilda Panipatda hal qiluvchi qo‘llanilgan."),
    achievements: L("The Taj Mahal, Red Fort and Fatehpur Sikri.", "Tojmahal, Qizil qal’a va Fatehpur-Sikri."),
    decline: L("Weakened after Aurangzeb; ended by the British after the 1857 uprising.", "Avrangzebdan keyin zaiflashgan; 1857-yilgi qo‘zg‘olondan so‘ng inglizlar tomonidan tugatilgan."),
  },
};
