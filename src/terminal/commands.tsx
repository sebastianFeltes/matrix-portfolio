import type { ReactNode } from 'react'
import { profile } from '../data/profile'
import { dict, fmt, type CommandName, type Lang } from '../i18n'
import { absCwd, getNode, resolve, type FileKind } from './fs'
import StarWars from './StarWars'

export type Ctx = {
  lang: Lang
  args: string[]
  cwd: string[]
  setCwd: (cwd: string[]) => void
  setLang: (l: Lang) => void
  history: string[]
}

/** 'clear' is a sentinel: the UI wipes the screen */
export type Output = ReactNode | { clear: true }

const dim = (s: ReactNode) => <span className="text-phosphor-dim">{s}</span>

export const About = ({ lang }: { lang: Lang }) => <span>{profile.about[lang]}</span>

export const Projects = ({ lang, only }: { lang: Lang; only?: string }) => (
  <ul>
    {profile.projects
      .filter((p) => !only || p.name === only)
      .map((p) => (
        <li key={p.name}>
          <a href={p.url} target="_blank" rel="noreferrer" className="underline">{p.name}</a>
          {dim(<> — {p.description[lang]} {p.tags.map((t) => `#${t}`).join(' ')}</>)}
        </li>
      ))}
  </ul>
)

export const Contact = () => (
  <ul>
    {profile.contact.map((c) => (
      <li key={c.label}>
        {dim(c.label.padEnd(10))}
        <a href={c.href} target="_blank" rel="noreferrer" className="underline">{c.text}</a>
      </li>
    ))}
  </ul>
)

export const Stack = ({ lang }: { lang: Lang }) => (
  <ul>
    {profile.stack.map((g) => (
      <li key={g.key}>
        <span className="text-phosphor">{g.label[lang].padEnd(10)}</span>
        {dim((g.key === 'ai' && lang === 'es' ? ['Agentes', ...g.items.slice(1)] : g.items).join(' · '))}
      </li>
    ))}
  </ul>
)

function renderFile(f: FileKind, lang: Lang): ReactNode {
  switch (f.type) {
    case 'about': return <About lang={lang} />
    case 'contact': return <Contact />
    case 'stack': return <Stack lang={lang} />
    case 'project': return <Projects lang={lang} only={f.name} />
  }
}

const LOGO = [
  '   ____  ____ ',
  '  / ___||  _ \\',
  '  \\___ \\| |_) |',
  '   ___) |  __/ ',
  '  |____/|_|    ',
]

type Cmd = (ctx: Ctx) => Output

export const COMMANDS: Record<CommandName, Cmd> = {
  help: ({ lang }) => (
    <ul>
      {(Object.keys(COMMANDS) as CommandName[]).map((name) => (
        <li key={name}>
          <span className="text-phosphor">{name.padEnd(10)}</span>
          {dim(dict[lang].help[name])}
        </li>
      ))}
    </ul>
  ),
  about: ({ lang }) => <About lang={lang} />,
  projects: ({ lang }) => <Projects lang={lang} />,
  contact: () => <Contact />,
  stack: ({ lang }) => <Stack lang={lang} />,
  whoami: ({ lang }) => dict[lang].whoami,
  lang: ({ lang, args, setLang }) => {
    const next = args[0]?.toLowerCase()
    if (next === 'en' || next === 'es') {
      setLang(next)
      return dict[next].langSet
    }
    const t = dict[lang]
    return <>{fmt(t.langCurrent, { lang })}{'\n'}{dim(t.langUsage)}</>
  },
  ls: ({ lang, args, cwd }) => {
    const long = args.some((a) => a.startsWith('-'))
    const path = args.find((a) => !a.startsWith('-')) ?? '.'
    const segs = resolve(cwd, path)
    const node = segs && getNode(segs)
    if (!node) return dim(fmt(dict[lang].noSuchFile, { cmd: 'ls', path }))
    if (node.kind === 'file') return path
    const entries = Object.entries(node.children)
    if (long) {
      return (
        <ul>
          {entries.map(([name, n]) => (
            <li key={name}>
              {dim(`${n.kind === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'}  visitor visitor  ${n.kind === 'dir' ? '4096' : ' 512'}  `)}
              <span className={n.kind === 'dir' ? 'font-bold' : ''}>{name}{n.kind === 'dir' ? '/' : ''}</span>
            </li>
          ))}
        </ul>
      )
    }
    return entries.map(([name, n]) => (n.kind === 'dir' ? `${name}/` : name)).join('  ')
  },
  cd: ({ lang, args, cwd, setCwd }) => {
    const path = args[0] ?? '~'
    const segs = resolve(cwd, path)
    const node = segs && getNode(segs)
    if (!segs || !node) return dim(fmt(dict[lang].noSuchFile, { cmd: 'cd', path }))
    if (node.kind !== 'dir') return dim(fmt(dict[lang].notDir, { path }))
    setCwd(segs)
    return null
  },
  pwd: ({ cwd }) => absCwd(cwd),
  cat: ({ lang, args, cwd }) => {
    const t = dict[lang]
    if (!args.length) return dim(t.catUsage)
    return (
      <>
        {args.map((path, i) => {
          const segs = resolve(cwd, path)
          const node = segs && getNode(segs)
          if (!node) return <div key={i}>{dim(fmt(t.noSuchFile, { cmd: 'cat', path }))}</div>
          if (node.kind === 'dir') return <div key={i}>{dim(fmt(t.isDir, { path }))}</div>
          return <div key={i}>{renderFile(node.content, lang)}</div>
        })}
      </>
    )
  },
  echo: ({ args }) => args.join(' '),
  date: ({ lang }) => new Date().toLocaleString(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'full', timeStyle: 'medium' }),
  uname: ({ args }) => (args.includes('-a') ? 'PortfolioOS 1.0 berisso x86_64' : 'PortfolioOS'),
  history: ({ history }) => (
    <ul>
      {history.map((h, i) => (
        <li key={i}>{dim(String(i + 1).padStart(4) + '  ')}{h}</li>
      ))}
    </ul>
  ),
  clear: () => ({ clear: true }),
  neofetch: ({ lang }) => {
    const t = dict[lang]
    const info: [string, string][] = [
      [t.nfLocation, profile.location],
      ['OS', 'PortfolioOS 1.0 x86_64'],
      [t.nfShell, 'portfolio-sh'],
      [t.nfLang, lang],
      [t.nfStack, profile.stack.slice(0, 3).map((g) => g.items.slice(0, 3).join(', ')).join(' · ')],
    ]
    return (
      <div className="flex flex-wrap gap-6">
        <pre className="font-bold leading-tight">{LOGO.join('\n')}</pre>
        <div>
          <p className="font-bold">visitor@portfolio</p>
          <p>{dim('-----------------')}</p>
          <p><span className="font-bold">{profile.name}</span> — {profile.role[lang]}</p>
          {info.map(([k, v]) => (
            <p key={k}><span className="font-bold">{k}:</span> {dim(v)}</p>
          ))}
        </div>
      </div>
    )
  },
  man: ({ lang, args }) => {
    const t = dict[lang]
    const name = args[0]?.toLowerCase()
    if (!name) return dim(t.manUsage)
    if (!(name in t.help)) return dim(fmt(t.noManual, { cmd: name }))
    return <>{<span className="font-bold">{name}</span>} — {t.help[name as CommandName]}</>
  },
  sudo: ({ lang }) => dict[lang].sudo,
  exit: ({ lang }) => dict[lang].exit,
  starwars: ({ lang }) => <StarWars lang={lang} />,
}

export const COMMAND_NAMES = Object.keys(COMMANDS) as CommandName[]

export function runCommand(name: string, ctx: Ctx): Output {
  const key = name.toLowerCase()
  if (key in COMMANDS) return COMMANDS[key as CommandName](ctx)
  return dim(fmt(dict[ctx.lang].notFound, { cmd: name }))
}
