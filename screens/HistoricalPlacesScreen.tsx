import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cardShadow } from '../constants/layout';
import { colors, radius } from '../theme';

export type HistoricalPlace = {
  key: string;
  title: string;
  description: string;
  shortInfo: string;
  tags: string[];
  image: ImageSourcePropType;
  mapUrl: string;
  museumCard?: {
    title: string;
    text: string;
  };
  transport?:
    | {
        kind: 'two';
        dolmusText: string;
        otobusText: string;
      }
    | {
        kind: 'single';
        title: string;
        text: string;
      };
};

export const HISTORICAL_PLACES: readonly HistoricalPlace[] = [
  {
    key: 'kucuk-ayvasil-kilisesi',
    title: 'Küçük Ayvasıl Kilisesi',
    description: 'Trabzon’un en eski kiliselerinden biri',
    shortInfo:
      'Küçük Ayvasıl Kilisesi’nin M.S. 9. yüzyılda Bizans İmparatoru I. Basil döneminde yeniden inşa edildiği düşünülmektedir. Trabzon’un en eski kiliselerinden biri kabul edilen yapı, bazilika planlı mimarisi, Roma etkili sütunları ve günümüze ulaşan fresk kalıntılarıyla dikkat çekmektedir.',
    tags: ['Tarih', 'Kilise', 'Bizans'],
    image: require('../assets/places/ayvasil.jpg'),
    mapUrl: 'https://maps.app.goo.gl/8X5uBU2ymVHW1KGr8',
    museumCard: {
      title: 'Müzekart',
      text: 'Ziyaretlerde Müzekart geçerlidir.',
    },
    transport: {
      kind: 'two',
      dolmusText: 'Postane - Beşirli dolmuşları kullanılabilir.',
      otobusText:
        '114 numaralı belediye otobüsü kullanılarak 1032 - Hacı Kasım Camii 2 durağında inilebilir.',
    },
  },
  {
    key: 'ayasofya',
    title: 'Trabzon Ayasofya Camii',
    description: 'Tarihi freskleriyle öne çıkan yapı',
    shortInfo:
      '13. yüzyılda Trabzon Rum İmparatorluğu döneminde kilise olarak inşa edilen yapı, Osmanlı döneminde camiye çevrilmiştir. Tarihi freskleri, taş işçiliği ve mimarisiyle Trabzon’un en önemli kültürel mirasları arasında yer almaktadır.',
    tags: ['Tarih', 'Mimari', 'Kültür'],
    image: require('../assets/places/ayasofya.jpg'),
    mapUrl: 'https://maps.app.goo.gl/7eC9FJL7uxKkXNfYA',
    transport: {
      kind: 'two',
      dolmusText: 'Moloz - Fatih dolmuşları kullanılabilir.',
      otobusText:
        '133A numaralı belediye otobüsü kullanılarak 2948 - Ayasofya durağında inilebilir.',
    },
  },
  {
    key: 'ataturk-kosku',
    title: 'Atatürk Köşkü',
    description: 'Atatürk’ün Trabzon ziyaretlerinde konakladığı köşk',
    shortInfo:
      '20. yüzyılın başlarında yaptırılan köşk, Mustafa Kemal Atatürk’ün Trabzon ziyaretlerinde konakladığı önemli yapılardan biridir. Günümüzde müze olarak hizmet veren yapı, mimarisi ve tarihi eşyalarıyla ziyaretçilerin ilgisini çekmektedir.',
    tags: ['Müze', 'Tarih', 'Köşk'],
    image: require('../assets/places/ataturk-kosku.jpg'),
    mapUrl: 'https://maps.app.goo.gl/n7fEAbCvx6cQDqMP6',
    transport: {
      kind: 'two',
      dolmusText: 'Postane - Çamlık dolmuşları kullanılabilir.',
      otobusText:
        '104 numaralı belediye otobüsü kullanılarak 1217 - Atatürk Köşkü durağında inilebilir.',
    },
  },
  {
    key: 'trabzon-kalesi',
    title: 'Trabzon Kalesi',
    description: 'Ortahisar bölgesindeki tarihi kale yapısı',
    shortInfo:
      'Trabzon Kalesi’nin temellerinin Roma dönemine kadar uzandığı düşünülmektedir. Bizans, Komnenos ve Osmanlı dönemlerinde çeşitli onarımlar gören kale, Trabzon’un tarihi savunma yapılarından biridir.',
    tags: ['Kale', 'Tarih', 'Şehir'],
    image: require('../assets/places/kale.jpeg'),
    mapUrl: 'https://maps.app.goo.gl/B6wjyPbd28EBMgip6',
    transport: {
      kind: 'two',
      dolmusText: 'Postane - Bahçecik dolmuşları kullanılabilir.',
      otobusText:
        '105 numaralı belediye otobüsü kullanılarak 1576 - Bahçecik Zağnos Vadisi Yol Ayrımı durağında inilebilir.',
    },
  },
  {
    key: 'gulbahar-hatun-camii',
    title: 'Gülbahar Hatun Camii',
    description: 'Osmanlı döneminden önemli tarihi cami',
    shortInfo:
      'Osmanlı Padişahı Yavuz Sultan Selim tarafından annesi Gülbahar Hatun adına 16. yüzyılda yaptırılmıştır. Erken Osmanlı mimarisinin Trabzon’daki önemli örneklerinden biri kabul edilmektedir.',
    tags: ['Osmanlı', 'Tarih', 'Mimari'],
    image: require('../assets/places/gulbahar-hatun.jpg'),
    mapUrl: 'https://maps.app.goo.gl/8k1xoYCHh694EEQMA',
    transport: {
      kind: 'two',
      dolmusText: 'Postane - Bahçecik dolmuşları kullanılabilir.',
      otobusText:
        '105 numaralı belediye otobüsü kullanılarak 1030 - Atapark durağında inilebilir.',
    },
  },
  {
    key: 'kizlar-manastiri',
    title: 'Kızlar Manastırı',
    description: 'Kayalıklar üzerine kurulmuş tarihi manastır',
    shortInfo:
      'Boztepe yamaçlarında bulunan Kızlar Manastırı’nın Bizans döneminde inşa edildiği düşünülmektedir. Tarihi boyunca dini eğitim ve ibadet amacıyla kullanılan yapı, restore edilerek turizme kazandırılmıştır.',
    tags: ['Tarih', 'Manastır', 'Kültür'],
    image: require('../assets/places/kizlar-manastir.jpg'),
    mapUrl: 'https://maps.app.goo.gl/9ebAiXChju2jBXtw7',
    transport: {
      kind: 'two',
      dolmusText: 'Tanjant - Boztepe dolmuşları kullanılabilir.',
      otobusText:
        '141 numaralı belediye otobüsü kullanılarak 1580 - Boztepe İlköğretim Okulu durağında inilebilir.',
    },
  },
  {
    key: 'bedesten',
    title: 'Bedesten',
    description: 'Tarihi çarşı ve ticaret merkezi',
    shortInfo:
      'Trabzon Bedesteni, Osmanlı döneminde şehrin önemli ticaret merkezlerinden biri olarak kullanılmıştır. Tarihi çarşı kültürünü günümüze taşıyan yapı, geleneksel Trabzon ticaret yaşamının önemli simgelerinden biridir.',
    tags: ['Tarih', 'Çarşı', 'Kültür'],
    image: require('../assets/places/bedesten.jpg'),
    mapUrl: 'https://maps.app.goo.gl/CvSpTuAYgRNskFj76',
    transport: {
      kind: 'single',
      title: 'Ulaşım Bilgisi',
      text: 'Bedesten şehir merkezinde bulunmaktadır. Meydandan uzak bir konumdaysanız herhangi bir Meydan dolmuşu veya Meydan güzergahından geçen belediye otobüslerini kullanabilirsiniz.',
    },
  },
  {
    key: 'kostaki-konagi',
    title: 'Köstaki Konağı',
    description: 'Tarihi Trabzon konağı ve müze yapısı',
    shortInfo:
      'Trabzon Müzesi olarak kullanılan Köstaki Konağı, 1900’lü yılların başında Banker Kostaki Teophylaktos tarafından yaptırılmıştır. Yapının mimarlarının İtalyan olduğu düşünülmekte olup kullanılan bazı malzemeler İtalya’dan getirilmiştir. Milli Mücadele döneminde karargâh olarak kullanılan konak, 1924 yılında Atatürk’ün Trabzon ziyareti sırasında konaklaması için hazırlanmıştır. Günümüzde tarihi eserlerin sergilendiği önemli bir müze yapısıdır.',
    tags: ['Müze', 'Konak', 'Tarih'],
    image: require('../assets/places/kostaki.jpg'),
    mapUrl: 'https://maps.app.goo.gl/p1zS1dyG9NSrgthE6',
    museumCard: {
      title: 'Müzekart',
      text: 'Ziyaretlerde Müzekart geçerlidir.',
    },
    transport: {
      kind: 'single',
      title: 'Ulaşım Bilgisi',
      text: 'Köstaki Konağı şehir merkezinde yer almakta olup Meydan bölgesinden yaklaşık 5 dakikalık yürüme mesafesindedir.',
    },
  },
  {
    key: 'kanuni-evi',
    title: 'Kanuni Evi',
    description: 'Kanuni Sultan Süleyman’ın doğduğu ev',
    shortInfo:
      'Osmanlı Padişahı Kanuni Sultan Süleyman’ın Trabzon’da doğduğu kabul edilen tarihi yapı, Osmanlı dönemi Trabzon yaşamını yansıtan önemli kültürel noktalardan biridir.',
    tags: ['Osmanlı', 'Tarih', 'Müze'],
    image: require('../assets/places/kanuni-evi.jpg'),
    mapUrl: 'https://maps.app.goo.gl/zMwfTfLZ7AtP9bFu5',
    transport: {
      kind: 'two',
      dolmusText: 'Postane - Bahçecik dolmuşları kullanılabilir.',
      otobusText:
        '105 numaralı belediye otobüsü kullanılarak 1030 - Atapark durağında inilebilir.',
    },
  },
  {
    key: 'hasan-pasa-hamami',
    title: 'Hasan Paşa Asker Hamamı Müzesi',
    description: 'Ortahisar Belediyesi tarafından restore edilen tarihi hamam müzesi',
    shortInfo:
      'Tarihi Hasan Paşa Asker Hamamı, Ortahisar Belediyesi tarafından yürütülen kapsamlı restorasyon projesi sonrasında kültürel mirasın korunması ve sergilenmesi amacıyla müzeye dönüştürülmüştür. Hamam kültürü, tarihi askeri dokular ve yerel etnografik eserler burada ziyaretçilere sunulmaktadır.',
    tags: ['Müze', 'Tarih', 'Hamam Kültürü'],
    image: require('../assets/places/bedesten.jpg'),
    mapUrl: 'https://maps.app.goo.gl/HasanPasaHamami',
    transport: {
      kind: 'single',
      title: 'Ulaşım Bilgisi',
      text: 'Meydan bölgesine yakın konumda bulunan müzeye şehir merkezinden yürüyerek veya tüm merkez dolmuşlarıyla kolayca ulaşım sağlanabilir.',
    },
  },
] as const;

export function HistoricalPlacesScreen({
  onBack,
  onSelect,
  view,
}: {
  onBack: () => void;
  onSelect: (place: HistoricalPlace) => void;
  view: string;
}) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [showListStickyBack, setShowListStickyBack] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const prevViewRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (view === 'tarihi' && prevViewRef.current === 'root') {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
    prevViewRef.current = view;
  }, [view]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: tabBarHeight + 28 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setShowListStickyBack(offsetY > 180);
        }}
        scrollEventThrottle={16}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Geri"
          onPress={onBack}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.9 }]}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          <Text style={styles.backText}>Gezilecek Yerler</Text>
        </Pressable>

        <Text style={styles.heroTitle}>Tarihi Yerler</Text>
        <Text style={styles.heroLead}>
          Manastırlar, camiler, kaleler — kısa açıklamalarla seç ve detaya geç.
        </Text>

        <View style={{ marginTop: 12 }}>
          {HISTORICAL_PLACES.map((p) => (
            <Pressable
              key={p.key}
              accessibilityRole="button"
              accessibilityLabel={p.title}
              onPress={() => onSelect(p)}
              style={({ pressed }) => [
                styles.card,
                cardShadow,
                pressed && styles.pressed,
              ]}
            >
              <ImageBackground
                source={p.image}
                style={styles.img}
                imageStyle={styles.imgRadius}
                resizeMode="cover"
              >
                <View style={styles.overlay} />
                <View style={styles.arrow}>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.onImage}
                  />
                </View>
              </ImageBackground>

              <View style={styles.body}>
                <Text style={styles.title}>{p.title}</Text>
                <Text style={styles.desc}>{p.description}</Text>
                <View style={styles.tags}>
                  {p.tags.map((t) => (
                    <View key={t} style={styles.tag}>
                      <Text style={styles.tagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      {showListStickyBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Geri Dön"
          onPress={onBack}
          style={({ pressed }) => [
            styles.stickyBackBtn,
            pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
          ]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.secondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  heroTitle: {
    marginTop: 12,
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.8,
  },
  heroLead: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  img: {
    height: 170,
    width: '100%',
    justifyContent: 'flex-end',
  },
  imgRadius: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    // Web: cover + center crop (native ignores safely)
    objectFit: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 18, 26, 0.18)',
  },
  arrow: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  body: {
    padding: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  desc: {
    marginTop: 6,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tags: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.secondarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondary,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  stickyBackBtn: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -30,
    width: 40,
    height: 60,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 0,
    elevation: 5,
    zIndex: 999,
  },
});

