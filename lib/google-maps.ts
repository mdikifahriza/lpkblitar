function decodeMapValue(value: string) {
  try {
    return decodeURIComponent(value).replace(/\+/g, " ").trim();
  } catch {
    return value.replace(/\+/g, " ").trim();
  }
}

function extractGoogleMapsQueryFromUrl(url: URL) {
  const searchParams = url.searchParams;
  const directQuery =
    searchParams.get("q") ||
    searchParams.get("query") ||
    searchParams.get("destination") ||
    searchParams.get("daddr");

  if (directQuery) {
    return decodeMapValue(directQuery);
  }

  const latLngParam = searchParams.get("ll");

  if (latLngParam) {
    return latLngParam.trim();
  }

  const pathParts = url.pathname.split("/").filter(Boolean);
  const placeIndex = pathParts.findIndex((part) => part === "place" || part === "search");

  if (placeIndex >= 0 && pathParts[placeIndex + 1]) {
    return decodeMapValue(pathParts[placeIndex + 1]);
  }

  const coordinateMatch = `${url.pathname}${url.search}`.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

  if (coordinateMatch) {
    return `${coordinateMatch[1]},${coordinateMatch[2]}`;
  }

  return url.toString();
}

export function isGoogleMapsShortUrl(value?: string | null) {
  const trimmedValue = value?.trim() ?? "";

  if (!trimmedValue) {
    return false;
  }

  try {
    const url = new URL(trimmedValue);
    return url.hostname === "maps.app.goo.gl";
  } catch {
    return false;
  }
}

export function buildGoogleMapsEmbedUrlSync(value?: string | null) {
  const trimmedValue = value?.trim() ?? "";

  if (!trimmedValue) {
    return "";
  }

  if (trimmedValue.includes("/maps/embed") || trimmedValue.includes("output=embed")) {
    return trimmedValue;
  }

  try {
    const url = new URL(trimmedValue);
    const query = extractGoogleMapsQueryFromUrl(url);

    return query
      ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(trimmedValue)}&output=embed`;
  } catch {
    return `https://www.google.com/maps?q=${encodeURIComponent(trimmedValue)}&output=embed`;
  }
}

async function expandGoogleMapsUrl(value: string) {
  if (!isGoogleMapsShortUrl(value)) {
    return value;
  }

  try {
    const response = await fetch(value, {
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    return response.url || value;
  } catch {
    return value;
  }
}

export async function buildGoogleMapsEmbedUrl(value?: string | null) {
  const trimmedValue = value?.trim() ?? "";

  if (!trimmedValue) {
    return "";
  }

  const expandedValue = await expandGoogleMapsUrl(trimmedValue);
  return buildGoogleMapsEmbedUrlSync(expandedValue);
}
