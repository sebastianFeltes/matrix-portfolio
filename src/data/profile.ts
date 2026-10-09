export type Project = { name: string; description: string; url: string; tags: string[] }
export type ContactLink = { label: string; href: string; text: string }

export const profile = {
  name: 'Sebastián Feltes',
  role: 'Forward Development Engineer',
  location: 'Berisso, Buenos Aires, Argentina',
  about:
    'FDE en Berisso, Argentina. Construyo SaaS, plataformas y sitios a medida, de punta a punta: front, back, base de datos, pagos y deploy. Trabajo con IA y agentes en el día a día.',
  stack: {
    frontend: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind', 'CSS', 'Vite'],
    backend: ['Node', 'Express', 'PHP', 'Laravel', 'WordPress', 'Rust'],
    datos: ['PostgreSQL', 'MariaDB', 'SQLite', 'SQL', 'Firebase', 'Firestore'],
    mobile: ['React Native', 'Expo'],
    devops: ['Docker', 'Vercel', 'Google Cloud Console'],
    pagos: ['Mercado Pago Checkout Pro'],
    ia: ['Agentes', 'Cursor', 'Gemini', 'Antigravity', 'Claude'],
  },
  projects: [
    { name: 'clubastilleroriosantiago.ar', description: 'Sitio del Club Astillero Río Santiago, de punta a punta, con integración con Banco Provincia.', url: 'https://clubastilleroriosantiago.ar', tags: ['laravel', 'php', 'banco-provincia'] },
    { name: 'cfl404.ar', description: 'Sitio del Centro de Formación Laboral 404 de Berisso, de punta a punta.', url: 'https://cfl404.ar', tags: ['react', 'express', 'sqlite'] },
    { name: 'arnipay.com.py', description: 'Front de una pasarela de cobros digitales en Paraguay.', url: 'https://arnipay.com.py', tags: ['react', 'tailwind'] },
    { name: 'ceneka.net', description: 'Front de una plataforma de donaciones para creadores (página de donaciones + links), multi-idioma.', url: 'https://ceneka.net', tags: ['react', 'tailwind'] },    { name: 'ateberisso.com.ar', description: 'Sitio oficial de la seccional ATE Berisso: WordPress con deploy en VPS.', url: 'https://ateberisso.com.ar', tags: ['wordpress', 'vps'] },
  ] satisfies Project[],
  contact: [
    { label: 'github', href: 'https://github.com/sebastianFeltes', text: 'github.com/sebastianFeltes' },
    { label: 'email', href: 'mailto:programma.ad.futura@gmail.com', text: 'programma.ad.futura@gmail.com' },
    { label: 'linkedin', href: 'https://www.linkedin.com/in/sebastianFeltes', text: 'TSebastian Feltes' },
  ] satisfies ContactLink[],
}