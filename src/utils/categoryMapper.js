export function mapToCategory({ name = '', category = '' } = {}) {
  const text = `${String(name || '')} ${String(category || '')}`.toLowerCase();

  // priority-based rules: check more-specific keywords first
  if (/\bduvet\b|\bblanket\b|\bbedding\b/.test(text)) return 'Duvet';
  if (/\b2[- ]?piece\b|\btwo ?piece\b|\b2 ?piece\b|\b2[- ]piece\b|\bset\b|\btwo ?piece set\b/.test(text)) return '2 Piece Sets';
  if (/\bromper\b|\bonesie\b|\bonesy\b/.test(text)) return 'Rompers';
  if (/\bdress\b|\bprincess\b|\bskirt\b|\bgown\b/.test(text)) return 'Dresses';
  // match singular and plural forms (sneakers, sandals, boots, trainers, loafers, pumps)
  if (/\b(?:shoe|shoes|sneaker|sneakers|sandal|sandals|loafer|loafers|boot|boots|trainer|trainers|pump|pumps)\b/.test(text)) return 'Shoes';

  // fall back to backend-provided category if present
  if (category && typeof category === 'string' && category.trim().length > 0) {
    // normalize capitalization
    const c = category.trim();
    if (['shoes', 'dress', 'dresses', 'duvet', 'romper', 'rompers', '2 piece', '2 piece sets', '2-piece', 'two piece'].includes(c.toLowerCase())) {
      // title-case common known names
      if (c.toLowerCase().includes('shoe')) return 'Shoes';
      if (c.toLowerCase().includes('dress')) return 'Dresses';
      if (c.toLowerCase().includes('duvet') || c.toLowerCase().includes('blanket')) return 'Duvet';
      if (c.toLowerCase().includes('romper') || c.toLowerCase().includes('onesie')) return 'Rompers';
      if (c.toLowerCase().includes('2') || c.toLowerCase().includes('set')) return '2 Piece Sets';
    }

    // otherwise Title Case the provided category
    return c.split(' ').map(s => s.charAt(0).toUpperCase()+s.slice(1)).join(' ');
  }

  // default fallback
  return 'Other';
}
