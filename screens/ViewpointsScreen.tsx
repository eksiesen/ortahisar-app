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

export type ViewpointSpot = {
  key: string;
  title: string;
  description: string;
  tags: string[];
  image: ImageSourcePropType;
  mapUrl: string;
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
  /** Harita linki ve kısa açıklama; yoksa detayda bölüm gösterilmez */
  venueSuggestions?: readonly { mapUrl: string; description: string }[];
};

export const VIEWPOINTS: readonly ViewpointSpot[] = [
  {
    key: 'boztepe',
    title: 'Boztepe',
    description:
      'Trabzon şehir manzarasını izleyebileceğiniz en popüler noktalardan biri',
    tags: ['Manzara', 'Şehir', 'Seyir'],
    image: require('../assets/places/boztepe-seyir.jpg'),
    mapUrl: 'https://share.google/yCSRmC0n3SXaYYw4k',
    transport: {
      kind: 'two',
      dolmusText: 'Tanjant - Boztepe dolmuşları kullanılabilir.',
      otobusText:
        '141 numaralı belediye otobüsü kullanılarak 2668 - Kemik Hastanesi durağında inilebilir. Sonrasında yaklaşık 10 dakikalık yürüyüş mesafesi bulunmaktadır.',
    },
    venueSuggestions: [
      {
        mapUrl: 'https://share.google/2I6n3sTuIIYdnavGX',
        description:
          'Burada Trabzon manzarasına karşı semaver çay deneyimi yaşayabilirsiniz.',
      },
    ],
  },
  {
    key: 'ganita-sahili',
    title: 'Ganita Sahili',
    description: 'Sahil yürüyüşü ve gün batımı için popüler yaşam alanı',
    tags: ['Sahil', 'Gün Batımı', 'Yürüyüş'],
    image: require('../assets/places/ganita-sahil.jpg'),
    mapUrl: 'https://share.google/csbCkVqkH59wIHnRG',
    transport: {
      kind: 'single',
      title: 'Ulaşım Bilgisi',
      text: 'Ganita Sahili, Trabzon Meydan bölgesine yaklaşık 10 dakikalık yürüme mesafesinde bulunmaktadır.',
    },
    venueSuggestions: [
      {
        mapUrl: 'https://share.google/8daxEL15FieaYA48f',
        description: 'Ganita sahilinde balık ekmek deneyebilirsiniz.',
      },
    ],
  },
  {
    key: 'faroz-sahili',
    title: 'Faroz Sahili',
    description: 'Deniz manzarası ve sahil atmosferiyle öne çıkan bölge',
    tags: ['Sahil', 'Deniz', 'Manzara'],
    image: require('../assets/places/faroz-sahil.jpg'),
    mapUrl: 'https://share.google/RP6whwOn5oUqUK0WY',
    transport: {
      kind: 'two',
      dolmusText: 'Postane - Beşirli dolmuşları kullanılabilir.',
      otobusText:
        '114 numaralı belediye otobüsü kullanılarak 1028 - TS Avni Aker Stadı Karşısı durağında inilebilir.',
    },
  },
];

export function ViewpointsScreen({
  onBack,
  onSelect,
  view,
}: {
  onBack: () => void;
  onSelect: (spot: ViewpointSpot) => void;
  view: string;
}) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [showListStickyBack, setShowListStickyBack] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const prevViewRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (view === 'manzara' && prevViewRef.current === 'root') {
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

        <Text style={styles.heroTitle}>Manzara Noktaları</Text>
        <Text style={styles.heroLead}>
          Şehir manzarası, sahil yürüyüşleri ve gün batımı noktaları.
        </Text>

        <View style={{ marginTop: 12 }}>
          {VIEWPOINTS.map((p) => (
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
