import { createContext, createElement, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Lang } from './data/profile'

export type { Lang }

export const dict = {
  en: {
    boot: ['booting system...', 'connected to {name}', 'type "help" to see available commands.'],
    navAbout: '[about]', navProjects: '[projects]', navContact: '[contact]',
    hAbout: 'about', hProjects: 'projects', hContact: 'contact',
    sections: 'Sections', terminal: 'Interactive terminal', command: 'Command', language: 'Language',
    notFound: 'command not found: {cmd}. Try "help".',
    langCurrent: 'current language: {lang}', langUsage: 'usage: lang en | lang es',
    langSet: 'language set to English.',
    noSuchFile: '{cmd}: {path}: No such file or directory',
    notDir: 'cd: {path}: Not a directory', isDir: 'cat: {path}: Is a directory',
    catUsage: 'usage: cat <file>', manUsage: 'usage: man <command>',
    noManual: 'No manual entry for {cmd}',
    whoami: 'visitor — thanks for stopping by.',
    sudo: 'nice try. this incident will be reported.',
    exit: "there is no escape. you're in the portfolio now.",
    skip: 'skip', skipHint: 'press any key to skip',
    credit: 'Original ASCII Star Wars by Simon Jansen: ',
    nfLocation: 'Location', nfStack: 'Stack', nfShell: 'Shell', nfLang: 'Lang',
    help: {
      help: 'show this help', about: 'who I am', projects: 'list my projects', contact: 'how to reach me',
      stack: 'technologies I use', whoami: 'who you are', lang: 'switch language: lang en | lang es',
      ls: 'list directory contents', cd: 'change directory', pwd: 'print working directory',
      cat: 'print a file', echo: 'print text', date: 'show current date and time', uname: 'system info',
      history: 'command history', clear: 'clear the screen', neofetch: 'system summary with style',
      man: 'one-line manual for a command', sudo: 'run as superuser (good luck)', exit: 'leave the terminal',
      starwars: 'a long time ago, in a Berisso far, far away...',
    },
  },
  es: {
    boot: ['iniciando sistema...', 'conectado a {name}', 'escribí "help" para ver los comandos.'],
    navAbout: '[sobre mí]', navProjects: '[proyectos]', navContact: '[contacto]',
    hAbout: 'sobre mí', hProjects: 'proyectos', hContact: 'contacto',
    sections: 'Secciones', terminal: 'Terminal interactiva', command: 'Comando', language: 'Idioma',
    notFound: 'comando no encontrado: {cmd}. Probá "help".',
    langCurrent: 'idioma actual: {lang}', langUsage: 'uso: lang en | lang es',
    langSet: 'idioma cambiado a español.',
    noSuchFile: '{cmd}: {path}: No existe el archivo o el directorio',
    notDir: 'cd: {path}: No es un directorio', isDir: 'cat: {path}: Es un directorio',
    catUsage: 'uso: cat <archivo>', manUsage: 'uso: man <comando>',
    noManual: 'No hay entrada de manual para {cmd}',
    whoami: 'visitor — gracias por pasar.',
    sudo: 'buen intento. este incidente será reportado.',
    exit: 'no hay salida. ahora estás en el portfolio.',
    skip: 'saltar', skipHint: 'tocá cualquier tecla para saltar',
    credit: 'Star Wars en ASCII original de Simon Jansen: ',
    nfLocation: 'Ubicación', nfStack: 'Stack', nfShell: 'Shell', nfLang: 'Idioma',
    help: {
      help: 'muestra esta ayuda', about: 'quién soy', projects: 'lista de proyectos', contact: 'cómo contactarme',
      stack: 'tecnologías que uso', whoami: 'quién sos vos', lang: 'cambiar idioma: lang en | lang es',
      ls: 'lista el contenido de un directorio', cd: 'cambia de directorio', pwd: 'muestra el directorio actual',
      cat: 'muestra un archivo', echo: 'imprime texto', date: 'muestra fecha y hora', uname: 'info del sistema',
      history: 'historial de comandos', clear: 'limpia la pantalla', neofetch: 'resumen del sistema con estilo',
      man: 'manual de una línea de un comando', sudo: 'ejecutar como superusuario (suerte)', exit: 'salir de la terminal',
      starwars: 'hace mucho tiempo, en un Berisso muy, muy lejano...',
    },
  },
} as const

export type Dict = (typeof dict)['en'] | (typeof dict)['es']
export type CommandName = keyof Dict['help']

export const fmt = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '')

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict }
const LangContext = createContext<Ctx | null>(null)

const initial = (): Lang => {
  try {
    return localStorage.getItem('lang') === 'es' ? 'es' : 'en'
  } catch {
    return 'en'
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial)
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem('lang', l)
    } catch {
      /* ignore */
    }
  }, [])
  return createElement(LangContext.Provider, { value: { lang, setLang, t: dict[lang] } }, children)
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}
