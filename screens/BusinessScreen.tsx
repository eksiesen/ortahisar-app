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

export type BusinessSpot = {
  key: string;
  title: string;
  description: string;
  tags: string[];
  image: ImageSourcePropType;
  mapUrl: string;
};

export const BUSINESSES: readonly BusinessSpot[] = [
  {
    key: 'vosporos',
    title: 'Vosporos Kafe',
    description: 'Manzaralı ve modern konsept kafe',
    tags: ['Kafe', 'Manzara', 'Sosyal'],
    image: require('../assets/places/vosporos-kafe.jpg'),
    mapUrl: 'https://share.google/8DjeyBBDvlOWyZXVa',
  },
  {
    key: 'texas',
    title: 'Texas City Kafe',
    description: 'Western temalı sosyal yaşam alanı',
    tags: ['Konsept', 'Kafe', 'Sosyal'],
    image: require('../assets/places/texas-city-kafe.jpg'),
    mapUrl: 'https://share.google/jZxgaI93v7Q3pHPcE',
  },
  {
    key: 'ceramicca',
    title: 'Ceramicca Atölye & Cafe',
    description: 'Seramik atölyesi ve kafe deneyimi',
    tags: ['Atölye', 'Sanat', 'Kafe'],
    image: require('../assets/places/ceramicca-kafe.jpg'),
    mapUrl: 'https://share.google/eHm2iLkGnWaAyRFBK',
  },
  {
    key: 'cafe-guz-eli',
    title: 'Cafe Güz.eli',
    description: 'Estetik tasarımıyla dikkat çeken konsept kafe',
    tags: ['Konsept', 'Kafe', 'Fotoğraf'],
    image: require('../assets/places/cafe-güz-eli.jpg'),
    mapUrl: 'https://share.google/YxLkAcOYL47QAOW4j',
  },
  {
    key: 'ruzan-antika',
    title: 'Ruzan Antika Kafe',
    description: 'Antika konseptiyle öne çıkan farklı bir kafe deneyimi',
    tags: ['Antika', 'Konsept', 'Kafe'],
    image: require('../assets/places/antika-kafe.jpg'),
    mapUrl: 'https://share.google/xVM8zk0OZK3bqwfif',
  },
];

export function BusinessScreen({
  onBack,
  onSelect,
  view,
}: {
  onBack: () => void;
  onSelect: (spot: BusinessSpot) => void;
  view: string;
}) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [showListStickyBack, setShowListStickyBack] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const prevViewRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (view === 'isletme' && prevViewRef.current === 'root') {
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

        <Text style={styles.heroTitle}>Farklı İşletmeler</Text>
        <Text style={styles.heroLead}>
          Ortahisar’daki konsept mekanlar ve farklı deneyim alanları.
        </Text>

        <View style={{ marginTop: 12 }}>
          {BUSINESSES.map((p) => (
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
