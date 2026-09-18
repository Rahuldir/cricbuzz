import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';

// IPL Team Logos from dbtulsi CDN (verified working 200 OK)
export const IPL_TEAM_LOGOS = {
  CSK: 'https://dbtulsi.tech/CricketData/data/CountryFlags/CSK.png',
  'CHENNAI SUPER KINGS': 'https://dbtulsi.tech/CricketData/data/CountryFlags/CSK.png',
  MI: 'https://dbtulsi.tech/CricketData/data/CountryFlags/MI.png',
  'MUMBAI INDIANS': 'https://dbtulsi.tech/CricketData/data/CountryFlags/MI.png',
  RCB: 'https://dbtulsi.tech/CricketData/data/CountryFlags/RCB.png',
  'ROYAL CHALLENGERS BENGALURU': 'https://dbtulsi.tech/CricketData/data/CountryFlags/RCB.png',
  'ROYAL CHALLENGERS BANGALORE': 'https://dbtulsi.tech/CricketData/data/CountryFlags/RCB.png',
  KKR: 'https://dbtulsi.tech/CricketData/data/CountryFlags/KKR.png',
  'KOLKATA KNIGHT RIDERS': 'https://dbtulsi.tech/CricketData/data/CountryFlags/KKR.png',
  DC: 'https://dbtulsi.tech/CricketData/data/CountryFlags/DC.png',
  'DELHI CAPITALS': 'https://dbtulsi.tech/CricketData/data/CountryFlags/DC.png',
  'DELHI DAREDEVILS': 'https://dbtulsi.tech/CricketData/data/CountryFlags/DC.png',
  RR: 'https://dbtulsi.tech/CricketData/data/CountryFlags/RR.png',
  'RAJASTHAN ROYALS': 'https://dbtulsi.tech/CricketData/data/CountryFlags/RR.png',
  GT: 'https://dbtulsi.tech/CricketData/data/CountryFlags/GT.png',
  'GUJARAT TITANS': 'https://dbtulsi.tech/CricketData/data/CountryFlags/GT.png',
  LSG: 'https://dbtulsi.tech/CricketData/data/CountryFlags/LSG.png',
  'LUCKNOW SUPER GIANTS': 'https://dbtulsi.tech/CricketData/data/CountryFlags/LSG.png',
  SRH: 'https://dbtulsi.tech/CricketData/data/CountryFlags/SRH.png',
  'SUNRISERS HYDERABAD': 'https://dbtulsi.tech/CricketData/data/CountryFlags/SRH.png',
  'DECCAN CHARGERS': 'https://dbtulsi.tech/CricketData/data/CountryFlags/SRH.png',
  PBKS: 'https://dbtulsi.tech/CricketData/data/CountryFlags/PBKS.png',
  PK: 'https://dbtulsi.tech/CricketData/data/CountryFlags/PBKS.png',
  'PUNJAB KINGS': 'https://dbtulsi.tech/CricketData/data/CountryFlags/PBKS.png',
  'KINGS XI PUNJAB': 'https://dbtulsi.tech/CricketData/data/CountryFlags/PBKS.png',
};

// International Country Flags from FlagCDN (reliable, fast, high quality PNG)
export const COUNTRY_FLAGS = {
  IND: 'https://flagcdn.com/w80/in.png',
  INDIA: 'https://flagcdn.com/w80/in.png',
  AUS: 'https://flagcdn.com/w80/au.png',
  AUSTRALIA: 'https://flagcdn.com/w80/au.png',
  ENG: 'https://flagcdn.com/w80/gb-eng.png',
  ENGLAND: 'https://flagcdn.com/w80/gb-eng.png',
  PAK: 'https://flagcdn.com/w80/pk.png',
  PAKISTAN: 'https://flagcdn.com/w80/pk.png',
  NZ: 'https://flagcdn.com/w80/nz.png',
  'NEW ZEALAND': 'https://flagcdn.com/w80/nz.png',
  SA: 'https://flagcdn.com/w80/za.png',
  'SOUTH AFRICA': 'https://flagcdn.com/w80/za.png',
  WI: 'https://flagcdn.com/w80/jm.png',
  'WEST INDIES': 'https://flagcdn.com/w80/jm.png',
  BAN: 'https://flagcdn.com/w80/bd.png',
  BANGLADESH: 'https://flagcdn.com/w80/bd.png',
  AFG: 'https://flagcdn.com/w80/af.png',
  AFGHANISTAN: 'https://flagcdn.com/w80/af.png',
  SL: 'https://flagcdn.com/w80/lk.png',
  'SRI LANKA': 'https://flagcdn.com/w80/lk.png',
  IRE: 'https://flagcdn.com/w80/ie.png',
  IRELAND: 'https://flagcdn.com/w80/ie.png',
  ZIM: 'https://flagcdn.com/w80/zw.png',
  ZIMBABWE: 'https://flagcdn.com/w80/zw.png',
  NED: 'https://flagcdn.com/w80/nl.png',
  NETHERLANDS: 'https://flagcdn.com/w80/nl.png',
  SCO: 'https://flagcdn.com/w80/gb-sct.png',
  SCOTLAND: 'https://flagcdn.com/w80/gb-sct.png',
  USA: 'https://flagcdn.com/w80/us.png',
  'UNITED STATES': 'https://flagcdn.com/w80/us.png',
  NAM: 'https://flagcdn.com/w80/na.png',
  NAMIBIA: 'https://flagcdn.com/w80/na.png',
  NEP: 'https://flagcdn.com/w80/np.png',
  NEPAL: 'https://flagcdn.com/w80/np.png',
  OMA: 'https://flagcdn.com/w80/om.png',
  OMAN: 'https://flagcdn.com/w80/om.png',
  PNG: 'https://flagcdn.com/w80/pg.png',
  UAE: 'https://flagcdn.com/w80/ae.png',
  CAN: 'https://flagcdn.com/w80/ca.png',
  CANADA: 'https://flagcdn.com/w80/ca.png',
};

// Fallback Emoji flags
export const COUNTRY_EMOJIS = {
  IND: '🇮🇳',
  INDIA: '🇮🇳',
  AUS: '🇦🇺',
  AUSTRALIA: '🇦🇺',
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  ENGLAND: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  PAK: '🇵🇰',
  PAKISTAN: '🇵🇰',
  NZ: '🇳🇿',
  'NEW ZEALAND': '🇳🇿',
  SA: '🇿🇦',
  'SOUTH AFRICA': '🇿🇦',
  WI: '🌴',
  'WEST INDIES': '🌴',
  BAN: '🇧🇩',
  BANGLADESH: '🇧🇩',
  AFG: '🇦🇫',
  AFGHANISTAN: '🇦🇫',
  SL: '🇱🇰',
  'SRI LANKA': '🇱🇰',
};

/**
 * Resolves the best available flag/logo image URL
 * 1. Checks if a valid remote URL is provided in response
 * 2. Checks IPL logos dictionary
 * 3. Checks International country flags dictionary
 */
export function getTeamLogoUrl(imageUrl, teamName, countryCode) {
  // 1. If direct remote URL provided
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // 2. Check by country code
  const codeKey = (countryCode || '').trim().toUpperCase();
  if (codeKey) {
    if (IPL_TEAM_LOGOS[codeKey]) return IPL_TEAM_LOGOS[codeKey];
    if (COUNTRY_FLAGS[codeKey]) return COUNTRY_FLAGS[codeKey];
  }

  // 3. Check by team name
  const nameKey = (teamName || '').trim().toUpperCase();
  if (nameKey) {
    if (IPL_TEAM_LOGOS[nameKey]) return IPL_TEAM_LOGOS[nameKey];
    if (COUNTRY_FLAGS[nameKey]) return COUNTRY_FLAGS[nameKey];

    // Substring checks (e.g. "Chennai Super Kings" contains "CHENNAI")
    for (const [k, url] of Object.entries(IPL_TEAM_LOGOS)) {
      if (nameKey.includes(k) || k.includes(nameKey)) return url;
    }
    for (const [k, url] of Object.entries(COUNTRY_FLAGS)) {
      if (nameKey.includes(k) || k.includes(nameKey)) return url;
    }
  }

  return null;
}

/**
 * TeamFlag Component
 * Renders Image if URL exists, else renders stylized fallback badge with initials or emoji
 */
export function TeamFlag({
  logo,
  teamName = '',
  countryCode = '',
  size = 28,
  style,
}) {
  const [imageError, setImageError] = useState(false);
  const resolvedUrl = getTeamLogoUrl(logo, teamName, countryCode);

  const cleanName = (teamName || countryCode || 'CR').trim();
  const initials = (countryCode || cleanName.slice(0, 3)).toUpperCase();
  const emoji = COUNTRY_EMOJIS[(countryCode || '').toUpperCase()] || COUNTRY_EMOJIS[cleanName.toUpperCase()];

  if (resolvedUrl && !imageError) {
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: 'hidden',
            backgroundColor: '#FFFFFF15',
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
        ]}
      >
        <Image
          source={{ uri: resolvedUrl }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      </View>
    );
  }

  // Fallback to emoji or initials badge
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#00927025',
          borderWidth: 1,
          borderColor: '#00927060',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {emoji ? (
        <Text style={{ fontSize: size * 0.55 }}>{emoji}</Text>
      ) : (
        <Text style={{ color: '#009270', fontWeight: '900', fontSize: size * 0.36 }}>
          {initials}
        </Text>
      )}
    </View>
  );
}
