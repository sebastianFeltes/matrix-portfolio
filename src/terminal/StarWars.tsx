import { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { dict, type Lang } from '../i18n'

const TITLE = [
  '█▀ █▀▀ █▄▄ ▄▀█ █▀ ▀█▀ █ ▄▀█ █▄ █',
  '▄█ ██▄ █▄█ █▀█ ▄█  █  █ █▀█ █ ▀█',
  '      █▀▀ █▀▀ █   ▀█▀ █▀▀ █▀',
  '      █▀  ██▄ █▄▄  █  ██▄ ▄█',
]

const CRAWL: Record<Lang, { episode: string; heading: string; paragraphs: string[] }> = {
  en: {
    episode: 'Episode IV',
    heading: 'A NEW DEPLOY',
    paragraphs: [
      'It is a period of tight deadlines. A lone developer, working from a quiet corner of Berisso, has shipped SaaS products end to end, from the first commit to the last migration.',
      'Armed with React, Laravel and a trusty terminal, he integrates payment gateways and bank APIs so that clubs, unions and creators can get paid without a single lost transaction.',
      'Now, guided by AI agents and a steady supply of mate, he races to push the next deploy to production, restoring order to the galaxy one green build at a time....',
    ],
  },
  es: {
    episode: 'Episodio IV',
    heading: 'UN NUEVO DEPLOY',
    paragraphs: [
      'Son tiempos de plazos ajustados. Un desarrollador solitario, desde un rincón tranquilo de Berisso, lanzó productos SaaS de punta a punta, del primer commit a la última migración.',
      'Armado con React, Laravel y una terminal de confianza, integra pasarelas de pago y APIs bancarias para que clubes, sindicatos y creadores cobren sin perder una sola transacción.',
      'Ahora, guiado por agentes de IA y una buena dosis de mate, corre a subir el próximo deploy a producción, devolviendo el orden a la galaxia un build en verde a la vez....',
    ],
  },
}

export default function StarWars({ lang }: { lang: Lang }) {
  const reduce = useReducedMotion()
  const [playing, setPlaying] = useState(!reduce)
  const t = dict[lang]
  const c = CRAWL[lang]

  const stars = useMemo(
    () => Array.from({ length: 60 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, o: 0.3 + Math.random() * 0.7 })),
    [],
  )

  useEffect(() => {
    if (!playing) return
    const stop = () => setPlaying(false)
    // defer so the Enter that launched the command doesn't skip it
    const id = setTimeout(() => window.addEventListener('keydown', stop, { once: true }), 50)
    return () => {
      clearTimeout(id)
      window.removeEventListener('keydown', stop)
    }
  }, [playing])

  const text = (
    <>
      <p className="mb-6 text-center">{c.episode}</p>
      <p className="mb-8 text-center font-bold">{c.heading}</p>
      {c.paragraphs.map((p) => (
        <p key={p} className="mb-6 text-justify">{p}</p>
      ))}
    </>
  )

  return (
    <div className="space-y-2 whitespace-normal">
      <p className="text-phosphor-dim italic">A long time ago, in a Berisso far, far away....</p>
      <pre aria-label="Sebastián Feltes" className="overflow-x-auto font-bold leading-tight text-phosphor">{TITLE.join('\n')}</pre>
      {playing ? (
        <div className="sw-box relative h-72 overflow-hidden border border-phosphor-faint bg-black">
          {stars.map((s, i) => (
            <span key={i} className="absolute h-px w-px bg-phosphor" style={{ left: `${s.x}%`, top: `${s.y}%`, opacity: s.o }} />
          ))}
          <div className="sw-perspective absolute inset-0">
            <div className="sw-crawl mx-auto w-4/5 text-phosphor" onAnimationEnd={() => setPlaying(false)}>
              {text}
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setPlaying(false)
            }}
            className="absolute right-2 bottom-2 z-10 border border-phosphor-dim bg-black px-2 text-xs text-phosphor-dim hover:text-phosphor"
          >
            [{t.skip}]
          </button>
          <span className="absolute bottom-2 left-2 text-xs text-phosphor-dim">{t.skipHint}</span>
        </div>
      ) : (
        <div className="border-l border-phosphor-dim pl-4 text-phosphor-dim">{text}</div>
      )}
      <p className="text-phosphor-dim">
        {t.credit}
        <a href="https://www.asciimation.co.nz" target="_blank" rel="noreferrer" className="underline">https://www.asciimation.co.nz</a>
      </p>
    </div>
  )
}
