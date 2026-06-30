import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
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
import type { RootTabParamList } from '../navigation/types';
import { colors, radius } from '../theme';
import type { Park } from './ParksScreen';

export function ParkDetailScreen({
  park,
  onBack,
}: {
  park: Park;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [showStickyBack, setShowStickyBack] = React.useState(false);

  const openUrl = async (url: string) => {
    const can = await Linking.canOpenURL(url);
    if (can) await Linking.openURL(url);
  };

  const restaurant = park.restaurantSuggestion;

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
          <Text style={styles.backText}>Parklar</Text>
        </Pressable>

        <View style={[styles.coverCard, cardShadow]}>
          <ImageBackground
            source={park.image}
            style={styles.coverImg}
            imageStyle={styles.coverImgRadius}
            resizeMode="cover"
          >
            <View style={styles.coverOverlay} />
          </ImageBackground>
        </View>

        <Text style={styles.title}>{park.title}</Text>

        <View style={[styles.infoCard, cardShadow]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
              <Ionicons name="pin-outline" size={18} color={colors.secondary} />
            </View>
            <Text style={styles.sectionHeaderTitle}>Konum</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Haritada Aç"
            onPress={() => openUrl(park.mapUrl)}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
          >
            <Text style={styles.primaryBtnText}>Haritada Aç</Text>
            <Ionicons name="open-outline" size={18} color={colors.surface} />
          </Pressable>
        </View>

        <View style={[styles.infoCard, cardShadow]}>
          <View style={styles.sectionHeader}>
            <View
              style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}
            >
              <Ionicons
                name="navigate-outline"
                size={18}
                color={colors.primary}
              />
            </View>
            <Text style={styles.sectionHeaderTitle}>Nasıl Gidilir?</Text>
          </View>

          <View style={styles.howBlock}>
            <Text style={styles.howTitle}>Dolmuş</Text>
            <Text style={styles.howText}>{park.transport.dolmusText}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dolmuş Bilgilerine Git"
              onPress={() =>
                navigation.navigate('Transport', { detailKey: 'dolmus' })
              }
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && { opacity: 0.92 },
              ]}
            >
              <Text style={styles.secondaryBtnText}>Dolmuş Bilgilerine Git</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.secondary}
              />
            </Pressable>
          </View>

          <View style={styles.divider} />

          <View style={styles.howBlock}>
            <Text style={styles.howTitle}>Otobüs</Text>
            <Text style={styles.howText}>{park.transport.otobusText}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Otobüs Bilgilerine Git"
              onPress={() =>
                navigation.navigate('Transport', { detailKey: 'otobus' })
              }
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && { opacity: 0.92 },
              ]}
            >
              <Text style={styles.secondaryBtnText}>Otobüs Bilgilerine Git</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.secondary}
              />
            </Pressable>
          </View>
        </View>

        {restaurant != null && (
          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons
                  name="restaurant-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Restoran Önerileri</Text>
            </View>

            <View style={styles.restaurantCard}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Haritada Aç"
                onPress={() => openUrl(restaurant.mapUrl)}
                style={({ pressed }) => [
                  styles.restaurantBtn,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={styles.restaurantBtnText}>Haritada Aç</Text>
                <Ionicons name="open-outline" size={18} color={colors.secondary} />
              </Pressable>
            </View>
            <Text style={styles.restaurantNote}>
              Restoran önerileri herhangi bir reklam veya sponsorluk
              içermemektedir. Mekanlar yalnızca ziyaretçilere fikir vermesi
              amacıyla örnek olarak paylaşılmıştır.
            </Text>
          </View>
        )}

        {park.visitBullets && park.visitBullets.length > 0 && (
          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconQr]}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Ziyaret Bilgileri</Text>
            </View>

            <View style={[styles.detailBullets, { marginTop: 10 }]}>
              {park.visitBullets.map((line) => (
                <Text key={line} style={styles.detailBullet}>
                  - {line}
                </Text>
              ))}
            </View>
          </View>
        )}
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
  sectionHeaderIconStops: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.primarySoft,
  },
  sectionHeaderIconQr: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.primarySoft,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
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
  secondaryBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.secondarySoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.secondary,
  },
  howBlock: {
    marginTop: 12,
  },
  howTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.secondary,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  howText: {
    marginTop: 6,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  divider: {
    marginTop: 16,
    height: 1,
    backgroundColor: colors.border,
  },
  restaurantCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.searchBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  restaurantName: {
    fontSize: 14.5,
    lineHeight: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  restaurantBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  restaurantBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: colors.secondary,
  },
  restaurantNote: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    color: colors.textMuted,
  },
  detailBullets: {
    gap: 6,
  },
  detailBullet: {
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
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
