import { buildSystemPrompt } from '@/lib/systemPrompt'
import { geocodePlace } from '@/lib/astrology'
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, userData } = await req.json()
  
  // Geocode birth place for accurate coordinates
  let locationInfo = userData.birthPlace
  const geo = await geocodePlace(userData.birthPlace)
  if (geo) {
    locationInfo = `${userData.birthPlace} (latitude: ${geo.lat.toFixed(4)}°, longitude: ${geo.lng.toFixed(4)}°)`
  }

  const systemPrompt = buildSystemPrompt(
    userData.name,
    userData.birthDate,
    userData.birthTime,
    userData.birthPlace,
  )

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openrouter/free',
      stream: true,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('OpenRouter error:', err)
    return new Response(err, { status: 500 })
  }

  console.log('OpenRouter status:', response.status)
  console.log('OpenRouter headers:', Object.fromEntries(response.headers.entries()))

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}