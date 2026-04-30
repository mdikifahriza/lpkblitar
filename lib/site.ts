const DEFAULT_SITE_URL = "https://lpkblitar.com";

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
}

export function getSiteUrlObject() {
  return new URL(getSiteUrl());
}
