'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import StarField from '@/components/Starfield'
import { getSunSign, getNakshatra } from '@/lib/astrology'
import ReactMarkdown from 'react-markdown'

type Message = { role: 'user' | 'assistant'; content: string; id: string }
type UserData = { name: string; birthDate: string; birthTime: string; birthPlace: string }

const SUGGESTED_QUESTIONS = [
  'What does my birth chart reveal about my purpose?',
  'Which Nakshatra am I born under?',
  'What is my current Dasha period?',
  'What does the coming year hold for me?',
]

export default function ChatPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raw = localStorage.getItem('userData')
    if (!raw) { router.push('/'); return }
    const data = JSON.parse(raw)
    setUserData(data)
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `The stars have been expecting you, ${data.name}. I am Jyotish — keeper of celestial time, reader of the cosmic design woven at your birth. Ask what weighs upon your heart, and the heavens shall answer.`,
    }])
  }, [router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading || !userData) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userData,
        }),
      })

const reader = res.body!.getReader()
const decoder = new TextDecoder()
let buffer = ''
let fullText = ''
let answerStarted = false
setIsThinking(true)

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  const chunk = decoder.decode(value, { stream: true })
  buffer += chunk
  const lines = buffer.split('\n')
  buffer = lines.pop() ?? ''

  for (const line of lines) {
    if (!line.startsWith('data: ')) continue
    const data = line.slice(6).trim()
    if (data === '[DONE]') continue
    try {
      const json = JSON.parse(data)
      const delta = json.choices?.[0]?.delta?.content || json.choices?.[0]?.delta?.reasoning || ''
      fullText += delta

      const answerMatch = fullText.match(/<answer>([\s\S]*?)(<\/answer>|$)/)
      if (answerMatch && answerMatch[1].trim()) {
        if (!answerStarted) {
          answerStarted = true
          setIsThinking(false)
        }
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: answerMatch[1].trim() } : m
        ))
      }
    } catch {}
  }
}

setIsThinking(false)

const finalMatch = fullText.match(/<answer>([\s\S]*?)<\/answer>/)
if (finalMatch) {
  setMessages(prev => prev.map(m =>
    m.id === assistantId ? { ...m, content: finalMatch[1].trim() } : m
  ))
}
    } catch (e) {
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, content: 'The cosmic connection was disrupted. Please ask again.' }
          : m
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  if (!userData) return null

  const sign = getSunSign(userData.birthDate)
  const nakshatra = getNakshatra(userData.birthDate)

  return (
    <div className="relative min-h-screen bg-[#080810] flex flex-col overflow-hidden">
      <StarField />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none" />

      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-cosmos-border bg-cosmos-card/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-2xl">☽</span>
          <div>
            <h1 className="font-heading text-white text-sm tracking-wider">Nakshatra</h1>
            <p className="text-cosmos-muted text-xs">Jyotish · Vedic Astrologer</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-cosmos-card border border-cosmos-border text-cosmos-gold text-xs font-sans">
            {sign.symbol} {sign.rashi}
          </Badge>
          <Badge className="bg-cosmos-card border border-cosmos-border text-cosmos-muted text-xs font-sans hidden sm:flex">
            {nakshatra} Nakshatra
          </Badge>
        </div>
      </header>

      <ScrollArea className="relative z-10 flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex animate-fade-up ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-cosmos-purple/20 border border-cosmos-purple/30 flex items-center justify-center text-sm mr-3 mt-1 flex-shrink-0">
                  ✦
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-cosmos-purple/20 border border-cosmos-purple/30 text-white ml-12'
                  : 'bg-cosmos-card border border-cosmos-border text-gray-200'
              }`}>
                {m.content ? (
  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:my-1 prose-headings:font-heading prose-headings:text-cosmos-gold prose-strong:text-white prose-hr:border-cosmos-border">
    <ReactMarkdown>{m.content}</ReactMarkdown>
  </div>
) : (
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-48 bg-cosmos-border" />
                    <Skeleton className="h-3 w-36 bg-cosmos-border" />
                    <Skeleton className="h-3 w-44 bg-cosmos-border" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {messages.length <= 1 && (
            <div className="space-y-3 mt-4">
              <p className="text-cosmos-muted text-xs text-center tracking-widest uppercase">Ask the stars</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-xs text-cosmos-muted border border-cosmos-border rounded-xl px-4 py-3 hover:border-cosmos-purple/50 hover:text-white hover:bg-cosmos-purple/10 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="relative z-10 border-t border-cosmos-border bg-cosmos-card/60 backdrop-blur px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Jyotish anything about your cosmic path…"
            className="flex-1 bg-[#0e0e1a] border border-cosmos-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-cosmos-muted focus:outline-none focus:border-cosmos-purple transition-colors"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-cosmos-purple hover:bg-purple-700 text-white px-5 rounded-xl transition-all disabled:opacity-40"
          >
            ✦
          </Button>
        </form>
      </div>
    </div>
  )
}