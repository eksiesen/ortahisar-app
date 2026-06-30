import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cardShadow } from '../constants/layout';
import { colors, radius } from '../theme';
import type { BusinessSpot } from './BusinessScreen';

export function BusinessDetailScreen({
  spot,
  onBack,
}: {
  spot: BusinessSpot;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const [showStickyBack, setShowStickyBack] = React.useState(false);

  const openUrl = async (url: string) => {
    const can = await Linking.canOpenURL(url);
    if (can) await Linking.openURL(url);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: tabBarHeight + 28 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setShowStickyBack(offsetY > 150);
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
          <Text style={styles.backText}>Farklı İşletmeler</Text>
        </Pressable>

        <View style={[styles.coverCard, cardShadow]}>
          <ImageBackground
            source={spot.image}
            style={styles.coverImg}
            imageStyle={styles.coverImgRadius}
            resizeMode="cover"
          >
            <View style={styles.coverOverlay} />
          </ImageBackground>
        </View>

        <Text style={styles.title}>{spot.title}</Text>

        <View style={[styles.infoCard, cardShadow]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
              <Ionicons name="pin-outline" size={18} color={colors.secondary} />
            </View>
            <Text style={styles.sectionHeaderTitle}>Açıklama & Konum</Text>
          </View>

          <Text style={styles.descriptionText}>{spot.description}</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Haritada Aç"
            onPress={() => openUrl(spot.mapUrl)}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
          >
            <Text style={styles.primaryBtnText}>Haritada Aç</Text>
            <Ionicons name="open-outline" size={18} color={colors.surface} />
          </Pressable>
        </View>
      </ScrollView>
      {showStickyBack && (
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
  coverCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },
  coverImg: {
    height: 220,
    width: '100%',
  },
  coverImgRadius: {
    borderRadius: radius.xl,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 18, 26, 0.12)',
  },
  title: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.secondarySoft,
  },
  sectionHeaderIconMap: {
    backgroundColor: colors.surface,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  descriptionText: {
    marginTop: 14,
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  primaryBtn: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.seaDeep,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.surface,
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
