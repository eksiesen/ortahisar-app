import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  FlatList,
  ImageBackground,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  UIManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchField } from '../components/home/SearchField';
import type { RootTabParamList } from '../navigation/types';
import { cardShadow } from '../constants/layout';
import { colors, radius } from '../theme';
import { searchRegistry } from '../constants/searchRegistry';

import WebViewComponent from '../components/WebViewComponent';

const CARD_WIDTH = 270;
const CARD_GAP = 12;

const CATEGORY_STYLES = {
  dogal: { color: '#10B981', icon: 'flower' }, // Yeşil Çiçekli İşaretçi
  tarihi: { color: '#7C3AED', icon: 'library' }, // Mor Tarihi İşaretçi
  park: { color: '#0D9488', icon: 'leaf' }, // Turkuaz Yapraklı İşaretçi
  manzara: { color: '#D97706', icon: 'eye' }, // Turuncu Göz/Dürbün İşaretçi
  isletme: { color: '#EF4444', icon: 'storefront' }, // Kırmızı İşletme İşaretçisi
  dolmus: { color: '#3B82F6', icon: 'car' }, // Mavi Dolmuş Durağı İşaretçisi
} as const;

// 512x512 Viewport SVG paths for custom HTML5 rendering inside Leaflet
const SVG_ICONS = {
  flower: `<circle cx="256" cy="256" r="64"/><circle cx="256" cy="128" r="64"/><circle cx="256" cy="384" r="64"/><circle cx="128" cy="256" r="64"/><circle cx="384" cy="256" r="64"/>`,
  library: `<path d="M256 32L32 128v32h448v-32L256 32zM80 192v208h48V192H80zm112 0v208h48V192h-48zm112 0v208h48V192h-48zm112 0v208h48V192h-48zM48 432v48h416v-48H48z"/>`,
  leaf: `<path d="M160 48v224c0 70.6 57.4 128 128 128h16V304c0-70.6-57.4-128-128-128H160z"/>`,
  eye: `<path d="M256 96C128 96 32 192 32 256s96 160 224 160 224-96 224-160-96-160-224-160zm0 256c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96zm0-160c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64z"/>`,
  storefront: `<path d="M48 32v48h416V32H48zm0 80v32l32 48v240h352V192l32-48v-32H48zm224 240h-64v-64h64v64zm128-64H112v-96h288v96z"/>`,
  car: `<path d="M400 192H112a32 32 0 00-32 32v144a32 32 0 0032 32h16a32 32 0 0032-32v-16h208v16a32 32 0 0032 32h16a32 32 0 0032-32V224a32 32 0 00-32-32zm-256 128a24 24 0 1124-24 24 24 0 01-24 24zm192 0a24 24 0 1124-24 24 24 0 01-24 24z"/>`,
} as const;

interface MapPoint {
  key: string;
  title: string;
  category: string;
  categoryKey: 'dogal' | 'tarihi' | 'park' | 'manzara' | 'isletme' | 'dolmus';
  detailKey: string;
  image: any;
  tags: string[];
  lat: number;
  lng: number;
}

const MAP_POINTS: MapPoint[] = [
  // --- DOĞAL GÜZELLİKLER ---
  {
    key: 'ganita',
    title: 'Ganita Sahil Bandı',
    category: 'Doğal Güzellikler',
    categoryKey: 'dogal',
    detailKey: 'ganita',
    image: require('../assets/places/ganita-sahil.jpg'),
    tags: ['Sahil', 'Manzara', 'Yürüyüş'],
    lat: 41.01289734446809,
    lng: 39.71448245767626,
  },
  {
    key: 'boztepe-dogal',
    title: 'Boztepe Seyir Alanı',
    category: 'Doğal Güzellikler',
    categoryKey: 'dogal',
    detailKey: 'boztepe-dogal',
    image: require('../assets/places/boztepe-seyir.jpg'),
    tags: ['Manzara', 'Seyir', 'Tepe'],
    lat: 40.998642320657154,
    lng: 39.73193707325702,
  },
  
  // --- PARKLAR ---
  {
    key: 'zagnos-vadisi',
    title: 'Zağnos Vadisi Parkı',
    category: 'Parklar',
    categoryKey: 'park',
    detailKey: 'zagnos-vadisi',
    image: require('../assets/places/zagnos-park.jpg'),
    tags: ['Vadi', 'Park', 'Tarih'],
    lat: 41.004337472722455,
    lng: 39.71841985770878,
  },
  {
    key: 'botanik',
    title: 'Trabzon Botanik Bahçesi',
    category: 'Parklar',
    categoryKey: 'park',
    detailKey: 'botanik',
    image: require('../assets/places/botanik.jpg'),
    tags: ['Doğa', 'Botanik', 'Yürüyüş'],
    lat: 40.98636334910902,
    lng: 39.70889746571553,
  },
  {
    key: 'besirli-ekopark',
    title: 'Beşirli EkoPark',
    category: 'Parklar',
    categoryKey: 'park',
    detailKey: 'besirli-ekopark',
    image: require('../assets/places/ekopark.jpg'),
    tags: ['Sahil', 'Park', 'Yürüyüş'],
    lat: 40.99733136360183,
    lng: 39.67507512642866,
  },
  {
    key: 'eyof',
    title: 'EYOF Park',
    category: 'Parklar',
    categoryKey: 'park',
    detailKey: 'eyof',
    image: require('../assets/places/eyof-park.jpg'),
    tags: ['Şehir', 'Park', 'Sosyal'],
    lat: 41.001921271471545,
    lng: 39.76101917201625,
  },
  {
    key: '100-yil',
    title: '100. Yıl Parkı',
    category: 'Parklar',
    categoryKey: 'park',
    detailKey: '100-yil',
    image: require('../assets/places/100yil-park.jpg'),
    tags: ['Şehir', 'Dinlenme', 'Park'],
    lat: 41.00045355371198,
    lng: 39.76534891349278,
  },
  {
    key: 'meydan',
    title: 'Trabzon Meydan Parkı',
    category: 'Parklar',
    categoryKey: 'park',
    detailKey: 'meydan',
    image: require('../assets/places/meydan-park.jpg'),
    tags: ['Meydan', 'Şehir', 'Park'],
    lat: 41.00574441578634,
    lng: 39.73111155282161,
  },
  {
    key: 'tunel-akvaryum',
    title: 'Trabzon Tünel Akvaryum',
    category: 'Parklar',
    categoryKey: 'park',
    detailKey: 'tunel-akvaryum',
    image: require('../assets/places/bedesten.jpg'),
    tags: ['Akvaryum', 'Tünel', 'Turistik'],
    lat: 41.000817164722186,
    lng: 39.72075816878773,
  },

  // --- TARİHİ YERLER ---
  {
    key: 'kucuk-ayvasil-kilisesi',
    title: 'Küçük Ayvasıl Kilisesi',
    category: 'Tarihi Yerler',
    categoryKey: 'tarihi',
    detailKey: 'kucuk-ayvasil-kilisesi',
    image: require('../assets/places/ayvasil.jpg'),
    tags: ['Tarih', 'Kilise', 'Bizans'],
    lat: 41.006452962598345,
    lng: 39.72346629788727,
  },
  {
    key: 'ayasofya',
    title: 'Trabzon Ayasofya Camii',
    category: 'Tarihi Yerler',
    categoryKey: 'tarihi',
    detailKey: 'ayasofya',
    image: require('../assets/places/ayasofya.jpg'),
    tags: ['Tarih', 'Mimari', 'Kültür'],
    lat: 41.003376809970014,
    lng: 39.6963131326272,
  },
  {
    key: 'ataturk-kosku',
    title: 'Atatürk Köşkü',
    category: 'Tarihi Yerler',
    categoryKey: 'tarihi',
    detailKey: 'ataturk-kosku',
    image: require('../assets/places/ataturk-kosku.jpg'),
    tags: ['Müze', 'Tarih', 'Köşk'],
    lat: 40.9800986756486,
    lng: 39.69743770873954,
  },
  {
    key: 'trabzon-kalesi',
    title: 'Trabzon Kalesi',
    category: 'Tarihi Yerler',
    categoryKey: 'tarihi',
    detailKey: 'trabzon-kalesi',
    image: require('../assets/places/kale.jpeg'),
    tags: ['Kale', 'Tarih', 'Şehir'],
    lat: 41.00159095846758,
    lng: 39.720599827106554,
  },
  {
    key: 'gulbahar-hatun-camii',
    title: 'Gülbahar Hatun Camii',
    category: 'Tarihi Yerler',
    categoryKey: 'tarihi',
    detailKey: 'gulbahar-hatun-camii',
    image: require('../assets/places/gulbahar-hatun.jpg'),
    tags: ['Osmanlı', 'Tarih', 'Mimari'],
    lat: 41.003578881123914,
    lng: 39.71620596833318,
  },
  {
    key: 'kizlar-manastiri',
    title: 'Kızlar Manastırı',
    category: 'Tarihi Yerler',
    categoryKey: 'tarihi',
    detailKey: 'kizlar-manastiri',
    image: require('../assets/places/kizlar-manastir.jpg'),
    tags: ['Tarih', 'Manastır', 'Kültür'],
    lat: 40.99829679795204,
    lng: 39.7286597008098,
  },
  {
    key: 'bedesten',
    title: 'Bedesten',
    category: 'Tarihi Yerler',
    categoryKey: 'tarihi',
    detailKey: 'bedesten',
    image: require('../assets/places/bedesten.jpg'),
    tags: ['Tarih', 'Çarşı', 'Kültür'],
    lat: 41.00806168619102,
    lng: 39.72353504310976,
  },
  {
    key: 'kostaki-konagi',
    title: 'Köstaki Konağı',
    category: 'Tarihi Yerler',
    categoryKey: 'tarihi',
    detailKey: 'kostaki-konagi',
    image: require('../assets/places/kostaki.jpg'),
    tags: ['Müze', 'Konak', 'Tarih'],
    lat: 41.005184344414616,
    lng: 39.72680550000085,
  },
  {
    key: 'kanuni-evi',
    title: 'Kanuni Evi',
    category: 'Tarihi Yerler',
    categoryKey: 'tarihi',
    detailKey: 'kanuni-evi',
    image: require('../assets/places/kanuni-evi.jpg'),
    tags: ['Osmanlı', 'Tarih', 'Müze'],
    lat: 41.0049347511312,
    lng: 39.71892124590197,
  },
  {
    key: 'hasan-pasa-hamami',
    title: 'Hasan Paşa Asker Hamamı Müzesi',
    category: 'Tarihi Yerler',
    categoryKey: 'tarihi',
    detailKey: 'hasan-pasa-hamami',
    image: require('../assets/places/bedesten.jpg'),
    tags: ['Müze', 'Tarih', 'Hamam Kültürü'],
    lat: 41.003149686480064,
    lng: 39.709364356079625,
  },

  // --- MANZARA NOKTALARI ---
  {
    key: 'faroz-sahili',
    title: 'Faroz Sahili',
    category: 'Manzara Noktaları',
    categoryKey: 'manzara',
    detailKey: 'faroz-sahili',
    image: require('../assets/places/faroz-sahil.jpg'),
    tags: ['Sahil', 'Deniz', 'Manzara'],
    lat: 41.00902357412022,
    lng: 39.707617920815416,
  },

  // --- FARKLI İŞLETMELER ---
  {
    key: 'vosporos',
    title: 'Vosporos Kafe',
    category: 'Farklı İşletmeler',
    categoryKey: 'isletme',
    detailKey: 'vosporos',
    image: require('../assets/places/vosporos-kafe.jpg'),
    tags: ['Kafe', 'Manzara', 'Sosyal'],
    lat: 41.00541302645331,
    lng: 39.729608208899826,
  },
  {
    key: 'texas',
    title: 'Texas City Kafe',
    category: 'Farklı İşletmeler',
    categoryKey: 'isletme',
    detailKey: 'texas',
    image: require('../assets/places/texas-city-kafe.jpg'),
    tags: ['Konsept', 'Kafe', 'Sosyal'],
    lat: 40.96771545343758,
    lng: 39.81218973261724,
  },
  {
    key: 'ceramicca',
    title: 'Ceramicca Atölye & Cafe',
    category: 'Farklı İşletmeler',
    categoryKey: 'isletme',
    detailKey: 'ceramicca',
    image: require('../assets/places/ceramicca-kafe.jpg'),
    tags: ['Atölye', 'Sanat', 'Kafe'],
    lat: 41.006892573041135,
    lng: 39.728200864931104,
  },
  {
    key: 'cafe-guz-eli',
    title: 'Cafe Güz.eli',
    category: 'Farklı İşletmeler',
    categoryKey: 'isletme',
    detailKey: 'cafe-guz-eli',
    image: require('../assets/places/cafe-güz-eli.jpg'),
    tags: ['Konsept', 'Kafe', 'Fotoğraf'],
    lat: 41.006383927601334,
    lng: 39.729703017197664,
  },
  {
    key: 'ruzan-antika',
    title: 'Ruzan Antika Kafe',
    category: 'Farklı İşletmeler',
    categoryKey: 'isletme',
    detailKey: 'ruzan-antika',
    image: require('../assets/places/antika-kafe.jpg'),
    tags: ['Antika', 'Konsept', 'Kafe'],
    lat: 41.004612377811206,
    lng: 39.72308529629611,
  },

  // --- DOLMUŞ DURAKLARI ---
  { key: 'p-aydinlikevler', title: 'Postane - Aydınlıkevler', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00694023127856, lng: 39.72396549223134 },
  { key: 'p-besirli', title: 'Postane - Beşirli', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00703738683742, lng: 39.72422298429274 },
  { key: 'p-camlik', title: 'Postane - Çamlık', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00630096403004, lng: 39.72431295917866 },
  { key: 'p-kurucesme', title: 'Postane - Kuruçeşme', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00638192779012, lng: 39.72450607823613 },
  { key: 'p-karsiyaka', title: 'Postane - Karşıyaka', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.006479084173115, lng: 39.72474211262841 },
  { key: 'p-yesiltepe', title: 'Postane - Yeşiltepe', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00648509643725, lng: 39.72499612478102 },
  { key: 'p-yenimahalle', title: 'Postane - Yenimahalle', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00653367456364, lng: 39.72505506711441 },
  { key: 'p-bahcecik', title: 'Postane - Bahçecik', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00658225267422, lng: 39.725237397800925 },
  { key: 'p-catak', title: 'Postane - Çatak', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00630697629395, lng: 39.724716648074455 },
  { key: 'p-erdogdu', title: 'Postane - Erdoğdu Camiyanı', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.0063069763029, lng: 39.724939924776585 },
  { key: 'p-kurankursu', title: 'Postane - Kurankursu', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00638794006531, lng: 39.725030994112934 },
  { key: 't-yenicuma', title: 'Tanjant - Yenicuma', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00390886029602, lng: 39.731202000733916 },
  { key: 't-boztepe', title: 'Tanjant - Boztepe', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.003733139772066, lng: 39.73111617004029 },
  { key: 't-yesiltepe', title: 'Tanjant - Yeşiltepe', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.003947345862244, lng: 39.731609696495966 },
  { key: 't-kurankursu', title: 'Tanjant - Kurankursu', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00393115252039, lng: 39.73173844254546 },
  { key: 't-degirmendere', title: 'Tanjant - Değirmendere', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00383399235108, lng: 39.731738442532716 },
  { key: 't-yenimahalle', title: 'Tanjant - Yenimahalle', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00368825190336, lng: 39.73171698487232 },
  { key: 't-caglayan', title: 'Tanjant - Çağlayan', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00347773733897, lng: 39.73165261183078 },
  { key: 't-ktu', title: 'Tanjant - KTÜ', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00306344155076, lng: 39.731845730892836 },
  { key: 't-havalimani', title: 'Tanjant - Havalimanı', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.00288942074333, lng: 39.731953019271145 },
  { key: 't-tip', title: 'Tanjant - Tıp Fakültesi', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.003004243455905, lng: 39.732024388536715 },
  { key: 't-aydinlikevler', title: 'Tanjant - Aydınlıkevler', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.003902335468496, lng: 39.73167406626473 },
  { key: 'moloz-fatih', title: 'Moloz - Fatih', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01061327786868, lng: 39.722575569877826 },
  // --- MOLOZ KALKIŞLI DURAKLAR ---
  { key: 'moloz-pinaralti-sayvan', title: 'Moloz - Pınaraltı Sayvan', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01119588041446, lng: 39.7181466919046 },
  { key: 'moloz-aktoprak', title: 'Moloz - Aktoprak', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.0110987309658, lng: 39.71801794567291 },
  { key: 'moloz-karlik', title: 'Moloz - Karlık', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01119588039435, lng: 39.71806086103921 },
  { key: 'moloz-gurbulak', title: 'Moloz - Gürbulak', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01100158141222, lng: 39.718103776499575 },
  { key: 'moloz-gecit-magmat', title: 'Moloz - Geçit Mağmat', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.0109044317116, lng: 39.71797503039499 },
  { key: 'moloz-karakaya', title: 'Moloz - Karakaya', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01064536509651, lng: 39.71797503027523 },
  { key: 'moloz-akkaya', title: 'Moloz - Akkaya', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01074251515645, lng: 39.71801794565265 },
  { key: 'moloz-subasi', title: 'Moloz - Subaşı', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01077489852321, lng: 39.718060861044755 },
  { key: 'moloz-kirechane', title: 'Moloz - Kireçhane', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01061298164838, lng: 39.717907049706525 },
  { key: 'moloz-yenikoy-ugurlu', title: 'Moloz - Yeniköy Uğurlu', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.0103539139439, lng: 39.71808216105399 },
  { key: 'moloz-agilli', title: 'Moloz - Aığıllı', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01090443170341, lng: 39.718404183829996 },
  { key: 'moloz-dogancay', title: 'Moloz - Doğançay', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.010904431690896, lng: 39.71836126852998 },
  { key: 'moloz-bahcecik', title: 'Moloz - Bahçecik', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01105045238021, lng: 39.72318795037495 },
  { key: 'moloz-besirli', title: 'Moloz - Beşirli', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01095330274293, lng: 39.72294123135833 },
  { key: 'moloz-yenimahalle', title: 'Moloz - Yenimahalle', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01071042801193, lng: 39.72276606601601 },
  { key: 'moloz-degirmendere', title: 'Moloz - Değirmendere', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.010856238906044, lng: 39.723359556390164 },
  { key: 'moloz-karsiyaka', title: 'Moloz - Karşıyaka', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01075575748531, lng: 39.72327372418408 },
  { key: 'moloz-aydinlikevler', title: 'Moloz - Aydınlıkevler', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01072764882014, lng: 39.723295689209294 },
  { key: 'moloz-yesiltepe', title: 'Moloz - Yeşiltepe', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01079138635507, lng: 39.72313307738533 },
  { key: 'moloz-camlik', title: 'Moloz - Çamlık', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.010783376474485, lng: 39.723649234964675 },
  { key: 'moloz-kurucesme', title: 'Moloz - Kuruçeşme', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.010750993145656, lng: 39.7235097600996 },
  { key: 'moloz-catak', title: 'Moloz - Çatak', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.010564788694694, lng: 39.723423929424015 },
  { key: 'moloz-camiyani', title: 'Moloz - Camiyanı', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01057288454504, lng: 39.72335955640349 },
  { key: 'moloz-caglayan', title: 'Moloz - Çağlayan', category: 'Dolmuş Durakları', categoryKey: 'dolmus', detailKey: '', image: null, tags: [], lat: 41.01044335072484, lng: 39.7235634042647 },
];

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedKey, setSelectedKey] = React.useState<string>('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedStopKeys, setSelectedStopKeys] = React.useState<string[]>([]);

  const toggleCategory = (catKey: string) => {
    setSelectedCategories(prev =>
      prev.includes(catKey) ? prev.filter(c => c !== catKey) : [...prev, catKey]
    );
    setSelectedKey(''); // Seçim değiştiğinde aktif pin odağını sıfırla
  };

  const toggleStopSelection = (stopKey: string) => {
    setSelectedStopKeys(prev =>
      prev.includes(stopKey) ? prev.filter(k => k !== stopKey) : [...prev, stopKey]
    );
  };

  const CAROUSEL_POINTS = React.useMemo(() => {
    let pts = MAP_POINTS.filter((p) => p.detailKey !== '');
    if (selectedCategories.length > 0) {
      pts = pts.filter((p) => selectedCategories.includes(p.categoryKey));
    }
    return pts;
  }, [selectedCategories]);

  const flatListRef = React.useRef<FlatList<MapPoint>>(null);
  const mapRef = React.useRef<any>(null);

  const filteredResults = React.useMemo(() => {
    return searchRegistry(searchQuery);
  }, [searchQuery]);

  // Leaflet JS dynamic HTML source code configuration
  const mapHtml = React.useMemo(() => {
    const filteredPoints = MAP_POINTS.filter((point) => {
      // First, filter by main categories
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(point.categoryKey)) {
          return false;
        }
      }
      // Second, if it's a dolmuş stop and selectedStopKeys is not empty, filter by selectedStopKeys
      if (point.categoryKey === 'dolmus') {
        if (selectedStopKeys.length > 0) {
          return selectedStopKeys.includes(point.key);
        }
      }
      return true;
    });

    const pointsData = filteredPoints.map((point) => {
      const style = CATEGORY_STYLES[point.categoryKey];
      return {
        key: point.key,
        title: point.title,
        lat: point.lat,
        lng: point.lng,
        color: style.color,
        svgIcon: SVG_ICONS[style.icon],
        categoryKey: point.categoryKey,
        detailKey: point.detailKey,
      };
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body { padding: 0; margin: 0; background-color: #f3f4f6; }
    html, body, #map { height: 100%; width: 100vw; }
    .custom-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .marker-bubble {
      width: 28px;
      height: 28px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid #FFF;
      box-shadow: 0 2px 4px rgba(0,0,0,0.25);
      z-index: 2;
      transition: all 0.15s ease-in-out;
    }
    .marker-arrow {
      width: 10px;
      height: 10px;
      transform: rotate(45deg);
      margin-top: -5px;
      border-right: 1.5px solid #FFF;
      border-bottom: 1.5px solid #FFF;
      z-index: 1;
      transition: all 0.15s ease-in-out;
    }
    .pulse-circle {
      position: absolute;
      width: 44px;
      height: 44px;
      border-radius: 22px;
      border: 2px solid;
      opacity: 0.5;
      animation: pulse 1.5s infinite;
      z-index: 0;
      pointer-events: none;
    }
    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 0.5; }
      100% { transform: scale(1.3); opacity: 0; }
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    // Trabzon center setup, zooming out can show all of Turkey (Level 5)
    var map = L.map('map', {
      zoomControl: false,
      minZoom: 4,
      maxZoom: 18
    }).setView([41.006624700467356, 39.7374947331336], 14);

    // Standard road layer tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    var markers = {};
    var pointsData = ${JSON.stringify(pointsData)};

    pointsData.forEach(function(point) {
      var isDefaultSelected = (point.key === '${selectedKey}');

      // --- Popup HTML (no inline onclick - avoids quote-escaping crashes) ---
      // detailKey === '' is the most reliable dolmuş stop signal (all other points have a non-empty detailKey)
      var popupContent = '<div style="font-family: sans-serif; padding: 6px; text-align: center; min-width: 140px;">';
      popupContent += '<b style="font-size: 14px; color: #1F2937; display: block; margin-bottom: 8px;">' + point.title + '</b>';
      if (!point.detailKey || point.detailKey === '') {
        popupContent += '<button id="btn-' + point.key + '" style="background-color: #3B82F6; color: white; border: none; padding: 8px 12px; font-size: 12px; font-weight: bold; border-radius: 6px; cursor: pointer; width: 100%; display: block; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">Yol Tarifi Al</button>';
      }
      popupContent += '</div>';

      // --- Marker icon HTML ---
      var markerHtml = '<div class="custom-marker" id="marker-' + point.key + '">';
      markerHtml += '<div class="pulse-circle" style="border-color: ' + point.color + '; display: ' + (isDefaultSelected ? 'block' : 'none') + ';"></div>';
      markerHtml += '<div class="marker-bubble" style="background-color: ' + point.color + '; width: ' + (isDefaultSelected ? '34px' : '28px') + '; height: ' + (isDefaultSelected ? '34px' : '28px') + '; border-radius: ' + (isDefaultSelected ? '17px' : '14px') + '">';
      markerHtml += '<svg style="width: 13px; height: 13px; fill: white;" viewBox="0 0 512 512">' + point.svgIcon + '</svg>';
      markerHtml += '</div>';
      markerHtml += '<div class="marker-arrow" style="background-color: ' + point.color + '"></div>';
      markerHtml += '</div>';

      var customIcon = L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: [30, 35],
        iconAnchor: [15, 35]
      });

      var marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(popupContent, { closeButton: false, offset: [0, -10] });

      // Wire the "Yol Tarifi Al" button safely after the popup opens in the DOM
      marker.on('popupopen', function() {
        var btn = document.getElementById('btn-' + point.key);
        if (btn) {
          btn.onclick = function(e) {
            if (e) e.preventDefault();
            var msg = JSON.stringify({ type: 'ROUTE_TO_STOP', lat: point.lat, lng: point.lng });
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(msg);
            } else {
              window.parent.postMessage(msg, '*');
            }
          };
        }
      });

      marker.on('click', function() {
        if (point.detailKey !== '') {
          var msg = JSON.stringify({ type: 'PIN_SELECTED', key: point.key });
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(msg);
          } else {
            window.parent.postMessage(msg, '*');
          }
        }
      });

      markers[point.key] = {
        marker: marker,
        point: point
      };
    });

    function selectPin(key) {
      // Reset all markers to default state first
      Object.keys(markers).forEach(function(k) {
        var el = document.getElementById('marker-' + k);
        if (el) {
          var pulse = el.querySelector('.pulse-circle');
          var bubble = el.querySelector('.marker-bubble');
          if (pulse) pulse.style.display = (k === key && key !== '') ? 'block' : 'none';
          if (bubble) {
            if (k === key && key !== '') {
              bubble.style.width = '34px';
              bubble.style.height = '34px';
              bubble.style.borderRadius = '17px';
            } else {
              bubble.style.width = '28px';
              bubble.style.height = '28px';
              bubble.style.borderRadius = '14px';
            }
          }
        }
      });
      if (key !== '' && markers[key]) {
        map.setView([markers[key].point.lat, markers[key].point.lng], 15, { animate: true });
      }
    }
    window.selectPin = selectPin;

    // Clear selection when tapping empty map area
    map.on('click', function(e) {
      var target = e.originalEvent.target;
      if (
        target.id === 'map' ||
        target.classList.contains('leaflet-container') ||
        target.classList.contains('leaflet-tile') ||
        target.classList.contains('leaflet-tile-container') ||
        target.tagName === 'CANVAS'
      ) {
        selectPin('');
        var msg = JSON.stringify({ type: 'CLEAR_SELECTION' });
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(msg);
        } else {
          window.parent.postMessage(msg, '*');
        }
      }
    });

    window.addEventListener('message', function(event) {
      try {
        var data = JSON.parse(event.data);
        if (data.type === 'SELECT_PIN') {
          selectPin(data.key);
        } else if (data.type === 'ZOOM_IN') {
          map.zoomIn();
        } else if (data.type === 'ZOOM_OUT') {
          map.zoomOut();
        }
      } catch (e) {}
    });
  </script>
</body>
</html>
    `;
  }, [selectedCategories, selectedStopKeys]);

  // Listen to carousel selection changes and pan/zoom map automatically
  React.useEffect(() => {
    if (selectedKey) {
      if (Platform.OS === 'web') {
        mapRef.current?.contentWindow?.postMessage(
          JSON.stringify({ type: 'SELECT_PIN', key: selectedKey }),
          '*'
        );
      } else {
        mapRef.current?.injectJavaScript(`if (window.selectPin) { window.selectPin('${selectedKey}'); }`);
      }
    }
  }, [selectedKey]);

  // Set up Message event listener for Web Platform
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWebMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'PIN_SELECTED') {
            setSelectedKey(data.key);
            const carouselPoints = CAROUSEL_POINTS;
            const index = carouselPoints.findIndex((p) => p.key === data.key);
            if (index !== -1) {
              flatListRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5,
              });
            }
          } else if (data.type === 'CLEAR_SELECTION') {
            setSelectedKey('');
            setSelectedStopKeys([]);
          } else if (data.type === 'ROUTE_TO_STOP') {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lng}`;
            Linking.openURL(url);
          }
        } catch (e) {
          // Ignore non-json frames messages
        }
      };
      window.addEventListener('message', handleWebMessage);
      return () => window.removeEventListener('message', handleWebMessage);
    }
  }, []);

  const handleQuickAccess = async (key: string) => {
    if (key === 'duyuru') {
      const url = 'https://www.trabzonortahisar.bel.tr/duyurular';
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
    }
  };

  const handleCardPress = (item: MapPoint) => {
    if (item.categoryKey === 'dolmus') return; // dolmuş stops have no Places detail page
    navigation.navigate('Places', {
      categoryKey: item.categoryKey as 'dogal' | 'tarihi' | 'park' | 'manzara' | 'isletme',
      detailKey: item.detailKey,
    });
  };

  const handleZoomIn = () => {
    if (Platform.OS === 'web') {
      mapRef.current?.contentWindow?.postMessage(
        JSON.stringify({ type: 'ZOOM_IN' }),
        '*'
      );
    } else {
      mapRef.current?.injectJavaScript(`map.zoomIn();`);
    }
  };

  const handleZoomOut = () => {
    if (Platform.OS === 'web') {
      mapRef.current?.contentWindow?.postMessage(
        JSON.stringify({ type: 'ZOOM_OUT' }),
        '*'
      );
    } else {
      mapRef.current?.injectJavaScript(`map.zoomOut();`);
    }
  };

  const handleNativeMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'PIN_SELECTED') {
        setSelectedKey(data.key);
        const carouselPoints = CAROUSEL_POINTS;
        const index = carouselPoints.findIndex((p) => p.key === data.key);
        if (index !== -1) {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        }
      } else if (data.type === 'CLEAR_SELECTION') {
        setSelectedKey('');
        setSelectedStopKeys([]);
      } else if (data.type === 'ROUTE_TO_STOP') {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lng}`;
        Linking.openURL(url);
      }
    } catch (e) {
      console.warn('Failed parsing native webview frame message:', e);
    }
  };

  const onMomentumScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + CARD_GAP));
    if (index >= 0 && index < CAROUSEL_POINTS.length) {
      setSelectedKey(CAROUSEL_POINTS[index].key);
    }
  };

  const renderCarouselItem = ({ item }: { item: MapPoint }) => {
    const isSelected = selectedKey === item.key;
    const style = CATEGORY_STYLES[item.categoryKey];
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.category}. Detaylar için tıkla.`}
        onPress={() => handleCardPress(item)}
        style={[
          styles.carouselCard,
          isSelected && { borderColor: style.color, borderWidth: 2.5 },
          cardShadow,
        ]}
      >
        {/* Üst Kısım: Resim Konteyneri */}
        <View style={styles.cardImageContainer}>
          <ImageBackground
            source={item.image}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>

        {/* Alt Kısım: Beyaz İçerik Alanı */}
        <View style={styles.cardContentContainer}>
          <View style={[styles.cardTagWrap, { backgroundColor: style.color }]}>
            <Text style={styles.cardTagText}>{item.category}</Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.cardDetailRow}>
            <Text style={[styles.cardDetailLink, { color: style.color }]}>Detayları Gör</Text>
            <Ionicons name="arrow-forward" size={12} color={style.color} />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Üst Arama ve Mikro Butonlar Bölümü */}
      <View style={styles.header}>
        <SearchField
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
        {searchQuery.trim().length === 0 && (
          <View style={styles.topButtonsRow}>
            {/* Duyurular Butonu */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Duyurular"
              onPress={() => handleQuickAccess('duyuru')}
              style={({ pressed }) => [
                styles.topBadgeBtn,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Ionicons
                name="megaphone-outline"
                size={15}
                color={colors.primary}
              />
              <Text style={styles.topBadgeBtnText}>Duyurular</Text>
            </Pressable>

            {/* Haberler Butonu */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Haberler"
              onPress={() => Linking.openURL('https://www.trabzonortahisar.bel.tr/haberler')}
              style={({ pressed }) => [
                styles.topBadgeBtn,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Ionicons
                name="newspaper-outline"
                size={15}
                color={colors.primary}
              />
              <Text style={styles.topBadgeBtnText}>Haberler</Text>
            </Pressable>

            {/* YENİ: Web Sitemiz Butonu */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Web Sitemiz"
              onPress={() => Linking.openURL('https://www.trabzonortahisar.bel.tr/')}
              style={({ pressed }) => [
                styles.topBadgeBtn,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Ionicons
                name="globe-outline"
                size={15}
                color={colors.primary}
              />
              <Text style={styles.topBadgeBtnText}>Web Sitemiz</Text>
            </Pressable>
          </View>
        )}
        {searchQuery.trim().length === 0 && (
          <View style={styles.socialMediaRow}>
            {/* Facebook */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ortahisar Belediyesi Facebook Sayfası"
              onPress={() => Linking.openURL('https://www.facebook.com/trbortahisarbel?mibextid=ZbWKwL')}
              style={({ pressed }) => [styles.socialIconBtn, pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] }]}
            >
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
            </Pressable>

            {/* X (Twitter) */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ortahisar Belediyesi X Hesabı"
              onPress={() => Linking.openURL('https://x.com/trbortahisarbel')}
              style={({ pressed }) => [styles.socialIconBtn, pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] }]}
            >
              <Ionicons name="logo-twitter" size={20} color="#000000" />
            </Pressable>

            {/* Instagram */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ortahisar Belediyesi Instagram Hesabı"
              onPress={() => Linking.openURL('https://www.instagram.com/trortahisarbel/')}
              style={({ pressed }) => [styles.socialIconBtn, pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] }]}
            >
              <Ionicons name="logo-instagram" size={20} color="#E1306C" />
            </Pressable>

            {/* YouTube */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ortahisar Belediyesi YouTube Kanalı"
              onPress={() => Linking.openURL('https://www.youtube.com/channel/UCspHo01bOgAIRfS8HXPwSLg?reload=9')}
              style={({ pressed }) => [styles.socialIconBtn, pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] }]}
            >
              <Ionicons name="logo-youtube" size={20} color="#FF0000" />
            </Pressable>
          </View>
        )}
      </View>

      {/* Arama Yapılıyorsa Sonuç Overlay'i */}
      {searchQuery.trim().length > 0 ? (
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={[styles.searchResultsContainer, cardShadow]}>
            {filteredResults.length > 0 ? (
              <View style={styles.resultsList}>
                {filteredResults.map((item, idx) => (
                  <View key={`${item.tab}-${item.key}`}>
                    {idx > 0 && <View style={styles.resultDivider} />}
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${item.title}, Kategori: ${item.category}`}
                      onPress={() => {
                        setSearchQuery('');
                        navigation.navigate(item.tab as any, item.routeParams as any);
                      }}
                      style={({ pressed }) => [
                        styles.resultCard,
                        pressed && styles.resultCardPressed,
                      ]}
                    >
                      <View style={styles.resultHeader}>
                        <Text style={styles.resultTitle}>{item.title}</Text>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryBadgeText}>
                            {item.category}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.resultDesc} numberOfLines={2}>
                        {item.description}
                      </Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noResultsCard}>
                <Ionicons
                  name="search-outline"
                  size={24}
                  color={colors.textMuted}
                />
                <Text style={styles.noResultsText}>Sonuç bulunamadı</Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        /* Canlı İnteraktif Harita ve Carousel Bölümü */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 40 }
          ]}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          {/* Canlı Harita Konteyneri */}
          <View style={[styles.mapWrapper, cardShadow]}>
            <WebViewComponent
              ref={mapRef}
              html={mapHtml}
              onMessage={handleNativeMessage}
              style={styles.webviewStyle}
            />

            {/* Modüler Floating Zoom Kontrolleri */}
            <View style={styles.zoomControls}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Yakınlaştır"
                onPress={handleZoomIn}
                style={({ pressed }) => [
                  styles.zoomBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="add" size={18} color="#374151" />
              </Pressable>
              <View style={styles.zoomDivider} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Uzaklaştır"
                onPress={handleZoomOut}
                style={({ pressed }) => [
                  styles.zoomBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="remove" size={18} color="#374151" />
              </Pressable>
            </View>
          </View>

          {/* Harita Lejantı (Legend) */}
          <View style={styles.legendContainer}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Doğal Güzellikler Filtresi"
              onPress={() => toggleCategory('dogal')}
              style={[
                styles.legendItem,
                { opacity: selectedCategories.length > 0 && !selectedCategories.includes('dogal') ? 0.4 : 1.0 }
              ]}
            >
              <View style={[styles.legendDot, { backgroundColor: CATEGORY_STYLES.dogal.color }]}>
                <Ionicons name={CATEGORY_STYLES.dogal.icon as any} size={8.5} color="#FFF" />
              </View>
              <Text style={styles.legendText}>Doğa</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tarihi Yerler Filtresi"
              onPress={() => toggleCategory('tarihi')}
              style={[
                styles.legendItem,
                { opacity: selectedCategories.length > 0 && !selectedCategories.includes('tarihi') ? 0.4 : 1.0 }
              ]}
            >
              <View style={[styles.legendDot, { backgroundColor: CATEGORY_STYLES.tarihi.color }]}>
                <Ionicons name={CATEGORY_STYLES.tarihi.icon as any} size={8.5} color="#FFF" />
              </View>
              <Text style={styles.legendText}>Tarih</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Parklar Filtresi"
              onPress={() => toggleCategory('park')}
              style={[
                styles.legendItem,
                { opacity: selectedCategories.length > 0 && !selectedCategories.includes('park') ? 0.4 : 1.0 }
              ]}
            >
              <View style={[styles.legendDot, { backgroundColor: CATEGORY_STYLES.park.color }]}>
                <Ionicons name={CATEGORY_STYLES.park.icon as any} size={8.5} color="#FFF" />
              </View>
              <Text style={styles.legendText}>Park</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Manzara Noktaları Filtresi"
              onPress={() => toggleCategory('manzara')}
              style={[
                styles.legendItem,
                { opacity: selectedCategories.length > 0 && !selectedCategories.includes('manzara') ? 0.4 : 1.0 }
              ]}
            >
              <View style={[styles.legendDot, { backgroundColor: CATEGORY_STYLES.manzara.color }]}>
                <Ionicons name={CATEGORY_STYLES.manzara.icon as any} size={8.5} color="#FFF" />
              </View>
              <Text style={styles.legendText}>Manzara</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="İşletmeler Filtresi"
              onPress={() => toggleCategory('isletme')}
              style={[
                styles.legendItem,
                { opacity: selectedCategories.length > 0 && !selectedCategories.includes('isletme') ? 0.4 : 1.0 }
              ]}
            >
              <View style={[styles.legendDot, { backgroundColor: CATEGORY_STYLES.isletme.color }]}>
                <Ionicons name={CATEGORY_STYLES.isletme.icon as any} size={8.5} color="#FFF" />
              </View>
              <Text style={styles.legendText}>İşletme</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dolmuş Durakları Filtresi"
              onPress={() => toggleCategory('dolmus')}
              style={[
                styles.legendItem,
                { opacity: selectedCategories.length > 0 && !selectedCategories.includes('dolmus') ? 0.4 : 1.0 }
              ]}
            >
              <View style={[styles.legendDot, { backgroundColor: CATEGORY_STYLES.dolmus.color }]}>
                <Ionicons name={CATEGORY_STYLES.dolmus.icon as any} size={8.5} color="#FFF" />
              </View>
              <Text style={styles.legendText}>Dolmuş</Text>
            </Pressable>
          </View>

          {/* Yatay Önizleme Carousel'i */}
          <View style={[styles.carouselWrapper, { paddingBottom: tabBarHeight + 14 }]}>
            {selectedCategories.length === 1 && selectedCategories.includes('dolmus') && (
              <View style={styles.dolmusLegend}>
                <Text style={styles.dolmusLegendText}>
                  ℹ️ <Text style={{fontWeight: 'bold'}}>P:</Text> Postane | <Text style={{fontWeight: 'bold'}}>T:</Text> Tanjant | <Text style={{fontWeight: 'bold'}}>M:</Text> Moloz
                </Text>
              </View>
            )}
            {/* Durak Çipleri Artık Doğrudan Kartların Tepesinde Sabit kalacak */}
            {selectedCategories.includes('dolmus') && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.stopChipsContainer}
              >
                {MAP_POINTS.filter(p => p.categoryKey === 'dolmus').map((stop) => {
                  const isStopSelected = selectedStopKeys.includes(stop.key);
                  return (
                    <Pressable
                      key={stop.key}
                      onPress={() => toggleStopSelection(stop.key)}
                      style={[
                        styles.stopChip,
                        isStopSelected && styles.stopChipSelected,
                        { opacity: selectedStopKeys.length > 0 && !isStopSelected ? 0.5 : 1.0 }
                      ]}
                    >
                      <Ionicons 
                        name="bus-outline" 
                        size={12} 
                        color={isStopSelected ? '#FFFFFF' : '#3B82F6'} 
                      />
                      <Text style={[
                        styles.stopChipText,
                        isStopSelected && styles.stopChipTextSelected
                      ]}>
                        {stop.title.replace('Postane - ', 'P - ').replace('Tanjant - ', 'T - ').replace('Moloz - ', 'M - ')}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

            <FlatList
              ref={flatListRef}
              data={CAROUSEL_POINTS}
              renderItem={renderCarouselItem}
              keyExtractor={(item) => item.key}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContainer}
              snapToInterval={CARD_WIDTH + CARD_GAP}
              decelerationRate="fast"
              onMomentumScrollEnd={onMomentumScrollEnd}
              getItemLayout={(data, index) => ({
                length: CARD_WIDTH + CARD_GAP,
                offset: (CARD_WIDTH + CARD_GAP) * index,
                index,
              })}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Açık gri arka plan
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#F3F4F6',
  },
  topButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
    marginTop: 4,
  },
  topBadgeBtn: {
    flex: 1, // Üç butonun da satırı eşit paylaşmasını sağlar
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.secondarySoft,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 95, // Taşmaları önlemek için güvenli minimum genişlik
  },
  topBadgeBtnText: {
    fontSize: 12, // Üç buton yan yana sığsın diye yazı boyutunu 12 yaptık
    fontWeight: '800',
    color: colors.textPrimary,
  },
  socialMediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  socialIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    // Hafif gölge efekti
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.96 }],
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mapWrapper: {
    minHeight: 280,
    backgroundColor: '#E5E7EB',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 20,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: 16,
  },
  iframeStyle: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
  webviewStyle: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  zoomControls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
  zoomBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 6,
  },
  carouselWrapper: {
    marginTop: 4,
  },
  carouselContainer: {
    paddingHorizontal: 20,
    paddingBottom: 2,
  },
  carouselCard: {
    width: CARD_WIDTH,
    height: 170,
    borderRadius: radius.lg,
    marginRight: CARD_GAP,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  carouselCardSelected: {
    borderWidth: 2.5,
  },
  cardImageContainer: {
    width: '100%',
    height: '55%',
    backgroundColor: '#F3F4F6',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageRadius: {
    borderRadius: radius.md,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.20)',
    borderRadius: radius.md,
  },
  cardContentContainer: {
    width: '100%',
    height: '45%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    padding: 10,
  },
  cardTagWrap: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 2,
  },
  cardDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardDetailLink: {
    fontSize: 11,
    fontWeight: '700',
  },
  scroll: {
    paddingHorizontal: 20,
    flex: 1,
  },
  searchResultsContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 10,
    overflow: 'hidden',
    padding: 8,
  },
  resultsList: {
    flexDirection: 'column',
  },
  resultCard: {
    padding: 12,
    borderRadius: radius.md,
  },
  resultCardPressed: {
    backgroundColor: colors.searchBg,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  resultDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  resultDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  noResultsCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    marginHorizontal: 20,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
   legendText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#4B5563',
  },
  stopChipsContainer: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
    height: 32,
  },
  stopChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    height: 28,
  },
  stopChipSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
  },
  stopChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E40AF',
  },
  stopChipTextSelected: {
    color: '#FFFFFF',
  },
  dolmusLegend: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  dolmusLegendText: {
    fontSize: 12,
    color: '#475569',
  },
});
