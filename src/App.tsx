import MatrixRain from './components/MatrixRain'
import Terminal from './components/Terminal'
import { profile } from './data/profile'
import { useLang, type Lang } from './i18n'

export default function App() {
  const { lang, setLang, t } = useLang()
  return (
    <>
      <div className="scanlines" aria-hidden="true" />
      <header className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden px-4 py-12">
        <MatrixRain />
        <div className="relative w-full max-w-3xl">
          <h1 className="text-2xl font-bold sm:text-4xl">
            {profile.name}<span className="cursor" aria-hidden="true">█</span>
          </h1>
          <p className="text-phosphor-dim">{profile.role[lang]}</p>
          <p className="text-xs text-phosphor-dim">{profile.location}</p>
        </div>
        <Terminal />
        <nav aria-label={t.sections} className="relative flex flex-wrap items-center gap-4 text-sm text-phosphor-dim">
          <a href="#about" className="hover:text-phosphor">{t.navAbout}</a>
          <a href="#projects" className="hover:text-phosphor">{t.navProjects}</a>
          <a href="#contact" className="hover:text-phosphor">{t.navContact}</a>
          <span role="group" aria-label={t.language}>
            [
            {(['en', 'es'] as Lang[]).map((l, i) => (
              <span key={l}>
                {i > 0 && '|'}
                <button
                  type="button"
                  onCl  ick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={lang === l ? 'font-bold text-phosphor' : 'hover:text-phosphor'}
                >
                  {l.toUpperCase()}
                </button>
              </span>
            ))}
            ]
          </span>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl space-y-16 px-4 py-16">
        <section id="about" aria-labelledby="about-title">
          <h2 id="about-title" className="mb-4 text-xl font-bold">&gt; {t.hAbout}</h2>
          <p className="text-phosphor-dim">{profile.about[lang]}</p>
        </section>

        <section id="projects" aria-labelledby="projects-title">
          <h2 id="projects-title" className="mb-4 text-xl font-bold">&gt; {t.hProjects}</h2>
          <ul className="space-y-6">
            {profile.projects.map((p) => (
              <li key={p.name} className="border-l border-phosphor-dim pl-4">
                <h3 className="font-bold">
                  <a href={p.url} target="_blank" rel="noreferrer" className="underline hover:no-underline">{p.name}</a>
                </h3>
                <p className="text-phosphor-dim">{p.description[lang]}</p>
                <p className="text-xs text-phosphor-dim">{p.tags.map((tag) => `#${tag}`).join(' ')}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title" className="mb-4 text-xl font-bold">&gt; {t.hContact}</h2>
          <ul className="space-y-2">
            {profile.contact.map((c) => (
              <li key={c.label} className="break-all">
                <span className="text-phosphor-dim">{c.label}: </span>
                <a href={c.href} target="_blank" rel="noreferrer" className="underline hover:no-underline">{c.text}</a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="px-4 pb-8 text-center text-xs text-phosphor-dim">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </>
  )
}
