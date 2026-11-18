import { RECIPE_CATALOG_PART1, StaticTranslatedRecipe } from './recipeCatalogEu1.ts';
import { RECIPE_CATALOG_PART2 } from './recipeCatalogEu2.ts';
import { Recipe } from '../types.ts';

export type { StaticTranslatedRecipe };

export const RECIPE_CATALOG_TRANSLATIONS: Record<string, Record<string, StaticTranslatedRecipe>> = {
  ...RECIPE_CATALOG_PART1,
  ...RECIPE_CATALOG_PART2,
};

export const WEEKLY_THEMES_I18N: Record<string, string[]> = {
  fr: [
    'Spécial Détox & Vitalité d’Automne 🍂',
    'Haute Teneur en Protéines & Satiété 💪',
    'Cuisine Express Méditerranéenne & Huile d’Olive 🫒',
    'Brûle-Graisses & Aliments à Faible Indice Glycémique 🔥',
    'Saveurs d’Asie Gourmandes & Légères 🥢',
    'Spécial Légumes Racines & Réconfort Sans Excès 🥕',
    'Cuisine Végétale & Fibres Prébiotiques 🥦',
    'Pêche Durable & Oméga-3 Essentiels 🐟',
  ],
  en: [
    'Autumn Detox & Vitality Special 🍂',
    'High Protein & Lasting Satiety 💪',
    'Express Mediterranean & Olive Oil Cuisine 🫒',
    'Fat-Burning & Low Glycemic Index Foods 🔥',
    'Light & Flavorful Asian Inspirations 🥢',
    'Root Vegetables & Guilt-Free Comfort 🥕',
    'Plant-Based & Prebiotic Fiber Kitchen 🥦',
    'Sustainable Seafood & Essential Omega-3s 🐟',
  ],
  es: [
    'Especial Detox y Vitalidad de Otoño 🍂',
    'Alto en Proteínas y Saciedad Duradera 💪',
    'Cocina Exprés Mediterránea y Aceite de Oliva 🫒',
    'Quema-Grasas y Bajo Índice Glucémico 🔥',
    'Sabores de Asia Ligeros y Sabrosos 🥢',
    'Verduras de Raíz y Confort Sin Excesos 🥕',
    'Cocina Vegetal y Fibra Prebiótica 🥦',
    'Pesca Sostenible y Omega-3 Esenciales 🐟',
  ],
  de: [
    'Herbst-Detox & Vitalität Spezial 🍂',
    'Hoher Proteingehalt & Lange Sättigung 💪',
    'Express-Mittelmeerküche & Olivenöl 🫒',
    'Fettverbrennung & Niedriger Glykämischer Index 🔥',
    'Leichte & Aromatische Asien-Küche 🥢',
    'Wurzelgemüse & Leichter Genuss 🥕',
    'Pflanzliche Küche & Präbiotische Ballaststoffe 🥦',
    'Nachhaltiger Fisch & Essentielle Omega-3s 🐟',
  ],
  it: [
    'Speciale Detox & Vitalità d’Autunno 🍂',
    'Alto Contenuto Proteico & Sazietà 💪',
    'Cucina Express Mediterranea & Olio d’Oliva 🫒',
    'Brucia-Grassi & Basso Indice Glicemico 🔥',
    'Sapori d’Asia Leggeri & Gustosi 🥢',
    'Verdure di Stagione & Comfort Leggero 🥕',
    'Cucina Vegetale & Fibre Prebiotiche 🥦',
    'Pesca Sostenibile & Omega-3 Essenziali 🐟',
  ],
  pt: [
    'Especial Detox & Vitalidade de Outono 🍂',
    'Alto Teor de Proteína & Saciedade 💪',
    'Cozinha Express Mediterrânica & Azeite 🫒',
    'Queima-Gordura & Baixo Índice Glicémico 🔥',
    'Sabores da Ásia Leves & Saborosos 🥢',
    'Legumes de Raiz & Conforto Sem Excessos 🥕',
    'Cozinha Vegetal & Fibras Prebióticas 🥦',
    'Pesca Sustentável & Ómega-3 Essenciais 🐟',
  ],
  nl: [
    'Herfst Detox & Vitaliteit Special 🍂',
    'Eiwitrijk & Langdurige Verzadiging 💪',
    'Snelle Mediterrane Keuken & Olijfolie 🫒',
    'Vetverbranding & Lage Glycemische Index 🔥',
    'Lichte & Smaakvolle Aziatische Gerechten 🥢',
    'Wortelgroenten & Verantwoord Comfort 🥕',
    'Plantaardige Keuken & Prebiotische Vezels 🥦',
    'Duurzame Vis & Essentiële Omega-3 🐟',
  ],
  pl: [
    'Jesienny Detoks i Witalność Specjal 🍂',
    'Wysoka Zawartość Białka i Sytość 💪',
    'Szybka Kuchnia Śródziemnomorska i Oliwa 🫒',
    'Spalanie Tłuszczu i Niski Indeks Glikemiczny 🔥',
    'Lekkie i Smaczne Inspiracje Azjatyckie 🥢',
    'Warzywa Korzeniowe i Zdrowy Komfort 🥕',
    'Kuchnia Roślinna i Błonnik Prebiotyczny 🥦',
    'Zrównoważone Ryby i Niezbędne Omega-3 🐟',
  ],
  no: [
    'Høst-Detox & Vitalitet Spesial 🍂',
    'Høyt Proteininnhold & Lang Metthet 💪',
    'Rask Middelhavsmat & Olivenolje 🫒',
    'Fettforbrenning & Lav Glykemisk Indeks 🔥',
    'Lette & Smakfulle Asiatiske Retter 🥢',
    'Rotgrønnsaker & Sunn Komfort 🥕',
    'Plantebasert & Prebiotisk Fiber 🥦',
    'Bærekraftig Sjømat & Essensiell Omega-3 🐟',
  ],
  sv: [
    'Höst-Detox & Vitalitet Special 🍂',
    'Högt Protein & Lång Mättnad 💪',
    'Snabb Medelhavsmat & Olivolja 🫒',
    'Fettförbränning & Lågt Glykemiskt Index 🔥',
    'Lätta & Smakrika Asiatiska Rätter 🥢',
    'Rotfrukter & Hälsosam Komfort 🥕',
    'Växtbaserat & Prebiotiska Fibrer 🥦',
    'Hållbar Fisk & Essentiell Omega-3 🐟',
  ],
  da: [
    'Efterårs-Detox & Vitalitet Special 🍂',
    'Højt Proteinindhold & Lang Mæthed 💪',
    'Hurtig Middelhavsmad & Olivenolie 🫒',
    'Fedtforbrænding & Lavt Glykæmisk Indeks 🔥',
    'Lette & Smagfulde Asiatiske Retter 🥢',
    'Rodfrugter & Sund Komfort 🥕',
    'Plantebaseret & Præbiotiske Fibre 🥦',
    'Bæredygtig Fisk & Essentiel Omega-3 🐟',
  ],
  fi: [
    'Syksyn Detox & Elinvoima Erikois 🍂',
    'Runsaasti Proteiinia & Pitkä Kylläisyys 💪',
    'Nopea Välimeren Keittiö & Oliiviöljy 🫒',
    'Rasvanpoltto & Matala Glykeeminen Indeksi 🔥',
    'Kevyet & Maukkaat Aasian Maut 🥢',
    'Juurekset & Kevyt Lohturuoka 🥕',
    'Kasvisruoka & Prebioottiset Kuidut 🥦',
    'Kestävä Kala & Välttämättömät Omega-3 🐟',
  ],
  ru: [
    'Осенний детокс и энергия 🍂',
    'Максимум белка и сытости 💪',
    'Быстрая средиземноморская кухня 🫒',
    'Жиросжигание и низкий ГИ 🔥',
    'Лёгкие азиатские вкусы 🥢',
    'Корнеплоды и уют без лишних калорий 🥕',
    'Растительная кухня и пребиотики 🥦',
    'Полезная рыба и Омега-3 🐟',
  ],
  ja: [
    '秋のデトックス＆活力スペシャル 🍂',
    '高タンパク＆持続する満腹感 💪',
    '時短地中海料理＆オリーブオイル 🫒',
    '脂肪燃焼＆低GI食材 🔥',
    'ヘルシーで美味しいアジアの味 🥢',
    '根菜とやさしいコンフォートフード 🥕',
    'プラントベース＆プレバイオティクス食物繊維 🥦',
    'サステナブルな魚と必須オメガ3 🐟',
  ],
  zh: [
    '秋季排毒与活力特辑 🍂',
    '高蛋白与持久饱腹感 💪',
    '快手地中海风味与橄榄油 🫒',
    '燃脂与低升糖指数饮食 🔥',
    '清爽美味亚洲风味 🥢',
    '根茎蔬菜与轻盈暖心美食 🥕',
    '植物基与益生元膳食纤维 🥦',
    '可持续海鲜与必需Omega-3 🐟',
  ],
  ar: [
    'خاص بالديتوكس والحيوية الخريفية 🍂',
    'نسبة عالية من البروتين والشبع المستدام 💪',
    'مطبخ متوسطي سريع وزيت الزيتون 🫒',
    'حرق الدهون ومؤشر جلايسيمي منخفض 🔥',
    'نكهات آسيوية خفيفة وشهية 🥢',
    'خضروات جذرية ودفء صحي بلا إفراط 🥕',
    'مطبخ نباتي وألياف البريبيوتيك 🥦',
    'أسماك مستدامة وأوميغا-3 الأساسية 🐟',
  ],
  tr: [
    'Sonbahar Detoks & Zindelik Özel 🍂',
    'Yüksek Protein & Uzun Süreli Tokluk 💪',
    'Hızlı Akdeniz Mutfağı & Zeytinyağı 🫒',
    'Yağ Yakıcı & Düşük Glisemik İndeks 🔥',
    'Hafif & Lezzetli Asya Esintileri 🥢',
    'Kök Sebzeler & Hafif Konfor 🥕',
    'Bitkisel Mutfak & Prebiyotik Lifler 🥦',
    'Sürdürülebilir Balık & Temel Omega-3 🐟',
  ],
  el: [
    'Αποτοξίνωση & Ζωτικότητα Φθινοπώρου 🍂',
    'Υψηλή Πρωτεΐνη & Παρατεταμένος Κορεσμός 💪',
    'Γρήγορη Μεσογειακή Κουζίνα & Ελαιόλαδο 🫒',
    'Καύση Λίπους & Χαμηλός Γλυκαιμικός Δείκτης 🔥',
    'Ελαφριές & Νόστιμες Ασιατικές Γεύσεις 🥢',
    'Ριζώδη Λαχανικά & Ελαφριά Θαλπωρή 🥕',
    'Φυτική Κουζίνα & Πρεβιοτικές Ίνες 🥦',
    'Βιώσιμα Ψάρια & Απαραίτητα Ωμέγα-3 🐟',
  ],
  cs: [
    'Podzimní Detox & Vitalita Speciál 🍂',
    'Vysoký Obsah Bílkovin & Sytost 💪',
    'Rychlá Středomořská Kuchyně & Olivový Olej 🫒',
    'Spalování Tuků & Nízký Glykemický Index 🔥',
    'Lehké & Chutné Asijské Inspirace 🥢',
    'Kořenová Zelenina & Lehký Komfort 🥕',
    'Rostlinná Kuchyně & Prebiotická Vláknina 🥦',
    'Udržitelné Ryby & Esenciální Omega-3 🐟',
  ],
  ro: [
    'Special Detox & Vitalitate de Toamnă 🍂',
    'Conținut Ridicat de Proteine & Sațietate 💪',
    'Bucătărie Mediteraneană Express & Ulei de Măsline 🫒',
    'Ardere Grăsimi & Indice Glicemic Scăzut 🔥',
    'Arome Asiatice Ușoare & Gustoase 🥢',
    'Legume Rădăcinoase & Confort Fără Excese 🥕',
    'Bucătărie Vegetală & Fibre Prebiotice 🥦',
    'Pește Sustenabil & Omega-3 Esențiali 🐟',
  ],
  uk: [
    'Осінній детокс та життєва енергія 🍂',
    'Високий вміст білка та тривала ситість 💪',
    'Швидка середземноморська кухня та оливкова олія 🫒',
    'Жироспалювання та низький глікемічний індекс 🔥',
    'Легкі та смачні азійські страви 🥢',
    'Коренеплоди та затишок без зайвих калорій 🥕',
    'Рослинна кухня та пребіотичні волокна 🥦',
    'Корисна риба та незамінні Омега-3 🐟',
  ],
};

export interface LocalizedShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

const SHOPPING_CATALOG: Record<string, Array<{ id: string; name: string; quantity: string; category: string; defaultChecked?: boolean }>> = {
  fr: [
    { id: 's1', name: 'Blanc de poulet bio', quantity: '300g', category: 'Viandes' },
    { id: 's2', name: 'Quinoa', quantity: '250g', category: 'Épicerie', defaultChecked: true },
    { id: 's3', name: 'Avocats', quantity: '2 pièces', category: 'Fruits & Légumes' },
    { id: 's4', name: 'Courgettes & Carottes', quantity: '500g', category: 'Fruits & Légumes' },
    { id: 's5', name: 'Lait de coco léger', quantity: '1 brique 200ml', category: 'Épicerie' },
  ],
  en: [
    { id: 's1', name: 'Organic chicken breast', quantity: '300g', category: 'Meat' },
    { id: 's2', name: 'Quinoa', quantity: '250g', category: 'Pantry', defaultChecked: true },
    { id: 's3', name: 'Avocados', quantity: '2 pcs', category: 'Produce' },
    { id: 's4', name: 'Zucchini & Carrots', quantity: '500g', category: 'Produce' },
    { id: 's5', name: 'Light coconut milk', quantity: '200ml carton', category: 'Pantry' },
  ],
  es: [
    { id: 's1', name: 'Pechuga de pollo ecológica', quantity: '300g', category: 'Carnes' },
    { id: 's2', name: 'Quinoa', quantity: '250g', category: 'Despensa', defaultChecked: true },
    { id: 's3', name: 'Aguacates', quantity: '2 uds', category: 'Frutas y Verduras' },
    { id: 's4', name: 'Calabacines y Zanahorias', quantity: '500g', category: 'Frutas y Verduras' },
    { id: 's5', name: 'Leche de coco ligera', quantity: '1 brik 200ml', category: 'Despensa' },
  ],
  de: [
    { id: 's1', name: 'Bio-Hähnchenbrust', quantity: '300g', category: 'Fleisch' },
    { id: 's2', name: 'Quinoa', quantity: '250g', category: 'Vorrat', defaultChecked: true },
    { id: 's3', name: 'Avocados', quantity: '2 Stück', category: 'Obst & Gemüse' },
    { id: 's4', name: 'Zucchini & Karotten', quantity: '500g', category: 'Obst & Gemüse' },
    { id: 's5', name: 'Leichte Kokosmilch', quantity: '200ml Packung', category: 'Vorrat' },
  ],
  it: [
    { id: 's1', name: 'Petto di pollo bio', quantity: '300g', category: 'Carni' },
    { id: 's2', name: 'Quinoa', quantity: '250g', category: 'Dispensa', defaultChecked: true },
    { id: 's3', name: 'Avocado', quantity: '2 pezzi', category: 'Frutta e Verdura' },
    { id: 's4', name: 'Zucchine e Carote', quantity: '500g', category: 'Frutta e Verdura' },
    { id: 's5', name: 'Latte di cocco leggero', quantity: '200ml', category: 'Dispensa' },
  ],
  pt: [
    { id: 's1', name: 'Peito de frango biológico', quantity: '300g', category: 'Carnes' },
    { id: 's2', name: 'Quinoa', quantity: '250g', category: 'Mercearia', defaultChecked: true },
    { id: 's3', name: 'Abacates', quantity: '2 unidades', category: 'Frutas e Legumes' },
    { id: 's4', name: 'Curgetes e Cenouras', quantity: '500g', category: 'Frutas e Legumes' },
    { id: 's5', name: 'Leite de coco leve', quantity: '200ml', category: 'Mercearia' },
  ],
  nl: [
    { id: 's1', name: 'Biologische kipfilet', quantity: '300g', category: 'Vlees' },
    { id: 's2', name: 'Quinoa', quantity: '250g', category: 'Voorraad', defaultChecked: true },
    { id: 's3', name: 'Avocado’s', quantity: '2 stuks', category: 'Groente & Fruit' },
    { id: 's4', name: 'Courgettes & Wortels', quantity: '500g', category: 'Groente & Fruit' },
    { id: 's5', name: 'Lichte kokosmelk', quantity: '200ml', category: 'Voorraad' },
  ],
  pl: [
    { id: 's1', name: 'Ekologiczna pierś z kurczaka', quantity: '300g', category: 'Mięso' },
    { id: 's2', name: 'Komosa ryżowa', quantity: '250g', category: 'Spiżarnia', defaultChecked: true },
    { id: 's3', name: 'Awokado', quantity: '2 szt.', category: 'Owoce i Warzywa' },
    { id: 's4', name: 'Cukinia i Marchew', quantity: '500g', category: 'Owoce i Warzywa' },
    { id: 's5', name: 'Lekkie mleko kokosowe', quantity: '200ml', category: 'Spiżarnia' },
  ],
  no: [
    { id: 's1', name: 'Økologisk kyllingfilet', quantity: '300g', category: 'Kjøtt' },
    { id: 's2', name: 'Quinoa', quantity: '250g', category: 'Tørrvarer', defaultChecked: true },
    { id: 's3', name: 'Avokado', quantity: '2 stk', category: 'Frukt & Grønt' },
    { id: 's4', name: 'Squash & Gulrøtter', quantity: '500g', category: 'Frukt & Grønt' },
    { id: 's5', name: 'Lett kokosmelk', quantity: '200ml', category: 'Tørrvarer' },
  ],
  sv: [
    { id: 's1', name: 'Ekologisk kycklingfilé', quantity: '300g', category: 'Kött' },
    { id: 's2', name: 'Quinoa', quantity: '250g', category: 'Skafferi', defaultChecked: true },
    { id: 's3', name: 'Avokado', quantity: '2 st', category: 'Frukt & Grönt' },
    { id: 's4', name: 'Zucchini & Morötter', quantity: '500g', category: 'Frukt & Grönt' },
    { id: 's5', name: 'Lätt kokosmjölk', quantity: '200ml', category: 'Skafferi' },
  ],
  da: [
    { id: 's1', name: 'Økologisk kyllingebryst', quantity: '300g', category: 'Kød' },
    { id: 's2', name: 'Quinoa', quantity: '250g', category: 'Kolonial', defaultChecked: true },
    { id: 's3', name: 'Avocadoer', quantity: '2 stk.', category: 'Frugt & Grønt' },
    { id: 's4', name: 'Squash & Gulerødder', quantity: '500g', category: 'Frugt & Grønt' },
    { id: 's5', name: 'Let kokosmælk', quantity: '200ml', category: 'Kolonial' },
  ],
  fi: [
    { id: 's1', name: 'Luomukananrinta', quantity: '300g', category: 'Liha' },
    { id: 's2', name: 'Kvinoa', quantity: '250g', category: 'Kuivakaappi', defaultChecked: true },
    { id: 's3', name: 'Avokado', quantity: '2 kpl', category: 'Hedelmät & Vihannekset' },
    { id: 's4', name: 'Kesäkurpitsa & Porkkana', quantity: '500g', category: 'Hedelmät & Vihannekset' },
    { id: 's5', name: 'Kevyt kookosmaito', quantity: '200ml', category: 'Kuivakaappi' },
  ],
  ru: [
    { id: 's1', name: 'Филе куриной грудки', quantity: '300 г', category: 'Мясо' },
    { id: 's2', name: 'Киноа', quantity: '250 г', category: 'Бакалея', defaultChecked: true },
    { id: 's3', name: 'Авокадо', quantity: '2 шт.', category: 'Овощи и фрукты' },
    { id: 's4', name: 'Цукини и морковь', quantity: '500 г', category: 'Овощи и фрукты' },
    { id: 's5', name: 'Лёгкое кокосовое молоко', quantity: '200 мл', category: 'Бакалея' },
  ],
  ja: [
    { id: 's1', name: '鶏むね肉（オーガニック）', quantity: '300g', category: '肉類' },
    { id: 's2', name: 'キヌア', quantity: '250g', category: '乾物', defaultChecked: true },
    { id: 's3', name: 'アボカド', quantity: '2個', category: '野菜・果物' },
    { id: 's4', name: 'ズッキーニ＆人参', quantity: '500g', category: '野菜・果物' },
    { id: 's5', name: 'ライトココナッツミルク', quantity: '200ml', category: '乾物' },
  ],
  zh: [
    { id: 's1', name: '有机鸡胸肉', quantity: '300g', category: '肉类' },
    { id: 's2', name: '藜麦', quantity: '250g', category: '粮油干货', defaultChecked: true },
    { id: 's3', name: '牛油果', quantity: '2个', category: '蔬果' },
    { id: 's4', name: '西葫芦和胡萝卜', quantity: '500g', category: '蔬果' },
    { id: 's5', name: '低脂椰浆', quantity: '200ml', category: '粮油干货' },
  ],
  ar: [
    { id: 's1', name: 'صدر دجاج عضوي', quantity: '300 غ', category: 'اللحوم' },
    { id: 's2', name: 'كينوا', quantity: '250 غ', category: 'المخزن', defaultChecked: true },
    { id: 's3', name: 'أفوكادو', quantity: '2 حبة', category: 'خضار وفواكه' },
    { id: 's4', name: 'كوسة وجزر', quantity: '500 غ', category: 'خضار وفواكه' },
    { id: 's5', name: 'حليب جوز هند خفيف', quantity: '200 مل', category: 'المخزن' },
  ],
  tr: [
    { id: 's1', name: 'Organik tavuk göğsü', quantity: '300g', category: 'Et' },
    { id: 's2', name: 'Kinoa', quantity: '250g', category: 'Kiler', defaultChecked: true },
    { id: 's3', name: 'Avokado', quantity: '2 adet', category: 'Meyve & Sebze' },
    { id: 's4', name: 'Kabak & Havuç', quantity: '500g', category: 'Meyve & Sebze' },
    { id: 's5', name: 'Hafif hindistan cevizi sütü', quantity: '200ml', category: 'Kiler' },
  ],
  el: [
    { id: 's1', name: 'Βιολογικό στήθος κοτόπουλου', quantity: '300 γρ.', category: 'Κρέας' },
    { id: 's2', name: 'Κινόα', quantity: '250 γρ.', category: 'Παντοπωλείο', defaultChecked: true },
    { id: 's3', name: 'Αβοκάντο', quantity: '2 τεμ.', category: 'Φρούτα & Λαχανικά' },
    { id: 's4', name: 'Κολοκυθάκια & Καρότα', quantity: '500 γρ.', category: 'Φρούτα & Λαχανικά' },
    { id: 's5', name: 'Ελαφρύ γάλα καρύδας', quantity: '200 ml', category: 'Παντοπωλείο' },
  ],
  cs: [
    { id: 's1', name: 'Bio kuřecí prsa', quantity: '300g', category: 'Maso' },
    { id: 's2', name: 'Quinoa', quantity: '250g', category: 'Spíž', defaultChecked: true },
    { id: 's3', name: 'Avokádo', quantity: '2 ks', category: 'Ovoce & Zelenina' },
    { id: 's4', name: 'Cukety & Mrkev', quantity: '500g', category: 'Ovoce & Zelenina' },
    { id: 's5', name: 'Lehké kokosové mléko', quantity: '200ml', category: 'Spíž' },
  ],
  ro: [
    { id: 's1', name: 'Piept de pui bio', quantity: '300g', category: 'Carne' },
    { id: 's2', name: 'Quinoa', quantity: '250g', category: 'Cămară', defaultChecked: true },
    { id: 's3', name: 'Avocado', quantity: '2 buc.', category: 'Fructe & Legume' },
    { id: 's4', name: 'Dovlecei & Morcovi', quantity: '500g', category: 'Fructe & Legume' },
    { id: 's5', name: 'Lapte de cocos ușor', quantity: '200ml', category: 'Cămară' },
  ],
  uk: [
    { id: 's1', name: 'Органічне куряче філе', quantity: '300 г', category: 'М’ясо' },
    { id: 's2', name: 'Кіноа', quantity: '250 г', category: 'Бакалія', defaultChecked: true },
    { id: 's3', name: 'Авокадо', quantity: '2 шт.', category: 'Овочі та фрукти' },
    { id: 's4', name: 'Кабачки та морква', quantity: '500 г', category: 'Овочі та фрукти' },
    { id: 's5', name: 'Легке кокосове молоко', quantity: '200 мл', category: 'Бакалія' },
  ],
};

export function getStaticWeekTheme(weekNum: number, lang: string): string {
  const list = WEEKLY_THEMES_I18N[lang] || WEEKLY_THEMES_I18N.en;
  return list[weekNum % list.length];
}

export function getStaticThemeTranslation(frenchTheme: string, lang: string): string | null {
  if (!frenchTheme || lang === 'fr') return frenchTheme;
  const idx = WEEKLY_THEMES_I18N.fr.indexOf(frenchTheme);
  if (idx === -1) return null;
  const targetList = WEEKLY_THEMES_I18N[lang] || WEEKLY_THEMES_I18N.en;
  return targetList[idx] || null;
}

export function getStaticRecipeTranslation(recipeId: string, lang: string): StaticTranslatedRecipe | null {
  if (lang === 'fr') return null;
  const dict = RECIPE_CATALOG_TRANSLATIONS[lang] || RECIPE_CATALOG_TRANSLATIONS.en;
  return dict?.[recipeId] || null;
}

export function getStaticShoppingItems(lang: string): LocalizedShoppingItem[] {
  const items = SHOPPING_CATALOG[lang] || SHOPPING_CATALOG.fr;
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    category: item.category,
    checked: Boolean(item.defaultChecked),
  }));
}

export function getDefaultAiRecipes(lang: string): { recipes: Recipe[]; success: boolean; message: string } {
  const now = Date.now();
  const baseRecipes: Recipe[] = [
    {
      id: `ai_recipe_${now}_1`,
      title: 'Filet de Bar Rôti au Thym & Fondue de Poireaux',
      description: 'Un plat raffiné, digeste et riche en protéines nobles pour votre semaine.',
      prepTimeMinutes: 20,
      calories: 340,
      protein: 38,
      carbs: 14,
      fat: 8,
      category: 'faibles_calories',
      imageUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
      ingredients: [
        '150g de filet de bar frais',
        '2 blancs de poireaux émincés',
        '1 c.à.c d’huile d’olive',
        'Jus d’un demi-citron & fleur de sel',
      ],
      instructions: [
        'Faire fondre les poireaux à feu doux avec un fond d’eau pendant 12 min.',
        'Poêler le poisson côté peau 3 min puis retourner 2 min.',
        'Dresser sur le lit de poireaux avec le jus de citron.',
      ],
      tags: ['Nouveauté Semaine', 'Riche en Protéines', 'Sans Gluten'],
      isNewThisWeek: true,
      isWeeklyStar: true,
    },
    {
      id: `ai_recipe_${now}_2`,
      title: 'Bowl Chaud Patate Douce, Pois Chiches Rôtis & Tahini',
      description: 'Plein d’énergie douce et de minéraux pour vos déjeuners actifs.',
      prepTimeMinutes: 25,
      calories: 410,
      protein: 16,
      carbs: 58,
      fat: 12,
      category: 'vegetarienne',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      ingredients: [
        '120g de patate douce rôtie',
        '100g de pois chiches cuits assaisonnés au cumin',
        '1 poignée de roquette fraîche',
        '1 c.à.s de sauce tahini au citron',
      ],
      instructions: [
        'Rôtir les dés de patate douce et les pois chiches au four à 200°C pendant 20 min.',
        'Disposer dans un bol avec la roquette.',
        'Arroser de sauce tahini légère.',
      ],
      tags: ['Nouveauté Semaine', 'Végétarien', 'Index Glycémique Modéré'],
      isNewThisWeek: true,
    },
    {
      id: `ai_recipe_${now}_3`,
      title: 'Tartine Rustique Seigle, Ricotta & Figues Fraîches',
      description: 'Une pause sucrée-salée riche en fibres et calcium naturel.',
      prepTimeMinutes: 8,
      calories: 270,
      protein: 12,
      carbs: 36,
      fat: 7,
      category: 'express',
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      ingredients: [
        '2 tranches de pain de seigle au levain',
        '50g de ricotta fraîche',
        '2 figues fraîches tranchées',
        '1 filet de miel d’acacia',
      ],
      instructions: [
        'Toaster le pain de seigle.',
        'Tartiner la ricotta crémeuse.',
        'Disposer les figues et le filet de miel.',
      ],
      tags: ['Nouveauté Semaine', 'Express 8 min', 'Gourmand & Sain'],
      isNewThisWeek: true,
    },
  ];

  const localized = baseRecipes.map((r, idx) => {
    const tr = getStaticRecipeTranslation(`ai_default_${idx + 1}`, lang);
    if (!tr) return r;
    return {
      ...r,
      title: tr.title,
      description: tr.description,
      ingredients: tr.ingredients,
      instructions: tr.instructions,
      tags: tr.tags,
    };
  });

  return {
    recipes: localized,
    success: true,
    message: 'Weekly recipes generated',
  };
}
