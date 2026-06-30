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

export type Park = {
  key: string;
  title: string;
  description: string;
  tags: string[];
  image: ImageSourcePropType;
  mapUrl: string;
  transport: {
    kind: 'two';
    dolmusText: string;
    otobusText: string;
  };
  /** Doğal güzellikler detayıyla aynı restoran kartı düzeni; yoksa gösterilmez. */
  restaurantSuggestion?: {
    name: string;
    mapUrl: string;
  };
  /** Ziyaret / uyarı maddeleri; yoksa kart gösterilmez. */
  visitBullets?: readonly string[];
};

export const PARKS: readonly Park[] = [
  {
    key: 'zagnos-vadisi',
    title: 'Zağnos Vadisi Parkı',
    description: 'Tarihi surlar çevresinde şehir içi yürüyüş alanı',
    tags: ['Park', 'Yürüyüş', 'Şehir'],
    image: require('../assets/places/zagnos-park.jpg'),
    mapUrl: 'https://share.google/pcp3E0Dn8mGnQLfcA',
    transport: {
      kind: 'two',
      dolmusText: 'Bahçecik dolmuşları kullanılabilir.',
      otobusText:
        '105 numaralı belediye otobüsü kullanılarak 1523 - Bahçecik Yol Ayrımı durağında inilebilir.',
    },
  },
  {
    key: 'botanik',
    title: 'Trabzon Botanik Bahçesi',
    description: 'Şehir manzaralı botanik ve dinlenme alanı',
    tags: ['Doğa', 'Botanik', 'Manzara'],
    image: require('../assets/places/botanik.jpg'),
    mapUrl: 'https://share.google/XoMBomxieqmCf0ZTS',
    transport: {
      kind: 'two',
      dolmusText: 'Postane - Çamlık dolmuşları kullanılabilir.',
      otobusText:
        '117 numaralı belediye otobüsü kullanılarak 1081 - Atakent durağında inilebilir.',
    },
  },
  {
    key: 'besirli-ekopark',
    title: 'Beşirli EkoPark',
    description: 'Sahil kenarında yürüyüş ve dinlenme alanı',
    tags: ['Sahil', 'Park', 'Yürüyüş'],
    image: require('../assets/places/ekopark.jpg'),
    mapUrl: 'https://share.google/7KuBuXUQ98y22iCiv',
    transport: {
      kind: 'two',
      dolmusText: 'Postane - Beşirli dolmuşları kullanılabilir.',
      otobusText:
        '121 numaralı belediye otobüsü kullanılarak 1408 - Spor Kompleksi 2 durağında inildikten sonra yaklaşık 5 dakikalık yürüyüş ile ulaşılabilir.',
    },
  },
  {
    key: 'eyof',
    title: 'EYOF Park',
    description: 'Modern şehir parkı ve sosyal yaşam alanı',
    tags: ['Şehir', 'Park', 'Sosyal'],
    image: require('../assets/places/eyof-park.jpg'),
    mapUrl: 'https://share.google/SpQVYgCSR1rvuztjw',
    transport: {
      kind: 'two',
      dolmusText: 'Tanjant - KTÜ dolmuşları kullanılabilir.',
      otobusText:
        '121 numaralı belediye otobüsü kullanılarak 1087 - Forum AVM 2 durağında inildikten sonra yaklaşık 5 dakikalık yürüyüş ile ulaşılabilir.',
    },
  },
  {
    key: '100-yil',
    title: '100. Yıl Parkı',
    description: 'Şehir merkezinde dinlenme ve buluşma noktası',
    tags: ['Şehir', 'Dinlenme', 'Park'],
    image: require('../assets/places/100yil-park.jpg'),
    mapUrl: 'https://share.google/gYRQrZcSy3IZzDZ2L',
    transport: {
      kind: 'two',
      dolmusText: 'Tanjant - KTÜ dolmuşları kullanılabilir.',
      otobusText:
        '121 numaralı belediye otobüsü kullanılarak 1087 - Forum AVM 2 durağında inildikten sonra yaklaşık 5 dakikalık yürüyüş ile ulaşılabilir.',
    },
  },
  {
    key: 'meydan',
    title: 'Trabzon Meydan Parkı',
    description: 'Trabzon şehir merkezinin en bilinen buluşma noktası',
    tags: ['Meydan', 'Şehir', 'Park'],
    image: require('../assets/places/meydan-park.jpg'),
    mapUrl: 'https://share.google/nNcpcU1W7tuplYmwF',
    transport: {
      kind: 'two',
      dolmusText: 'Postane - Fatih dolmuşları kullanılabilir.',
      otobusText:
        '102 numaralı belediye otobüsü kullanılarak Meydan çevresindeki duraklarda inilebilir.',
    },
  },
  {
    key: 'tunel-akvaryum',
    title: 'Trabzon Tünel Akvaryum',
    description: 'Ortahisar Belediyesi’nin benzersiz tünel akvaryum projesi',
    tags: ['Akvaryum', 'Tünel', 'Turistik'],
    image: require('../assets/places/bedesten.jpg'),
    mapUrl: 'https://maps.app.goo.gl/TunelAkvaryum',
    transport: {
      kind: 'two',
      dolmusText: 'Meydan - Bahçecik / Ortahisar dolmuşları kullanılabilir.',
      otobusText:
        '105 numaralı belediye otobüsü kullanılarak Zağnos Vadisi çevresindeki duraklarda inilip ulaşım sağlanabilir.',
    },
    restaurantSuggestion: {
      name: 'Akvaryum Kafe',
      mapUrl: 'https://maps.app.goo.gl/AkvaryumKafe',
    },
  },
] as const;

export function ParksScreen({
  onBack,
  onSelect,
  view,
}: {
  onBack: () => void;
  onSelect: (park: Park) => void;
  view: string;
}) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [showListStickyBack, setShowListStickyBack] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const prevViewRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (view === 'parklar' && prevViewRef.current === 'root') {
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

        <Text style={styles.heroTitle}>Parklar</Text>
        <Text style={styles.heroLead}>
          Şehir parkları, yürüyüş alanları ve dinlenme noktaları.
        </Text>

        <View style={{ marginTop: 12 }}>
          {PARKS.map((p) => (
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
