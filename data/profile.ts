export type Lang = 'en' | 'es'
export type L10n = Record<Lang, string>
export type Project = { name: string; description: L10n; url: string; tags: string[] }
export type ContactLink = { label: string; href: string; text: string }
export type StackGroup = { key: string; label: L10n; items: string[] }

export const profile = {
  name: 'Sebastián Feltes',
  handle: 'visitor',
  role: { en: 'Forward Development Engineer', es: 'Forward Development Engineer' } satisfies L10n,
  location: 'Berisso, Buenos Aires, Argentina',
  about: {
    en: 'FDE based in Berisso, Argentina. I build SaaS products, platforms and custom websites end to end: front end, back end, databases, payments and deployment. I work with AI and agents every day.',
    es: 'FDE en Berisso, Argentina. Construyo SaaS, plataformas y sitios a medida, de punta a punta: front, back, base de datos, pagos y deploy. Trabajo con IA y agentes en el día a día.',
  } satisfies L10n,
  stack: [
    { key: 'frontend', label: { en: 'frontend', es: 'frontend' }, items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind', 'CSS', 'Vite'] },
    { key: 'backend', label: { en: 'backend', es: 'backend' }, items: ['Node', 'Express', 'PHP', 'Laravel', 'WordPress', 'Rust'] },
    { key: 'data', label: { en: 'data', es: 'datos' }, items: ['PostgreSQL', 'MariaDB', 'SQLite', 'SQL', 'Firebase', 'Firestore'] },
    { key: 'mobile', label: { en: 'mobile', es: 'mobile' }, items: ['React Native', 'Expo'] },
    { key: 'devops', label: { en: 'devops', es: 'devops' }, items: ['Docker', 'Vercel', 'Google Cloud Console'] },
    { key: 'payments', label: { en: 'payments', es: 'pagos' }, items: ['Mercado Pago Checkout Pro'] },
    { key: 'ai', label: { en: 'ai', es: 'ia' }, items: ['Agents', 'Cursor', 'Gemini', 'Antigravity', 'Claude'] },
  ] satisfies StackGroup[],
  projects: [
    {
      name: 'clubastilleroriosantiago.ar',
      description: {
        en: 'Website for Club Astillero Río Santiago, built end to end, with a Banco Provincia integration.',
        es: 'Sitio del Club Astillero Río Santiago, de punta a punta, con integración con Banco Provincia.',
      },
      url: 'https://clubastilleroriosantiago.ar',
      tags: ['laravel', 'php', 'banco-provincia'],
    },
    {
      name: 'cfl404.ar',
      description: {
        en: 'Website for Centro de Formación Laboral 404, a vocational training center in Berisso, built end to end.',
        es: 'Sitio del Centro de Formación Laboral 404 de Berisso, de punta a punta.',
      },
      url: 'https://cfl404.ar',
      tags: ['react', 'express', 'sqlite'],
    },
    {
      name: 'arnipay.com.py',
      description: {
        en: 'Front end for a digital payments gateway in Paraguay.',
        es: 'Front de una pasarela de cobros digitales en Paraguay.',
      },
      url: 'https://arnipay.com.py',
      tags: ['react', 'tailwind'],
    },
    {
      name: 'ceneka.net',
      description: {
        en: 'Front end for a multilingual donation platform for creators (donation page + links).',
        es: 'Front de una plataforma de donaciones para creadores (página de donaciones + links), multi-idioma.',
      },
      url: 'https://ceneka.net',
      tags: ['react', 'tailwind'],
    },
    {
      name: 'ateberisso.com.ar',
      description: {
        en: 'Official website of the ATE Berisso union branch: WordPress, deployed on a VPS.',
        es: 'Sitio oficial de la seccional ATE Berisso: WordPress con deploy en VPS.',
      },
      url: 'https://ateberisso.com.ar',
      tags: ['wordpress', 'vps'],
    },
  ] satisfies Project[],
  contact: [
    { label: 'github', href: 'https://github.com/sebastianFeltes', text: 'github.com/sebastianFeltes' },
    { label: 'email', href: 'mailto:programma.ad.futura@gmail.com', text: 'programma.ad.futura@gmail.com' },
    { label: 'linkedin', href: 'https://www.linkedin.com/in/sebastianFeltes', text: 'Sebastián Feltes' },
  ] satisfies ContactLink[],
}
