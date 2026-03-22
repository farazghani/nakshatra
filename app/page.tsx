'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import StarField from '@/components/Starfield'

export default function OnboardingPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.birthDate || !form.birthPlace) return
    setLoading(true)
    localStorage.setItem('userData', JSON.stringify(form))
    router.push('/chat')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080810]">
      <StarField />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-amber-900/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="text-5xl mb-4 select-none">☽</div>
          <h1 className="font-heading text-3xl text-white mb-2 tracking-wider">
            Nakshatra
          </h1>
          <p className="text-cosmos-muted text-sm tracking-widest uppercase">
            Vedic Wisdom · Ancient Stars
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="animate-fade-up bg-cosmos-card/80 backdrop-blur border border-cosmos-border rounded-2xl p-8 space-y-6"
          style={{ animationDelay: '0.1s' }}
        >
          <p className="text-cosmos-muted text-sm text-center leading-relaxed">
            Share the moment of your arrival into this world. The stars remember.
          </p>

          <div className="space-y-2">
            <Label className="text-cosmos-gold text-xs tracking-widest uppercase">Your Name</Label>
            <Input
              placeholder="What shall I call you?"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="bg-[#0e0e1a] border-cosmos-border text-white placeholder:text-cosmos-muted focus:border-cosmos-purple"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-cosmos-gold text-xs tracking-widest uppercase">Date of Birth</Label>
            <Input
              type="date"
              value={form.birthDate}
              onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))}
              className="bg-[#0e0e1a] border-cosmos-border text-white focus:border-cosmos-purple"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-cosmos-gold text-xs tracking-widest uppercase">
              Time of Birth
              <span className="text-cosmos-muted ml-2 normal-case">(approximate is fine)</span>
            </Label>
            <Input
              type="time"
              value={form.birthTime}
              onChange={e => setForm(f => ({ ...f, birthTime: e.target.value }))}
              className="bg-[#0e0e1a] border-cosmos-border text-white focus:border-cosmos-purple"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-cosmos-gold text-xs tracking-widest uppercase">Place of Birth</Label>
            <Input
              placeholder="City, Country"
              value={form.birthPlace}
              onChange={e => setForm(f => ({ ...f, birthPlace: e.target.value }))}
              className="bg-[#0e0e1a] border-cosmos-border text-white placeholder:text-cosmos-muted focus:border-cosmos-purple"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-cosmos-purple hover:bg-purple-700 text-white font-heading tracking-widest uppercase text-sm py-6 transition-all"
          >
            {loading ? 'Consulting the stars…' : 'Begin the Reading ✦'}
          </Button>
        </form>

        <p className="text-center text-cosmos-muted text-xs mt-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Your birth data is never stored or shared.
        </p>
      </div>
    </div>
  )
}