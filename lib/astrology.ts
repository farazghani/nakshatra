export function getSunSign(dateStr: string): { rashi: string; symbol: string; english: string } {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()

  const signs = [
    { rashi: 'Makara', english: 'Capricorn', symbol: '♑', from: [12, 22], to: [1, 19] },
    { rashi: 'Kumbha', english: 'Aquarius', symbol: '♒', from: [1, 20], to: [2, 18] },
    { rashi: 'Meena', english: 'Pisces', symbol: '♓', from: [2, 19], to: [3, 20] },
    { rashi: 'Mesha', english: 'Aries', symbol: '♈', from: [3, 21], to: [4, 19] },
    { rashi: 'Vrishabha', english: 'Taurus', symbol: '♉', from: [4, 20], to: [5, 20] },
    { rashi: 'Mithuna', english: 'Gemini', symbol: '♊', from: [5, 21], to: [6, 20] },
    { rashi: 'Karka', english: 'Cancer', symbol: '♋', from: [6, 21], to: [7, 22] },
    { rashi: 'Simha', english: 'Leo', symbol: '♌', from: [7, 23], to: [8, 22] },
    { rashi: 'Kanya', english: 'Virgo', symbol: '♍', from: [8, 23], to: [9, 22] },
    { rashi: 'Tula', english: 'Libra', symbol: '♎', from: [9, 23], to: [10, 22] },
    { rashi: 'Vrishchika', english: 'Scorpio', symbol: '♏', from: [10, 23], to: [11, 21] },
    { rashi: 'Dhanu', english: 'Sagittarius', symbol: '♐', from: [11, 22], to: [12, 21] },
  ]

  for (const s of signs) {
    const [fm, fd] = s.from
    const [tm, td] = s.to
    if ((month === fm && day >= fd) || (month === tm && day <= td)) {
      return { rashi: s.rashi, symbol: s.symbol, english: s.english }
    }
  }

  return { rashi: 'Makara', english: 'Capricorn', symbol: '♑' }
}

export function getNakshatra(dateStr: string): string {
  const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
    'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
    'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
    'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
  ]
  const date = new Date(dateStr)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return nakshatras[dayOfYear % 27]
}

export async function geocodePlace(place: string): Promise<{ lat: number; lng: number; display: string } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'Nakshatra-App' } }
    )
    const data = await res.json()
    if (!data[0]) return null
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      display: data[0].display_name,
    }
  } catch {
    return null
  }
}