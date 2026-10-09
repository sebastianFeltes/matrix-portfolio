import { profile } from '../data/profile'

export type FileKind = { type: 'about' } | { type: 'contact' } | { type: 'stack' } | { type: 'project'; name: string }
export type FsFile = { kind: 'file'; content: FileKind }
export type FsDir = { kind: 'dir'; children: Record<string, FsNode> }
export type FsNode = FsFile | FsDir

export const root: FsDir = {
  kind: 'dir',
  children: {
    'about.txt': { kind: 'file', content: { type: 'about' } },
    'contact.txt': { kind: 'file', content: { type: 'contact' } },
    'stack.txt': { kind: 'file', content: { type: 'stack' } },
    projects: {
      kind: 'dir',
      children: Object.fromEntries(
        profile.projects.map((p) => [`${p.name}.txt`, { kind: 'file', content: { type: 'project', name: p.name } } as FsFile]),
      ),
    },
  },
}

/** cwd is a list of segments below ~ */
export function resolve(cwd: string[], path = '~'): string[] | null {
  let parts: string[]
  let base: string[]
  if (path === '~' || path.startsWith('~/')) {
    base = []
    parts = path.slice(1).split('/')
  } else if (path.startsWith('/home/visitor')) {
    base = []
    parts = path.slice('/home/visitor'.length).split('/')
  } else if (path.startsWith('/')) {
    return null
  } else {
    base = [...cwd]
    parts = path.split('/')
  }
  for (const p of parts) {
    if (!p || p === '.') continue
    if (p === '..') base.pop()
    else base.push(p)
  }
  return base
}

export function getNode(segments: string[]): FsNode | null {
  let node: FsNode = root
  for (const s of segments) {
    if (node.kind !== 'dir') return null
    const next: FsNode | undefined = node.children[s]
    if (!next) return null
    node = next
  }
  return node
}

export const formatCwd = (cwd: string[]) => (cwd.length ? `~/${cwd.join('/')}` : '~')
export const absCwd = (cwd: string[]) => ['/home/visitor', ...cwd].join('/')

/** Completion candidates for a partial path relative to cwd (dirs get a trailing slash). */
export function completePath(cwd: string[], partial: string): string[] {
  const slash = partial.lastIndexOf('/')
  const dirPart = slash >= 0 ? partial.slice(0, slash + 1) : ''
  const prefix = slash >= 0 ? partial.slice(slash + 1) : partial
  const dirSegs = resolve(cwd, dirPart || '.')
  const dir = dirSegs && getNode(dirSegs)
  if (!dir || dir.kind !== 'dir') return []
  return Object.entries(dir.children)
    .filter(([name]) => name.toLowerCase().startsWith(prefix.toLowerCase()))
    .map(([name, n]) => dirPart + name + (n.kind === 'dir' ? '/' : ''))
}
