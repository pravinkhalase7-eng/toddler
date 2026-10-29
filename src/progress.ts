export type Lang = "en" | "hi" | "mr";

export type Child = {
  id: string;
  name: string;
  lang: Lang;
  stars: Record<string, number>;
  favorites: string[];
  opened: string[];
  owned: string[];
  placed: Record<string, string[]>;
  spent: number;
};

type Store = { children: Child[]; activeId: string; restEnabled: boolean };

const KEY = "toddler-learn-children-v1";
const LEGACY = "toddler-learn-stars";
const listeners = new Set<() => void>();

function blank(name: string, stars: Record<string, number> = {}): Child {
  return {
    id: `c${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`,
    name,
    lang: "en",
    stars,
    favorites: [],
    opened: [],
    owned: [],
    placed: {},
    spent: 0,
  };
}

function legacyStars(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LEGACY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, number>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Store;
      if (parsed?.children?.length && parsed.activeId) return parsed;
    }
  } catch {
    /* start fresh */
  }
  const child = blank("Star", legacyStars());
  return { children: [child], activeId: child.id, restEnabled: true };
}

let store = load();

function save() {
  localStorage.setItem(KEY, JSON.stringify(store));
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function active() {
  return store.children.find((child) => child.id === store.activeId) ?? store.children[0];
}

export function getChild() {
  return active();
}

export function getLang(): Lang {
  return active().lang;
}

export function allChildren() {
  return store.children;
}

export function readStars() {
  return active().stars;
}

export function starsFor(title: string) {
  return active().stars[title] ?? 0;
}

export function totalStars() {
  return Object.values(active().stars).reduce((sum, n) => sum + n, 0);
}

export function walletStars() {
  return Math.max(0, totalStars() - active().spent);
}

export function awardStars(title: string, n: number) {
  const child = active();
  const next = Math.max(child.stars[title] ?? 0, Math.max(0, Math.min(3, n)));
  child.stars = { ...child.stars, [title]: next };
  if (!child.opened.includes(title)) child.opened = [...child.opened, title];
  save();
  return next;
}

export function markOpened(title: string) {
  const child = active();
  if (child.opened.includes(title)) return;
  child.opened = [...child.opened, title];
  save();
}

export function isFavorite(title: string) {
  return active().favorites.includes(title);
}

export function toggleFavorite(title: string) {
  const child = active();
  child.favorites = child.favorites.includes(title)
    ? child.favorites.filter((item) => item !== title)
    : [...child.favorites, title];
  save();
}

export function setLanguage(lang: Lang) {
  active().lang = lang;
  save();
}

export function setRestEnabled(enabled: boolean) {
  store.restEnabled = enabled;
  save();
}

export function restEnabled() {
  return store.restEnabled;
}

export function addChild(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  const child = blank(trimmed);
  store.children = [...store.children, child];
  store.activeId = child.id;
  save();
}

export function renameChild(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  active().name = trimmed;
  save();
}

export function switchChild(id: string) {
  if (!store.children.some((child) => child.id === id)) return;
  store.activeId = id;
  save();
}

export function ownsSticker(id: string) {
  return active().owned.includes(id);
}

export function placedStickers(scene: string) {
  return active().placed[scene] ?? [];
}

export function buySticker(id: string, cost: number) {
  const child = active();
  if (child.owned.includes(id)) return true;
  if (walletStars() < cost) return false;
  child.spent += cost;
  child.owned = [...child.owned, id];
  save();
  return true;
}

export function togglePlaced(scene: string, id: string) {
  const child = active();
  if (!child.owned.includes(id)) return;
  const current = child.placed[scene] ?? [];
  child.placed = {
    ...child.placed,
    [scene]: current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
  };
  save();
}

const SESSION = "toddler-session-start";
const REST_DONE = "toddler-rest-done";

export function touchSession() {
  if (!sessionStorage.getItem(SESSION)) sessionStorage.setItem(SESSION, String(Date.now()));
}

export function shouldRest() {
  if (!store.restEnabled) return false;
  if (sessionStorage.getItem(REST_DONE) === "1") return false;
  const start = Number(sessionStorage.getItem(SESSION) ?? Date.now());
  return Date.now() - start >= 15 * 60 * 1000;
}

export function dismissRest() {
  sessionStorage.setItem(REST_DONE, "1");
}
