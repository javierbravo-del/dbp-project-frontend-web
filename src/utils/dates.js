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