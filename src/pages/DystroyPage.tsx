import { useCallback, useEffect, useRef, useState } from 'react'
import './DystroyPage.css'

const TICKER_ITEMS = [
  'OP1UM',
  'RAGE',
  'HIP-HOP',
  'OPEN FORMAT',
  'BASS HOUSE',
  'TECH HOUSE',
  'AFRO HOUSE',
  'POP',
  'KUALA LUMPUR',
  'HIGH PRESSURE',
  'ZERO LAG',
]

const ARSENAL = [
  'OP1UM / RAGE',
  'HIP-HOP',
  'BASS HOUSE',
  'TECH HOUSE',
  'AFRO HOUSE',
  'POP',
]

const ARCHIVE: { src: string; label: string; wide?: boolean }[] = [
  { src: '/dystroy/img/club-a.webp', label: 'ARCHIVE_001' },
  { src: '/dystroy/img/perf-1.webp', label: 'ARCHIVE_002', wide: true },
  { src: '/dystroy/img/perf-3.webp', label: 'ARCHIVE_003' },
  { src: '/dystroy/img/portrait-stand.webp', label: 'ARCHIVE_004' },
  { src: '/dystroy/img/club-b.webp', label: 'ARCHIVE_005' },
  { src: '/dystroy/img/perf-4.webp', label: 'ARCHIVE_006' },
  { src: '/dystroy/img/perf-2.webp', label: 'ARCHIVE_007', wide: true },
  { src: '/dystroy/img/perf-6.webp', label: 'ARCHIVE_008' },
  { src: '/dystroy/img/perf-5.webp', label: 'ARCHIVE_009' },
  { src: '/dystroy/img/perf-7.webp', label: 'ARCHIVE_010' },
  { src: '/dystroy/img/perf-8.webp', label: 'ARCHIVE_011' },
]

const RITUALS = [
  { venue: 'YAGA BAR', ritual: 'KL NIGHT CIRCUIT', city: 'KUALA LUMPUR' },
  { venue: 'SUNWAY SQUARE MALL', ritual: 'RAREEE CARNIVAL 1.0', city: 'PETALING JAYA' },
  { venue: 'DEJABREW', ritual: 'GROUND PLAYED', city: 'KUALA LUMPUR' },
]

const GLYPHS = '†‡$%&#@✝X0123456789'

function useScramble(reducedMotion: boolean) {
  return useCallback(
    (el: HTMLElement) => {
      if (reducedMotion) return
      const original = el.dataset.text ?? el.textContent ?? ''
      if (!original || el.dataset.scrambling === '1') return
      el.dataset.scrambling = '1'
      let frame = 0
      const total = original.length * 2 + 6
      const id = window.setInterval(() => {
        frame += 1
        const settled = Math.floor(frame / 2)
        el.textContent = original
          .split('')
          .map((ch, i) =>
            i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join('')
        if (frame >= total) {
          window.clearInterval(id)
          el.textContent = original
          delete el.dataset.scrambling
        }
      }, 28)
    },
    [reducedMotion]
  )
}

function formatTime(t: number) {
  if (!Number.isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function DystroyPage() {
  const [entered, setEntered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [trackTime, setTrackTime] = useState(0)
  const [trackDuration, setTrackDuration] = useState(165)
  const [videoStarted, setVideoStarted] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef(0)
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const heroImgRef = useRef<HTMLDivElement | null>(null)

  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current

  const scramble = useScramble(reducedMotion)

  // ── Page chrome: body class, title, favicon ────────────────────────────────
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('dys-html')
    document.body.classList.add('dys-mode')
    document.title = 'DY$TROY ✝ OFFICIAL PRESS KIT'
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = '#050505'
    document.head.appendChild(meta)
    const icon = document.createElement('link')
    icon.rel = 'icon'
    icon.href =
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#050505"/><text x="32" y="46" font-size="40" text-anchor="middle" fill="#d6101e" font-family="serif">✝</text></svg>'
      )
    document.head.appendChild(icon)
    return () => {
      root.classList.remove('dys-html')
      document.body.classList.remove('dys-mode')
      meta.remove()
      icon.remove()
    }
  }, [])

  // ── Auto-enter the gate so nobody gets trapped ─────────────────────────────
  useEffect(() => {
    if (entered) return
    const id = window.setTimeout(() => setEntered(true), 7000)
    return () => window.clearTimeout(id)
  }, [entered])

  const enter = useCallback(() => setEntered(true), [])

  useEffect(() => {
    if (entered) return
    const onKey = () => setEntered(true)
    window.addEventListener('keydown', onKey, { once: true })
    return () => window.removeEventListener('keydown', onKey)
  }, [entered])

  // ── Scroll reveals ──────────────────────────────────────────────────────────
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.dys-reveal'))
    if (reducedMotion) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [entered, reducedMotion])

  // ── Hero parallax ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        if (heroImgRef.current) {
          heroImgRef.current.style.transform = `translateY(${y * 0.18}px) scale(${1 + y * 0.00012})`
        }
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reducedMotion])

  // ── Custom cursor ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const cursor = cursorRef.current
    if (!cursor) return
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      const t = e.target as HTMLElement
      const interactive = !!t.closest('a, button, [data-hover]')
      cursor.classList.toggle('is-hot', interactive)
    }
    const loop = () => {
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      cursor.style.transform = `translate(${x}px, ${y}px)`
      rafRef.current = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [reducedMotion])

  // ── $ easter egg: the rapture ───────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '$') return
      document.body.classList.add('dys-rapture')
      window.setTimeout(() => document.body.classList.remove('dys-rapture'), 700)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Audio: Web Audio visualizer ─────────────────────────────────────────────
  const drawIdle = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = (canvas.width = canvas.clientWidth * 2)
    const h = (canvas.height = canvas.clientHeight * 2)
    const bars = 48
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(236,231,221,0.25)'
    for (let i = 0; i < bars; i++) {
      const bw = w / bars
      const bh = 4
      ctx.fillRect(i * bw + bw * 0.18, h - bh, bw * 0.64, bh)
    }
  }, [])

  const startVisualizer = useCallback(() => {
    const audio = audioRef.current
    const canvas = canvasRef.current
    if (!audio || !canvas) return
    try {
      if (!audioCtxRef.current) {
        const AC =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext
        if (!AC) return
        audioCtxRef.current = new AC()
      }
      const ctx = audioCtxRef.current
      if (!analyserRef.current && ctx) {
        const source = ctx.createMediaElementSource(audio)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 128
        source.connect(analyser)
        analyser.connect(ctx.destination)
        analyserRef.current = analyser
      }
      if (ctx && ctx.state === 'suspended') void ctx.resume()
    } catch {
      // visualizer is decorative; keep playback working without it
    }
    const data = new Uint8Array(64)
    const loop = () => {
      const c = canvasRef.current
      if (!c) return
      const g = c.getContext('2d')
      if (!g) return
      const w = (c.width = c.clientWidth * 2)
      const h = (c.height = c.clientHeight * 2)
      const bars = 48
      g.clearRect(0, 0, w, h)
      const analyser = analyserRef.current
      if (analyser) analyser.getByteFrequencyData(data)
      for (let i = 0; i < bars; i++) {
        const v = analyser
          ? data[Math.floor((i / bars) * (data.length - 1))] / 255
          : Math.random() * 0.5 + 0.2
        const bw = w / bars
        const bh = Math.max(4, v * h)
        g.fillStyle = i % 7 === 0 ? 'rgba(214,16,30,0.95)' : 'rgba(236,231,221,0.85)'
        g.fillRect(i * bw + bw * 0.18, h - bh, bw * 0.64, bh)
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [])

  const stopVisualizer = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    drawIdle()
  }, [drawIdle])

  const toggleTrack = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      startVisualizer()
      void audio.play()
    } else {
      audio.pause()
    }
  }, [startVisualizer])

  const onSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * audio.duration
    setTrackTime(audio.currentTime)
  }, [])

  const playVideo = useCallback(() => {
    const v = document.getElementById('dys-video') as HTMLVideoElement | null
    if (!v) return
    setVideoStarted(true)
    void v.play()
  }, [])

  return (
    <div className="dys">
      {/* ── atmosphere ─────────────────────────────────────────────────────── */}
      <div className="dys-grain" aria-hidden="true" />
      <div className="dys-scan" aria-hidden="true" />
      <div className="dys-vhs-band" aria-hidden="true" />
      <div className="dys-cursor" ref={cursorRef} aria-hidden="true" />

      {/* ── entry gate ─────────────────────────────────────────────────────── */}
      {!entered && (
        <div
          className="dys-gate"
          role="button"
          tabIndex={0}
          aria-label="Enter the press kit"
          onClick={enter}
          onKeyDown={(e) => e.key === 'Enter' && enter()}
        >
          <div className="dys-gate-static" aria-hidden="true" />
          <p className="dys-gate-signal">SIGNAL ACQUIRED ✝ 60.17335N</p>
          <p className="dys-gate-name">DY$TROY</p>
          <p className="dys-gate-hint">[ CLICK OR PRESS ANY KEY TO ENTER ]</p>
        </div>
      )}

      {/* ── fixed chrome ───────────────────────────────────────────────────── */}
      <header className="dys-topbar">
        <a className="dys-brand" href="#top" data-hover>
          <span className="dys-brand-mark">✝</span> DY$TROY
        </a>
        <nav className="dys-nav" aria-label="Dystroy sections">
          {[
            ['MANIFESTO', '#manifesto'],
            ['SOUND', '#sound'],
            ['VISUALS', '#visuals'],
            ['ARCHIVE', '#archive'],
            ['RITUALS', '#rituals'],
            ['SUMMON', '#summon'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              data-text={label}
              onMouseEnter={(e) => scramble(e.currentTarget)}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <aside className="dys-rail dys-rail-l" aria-hidden="true">
        OFFICIAL PRESS KIT ✝ V1
      </aside>
      <aside className="dys-rail dys-rail-r" aria-hidden="true">
        KUALA LUMPUR ✝ MALAYSIA
      </aside>

      <main>
        {/* ── hero ─────────────────────────────────────────────────────────── */}
        <section className="dys-hero" id="top" aria-label="hero">
          <div className="dys-hero-img" ref={heroImgRef} aria-hidden="true">
            <img src="/dystroy/img/portrait-flash.webp" alt="" />
          </div>
          <div className="dys-hero-copy">
            <p className="dys-kicker">✝ OFFICIAL PRESS KIT ✝</p>
            <h1 className="dys-title" data-text="DY$TROY">
              DY<span className="dys-red">$</span>TROY
            </h1>
            <p className="dys-hero-sub">
              HIP-HOP ✝ OPEN FORMAT DJ — KUALA LUMPUR, MALAYSIA
            </p>
            <p className="dys-hero-tags">
              <span>OP1UM MOVEMENT</span>
              <span>RAGE</span>
              <span>THE NEW UNDERGROUND</span>
            </p>
          </div>
          <div className="dys-scroll-cue" aria-hidden="true">
            <span className="dys-scroll-line" />
            SCROLL INTO THE VOID
          </div>
        </section>

        {/* ── ticker ───────────────────────────────────────────────────────── */}
        <div className="dys-ticker" aria-hidden="true">
          <div className="dys-ticker-track">
            {[0, 1].map((n) => (
              <span className="dys-ticker-run" key={n}>
                {TICKER_ITEMS.map((t) => (
                  <span className="dys-ticker-item" key={t}>
                    {t} <i>✝</i>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── manifesto ────────────────────────────────────────────────────── */}
        <section className="dys-section dys-manifesto" id="manifesto" aria-label="manifesto">
          <header className="dys-sec-head dys-reveal">
            <p className="dys-kicker">01 — THE MANIFESTO</p>
            <h2 className="dys-sec-word" data-word="MANIFESTO">
              MANIFESTO
            </h2>
          </header>
          <div className="dys-manifesto-grid">
            <figure className="dys-manifesto-art dys-reveal">
              <img src="/dystroy/img/skull.webp" alt="Gothic skull emblem" />
              <figcaption>
                ONE OF THE VERY FEW IN THE MALAYSIAN SCENE
                <br />
                PUSHING <b>OP1UM ✝ RAGE</b>
              </figcaption>
            </figure>
            <div className="dys-manifesto-body">
              <p className="dys-reveal">
                In a landscape of predictable sets, <b>DY$TROY</b> stands as a rare
                anomaly — one of the very few in the Malaysian scene pushing the{' '}
                <b className="dys-red">OP1UM</b> and <b className="dys-red">RAGE</b>{' '}
                movement, bringing that dark, distorted, high-octane energy that
                defines the new underground.
              </p>
              <p className="dys-reveal">
                But don&apos;t get it twisted — his range is as sharp as his service.
                While Hip-Hop is his soul, he is a master of the floor, effortlessly
                pivoting from the heavy grit of <b>Bass House</b> and{' '}
                <b>Tech House</b> to the rhythmic pulses of <b>Afro House</b> and{' '}
                <b>Pop</b>. Whether he&apos;s curating a mosh pit or keeping it
                grooving with a House set, his philosophy remains the same.
              </p>
              <blockquote className="dys-quote dys-reveal">
                HIGH PRESSURE.
                <br />
                <span className="dys-red">ZERO LAG.</span>
              </blockquote>
              <p className="dys-reveal">
                Drawing from the fast-paced grind of the service industry, he knows
                exactly how to read the room and deliver the hit the crowd is
                craving. He&apos;s not just a DJ — he&apos;s the{' '}
                <b>local authority on the sounds of the future.</b>
              </p>
              <dl className="dys-facts dys-reveal">
                <div>
                  <dt>MORTAL NAME</dt>
                  <dd>DYLAN CHOW</dd>
                </div>
                <div>
                  <dt>FORMAT</dt>
                  <dd>HIP-HOP / OPEN FORMAT</dd>
                </div>
                <div>
                  <dt>BASE</dt>
                  <dd>KUALA LUMPUR, MY</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ── sound ────────────────────────────────────────────────────────── */}
        <section className="dys-section dys-sound" id="sound" aria-label="sound">
          <header className="dys-sec-head dys-reveal">
            <p className="dys-kicker">02 — SELECTED TRANSMISSIONS</p>
            <h2 className="dys-sec-word" data-word="SOUND">
              SOUND
            </h2>
          </header>

          <div className="dys-player dys-reveal">
            <div className="dys-player-head">
              <span>TRANSMISSION_001</span>
              <span className="dys-red">● LIVE FROM THE VOID</span>
            </div>
            <div className="dys-player-body">
              <button
                className="dys-play"
                onClick={toggleTrack}
                aria-label={playing ? 'Pause track' : 'Play track'}
                data-hover
              >
                {playing ? '❚❚' : '▶'}
              </button>
              <div className="dys-player-meta">
                <p className="dys-track-title">戒烟戒酒戒色 ✝ HIGH END LOCAL</p>
                <p className="dys-track-sub">DY$TROY — BLEND / DEMO TRANSMISSION</p>
                <canvas
                  className="dys-viz"
                  ref={canvasRef}
                  aria-hidden="true"
                />
                <div
                  className="dys-progress"
                  onClick={onSeek}
                  role="progressbar"
                  aria-label="Seek"
                  aria-valuenow={Math.round((trackTime / (trackDuration || 1)) * 100)}
                  tabIndex={0}
                >
                  <span
                    className="dys-progress-fill"
                    style={{ width: `${(trackTime / (trackDuration || 1)) * 100}%` }}
                  />
                </div>
                <div className="dys-time">
                  <span>{formatTime(trackTime)}</span>
                  <span>{formatTime(trackDuration)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dys-arsenal dys-reveal">
            <p className="dys-arsenal-label">THE ARSENAL ✝</p>
            <ul>
              {ARSENAL.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          <audio
            ref={audioRef}
            src="/dystroy/media/high-end-local.mp3"
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => {
              setPlaying(false)
              stopVisualizer()
            }}
            onEnded={() => {
              setPlaying(false)
              stopVisualizer()
            }}
            onTimeUpdate={(e) => setTrackTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => {
              if (Number.isFinite(e.currentTarget.duration)) {
                setTrackDuration(e.currentTarget.duration)
              }
            }}
          />
        </section>

        {/* ── visuals ──────────────────────────────────────────────────────── */}
        <section className="dys-section dys-visuals" id="visuals" aria-label="visuals">
          <header className="dys-sec-head dys-reveal">
            <p className="dys-kicker">03 — FOOTAGE</p>
            <h2 className="dys-sec-word" data-word="VISUALS">
              VISUALS
            </h2>
          </header>

          <div className="dys-vhs dys-reveal">
            <div className="dys-vhs-head">
              <span className="dys-rec" aria-hidden="true">
                ● REC
              </span>
              <span>FOOTAGE_001.MOV</span>
              <span>00:17 — 1080×1920</span>
            </div>
            <div className="dys-vhs-screen">
              <video
                id="dys-video"
                poster="/dystroy/media/sicko-poster.jpg"
                controls={videoStarted}
                playsInline
                preload="none"
                onClick={() => !videoStarted && playVideo()}
              >
                <source src="/dystroy/media/sicko-clip.mp4" type="video/mp4" />
              </video>
              {!videoStarted && (
                <button className="dys-vhs-play" onClick={playVideo} aria-label="Play footage" data-hover>
                  <span>▶</span>
                  <em>SICKO MODE ✝ WOKE UP LIKE THIS</em>
                </button>
              )}
            </div>
            <div className="dys-vhs-foot">
              <span>▶ PLAY BIT: SICKO MODE × WOKE UP LIKE THIS</span>
              <span>TAPE 001 — CLUB RITUAL FOOTAGE</span>
            </div>
          </div>
        </section>

        {/* ── archive ──────────────────────────────────────────────────────── */}
        <section className="dys-section dys-archive" id="archive" aria-label="archive">
          <header className="dys-sec-head dys-reveal">
            <p className="dys-kicker">04 — THE ARCHIVE</p>
            <h2 className="dys-sec-word" data-word="ARCHIVE">
              ARCHIVE
            </h2>
          </header>
          <div className="dys-grid">
            {ARCHIVE.map((item, i) => (
              <figure
                className={`dys-shot dys-reveal ${item.wide ? 'is-wide' : ''}`}
                key={item.label}
                style={{ ['--dys-rot' as string]: `${((i % 5) - 2) * 0.45}deg` }}
              >
                <img src={item.src} alt={`Dystroy performing — archive photo ${i + 1}`} loading="lazy" />
                <figcaption>{item.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── rituals ──────────────────────────────────────────────────────── */}
        <section className="dys-section dys-rituals" id="rituals" aria-label="rituals">
          <header className="dys-sec-head dys-reveal">
            <p className="dys-kicker">05 — GROUNDS PLAYED</p>
            <h2 className="dys-sec-word" data-word="RITUALS">
              RITUALS
            </h2>
          </header>
          <ul className="dys-ritual-list">
            {RITUALS.map((r) => (
              <li className="dys-ritual-row dys-reveal" key={r.venue} data-hover>
                <span className="dys-ritual-cross" aria-hidden="true">
                  ✝
                </span>
                <span className="dys-ritual-venue">{r.venue}</span>
                <span className="dys-ritual-event">{r.ritual}</span>
                <span className="dys-ritual-city">{r.city}</span>
                <span className="dys-ritual-status">PLAYED</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── summon ───────────────────────────────────────────────────────── */}
        <section className="dys-section dys-summon" id="summon" aria-label="contact">
          <img
            className="dys-summon-skull"
            src="/dystroy/img/cross.webp"
            alt=""
            aria-hidden="true"
          />
          <header className="dys-sec-head dys-reveal">
            <p className="dys-kicker">06 — BOOKINGS ✝ PRESS</p>
            <h2 className="dys-sec-word dys-sec-word-solid" data-word="SUMMON">
              SUMMON
            </h2>
          </header>
          <p className="dys-summon-line dys-reveal">
            BRING THE <b className="dys-red">RAGE</b> TO YOUR GROUND.
          </p>
          <div className="dys-contact">
            <a className="dys-contact-row dys-reveal" href="mailto:dystr0y.wav@gmail.com" data-hover>
              <span className="dys-contact-key">EMAIL</span>
              <span className="dys-contact-val">dystr0y.wav@gmail.com</span>
            </a>
            <a className="dys-contact-row dys-reveal" href="tel:+60173353620" data-hover>
              <span className="dys-contact-key">PHONE</span>
              <span className="dys-contact-val">+60 17-335 3620</span>
            </a>
            <a
              className="dys-contact-row dys-reveal"
              href="https://www.instagram.com/dylanc0214/"
              target="_blank"
              rel="noreferrer"
              data-hover
            >
              <span className="dys-contact-key">INSTAGRAM</span>
              <span className="dys-contact-val">@dylanc0214</span>
            </a>
            <div className="dys-contact-row dys-contact-row-static dys-reveal">
              <span className="dys-contact-key">BASE</span>
              <span className="dys-contact-val">KUALA LUMPUR, MALAYSIA</span>
            </div>
          </div>
        </section>

        {/* ── footer ───────────────────────────────────────────────────────── */}
        <footer className="dys-footer">
          <a className="dys-return" href="/" data-hover>
            ↩ RETURN TO THE MORTAL REALM
          </a>
          <p>
            © MMXXVI DY$TROY — <span className="dys-red">ALL RITES RESERVED</span>
          </p>
          <p className="dys-footer-small">
            SOUND OF THE FUTURE ✝ HIGH PRESSURE ✝ ZERO LAG ✝ PRESS <kbd>$</kbd> FOR
            THE RAPTURE
          </p>
        </footer>
      </main>
    </div>
  )
}

export default DystroyPage
