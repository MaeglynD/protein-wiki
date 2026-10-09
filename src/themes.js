export const themes = [
  { id: 'graphite', name: 'Graphite', background: 0x191816 },
  { id: 'porcelain', name: 'Porcelain', background: 0xe9e6de },
  { id: 'slate', name: 'Slate', background: 0x10161d },
  { id: 'juniper', name: 'Juniper', background: 0x10201c },
  { id: 'aubergine', name: 'Aubergine', background: 0x201820 }
];
let index = 0;
try { index = Math.max(0, themes.findIndex(t => t.id === (localStorage.getItem('protein-wiki-theme') || localStorage.getItem('forma-theme')))); } catch {}
export const currentTheme = () => themes[index];
function apply() {
  document.documentElement.dataset.theme = currentTheme().id;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#' + currentTheme().background.toString(16).padStart(6, '0'));

  document.documentElement.style.colorScheme = currentTheme().id === 'porcelain' ? 'light' : 'dark';
}
export function cycleTheme() {
  index = (index + 1) % themes.length;
  try { localStorage.setItem('protein-wiki-theme', currentTheme().id); } catch {}
  apply();
  return { ...currentTheme(), number: index + 1, total: themes.length };
}
apply();
