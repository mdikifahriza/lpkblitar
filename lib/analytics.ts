import { getSiteUrl } from "@/lib/site";

export type PageVisitType =
  | "home"
  | "service_index"
  | "service_detail"
  | "gallery_index"
  | "gallery_detail"
  | "article_index"
  | "article_detail"
  | "team"
  | "contact"
  | "consultation"
  | "inquiry_list"
  | "public_page";

export type PageVisitGroupKey =
  | "home"
  | "services"
  | "articles"
  | "galleries"
  | "team"
  | "contact"
  | "consultation"
  | "inquiries"
  | "other";

export type PageVisitGroup = {
  key: PageVisitGroupKey;
  label: string;
  detailType: "service" | "article" | null;
};

export type ClassifiedPublicPath = {
  path: string;
  pageType: PageVisitType;
  pageSlug: string | null;
  label: string;
  typeLabel: string;
};

const PAGE_TYPE_LABELS: Record<PageVisitType, string> = {
  home: "Beranda",
  service_index: "Layanan",
  service_detail: "Detail Layanan",
  gallery_index: "Galeri",
  gallery_detail: "Detail Galeri",
  article_index: "Artikel",
  article_detail: "Detail Artikel",
  team: "Tim",
  contact: "Kontak",
  consultation: "Konsultasi",
  inquiry_list: "Daftar Konsultasi",
  public_page: "Halaman Publik",
};

const PAGE_GROUP_LABELS: Record<PageVisitGroupKey, string> = {
  home: "Beranda",
  services: "Layanan",
  articles: "Artikel",
  galleries: "Galeri",
  team: "Tim",
  contact: "Kontak",
  consultation: "Konsultasi",
  inquiries: "Daftar Konsultasi",
  other: "Halaman Lainnya",
};

export function normalizeTrackedPath(path: string) {
  const firstPart = (path || "/").trim().split(/[?#]/)[0] || "/";
  const withLeadingSlash = firstPart.startsWith("/") ? firstPart : `/${firstPart}`;
  const normalized = withLeadingSlash.replace(/\/{2,}/g, "/");

  if (normalized !== "/" && normalized.endsWith("/")) {
    return normalized.slice(0, -1);
  }

  return normalized || "/";
}

export function isTrackablePublicPath(path: string) {
  const normalized = normalizeTrackedPath(path);

  return ![
    "/admin",
    "/api",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
  ].some((blockedPrefix) => normalized === blockedPrefix || normalized.startsWith(`${blockedPrefix}/`));
}

export function humanizeSlug(slug: string | null | undefined) {
  if (!slug) {
    return "";
  }

  return slug
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function classifyPublicPath(path: string): ClassifiedPublicPath {
  const normalized = normalizeTrackedPath(path);
  const segments = normalized.split("/").filter(Boolean);

  if (normalized === "/") {
    return {
      path: normalized,
      pageType: "home",
      pageSlug: null,
      label: "Beranda",
      typeLabel: PAGE_TYPE_LABELS.home,
    };
  }

  if (normalized === "/layanan") {
    return {
      path: normalized,
      pageType: "service_index",
      pageSlug: null,
      label: "Semua Layanan",
      typeLabel: PAGE_TYPE_LABELS.service_index,
    };
  }

  if (segments[0] === "layanan" && segments[1]) {
    const pageSlug = segments[1];
    return {
      path: normalized,
      pageType: "service_detail",
      pageSlug,
      label: `Layanan: ${humanizeSlug(pageSlug)}`,
      typeLabel: PAGE_TYPE_LABELS.service_detail,
    };
  }

  if (normalized === "/artikel") {
    return {
      path: normalized,
      pageType: "article_index",
      pageSlug: null,
      label: "Semua Artikel",
      typeLabel: PAGE_TYPE_LABELS.article_index,
    };
  }

  if (segments[0] === "artikel" && segments[1]) {
    const pageSlug = segments[1];
    return {
      path: normalized,
      pageType: "article_detail",
      pageSlug,
      label: `Artikel: ${humanizeSlug(pageSlug)}`,
      typeLabel: PAGE_TYPE_LABELS.article_detail,
    };
  }

  if (normalized === "/galeri") {
    return {
      path: normalized,
      pageType: "gallery_index",
      pageSlug: null,
      label: "Galeri",
      typeLabel: PAGE_TYPE_LABELS.gallery_index,
    };
  }

  if (segments[0] === "galeri" && segments[1]) {
    const pageSlug = segments[1];
    return {
      path: normalized,
      pageType: "gallery_detail",
      pageSlug,
      label: `Galeri: ${humanizeSlug(pageSlug)}`,
      typeLabel: PAGE_TYPE_LABELS.gallery_detail,
    };
  }

  if (normalized === "/tim") {
    return {
      path: normalized,
      pageType: "team",
      pageSlug: null,
      label: "Tim",
      typeLabel: PAGE_TYPE_LABELS.team,
    };
  }

  if (normalized === "/kontak") {
    return {
      path: normalized,
      pageType: "contact",
      pageSlug: null,
      label: "Kontak",
      typeLabel: PAGE_TYPE_LABELS.contact,
    };
  }

  if (normalized === "/konsultasi") {
    return {
      path: normalized,
      pageType: "consultation",
      pageSlug: null,
      label: "Konsultasi",
      typeLabel: PAGE_TYPE_LABELS.consultation,
    };
  }

  if (normalized === "/daftar-konsultasi") {
    return {
      path: normalized,
      pageType: "inquiry_list",
      pageSlug: null,
      label: "Daftar Konsultasi",
      typeLabel: PAGE_TYPE_LABELS.inquiry_list,
    };
  }

  return {
    path: normalized,
    pageType: "public_page",
    pageSlug: segments.at(-1) ?? null,
    label: normalized === "/" ? "Beranda" : `Halaman ${humanizeSlug(segments.at(-1)) || normalized}`,
    typeLabel: PAGE_TYPE_LABELS.public_page,
  };
}

export function getPageTypeLabel(pageType: string) {
  return PAGE_TYPE_LABELS[pageType as PageVisitType] ?? "Halaman Publik";
}

export function getPageVisitGroup(pageType: string): PageVisitGroup {
  switch (pageType as PageVisitType) {
    case "home":
      return { key: "home", label: PAGE_GROUP_LABELS.home, detailType: null };
    case "service_index":
    case "service_detail":
      return { key: "services", label: PAGE_GROUP_LABELS.services, detailType: "service" };
    case "article_index":
    case "article_detail":
      return { key: "articles", label: PAGE_GROUP_LABELS.articles, detailType: "article" };
    case "gallery_index":
    case "gallery_detail":
      return { key: "galleries", label: PAGE_GROUP_LABELS.galleries, detailType: null };
    case "team":
      return { key: "team", label: PAGE_GROUP_LABELS.team, detailType: null };
    case "contact":
      return { key: "contact", label: PAGE_GROUP_LABELS.contact, detailType: null };
    case "consultation":
      return { key: "consultation", label: PAGE_GROUP_LABELS.consultation, detailType: null };
    case "inquiry_list":
      return { key: "inquiries", label: PAGE_GROUP_LABELS.inquiries, detailType: null };
    default:
      return { key: "other", label: PAGE_GROUP_LABELS.other, detailType: null };
  }
}

export function getPageLabel(path: string, pageType?: string | null, pageSlug?: string | null) {
  if (pageType) {
    const classified = classifyPublicPath(path);

    if (classified.pageType === pageType && classified.pageSlug === (pageSlug ?? null)) {
      return classified.label;
    }
  }

  return classifyPublicPath(path).label;
}

export function getReferrerLabel(referrer?: string | null) {
  if (!referrer) {
    return "Langsung";
  }

  if (referrer.startsWith("/")) {
    return `Internal: ${getPageLabel(referrer)}`;
  }

  try {
    const siteHost = new URL(getSiteUrl()).host.replace(/^www\./, "");
    const referrerUrl = new URL(referrer);
    const referrerHost = referrerUrl.host.replace(/^www\./, "");

    if (referrerHost === siteHost) {
      return `Internal: ${getPageLabel(referrerUrl.pathname)}`;
    }

    if (referrerHost.includes("google.")) {
      return "Google";
    }

    if (referrerHost.includes("bing.")) {
      return "Bing";
    }

    if (referrerHost.includes("facebook.")) {
      return "Facebook";
    }

    if (referrerHost.includes("instagram.")) {
      return "Instagram";
    }

    return referrerHost;
  } catch {
    return "Sumber lain";
  }
}
