export function normalizeWhatsAppNumber(value?: string | null) {
  const rawValue = (value ?? "").trim();

  if (!rawValue) {
    return "";
  }

  let normalized = rawValue.replace(/\D/g, "");

  if (normalized.startsWith("0")) {
    normalized = `62${normalized.slice(1)}`;
  } else if (normalized.startsWith("8")) {
    normalized = `62${normalized}`;
  }

  return normalized;
}

export function buildWhatsAppUrl(number?: string | null, message?: string | null) {
  const normalizedNumber = normalizeWhatsAppNumber(number) || "6281234567890";

  if (!message) {
    return `https://wa.me/${normalizedNumber}`;
  }

  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}
