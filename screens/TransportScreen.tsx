import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import {
  Linking,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TRANSPORT_ALL } from '../constants/data';
import { cardShadow } from '../constants/layout';
import type { RootTabParamList } from '../navigation/types';
import { colors, radius } from '../theme';

const BLURBS: Record<string, string> = {
  otobus:
    'Şehir içi ve çevre ilçe hatları — gezi günlerinde saat ve durak planı.',
  dolmus: 'Kısa mesafe ve merkez çevresi için hızlı paylaşımlı ulaşım.',
  taksi: 'Havalimanı, otel ve sahil hattı arasında pratik ulaşım.',
  havaalani: 'Trabzon Havalimanı ulaşım bilgileri',
};

type TransportDetailKey =
  | 'dolmus'
  | 'taksi'
  | 'otobus'
  | 'havalimani'
  | 'havas'
  | null;

const POPULAR_STOPS = [
  { key: 'meydan-boztepe', title: 'Meydan - Boztepe', blurb: 'Merkez / Seyir hattı' },
  { key: 'meydan-kosk', title: 'Meydan - Atatürk Köşkü', blurb: 'Tarih hattı' },
  { key: 'meydan-besirli', title: 'Meydan - Beşirli (Ganita)', blurb: 'Sahil hattı' },
  { key: 'moloz-akcaabat', title: 'Moloz - Akçaabat', blurb: 'Komşu İlçe hattı' },
  { key: 'tanjant-ktu', title: 'Tanjant - KTÜ', blurb: 'Üniversite hattı' },
  {
    key: 'tanjant-havalimani',
    title: 'Tanjant - Havalimanı',
    blurb: 'Havalimanı hattı',
  },
] as const;

const TAXI_STANDS = [
  {
    key: 'ayasofya',
    name: 'Ayasofya Taksi',
    phone: '0462 223 05 82',
    latitude: 41.0031086941905,
    longitude: 39.693789527523144,
  },
  {
    key: 'besirli',
    name: 'Beşirli Taksi',
    phone: '0462 221 00 50',
    latitude: 40.99374224840369,
    longitude: 39.66518365582869,
  },
  {
    key: 'boztepe',
    name: 'Boztepe Taksi',
    phone: '0462 321 30 16',
    latitude: 40.98664557610203,
    longitude: 39.727779142334114,
  },
  {
    key: 'camlik',
    name: 'Çamlık Taksi',
    phone: '0462 231 03 81',
    latitude: 40.98752677652867,
    longitude: 39.697087600006626,
  },
  {
    key: 'comlekci',
    name: 'Çömlekçi Taksi',
    phone: '0462 323 09 40',
    latitude: 41.00461760823374,
    longitude: 39.73393818651418,
  },
  {
    key: 'havaalani',
    name: 'Havaalanı Taksi',
    phone: '0462 325 67 29',
    latitude: 40.99327874584173,
    longitude: 39.7817846441872,
  },
  {
    key: 'liman',
    name: 'Liman Taksi',
    phone: '0462 323 31 72',
    latitude: 41.00728452540162,
    longitude: 39.735479801860414,
  },
  {
    key: 'numune',
    name: 'Numune Taksi',
    phone: '0462 229 22 99',
    latitude: 41.00486504847447,
    longitude: 39.70692155529753,
  },
  {
    key: 'otogar',
    name: 'Otogar Taksi',
    phone: '0462 325 47 81',
    latitude: 40.997193181339824,
    longitude: 39.751773044210175,
  },
  {
    key: 'park',
    name: 'Park Taksi',
    phone: '0462 321 13 28',
    latitude: 41.004611015023414,
    longitude: 39.731064115351344,
  },
  {
    key: 'sahil',
    name: 'Sahil Taksi',
    phone: '0462 321 60 78',
    latitude: 41.00883753426741,
    longitude: 39.721136736827255,
  },
  {
    key: 'site',
    name: 'Site Taksi',
    phone: '0462 223 18 98',
    latitude: 41.00302313586682,
    longitude: 39.693789255824974,
  },
  {
    key: 'tip',
    name: 'Tıp Fakültesi Taksi',
    phone: '0462 321 91 46',
    latitude: 40.99278399567639,
    longitude: 39.7678768265531,
  },
] as const;

export function TransportScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const route = useRoute<RouteProp<RootTabParamList, 'Transport'>>();
  const [detailKey, setDetailKey] = React.useState<TransportDetailKey>(null);
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [nearestTaxi, setNearestTaxi] = React.useState<{
    name: string;
    phone: string;
    distanceKm: number;
  } | null>(null);
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [expandedKart, setExpandedKart] = React.useState<
    'anonim' | 'indirimli' | 'ucretsiz' | 'standart' | null
  >(null);
  const goBack = () => {
    setDetailKey(null);
    setLocationLoading(false);
    setNearestTaxi(null);
    setLocationError(null);
    setExpandedKart(null);
    navigation.setParams({ detailKey: undefined });
  };

  React.useEffect(() => {
    const incoming = route.params?.detailKey;
    setDetailKey(incoming || null);
  }, [route.params?.detailKey]);

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  const haversineKm = React.useCallback(
    (
      a: { latitude: number; longitude: number },
      b: { latitude: number; longitude: number }
    ) => {
      const toRad = (v: number) => (v * Math.PI) / 180;
      const R = 6371; // km
      const dLat = toRad(b.latitude - a.latitude);
      const dLon = toRad(b.longitude - a.longitude);
      const lat1 = toRad(a.latitude);
      const lat2 = toRad(b.latitude);

      const s =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
      return R * c;
    },
    []
  );

  if (detailKey === 'dolmus') {
    const openMap = async () => {
      const url = 'https://www.trabzondolmus.site/';
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
    };

    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={goBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.9 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Ulaşım</Text>
          </Pressable>

          <Text style={styles.title}>Dolmuş</Text>
          <Text style={styles.lead}>
            Trabzon’da dolmuş duraklarını ve güzergâhlarını görmek için resmi
            durak haritasını kullanabilirsin.
          </Text>

          <View style={[styles.fareCard, cardShadow]}>
            <View style={styles.fareHeader}>
              <View style={styles.fareHeaderIcon}>
                <Ionicons
                  name="cash-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.fareHeaderTitle}>Ücretler</Text>
            </View>

            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Sivil</Text>
              <Text style={styles.fareValue}>32 TL</Text>
            </View>
            <View style={styles.fareDivider} />
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Üniversite öğrencisi</Text>
              <Text style={styles.fareValue}>25 TL</Text>
            </View>
            <View style={styles.fareDivider} />
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Öğrenci</Text>
              <Text style={styles.fareValue}>23 TL</Text>
            </View>

            <Text style={styles.fareHint}>
              Üniversite öğrenci ücreti yalnızca KTÜ dolmuş hatlarında
              geçerlidir. Diğer hatlarda üniversite öğrencileri sivil tarifeden
              ücretlendirilir.
            </Text>
          </View>

          <View style={[styles.mapCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons name="map-outline" size={18} color={colors.secondary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>Dolmuş Durak Haritası</Text>
            </View>

            <Text style={styles.sectionDesc}>
              Durakların konumunu ve hangi dolmuşun nereden kalktığını görmek
              için haritayı aç.
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Haritayı Aç"
              onPress={openMap}
              style={({ pressed }) => [
                styles.mapButton,
                pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
              ]}
            >
              <Text style={styles.mapButtonText}>Haritayı Aç</Text>
              <Ionicons
                name="open-outline"
                size={18}
                color={colors.surface}
              />
            </Pressable>
          </View>

          <View style={[styles.qrCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconQr]}>
                <Ionicons name="qr-code-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>QR ile aç</Text>
            </View>

            <Image
              source={require('../assets/dolmus-qr.png')}
              style={{
                width: 180,
                height: 180,
                alignSelf: 'center',
                marginVertical: 16,
              }}
            />

            <Text style={styles.sectionDesc}>
              Telefon kamerası ile okutarak dolmuş durak haritasına ulaşabilirsin.
            </Text>
          </View>

          <View style={[styles.popularCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}
              >
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Popüler duraklar</Text>
            </View>

            <View style={{ marginTop: 6 }}>
              {POPULAR_STOPS.map((line, idx) => (
                <Pressable
                  key={line.key}
                  accessibilityRole="button"
                  accessibilityLabel={line.title}
                  style={({ pressed }) => [
                    styles.popRow,
                    pressed && { backgroundColor: colors.searchBg },
                  ]}
                >
                  <View style={styles.popRowIcon}>
                    <Ionicons
                      name="car-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.popRowBody}>
                    <Text style={styles.popRowTitle}>{line.title}</Text>
                    <Text style={styles.popRowBlurb}>{line.blurb}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.textMuted}
                  />
                  {idx < POPULAR_STOPS.length - 1 ? (
                    <View style={styles.popDivider} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.noteCard, cardShadow]}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={colors.textMuted}
            />
            <Text style={styles.noteText}>
              Gezilecek yerler sayfasında, her nokta için önerilen dolmuş durağı
              ayrıca gösterilecektir.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (detailKey === 'taksi') {
    const onUseMyLocation = async () => {
      try {
        setLocationLoading(true);
        setLocationError(null);
        setNearestTaxi(null);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError(
            'Konum izni olmadan en yakın durak hesaplanamaz.'
          );
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        console.log('User location:', { latitude, longitude });

        const user = { latitude, longitude };
        let best:
          | { name: string; phone: string; distanceKm: number }
          | null = null;

        for (const stand of TAXI_STANDS) {
          const d = haversineKm(user, stand);
          if (!best || d < best.distanceKm) {
            best = { name: stand.name, phone: stand.phone, distanceKm: d };
          }
        }

        setNearestTaxi(best);
      } finally {
        setLocationLoading(false);
      }
    };

    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={goBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.9 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Ulaşım</Text>
          </Pressable>

          <Text style={styles.title}>Taksi</Text>
          <Text style={styles.lead}>
            Havalimanı, otel ve sahil hattı arasında pratik ulaşım.
          </Text>

          <View style={[styles.fareCard, cardShadow]}>
            <View style={styles.fareHeader}>
              <View style={styles.fareHeaderIcon}>
                <Ionicons
                  name="cash-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.fareHeaderTitle}>Ücret Bilgisi</Text>
            </View>

            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Açılış</Text>
              <Text style={styles.fareValue}>71,50 TL</Text>
            </View>
            <View style={styles.fareDivider} />
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Dakika</Text>
              <Text style={styles.fareValue}>9,36 TL</Text>
            </View>
            <View style={styles.fareDivider} />
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Saatlik bekleme</Text>
              <Text style={styles.fareValue}>561,60 TL</Text>
            </View>
            <View style={styles.fareDivider} />
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>İndi-bindi</Text>
              <Text style={styles.fareValue}>208 TL</Text>
            </View>

            <Text style={styles.fareHint}>
              Ücretler trafik ve mesafeye göre değişebilir.
            </Text>
          </View>

          <View style={[styles.nearestCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}
              >
                <Ionicons name="navigate-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>En yakın taksi durağı</Text>
            </View>

            <Text style={styles.sectionDesc}>
              Konum izni vererek sana en yakın taksi durağını görebilirsin.
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Konumumu Kullan"
              onPress={onUseMyLocation}
              style={({ pressed }) => [
                styles.nearestButton,
                locationLoading && { opacity: 0.85 },
                pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
              ]}
              disabled={locationLoading}
            >
              <Text style={styles.nearestButtonText}>
                {locationLoading ? 'Konum alınıyor…' : 'Konumumu Kullan'}
              </Text>
              <Ionicons
                name="location-outline"
                size={18}
                color={colors.surface}
              />
            </Pressable>

            {locationError ? (
              <View style={styles.nearestResult}>
                <View style={styles.nearestResultLeft}>
                  <View style={styles.popRowIcon}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.nearestErrorText}>{locationError}</Text>
                  </View>
                </View>
              </View>
            ) : null}

            {nearestTaxi ? (
              <View style={styles.nearestResult}>
                <View style={styles.nearestResultLeft}>
                  <View style={styles.popRowIcon}>
                    <Ionicons
                      name="car-sport-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.nearestName} numberOfLines={1}>
                      {nearestTaxi.name}
                    </Text>
                    <Text style={styles.nearestPhone} numberOfLines={1}>
                      {nearestTaxi.phone}
                    </Text>
                  </View>
                </View>
                <Text style={styles.nearestDistanceText}>
                  Yaklaşık {nearestTaxi.distanceKm.toFixed(1)} km uzaklıkta
                </Text>
              </View>
            ) : null}

            <Text style={styles.nearestHint}>
              Mesafe yaklaşık olarak hesaplanır.
            </Text>
          </View>

          <View style={[styles.listCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}
              >
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Taksi durakları</Text>
            </View>

            <View style={{ marginTop: 6 }}>
              {TAXI_STANDS.map((item, idx) => (
                <Pressable
                  key={item.key}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.name} ${item.phone}`}
                  style={({ pressed }) => [
                    styles.popRow,
                    pressed && { backgroundColor: colors.searchBg },
                  ]}
                >
                  <View style={styles.taxiLeft}>
                    <View style={styles.popRowIcon}>
                      <Ionicons
                        name="car-sport-outline"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <Text style={styles.taxiName} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>

                  <View style={styles.taxiRight}>
                    <Ionicons
                      name="call-outline"
                      size={18}
                      color={colors.textMuted}
                    />
                    <Text style={styles.taxiPhone} numberOfLines={1}>
                      {item.phone}
                    </Text>
                  </View>
                  {idx < TAXI_STANDS.length - 1 ? (
                    <View style={styles.popDivider} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (detailKey === 'otobus') {
    const openUrl = async (url: string) => {
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
    };
    const openUlasim = () => openUrl('https://ulasim.trabzon.bel.tr/');

    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={goBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.9 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Ulaşım</Text>
          </Pressable>

          <Text style={styles.title}>Otobüs</Text>
          <Text style={styles.lead}>
            Trabzon Büyükşehir Belediyesi ulaşım sistemi ve Trabzon Kart
            bilgileri
          </Text>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}
              >
                <Ionicons
                  name="card-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Trabzon Kart</Text>
            </View>

            <Text style={styles.subSectionTitle}>Trabzon Kart Türleri</Text>

            <View style={{ marginTop: 10, gap: 10 }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Anonim Kart"
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setExpandedKart((cur) => (cur === 'anonim' ? null : 'anonim'));
                }}
                style={({ pressed }) => [
                  styles.accordionCard,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <View style={styles.accordionTop}>
                  <View style={styles.accordionIcon}>
                    <Ionicons
                      name="person-circle-outline"
                      size={22}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.accordionTopBody}>
                    <Text style={styles.accordionTitle}>Anonim Kart</Text>
                    <Text style={styles.accordionSubtitle}>
                      İsimsiz kart — dolum noktalarından alınabilir
                    </Text>
                  </View>
                  <Ionicons
                    name={expandedKart === 'anonim' ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.textMuted}
                  />
                </View>

                {expandedKart === 'anonim' ? (
                  <View style={styles.accordionDetail}>
                    <Text style={styles.detailHeading}>Kimler kullanabilir</Text>
                    <View style={styles.detailBullets}>
                      <Text style={styles.detailBullet}>- Herkes kullanabilir</Text>
                      <Text style={styles.detailBullet}>- İsimsiz kart</Text>
                    </View>

                    <Text style={styles.detailHeading}>Gerekli belgeler</Text>
                    <View style={styles.detailBullets}>
                      <Text style={styles.detailBullet}>- Belge gerekmiyor</Text>
                    </View>

                    <Text style={styles.detailHeading}>Başvuru şekli</Text>
                    <View style={styles.detailBullets}>
                      <Text style={styles.detailBullet}>
                        - Dolum noktalarından alınabilir
                      </Text>
                    </View>
                  </View>
                ) : null}
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="İndirimli Kart"
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setExpandedKart((cur) => (cur === 'indirimli' ? null : 'indirimli'));
                }}
                style={({ pressed }) => [
                  styles.accordionCard,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <View style={styles.accordionTop}>
                  <View style={[styles.accordionIcon, styles.accordionIconBlue]}>
                    <Ionicons
                      name="school-outline"
                      size={22}
                      color={colors.secondary}
                    />
                  </View>
                  <View style={styles.accordionTopBody}>
                    <Text style={styles.accordionTitle}>İndirimli Kart</Text>
                    <Text style={styles.accordionSubtitle}>
                      Öğrenci/öğretmen ve yaş indirimi grupları
                    </Text>
                  </View>
                  <Ionicons
                    name={expandedKart === 'indirimli' ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.textMuted}
                  />
                </View>

                {expandedKart === 'indirimli' ? (
                  <View style={styles.accordionDetail}>
                    <Text style={styles.detailHeading}>Kimler kullanabilir</Text>
                    <View style={styles.detailBullets}>
                      <Text style={styles.detailBullet}>- Öğrenciler</Text>
                      <Text style={styles.detailBullet}>- Öğretmenler</Text>
                      <Text style={styles.detailBullet}>- 60-65 yaş vatandaşlar</Text>
                    </View>

                    <Text style={styles.detailHeading}>Gerekli belgeler</Text>
                    <View style={styles.detailBullets}>
                      <Text style={styles.detailBullet}>
                        - Öğrenci belgesi veya öğrenci kimliği
                      </Text>
                      <Text style={styles.detailBullet}>- Kimlik fotokopisi</Text>
                    </View>

                    <Text style={styles.detailHeading}>Başvuru şekli</Text>
                    <View style={styles.detailBullets}>
                      <Text style={styles.detailBullet}>
                        - Toplu Taşıma Şube Müdürlüğü
                      </Text>
                    </View>
                  </View>
                ) : null}
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ücretsiz Kart"
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setExpandedKart((cur) => (cur === 'ucretsiz' ? null : 'ucretsiz'));
                }}
                style={({ pressed }) => [
                  styles.accordionCard,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <View style={styles.accordionTop}>
                  <View style={styles.accordionIcon}>
                    <Ionicons
                      name="accessibility-outline"
                      size={22}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.accordionTopBody}>
                    <Text style={styles.accordionTitle}>Ücretsiz Kart</Text>
                    <Text style={styles.accordionSubtitle}>
                      65+ ve ücretsiz kart kapsamındaki gruplar
                    </Text>
                  </View>
                  <Ionicons
                    name={expandedKart === 'ucretsiz' ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.textMuted}
                  />
                </View>

                {expandedKart === 'ucretsiz' ? (
                  <View style={styles.accordionDetail}>
                    <Text style={styles.detailHeading}>Kimler kullanabilir</Text>
                    <View style={styles.detailBullets}>
                      <Text style={styles.detailBullet}>- 65 yaş üstü</Text>
                      <Text style={styles.detailBullet}>- Engelliler</Text>
                      <Text style={styles.detailBullet}>- Şehit yakınları</Text>
                      <Text style={styles.detailBullet}>- Gaziler</Text>
                      <Text style={styles.detailBullet}>
                        - Sarı basın kartı sahipleri
                      </Text>
                    </View>

                    <Text style={styles.detailHeading}>Gerekli belgeler</Text>
                    <View style={styles.detailBullets}>
                      <Text style={styles.detailBullet}>- Kimlik fotokopisi</Text>
                      <Text style={styles.detailBullet}>
                        - Gerekli durumlarda engelli raporu vb.
                      </Text>
                    </View>

                    <Text style={styles.detailHeading}>Başvuru şekli</Text>
                    <View style={styles.detailBullets}>
                      <Text style={styles.detailBullet}>
                        - Toplu Taşıma Şube Müdürlüğü
                      </Text>
                    </View>
                  </View>
                ) : null}
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Standart Kart"
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setExpandedKart((cur) => (cur === 'standart' ? null : 'standart'));
                }}
                style={({ pressed }) => [
                  styles.accordionCard,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <View style={styles.accordionTop}>
                  <View style={[styles.accordionIcon, styles.accordionIconBlue]}>
                    <Ionicons
                      name="id-card-outline"
                      size={22}
                      color={colors.secondary}
                    />
                  </View>
                  <View style={styles.accordionTopBody}>
                    <Text style={styles.accordionTitle}>Standart Kart</Text>
                    <Text style={styles.accordionSubtitle}>
                      Fotoğraflı anonim kart — kayıpta bakiye aktarımı
                    </Text>
                  </View>
                  <Ionicons
                    name={expandedKart === 'standart' ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.textMuted}
                  />
                </View>

                {expandedKart === 'standart' ? (
                  <View style={styles.accordionDetail}>
                    <Text style={styles.detailHeading}>Kimler kullanabilir</Text>
                    <View style={styles.detailBullets}>
                      <Text style={styles.detailBullet}>- Herkes kullanabilir</Text>
                      <Text style={styles.detailBullet}>
                        - Fotoğraflı anonim kart
                      </Text>
                    </View>

                    <Text style={styles.detailHeading}>Gerekli belgeler</Text>
                    <View style={styles.detailBullets}>
                      <Text style={styles.detailBullet}>- Kimlik kartı</Text>
                      <Text style={styles.detailBullet}>
                        - Bazı başvurularda vesikalık fotoğraf
                      </Text>
                    </View>

                    <Text style={styles.detailHeading}>Başvuru şekli</Text>
                    <View style={styles.detailBullets}>
                      <Text style={styles.detailBullet}>
                        - Toplu Taşıma Şube Müdürlüğü
                      </Text>
                    </View>
                  </View>
                ) : null}
              </Pressable>
            </View>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}
              >
                <Ionicons
                  name="globe-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Online İşlemler</Text>
            </View>

            <View style={styles.onlineGrid}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Yakındaki Duraklar"
                onPress={() =>
                  openUrl(
                    'https://ulasim.trabzon.bel.tr/Web/YakinimdakiDuraklar'
                  )
                }
                style={({ pressed }) => [
                  styles.onlineTile,
                  pressed && styles.tilePressed,
                ]}
              >
                <View style={[styles.tileIconWrap, styles.tileIconWrapBlue]}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.secondary}
                  />
                </View>
                <Text style={styles.tileTitle} numberOfLines={2}>
                  Yakındaki{'\n'}Duraklar
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Bakiye Yükleme"
                onPress={() =>
                  openUrl(
                    'https://www.akillibiletim.com/GuestPayment.aspx?cid=4816AWC178PL896ZIQA1'
                  )
                }
                style={({ pressed }) => [
                  styles.onlineTile,
                  pressed && styles.tilePressed,
                ]}
              >
                <View style={[styles.tileIconWrap, styles.tileIconWrapBordo]}>
                  <Ionicons
                    name="wallet-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.tileTitle} numberOfLines={2}>
                  Bakiye{'\n'}Yükleme
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Bakiye Sorgulama"
                onPress={() =>
                  openUrl('https://www.akillibiletim.com/tBKY_SRG-01.aspx')
                }
                style={({ pressed }) => [
                  styles.onlineTile,
                  pressed && styles.tilePressed,
                ]}
              >
                <View style={[styles.tileIconWrap, styles.tileIconWrapBordo]}>
                  <Ionicons
                    name="search-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.tileTitle} numberOfLines={2}>
                  Bakiye{'\n'}Sorgulama
                </Text>
              </Pressable>
            </View>

            <Text style={styles.sectionMinor}>
              Ve diğer tüm işlemler için:
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sistemi Aç"
              onPress={openUlasim}
              style={({ pressed }) => [
                styles.mapButton,
                pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
              ]}
            >
              <Text style={styles.mapButtonText}>Sistemi Aç</Text>
              <Ionicons
                name="open-outline"
                size={18}
                color={colors.surface}
              />
            </Pressable>
          </View>

          <View style={[styles.qrCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconQr]}>
                <Ionicons name="qr-code-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionHeaderTitle}>QR ile Aç</Text>
            </View>

            <View style={styles.qrImageWrap}>
              <Image
                source={require('../assets/otobus-qr.png')}
                style={styles.qrImage}
              />
            </View>

            <Text style={styles.sectionDesc}>
              Telefon kamerası ile belediyenin ulaşım sistemine hızlıca
              ulaşabilirsin.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (detailKey === 'havalimani') {
    const openUrl = async (url: string) => {
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
    };

    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={goBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.9 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Ulaşım</Text>
          </Pressable>

          <Text style={styles.title}>Havaalanı</Text>
          <Text style={styles.lead}>
            Trabzon Havalimanı’na ulaşım seçenekleri ve pratik bilgiler
          </Text>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons
                  name="rocket-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Hızlı Ulaşım</Text>
            </View>

            <View style={styles.airportQuickGrid}>
              <View style={[styles.airportQuickTile, cardShadow]}>
                <View style={[styles.tileIconWrap, styles.tileIconWrapBordo]}>
                  <Ionicons
                    name="car-sport-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.airportQuickTitle}>Taksi</Text>
                <Text style={styles.airportQuickDesc}>
                  7/24 hızlı ve kapıdan kapıya.
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Taksi duraklarını görüntüle"
                  onPress={() => setDetailKey('taksi')}
                  style={({ pressed }) => [
                    styles.airportMiniBtn,
                    pressed && styles.tilePressed,
                  ]}
                >
                  <Text style={styles.airportMiniBtnText}>
                    Taksi duraklarını görüntüle
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.secondary}
                  />
                </Pressable>
              </View>

              <View style={[styles.airportQuickTile, cardShadow]}>
                <View style={[styles.tileIconWrap, styles.tileIconWrapBordo]}>
                  <Ionicons
                    name="car-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.airportQuickTitle}>Dolmuş</Text>
                <Text style={styles.airportQuickDesc}>
                  Moloz - Havalimanı ve Tanjant hatları
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Dolmuş hatlarını görüntüle"
                  onPress={() => setDetailKey('dolmus')}
                  style={({ pressed }) => [
                    styles.airportMiniBtn,
                    pressed && styles.tilePressed,
                  ]}
                >
                  <Text style={styles.airportMiniBtnText}>
                    Dolmuş hatlarını görüntüle
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.secondary}
                  />
                </Pressable>
              </View>

              <View style={[styles.airportQuickTile, cardShadow]}>
                <View style={[styles.tileIconWrap, styles.tileIconWrapBlue]}>
                  <Ionicons name="bus" size={20} color={colors.secondary} />
                </View>
                <Text style={styles.airportQuickTitle}>Belediye Otobüsü</Text>
                <Text style={styles.airportQuickDesc}>
                  Havalimanı bağlantılı belediye otobüs hatları
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Otobüs bilgilerini görüntüle"
                  onPress={() => setDetailKey('otobus')}
                  style={({ pressed }) => [
                    styles.airportMiniBtn,
                    pressed && styles.tilePressed,
                  ]}
                >
                  <Text style={styles.airportMiniBtnText}>
                    Otobüs bilgilerini görüntüle
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.secondary}
                  />
                </Pressable>
              </View>

              <View style={[styles.airportQuickTile, cardShadow]}>
                <View style={[styles.tileIconWrap, styles.tileIconWrapBlue]}>
                  <Ionicons
                    name="bus-outline"
                    size={20}
                    color={colors.secondary}
                  />
                </View>
                <Text style={styles.airportQuickTitle}>Havaş</Text>
                <Text style={styles.airportQuickDesc}>
                  Merkez ve Rize yönüne servis
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Havaş detaylarını görüntüle"
                  onPress={() => setDetailKey('havas')}
                  style={({ pressed }) => [
                    styles.airportMiniBtn,
                    pressed && styles.tilePressed,
                  ]}
                >
                  <Text style={styles.airportMiniBtnText}>
                    Havaş detaylarını görüntüle
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.secondary}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons
                  name="pin-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Havalimanı Konumu</Text>
            </View>

            <Text style={styles.sectionDesc}>
              Trabzon Havalimanı şehir merkezine yakın konumdadır.
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Haritada Aç"
              onPress={() => openUrl('https://maps.app.goo.gl/aYm5jcTHfznM8wkd6')}
              style={({ pressed }) => [
                styles.mapButton,
                pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
              ]}
            >
              <Text style={styles.mapButtonText}>Haritada Aç</Text>
              <Ionicons
                name="open-outline"
                size={18}
                color={colors.surface}
              />
            </Pressable>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconQr]}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Faydalı Bilgiler</Text>
            </View>

            <View style={styles.tipsList}>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  El bagajında 100 ml üzeri sıvılar kabine alınmaz.
                </Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  İç hat uçuşlarında kimlik kartını yanında bulundur.
                </Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  İç hat uçuşları için en az 1.5 saat önce havalimanında ol.
                </Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  Güvenlik kontrolünden geçerken metal eşyaları çıkar.
                </Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  Çakı, makas ve kesici ürünler kabin bagajında yasaktır.
                </Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  Powerbank ürünleri uçak altı bagajına verilmez, kabin bagajında
                  taşınmalıdır.
                </Text>
              </View>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  Telefon ve elektronik cihazlar uçuş sırasında uçak modunda
                  olmalıdır.
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}
              >
                <Ionicons
                  name="pricetag-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Ücret Tarifeleri</Text>
            </View>

            <Text style={styles.sectionDesc}>
              Resmi ücret tarifelerine DHMİ sayfasından ulaşabilirsin.
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="DHMİ Ücret Tarifeleri"
              onPress={() =>
                openUrl('https://dhmi.gov.tr/Sayfalar/UcretTarifeleri.aspx')
              }
              style={({ pressed }) => [
                styles.mapButton,
                pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
              ]}
            >
              <Text style={styles.mapButtonText}>DHMİ Ücret Tarifeleri</Text>
              <Ionicons
                name="open-outline"
                size={18}
                color={colors.surface}
              />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (detailKey === 'havas') {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarHeight + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri"
            onPress={goBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.9 },
            ]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Ulaşım</Text>
          </Pressable>

          <Text style={styles.title}>Havaş</Text>
          <Text style={styles.lead}>Trabzon Havalimanı servis bilgileri</Text>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}>
                <Ionicons
                  name="cash-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Ücretler</Text>
            </View>

            <View style={[styles.detailBullets, { marginTop: 10 }]}>
              <Text style={styles.detailBullet}>- Trabzon Meydan: 100 TL</Text>
              <Text style={styles.detailBullet}>- Tanjant Migros: 140 TL</Text>
              <Text style={styles.detailBullet}>- Beşirli: 140 TL</Text>
              <Text style={styles.detailBullet}>- Of: 250 TL</Text>
              <Text style={styles.detailBullet}>- Rize: 300 TL</Text>
            </View>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons
                  name="pin-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Yolcu alma noktaları</Text>
            </View>

            <View style={[styles.detailBullets, { marginTop: 10 }]}>
              <Text style={styles.detailBullet}>- Beşirli Opet</Text>
              <Text style={styles.detailBullet}>
                - Karşıyaka Kavşağı Otobüs Durağı
              </Text>
              <Text style={styles.detailBullet}>- Tanjant Migros önü</Text>
              <Text style={styles.detailBullet}>
                - Zeytinlik Belediye Otobüs Durağı / TS Club önü
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconMap]}>
                <Ionicons
                  name="git-branch-outline"
                  size={18}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Güzergah</Text>
            </View>

            <Text style={[styles.sectionDesc, { marginTop: 10 }]}>
              Beşirli → Tanjant → Trabzon Havalimanı
            </Text>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconStops]}>
                <Ionicons
                  name="compass-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Rize yönü</Text>
            </View>

            <Text style={[styles.sectionDesc, { marginTop: 10 }]}>
              Trabzon Havalimanı → Şana → Yomra → Arsin → Araklı → Sürmene → Of →
              İyidere → Derepazarı → Rize Merkez
            </Text>
          </View>

          <View style={[styles.infoCard, cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionHeaderIcon, styles.sectionHeaderIconQr]}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Uyarı</Text>
            </View>

            <View style={[styles.havasWarnCard, { marginTop: 10 }]}>
              <Ionicons
                name="call-outline"
                size={18}
                color={colors.textMuted}
              />
              <Text style={styles.havasWarnText}>
                Kesin saat bilgisi için Havaş çağrı merkezini arayınız: 0850 222 0
                487
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: tabBarHeight + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>Trabzon’da hareket</Text>
        <Text style={styles.title}>Ulaşım</Text>
        <Text style={styles.lead}>
          Kısa süreli ziyaretlerde merkez, sahil ve tur rotaları arasında
          geçişler için tüm seçenekler. Canlı saatler ileride eklenecek.
        </Text>

        {TRANSPORT_ALL.map((item) => (
          <Pressable
            key={item.key}
            style={({ pressed }) => [
              styles.card,
              cardShadow,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            onPress={() => {
              if (item.key === 'dolmus') setDetailKey('dolmus');
              if (item.key === 'taksi') setDetailKey('taksi');
              if (item.key === 'otobus') setDetailKey('otobus');
              if (item.key === 'havaalani') setDetailKey('havalimani');
            }}
          >
            <View style={styles.cardIcon}>
              <Ionicons name={item.icon} size={26} color={colors.primary} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.label}</Text>
              <Text style={styles.cardText}>{BLURBS[item.key]}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ))}
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
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  lead: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
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
  sectionDesc: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  sectionMinor: {
    marginTop: 10,
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.textMuted,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  onlineGrid: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  onlineTile: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  tilePressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  tileIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tileIconWrapBlue: {
    backgroundColor: colors.surface,
  },
  tileIconWrapBordo: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.primarySoft,
  },
  tileTitle: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  airportQuickGrid: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  airportQuickTile: {
    width: '48.5%',
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  airportQuickTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  airportQuickDesc: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  airportMiniBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  airportMiniBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.secondary,
    textAlign: 'center',
    flex: 1,
  },
  havasWarnCard: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.secondarySoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  havasWarnText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  tipsList: {
    marginTop: 12,
    gap: 10,
  },
  tipCard: {
    backgroundColor: colors.searchBg,
    borderRadius: radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  subSectionTitle: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '900',
    color: colors.secondary,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  bulletList: {
    marginTop: 10,
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    marginTop: 7,
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  bulletText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  divider: {
    marginTop: 12,
    height: 1,
    backgroundColor: colors.border,
  },
  accordionCard: {
    backgroundColor: colors.searchBg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  accordionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accordionIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  accordionIconBlue: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.border,
  },
  accordionTopBody: {
    flex: 1,
    minWidth: 0,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  accordionSubtitle: {
    marginTop: 3,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  accordionDetail: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  detailHeading: {
    fontSize: 12.5,
    fontWeight: '900',
    color: colors.secondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  detailBullets: {
    marginTop: 6,
    gap: 6,
  },
  detailBullet: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  fareCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  fareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  fareHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  fareHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  fareLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  fareValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  fareDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  fareHint: {
    marginTop: 10,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.textMuted,
  },
  mapCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  mapButton: {
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
  mapButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.surface,
  },
  qrCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  qrImageWrap: {
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 6,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrImage: {
    width: 170,
    height: 170,
    borderRadius: 14,
  },
  popularCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  nearestCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  nearestButton: {
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
  nearestButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.surface,
  },
  nearestResult: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.searchBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nearestResultLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nearestName: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  nearestPhone: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  nearestDistanceText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: colors.secondary,
  },
  nearestErrorText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    color: colors.textSecondary,
  },
  nearestHint: {
    marginTop: 10,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.textMuted,
  },
  popRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: radius.md,
  },
  popRowIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  popRowBody: {
    flex: 1,
  },
  popRowTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  popRowBlurb: {
    marginTop: 3,
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  popDivider: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 0,
    height: 1,
    backgroundColor: colors.border,
  },
  taxiLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  taxiName: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  taxiRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  taxiPhone: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  lineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  lineIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  lineBody: {
    flex: 1,
  },
  lineTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  lineBlurb: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 2,
    backgroundColor: colors.searchBg,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
