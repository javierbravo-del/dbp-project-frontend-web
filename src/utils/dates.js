export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getLastDaysRange(days = 30) {
  const hasta = new Date();
  const desde = new Date();
  desde.setDate(hasta.getDate() - (days - 1));
  return { desde: toISODate(desde), hasta: toISODate(hasta) };
}

export function addDays(isoDate, amount) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

export function countDays({ desde, hasta }) {
  const [y1, m1, d1] = desde.split('-').map(Number);
  const [y2, m2, d2] = hasta.split('-').map(Number);
  const ms = new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1);
  return Math.round(ms / 86400000) + 1;
}

// Periodo inmediatamente anterior y de igual duración
export function getPreviousRange(range) {
  const days = countDays(range);
  return { desde: addDays(range.desde, -days), hasta: addDays(range.desde, -1) };
}

export function getDaysList(hasta, days = 7) {
  return Array.from({ length: days }, (_, i) => addDays(hasta, i - (days - 1)));
}

export function formatShortDay(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: 'numeric' }).format(
    new Date(y, m - 1, d),
  );
}

export function percentChange(current, previous) {
  const prev = Number(previous ?? 0);
  if (!prev) return null;
  return ((Number(current ?? 0) - prev) / Math.abs(prev)) * 100;
}
