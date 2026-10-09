import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { profile } from '../data/profile'

const PROMPT = 'visitor@portfolio:~$'
const BOOT = ['iniciando sistema...', `conectado a ${profile.name}`, 'escribí "help" para ver los comandos.']

type Line = { id: number; content: ReactNode }

const COMMANDS: Record<string, { help: string; run: () => ReactNode }> = {
  help: {
    help: 'muestra esta ayuda',
    run: () => (
      <ul>
        {Object.entries(COMMANDS).map(([name, c]) => (
          <li key={name}>
            <span className="text-phosphor">{name.padEnd(10)}</span>
            <span className="text-phosphor-dim">{c.help}</span>
          </li>
        ))}
      </ul>
    ),
  },
  about: { help: 'quién soy', run: () => profile.about },
  projects: {
    help: 'lista de proyectos',
    run: () => (
      <ul>
        {profile.projects.map((p) => (
          <li key={p.name}>
            <a href={p.url} target="_blank" rel="noreferrer" className="underline">{p.name}</a>
            <span className="text-phosphor-dim"> — {p.description}</span>
          </li>
        ))}
      </ul>
    ),
  },
  contact: {
    help: 'cómo contactarme',
    run: () => (
      <ul>
        {profile.contact.map((c) => (
          <li key={c.label}>
            <span className="text-phosphor-dim">{c.label.padEnd(10)}</span>
            <a href={c.href} target="_blank" rel="noreferrer" className="underline">{c.text}</a>
          </li>
        ))}
      </ul>
    ),
  },
    stack: {
    help: 'tecnologías que uso',
    run: () => (
      <ul>
        {Object.entries(profile.stack).map(([area, items]) => (
          <li key={area}>
            <span className="text-phosphor">{area.padEnd(10)}</span>
            <span className="text-phosphor-dim">{items.join(' · ')}</span>
          </li>
        ))}
      </ul>
    ),
  },
  whoami: { help: 'quién sos vos', run: () => 'visitor — gracias por pasar.' },
  clear: { help: 'limpia la pantalla', run: () => null },
}

let nextId = 0
const line = (content: ReactNode): Line => ({ id: nextId++, content })
const finePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

export default function Terminal() {
  const reduce = useReducedMotion()
  const [lines, setLines] = useState<Line[]>([])
  const [booted, setBooted] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce) {
      setLines(BOOT.map(line))
      setBooted(true)
      return
    }
    const timers = BOOT.map((text, i) => setTimeout(() => setLines((l) => [...l, line(text)]), 400 * (i + 1)))
    timers.push(setTimeout(() => setBooted(true), 400 * (BOOT.length + 1)))
    return () => timers.forEach(clearTimeout)
  }, [reduce])

  useEffect(() => {endRef.current?.scrollIntoView({ block: 'nearest' })}, [lines])

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    if (cmd) setHistory((h) => [...h, cmd])
    setCursor(-1)
    if (cmd === 'clear') return setLines([])
    const echo = line(<span><span className="text-phosphor-dim">{PROMPT}</span> {raw}</span>)
    const out = !cmd
      ? null
      : COMMANDS[cmd]
        ? line(COMMANDS[cmd].run())
        : line(<span className="text-phosphor-dim">comando no encontrado: {cmd}. Probá "help".</span>)
    setLines((l) => [...l, echo, ...(out ? [out] : [])])
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      if (!history.length) return
      const next = e.key === 'ArrowUp'
        ? (cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1))
        : (cursor === -1 ? -1 : cursor + 1)
      const valid = next >= 0 && next < history.length
      setCursor(valid ? next : -1)
      setInput(valid ? history[next] : '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(input.trim().toLowerCase()))
      if (matches.length === 1) setInput(matches[0])
      else if (matches.length > 1) setLines((l) => [...l, line(<span className="text-phosphor-dim">{matches.join('  ')}</span>)])
    }
  }

  return (
    <section
      aria-label="Terminal interactiva"
      onClick={() => inputRef.current?.focus()}
      className="relative w-full max-w-3xl border border-phosphor-dim bg-black/80 p-4 text-sm sm:text-base"
    >
      <div aria-live="polite" className="max-h-[60vh] space-y-1 overflow-y-auto whitespace-pre-wrap break-words">
        {lines.map((l) => (
          <motion.div key={l.id} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            {l.content}
          </motion.div>
        ))}
        <div ref={endRef} />
      </div>
      {booted ? (
        <label className="mt-1 flex items-center gap-2">
          <span className="shrink-0 text-phosphor-dim">{PROMPT}</span>
          <input
            ref={inputRef}
            autoFocus={finePointer}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Comando"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full min-w-0 bg-transparent text-phosphor caret-phosphor outline-none focus-visible:outline-none"
          />
        </label>
      ) : (
        <span className="cursor" aria-hidden="true">█</span>
      )}
    </section>
  )
}