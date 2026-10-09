import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { profile } from '../data/profile'
import { dict, fmt, useLang } from '../i18n'
import { COMMAND_NAMES, runCommand } from '../terminal/commands'
import { completePath, formatCwd } from '../terminal/fs'

type Line = { id: number; content: ReactNode }

let nextId = 0
const line = (content: ReactNode): Line => ({ id: nextId++, content })

const commonPrefix = (xs: string[]) =>
  xs.reduce((a, b) => {
    let i = 0
    while (i < a.length && i < b.length && a[i].toLowerCase() === b[i].toLowerCase()) i++
    return a.slice(0, i)
  })

export default function Terminal() {
  const reduce = useReducedMotion()
  const { lang, setLang, t } = useLang()
  const [lines, setLines] = useState<Line[]>([])
  const [booted, setBooted] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const [cwd, setCwd] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const bootLang = useRef(lang)

  const prompt = `visitor@portfolio:${formatCwd(cwd)}$`

  useEffect(() => {
    const boot = dict[bootLang.current].boot.map((s) => fmt(s, { name: profile.name }))
    if (reduce) {
      setLines(boot.map(line))
      setBooted(true)
      return
    }
    setLines([])
    const timers = boot.map((text, i) => setTimeout(() => setLines((l) => [...l, line(text)]), 400 * (i + 1)))
    timers.push(setTimeout(() => setBooted(true), 400 * (boot.length + 1)))
    return () => timers.forEach(clearTimeout)
  }, [reduce])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [lines])

  const run = (raw: string) => {
    const trimmed = raw.trim()
    const [name = '', ...args] = trimmed.split(/\s+/)
    const nextHistory = trimmed ? [...history, trimmed] : history
    setHistory(nextHistory)
    setCursor(-1)
    const echo = line(<span><span className="text-phosphor-dim">{prompt}</span> {raw}</span>)
    if (!name) return setLines((l) => [...l, echo])
    const out = runCommand(name, { lang, args, cwd, setCwd, setLang, history: nextHistory })
    if (out && typeof out === 'object' && 'clear' in out) return setLines([])
    setLines((l) => [...l, echo, ...(out != null && out !== '' ? [line(out as ReactNode)] : [])])
  }

  const complete = () => {
    const parts = input.split(/\s+/)
    const last = parts[parts.length - 1] ?? ''
    const isCmd = parts.length <= 1
    const matches = isCmd
      ? COMMAND_NAMES.filter((c) => c.startsWith(last.toLowerCase()))
      : completePath(cwd, last)
    if (!matches.length) return
    const head = parts.slice(0, -1).join(' ')
    const join = (s: string) => (head ? `${head} ${s}` : s)
    if (matches.length === 1) {
      const m = matches[0]
      setInput(join(m + (isCmd || !m.endsWith('/') ? ' ' : '')))
    } else {
      const pre = commonPrefix(matches)
      if (pre.length > last.length) setInput(join(pre))
      else setLines((l) => [...l, line(<span className="text-phosphor-dim">{matches.join('  ')}</span>)])
    }
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
      complete()
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <section
      aria-label={t.terminal}
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
          <span className="shrink-0 text-phosphor-dim">{prompt}</span>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label={t.command}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full min-w-0 bg-transparent text-phosphor caret-transparent outline-none focus-visible:outline-none"
          />
        </label>
      ) : (
        <span className="cursor" aria-hidden="true">█</span>
      )}
    </section>
  )
}
