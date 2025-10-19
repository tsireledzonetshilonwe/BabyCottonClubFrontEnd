// Utility to resolve a reasonable product image from known public images
// Falls back to a generic onesie image if no match

export function normalizeLocalImage(path) {
  if (!path) return '';
  try {
    const p = String(path).trim();
    if (/^https?:\/\//i.test(p)) return p; // absolute URL
    // Ensure leading slash for public assets
    const withSlash = p.startsWith('/') ? p : `/${p}`;
    // Only replace underscores with spaces in the filename if under /images/
    if (withSlash.startsWith('/images/')) {
      const parts = withSlash.split('/');
      const file = parts.pop() || '';
      const normalizedFile = file.replaceAll('_', ' ');
      return [...parts, normalizedFile].join('/');
    }
    return withSlash;
  } catch {
    return '';
  }
}

export function resolveProductImage(backendProduct) {
  if (!backendProduct) return "/images/onesie.jpg";
  const raw = String(
    backendProduct.imageUrl || backendProduct.image || ""
  ).trim();
  if (raw) return normalizeLocalImage(raw);

  const name = String(backendProduct.productName || backendProduct.name || "")
    .toLowerCase();
  const category = String(
    (backendProduct.category && (backendProduct.category.categoryName || backendProduct.category)) || ""
  ).toLowerCase();
  const text = `${name} ${category}`;

  // Keyword mapping to existing public images
  const map = [
    { k: ["princess"], img: "/images/princess_dress.jpg" },
    { k: ["dress"], img: "/images/dress.jpg" },
    { k: ["wool", "onesy"], img: "/images/wool_onesy.jpg" },
    { k: ["onesie", "onesy", "romper"], img: "/images/onesie.jpg" },
    { k: ["duvet", "blanket", "bedding"], img: "/images/duvet.jpg" },
    { k: ["fleece"], img: "/images/fleece.jpg" },
    { k: ["sneaker", "trainer", "running"], img: "/images/sneakers.jpg" },
    { k: ["loafer"], img: "/images/loafers.jpg" },
    { k: ["boot"], img: "/images/boots.jpg" },
    { k: ["top", "shirt"], img: "/images/top.jpg" },
    { k: ["set", "two piece", "2 piece"], img: "/images/bedding.jpg" },
  ];

  for (const m of map) {
    if (m.k.some((kw) => text.includes(kw))) return m.img;
  }

  return "/images/onesie.jpg";
}

export const IMAGE_PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="14">No Image</text></svg>';

// (duplicate removed)
