export function normalizeSeoText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() || "";
}

export function buildSeoExcerpt(value?: string | null, maxLength = 160) {
  const text = normalizeSeoText(value);

  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}
