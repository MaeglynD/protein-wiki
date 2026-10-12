export const themes = [
  { id: 'porcelain', name: 'Porcelain', background: 0xe9e6de },
  { id: 'graphite', name: 'Graphite', background: 0x191816 },
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
export function setTheme(id) {
  const next=themes.findIndex(t=>t.id===id);
  if(next<0)return currentTheme();
  index=next;
  try { localStorage.setItem('protein-wiki-theme', currentTheme().id); } catch {}
  apply();
  return currentTheme();
}
export function cycleTheme() {return setTheme(themes[(index+1)%themes.length].id);}
apply();
