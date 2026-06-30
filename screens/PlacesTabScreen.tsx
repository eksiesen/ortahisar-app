import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import {
  Linking,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PLACE_CATEGORIES,
} from '../constants/data';
import { cardShadow } from '../constants/layout';
import {
  HistoricalPlacesScreen,
  type HistoricalPlace,
  HISTORICAL_PLACES,
} from './HistoricalPlacesScreen';
import { HistoricalPlaceDetailScreen } from './HistoricalPlaceDetailScreen';
import { ParksScreen, type Park, PARKS } from './ParksScreen';
import { ParkDetailScreen } from './ParkDetailScreen';
import { ViewpointsScreen, type ViewpointSpot, VIEWPOINTS } from './ViewpointsScreen';
import { ViewpointDetailScreen } from './ViewpointDetailScreen';

import { BusinessScreen, type BusinessSpot, BUSINESSES } from './BusinessScreen';
import { BusinessDetailScreen } from './BusinessDetailScreen';
import type { RootTabParamList } from '../navigation/types';
import { colors, radius } from '../theme';

type PlacesView =
  | 'root'
  | 'dogal'
  | 'tarihi'
  | 'tarihi-detail'
  | 'parklar'
  | 'parklar-detail'
  | 'manzara'
  | 'manzara-detail'
  | 'ganita'
  | 'boztepe-dogal'
  | 'botanik'
  | 'zagnos'
  | 'isletme'
  | 'isletme-detail';

export const NATURAL_PLACES = [
  {
    key: 'ganita',
    title: 'Ganita Sahil Bandı',
    description: 'Ortahisar’da deniz esintisi ve sahil yürüyüşü',
    tags: ['Sahil', 'Manzara', 'Yürüyüş'],
    image: require('../assets/places/ganita-sahil.jpg'),
  },
  {
    key: 'boztepe-dogal',
    title: 'Boztepe Seyir Alanı',
    description: 'Şehri kuş bakışı izleyebileceğiniz doğal tepe konumu',
    tags: ['Manzara', 'Seyir', 'Tepe'],
    image: require('../assets/places/boztepe-seyir.jpg'),
  },
  {
    key: 'botanik',
    title: 'Trabzon Botanik Bahçesi',
    description: 'Çamoba’da yeşillikler içinde zengin bitki çeşitliliği',
    tags: ['Doğa', 'Botanik', 'Yürüyüş'],
    image: require('../assets/places/botanik.jpg'),
  },
  {
    key: 'zagnos',
    title: 'Zağnos Vadisi Parkı',
    description: 'Tarihi surların gölgesinde yeşil vadi alanı',
    tags: ['Vadi', 'Park', 'Tarih'],
    image: require('../assets/places/zagnos-park.jpg'),
  },
] as const;

export function PlacesTabScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [view, setView] = React.useState<PlacesView>('root');
  const [selectedHistorical, setSelectedHistorical] =
    React.useState<HistoricalPlace | null>(null);
  const [selectedPark, setSelectedPark] = React.useState<Park | null>(null);

  const [selectedViewpoint, setSelectedViewpoint] =
    React.useState<ViewpointSpot | null>(null);
  const [selectedBusiness, setSelectedBusiness] =
    React.useState<BusinessSpot | null>(null);
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const route = useRoute<RouteProp<RootTabParamList, 'Places'>>();

  React.useEffect(() => {
    const categoryKey = route.params?.categoryKey;
    const detailKey = route.params?.detailKey;

    if (categoryKey) {
      if (categoryKey === 'dogal' && detailKey) {
        setView(detailKey as PlacesView);
      } else if (categoryKey === 'tarihi' && detailKey) {
        const found = HISTORICAL_PLACES.find((p) => p.key === detailKey);
        if (found) {
          setSelectedHistorical(found);
          setView('tarihi-detail');
        } else {
          setView('tarihi');
        }
      } else if (categoryKey === 'park' && detailKey) {
        const found = PARKS.find((p) => p.key === detailKey);
        if (found) {
          setSelectedPark(found);
          setView('parklar-detail');
        } else {
          setView('parklar');
        }
      } else if (categoryKey === 'manzara' && detailKey) {
        const found = VIEWPOINTS.find((p) => p.key === detailKey);
        if (found) {
          setSelectedViewpoint(found);
          setView('manzara-detail');
        } else {
          setView('manzara');
        }

      } else if (categoryKey === 'isletme' && detailKey) {
        const found = BUSINESSES.find((p) => p.key === detailKey);
        if (found) {
          setSelectedBusiness(found);
          setView('isletme-detail');
        } else {
          setView('isletme');
        }
      } else {
        setView(categoryKey as PlacesView);
      }
      navigation.setParams({ categoryKey: undefined, detailKey: undefined });
    }
  }, [route.params?.categoryKey, route.params?.detailKey]);

  const openUrl = async (url: string) => {
    const can = await Linking.canOpenURL(url);
    if (can) await Linking.openURL(url);
  };

  if (view === 'ganita') {
    const cover = require('../assets/places/ganita-sahil.jpg');

    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 28 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={() => setView('dogal')}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.9 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Doğal Güzellikler</Text>
          </Pressable>

          <View style={[styles.detailCoverCard, cardShadow]}>
            <ImageBackground
              source={cover}
              style={styles.detailCoverImg}
              imageStyle={styles.detailCoverImgRadius}
              resizeMode="cover"
            >
              <View style={styles.detailCoverOverlay} />
            </ImageBackground>
          </View>

          <Text style={styles.detailTitle}>Ganita Sahil Bandı</Text>
          <Text style={styles.detailMeta}>Ortahisar / Sahil Bandı</Text>

          <View style={styles.detailTags}>
            {['Sahil', 'Gün Batımı', 'Yürüyüş', 'Dinlenme'].map((t) => (
              <View key={t} style={styles.natureTag}>
                <Text style={styles.natureTagText}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.detailDesc}>
            Ortahisar Belediyesi tarafından yenilenen Ganita Sahil Bandı; yürüyüş yolları, yeşil alanlar, kafeler, seyir terasları ve gün batımı manzarasıyla kentin en popüler sahil dinlenme alanıdır.
          </Text>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons
                  name="restaurant-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Mekan Önerileri</Text>
            </View>

            <View style={styles.restaurantCard}>
              <Text style={styles.restaurantName}>Dalyan Kafe</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Haritada Aç"
                onPress={() => openUrl('https://maps.app.goo.gl/GanitaDalyanKafe')}
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
              Öneriler herhangi bir reklam veya sponsorluk
              içermemektedir. Mekanlar yalnızca ziyaretçilere fikir vermesi
              amacıyla örnek olarak paylaşılmıştır.
            </Text>
          </View>

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
              onPress={() => openUrl('https://maps.app.goo.gl/m39M5Ees8YJ3yqXm8')}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryBtnText}>Haritada Aç</Text>
              <Ionicons name="open-outline" size={18} color={colors.surface} />
            </Pressable>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}>
                <Ionicons name="navigate-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Nasıl Gidilir?</Text>
            </View>

            <View style={styles.howBlock}>
              <Text style={styles.howTitle}>Yürüyüş</Text>
              <Text style={styles.howText}>
                Ortahisar Meydanı'ndan (şehir merkezi) güneye doğru yürüyerek yaklaşık 10-15 dakikada sahile inip Ganita'ya ulaşabilirsiniz.
              </Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.howBlock}>
              <Text style={styles.howTitle}>Dolmuş / Otobüs</Text>
              <Text style={styles.howText}>
                Meydan'dan kalkan Beşirli dolmuşları veya sahil güzergahından geçen belediye otobüsleri ile kolayca ulaşım sağlanabilir.
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconQr]}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Ziyaret Bilgileri</Text>
            </View>

            <View style={[styles.detailBullets, { marginTop: 10 }]}>
              <Text style={styles.detailBullet}>- Ortalama süre: 1-2 saat</Text>
              <Text style={styles.detailBullet}>
                - En uygun zaman: Her mevsim, özellikle gün batımı saatleri
              </Text>
              <Text style={styles.detailBullet}>- Giriş: Ücretsiz ve halka açık</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (view === 'boztepe-dogal') {
    const cover = require('../assets/places/boztepe-seyir.jpg');

    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 28 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={() => setView('dogal')}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.9 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Doğal Güzellikler</Text>
          </Pressable>

          <View style={[styles.detailCoverCard, cardShadow]}>
            <ImageBackground
              source={cover}
              style={styles.detailCoverImg}
              imageStyle={styles.detailCoverImgRadius}
              resizeMode="cover"
            >
              <View style={styles.detailCoverOverlay} />
            </ImageBackground>
          </View>

          <Text style={styles.detailTitle}>Boztepe Seyir Alanı</Text>
          <Text style={styles.detailMeta}>Ortahisar / Seyir Noktası</Text>

          <View style={styles.detailTags}>
            {['Manzara', 'Seyir Terası', 'Fotoğraf', 'Çay Keyfi'].map((t) => (
              <View key={t} style={styles.natureTag}>
                <Text style={styles.natureTagText}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.detailDesc}>
            Şehri ve Karadeniz'i kuş bakışı izlemek isteyenlerin ilk adresi olan Boztepe, yürüyüş yolları, seyir terasları ve çay bahçeleriyle hem turistlerin hem de yerel halkın uğrak yeridir.
          </Text>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons
                  name="restaurant-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Mekan Önerileri</Text>
            </View>

            <View style={styles.restaurantCard}>
              <Text style={styles.restaurantName}>Boztepe Çay Bahçesi</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Haritada Aç"
                onPress={() => openUrl('https://maps.app.goo.gl/BoztepeCayBahcesi')}
                style={({ pressed }) => [
                  styles.restaurantBtn,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={styles.restaurantBtnText}>Haritada Aç</Text>
                <Ionicons name="open-outline" size={18} color={colors.secondary} />
              </Pressable>
            </View>
          </View>

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
              onPress={() => openUrl('https://maps.app.goo.gl/WvpxUymV78N5aG6q8')}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryBtnText}>Haritada Aç</Text>
              <Ionicons name="open-outline" size={18} color={colors.surface} />
            </Pressable>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}>
                <Ionicons name="navigate-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Nasıl Gidilir?</Text>
            </View>

            <View style={styles.howBlock}>
              <Text style={styles.howTitle}>Dolmuş</Text>
              <Text style={styles.howText}>
                Meydan bölgesinden kalkan Boztepe dolmuşları ile yaklaşık 10 dakikada doğrudan seyir alanına ulaşabilirsiniz.
              </Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.howBlock}>
              <Text style={styles.howTitle}>Otobüs</Text>
              <Text style={styles.howText}>
                141 numaralı Boztepe belediye otobüsü ile de tepeye ulaşım sağlanabilmektedir.
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconQr]}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Ziyaret Bilgileri</Text>
            </View>

            <View style={[styles.detailBullets, { marginTop: 10 }]}>
              <Text style={styles.detailBullet}>- Ortalama süre: 1-2 saat</Text>
              <Text style={styles.detailBullet}>- En uygun zaman: Akşamüstü / Gece manzarası için akşam</Text>
              <Text style={styles.detailBullet}>- Not: Semaver çayı eşliğinde manzara önerilir.</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (view === 'botanik') {
    const cover = require('../assets/places/botanik.jpg');

    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 28 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={() => setView('dogal')}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.9 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Doğal Güzellikler</Text>
          </Pressable>

          <View style={[styles.detailCoverCard, cardShadow]}>
            <ImageBackground
              source={cover}
              style={styles.detailCoverImg}
              imageStyle={styles.detailCoverImgRadius}
              resizeMode="cover"
            >
              <View style={styles.detailCoverOverlay} />
            </ImageBackground>
          </View>

          <Text style={styles.detailTitle}>Trabzon Botanik Bahçesi</Text>
          <Text style={styles.detailMeta}>Ortahisar / Botanik Bahçesi</Text>

          <View style={styles.detailTags}>
            {['Doğa', 'Botanik', 'Yürüyüş', 'Huzur'].map((t) => (
              <View key={t} style={styles.natureTag}>
                <Text style={styles.natureTagText}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.detailDesc}>
            Çamoba bölgesinde yer alan Trabzon Botanik Bahçesi, zengin bitki çeşitliliği, yürüyüş yolları, göletleri ve ahşap yapılarıyla doğayla baş başa vakit geçirmek isteyenler için harika bir adrestir.
          </Text>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons
                  name="restaurant-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Mekan Önerileri</Text>
            </View>

            <View style={styles.restaurantCard}>
              <Text style={styles.restaurantName}>Botanik Sosyal Tesisleri & Cafe</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Haritada Aç"
                onPress={() => openUrl('https://maps.app.goo.gl/BotanikSosyalTesis')}
                style={({ pressed }) => [
                  styles.restaurantBtn,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={styles.restaurantBtnText}>Haritada Aç</Text>
                <Ionicons name="open-outline" size={18} color={colors.secondary} />
              </Pressable>
            </View>
          </View>

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
              onPress={() => openUrl('https://maps.app.goo.gl/d8E4L2wV46N3X9sR6')}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryBtnText}>Haritada Aç</Text>
              <Ionicons name="open-outline" size={18} color={colors.surface} />
            </Pressable>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}>
                <Ionicons name="navigate-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Nasıl Gidilir?</Text>
            </View>

            <View style={styles.howBlock}>
              <Text style={styles.howTitle}>Dolmuş</Text>
              <Text style={styles.howText}>
                Meydan bölgesinden kalkan Çamoba dolmuşları ile bahçe girişine kadar ulaşım sağlayabilirsiniz.
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconQr]}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Ziyaret Bilgileri</Text>
            </View>

            <View style={[styles.detailBullets, { marginTop: 10 }]}>
              <Text style={styles.detailBullet}>- Ortalama süre: 1-2 saat</Text>
              <Text style={styles.detailBullet}>- Giriş: Belediye tarafından belirlenen küçük bir giriş ücreti bulunmaktadır.</Text>
              <Text style={styles.detailBullet}>- Not: Çocuk oyun alanları ve dinlenme çardakları mevcuttur.</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (view === 'zagnos') {
    const cover = require('../assets/places/zagnos-park.jpg');

    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 28 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={() => setView('dogal')}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.9 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Doğal Güzellikler</Text>
          </Pressable>

          <View style={[styles.detailCoverCard, cardShadow]}>
            <ImageBackground
              source={cover}
              style={styles.detailCoverImg}
              imageStyle={styles.detailCoverImgRadius}
              resizeMode="cover"
            >
              <View style={styles.detailCoverOverlay} />
            </ImageBackground>
          </View>

          <Text style={styles.detailTitle}>Zağnos Vadisi Parkı</Text>
          <Text style={styles.detailMeta}>Ortahisar / Kent Parkı</Text>

          <View style={styles.detailTags}>
            {['Vadi', 'Kent Parkı', 'Tarihi Surlar', 'Yürüyüş'].map((t) => (
              <View key={t} style={styles.natureTag}>
                <Text style={styles.natureTagText}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.detailDesc}>
            Kentsel dönüşüm projesiyle yeşil bir vadiye dönüştürülen Zağnos Vadisi, tarihi surların gölgesinde yapay göletleri, köprüleri, yürüyüş yolları ve dinlenme alanlarıyla şehrin merkezinde devasa bir yeşil alandır.
          </Text>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons
                  name="restaurant-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Mekan Önerileri</Text>
            </View>

            <View style={styles.restaurantCard}>
              <Text style={styles.restaurantName}>Zağnos Vadi Kafe</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Haritada Aç"
                onPress={() => openUrl('https://maps.app.goo.gl/zagnos')}
                style={({ pressed }) => [
                  styles.restaurantBtn,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={styles.restaurantBtnText}>Haritada Aç</Text>
                <Ionicons name="open-outline" size={18} color={colors.secondary} />
              </Pressable>
            </View>
          </View>

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
              onPress={() => openUrl('https://maps.app.goo.gl/ZağnosVadisi')}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryBtnText}>Haritada Aç</Text>
              <Ionicons name="open-outline" size={18} color={colors.surface} />
            </Pressable>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}>
                <Ionicons name="navigate-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Nasıl Gidilir?</Text>
            </View>

            <View style={styles.howBlock}>
              <Text style={styles.howTitle}>Yürüyüş</Text>
              <Text style={styles.howText}>
                Meydan bölgesinden veya Trabzon Kalesi çevresinden yürüyerek 5-10 dakikada vadiye inebilirsiniz.
              </Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.howBlock}>
              <Text style={styles.howTitle}>Dolmuş / Otobüs</Text>
              <Text style={styles.howText}>
                Şehir içi ulaşım hatlarının büyük çoğunluğu Zağnos Köprüsü ve vadi yakınından geçmektedir.
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconQr]}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Ziyaret Bilgileri</Text>
            </View>

            <View style={[styles.detailBullets, { marginTop: 10 }]}>
              <Text style={styles.detailBullet}>- Ortalama süre: 1 saat</Text>
              <Text style={styles.detailBullet}>- Giriş: Ücretsiz ve halka açık</Text>
              <Text style={styles.detailBullet}>- Not: Park içerisinde yer alan kuğular ve ördekler özellikle çocukların ilgisini çekmektedir.</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (view === 'dogal') {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 28 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={() => setView('root')}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.9 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Gezilecek Yerler</Text>
          </Pressable>

          <Text style={styles.heroTitle}>Doğal Güzellikler</Text>
          <Text style={styles.heroLead}>
            Sahil bandı, seyir alanı ve botanik bahçesi — Ortahisar'ın doğal alanlarını keşfet.
          </Text>

          <View style={{ marginTop: 12 }}>
            {NATURAL_PLACES.map((p) => (
              <Pressable
                key={p.key}
                accessibilityRole="button"
                accessibilityLabel={p.title}
                onPress={() => {
                  setView(p.key as PlacesView);
                }}
                style={({ pressed }) => [
                  styles.natureCard,
                  cardShadow,
                  pressed && styles.pressed,
                ]}
              >
                <ImageBackground
                  source={p.image}
                  style={styles.natureImg}
                  imageStyle={styles.natureImgRadius}
                  resizeMode="cover"
                >
                  <View style={styles.natureOverlay} />
                  <View style={styles.natureArrow}>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.onImage}
                    />
                  </View>
                </ImageBackground>

                <View style={styles.natureBody}>
                  <Text style={styles.natureTitle}>{p.title}</Text>
                  <Text style={styles.natureDesc}>{p.description}</Text>
                  <View style={styles.natureTags}>
                    {p.tags.map((t) => (
                      <View key={t} style={styles.natureTag}>
                        <Text style={styles.natureTagText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (view === 'tarihi') {
    return (
      <HistoricalPlacesScreen
        onBack={() => setView('root')}
        onSelect={(place) => {
          setSelectedHistorical(place);
          setView('tarihi-detail');
        }}
      />
    );
  }

  if (view === 'tarihi-detail' && selectedHistorical) {
    return (
      <HistoricalPlaceDetailScreen
        place={selectedHistorical}
        onBack={() => setView('tarihi')}
      />
    );
  }

  if (view === 'parklar') {
    return (
      <ParksScreen
        onBack={() => setView('root')}
        onSelect={(park) => {
          setSelectedPark(park);
          setView('parklar-detail');
        }}
      />
    );
  }

  if (view === 'parklar-detail' && selectedPark) {
    return (
      <ParkDetailScreen
        park={selectedPark}
        onBack={() => setView('parklar')}
      />
    );
  }

  if (view === 'manzara') {
    return (
      <ViewpointsScreen
        onBack={() => setView('root')}
        onSelect={(spot) => {
          setSelectedViewpoint(spot);
          setView('manzara-detail');
        }}
      />
    );
  }

  if (view === 'manzara-detail' && selectedViewpoint) {
    return (
      <ViewpointDetailScreen
        spot={selectedViewpoint}
        onBack={() => setView('manzara')}
      />
    );
  }



  if (view === 'isletme') {
    return (
      <BusinessScreen
        onBack={() => setView('root')}
        onSelect={(spot) => {
          setSelectedBusiness(spot);
          setView('isletme-detail');
        }}
      />
    );
  }

  if (view === 'isletme-detail' && selectedBusiness) {
    return (
      <BusinessDetailScreen
        spot={selectedBusiness}
        onBack={() => setView('isletme')}
      />
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: tabBarHeight + 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Ionicons name="trail-sign-outline" size={18} color={colors.secondary} />
            <Text style={styles.heroBadgeText}>Şehir rehberi</Text>
          </View>
          <Text style={styles.heroTitle}>Gezilecek Yerler</Text>
          <Text style={styles.heroLead}>
            İlçelere dağılan doğa ve tarih duraklarından Boztepe manzarasına —
            Trabzon gezisinde öncelik vereceğin başlıklar.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Kategoriler</Text>
        <View style={styles.catWrap}>
          {PLACE_CATEGORIES.map((c) => (
            <Pressable
              key={c.key}
              style={({ pressed }) => [
                styles.catCard,
                cardShadow,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={c.label}
              onPress={() => {
                if (c.key === 'dogal') setView('dogal');
                if (c.key === 'tarihi') setView('tarihi');
                if (c.key === 'park') setView('parklar');
                if (c.key === 'manzara') setView('manzara');

                if (c.key === 'isletme') setView('isletme');
              }}
            >
              <View style={styles.catIcon}>
                <Ionicons name={c.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.catTitle}>{c.label}</Text>
            </Pressable>
          ))}
        </View>

      </ScrollView>
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
    backgroundColor: colors.surface,
  },
  sectionHeaderIconMap: {
    backgroundColor: colors.surface,
  },
  sectionHeaderIconQr: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.primarySoft,
  },
  sectionHeaderIconStops: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.primarySoft,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionMinor: {
    marginTop: 12,
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.textMuted,
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
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
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
  detailCoverCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },
  detailCoverImg: {
    height: 220,
    width: '100%',
  },
  detailCoverImgRadius: {
    borderRadius: radius.xl,
  },
  detailCoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 18, 26, 0.12)',
  },
  detailTitle: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  detailMeta: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '800',
    color: colors.secondary,
  },
  detailTags: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailDesc: {
    marginTop: 12,
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  detailBullets: {
    marginTop: 6,
    gap: 6,
  },
  detailBullet: {
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  detailBulletStrong: {
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '900',
    color: colors.textPrimary,
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
  howInfoBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.searchBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  howInfoTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.secondary,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  howInfoText: {
    marginTop: 6,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  howWarnBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.accentSoft,
    borderColor: colors.primarySoft,
  },
  howSuggestBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.secondarySoft,
  },
  detailDivider: {
    marginTop: 16,
    height: 1,
    backgroundColor: colors.border,
  },
  hero: {
    marginBottom: 20,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: colors.secondarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
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
  sectionLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  catWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  catCard: {
    width: '48%',
    flexGrow: 1,
    minWidth: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  catTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 22,
  },
  destCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  destImg: {
    minHeight: 208,
    justifyContent: 'space-between',
  },
  destImgRadius: {
    borderRadius: radius.xl,
  },
  destImgPosition: {
    height: '140%',
    top: '-30%',
  },
  destOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayStrong,
    borderRadius: radius.xl,
  },
  destTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 14,
  },
  tag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  tagText: {
    color: colors.onImage,
    fontSize: 11,
    fontWeight: '700',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destBottom: {
    padding: 18,
  },
  destTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.onImage,
  },
  destSub: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.92)',
  },
  gastroIntro: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  gastroRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gastroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gastroText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  natureCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  natureImg: {
    height: 170,
    width: '100%',
    justifyContent: 'flex-end',
  },
  natureImgRadius: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    // Web: cover + center crop (native ignores safely)
    objectFit: 'cover',
  },
  natureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 18, 26, 0.18)',
  },
  natureArrow: {
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
  natureBody: {
    padding: 14,
  },
  natureTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  natureDesc: {
    marginTop: 6,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  natureTags: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  natureTag: {
    backgroundColor: colors.secondarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  natureTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondary,
  },
});
