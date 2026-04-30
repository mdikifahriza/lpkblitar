import { ARTICLES, SERVICES } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";
import { classifyPublicPath, getPageTypeLabel, getPageVisitGroup, getReferrerLabel } from "@/lib/analytics";

export type AnalyticsRangeKey = "7d" | "30d" | "90d";

export type AnalyticsPageSummary = {
  path: string;
  label: string;
  pageType: string;
  pageTypeLabel: string;
  pageSlug: string | null;
  views: number;
  uniqueSessions: number;
  lastVisitedAt: string;
};

export type AnalyticsPageTypeSummary = {
  pageType: string;
  pageTypeLabel: string;
  views: number;
  uniqueSessions: number;
  uniquePages: number;
};

export type AnalyticsPageGroupSummary = {
  key: string;
  label: string;
  views: number;
  uniquePages: number;
  lastVisitedAt: string;
  detailType: "service" | "article" | null;
};

export type AnalyticsSlugSummary = {
  slug: string;
  label: string;
  path: string;
  views: number;
  lastVisitedAt: string | null;
};

export type AnalyticsReferrerSummary = {
  label: string;
  views: number;
};

export type AnalyticsDailyPoint = {
  date: string;
  label: string;
  views: number;
  uniqueSessions: number;
};

export type AnalyticsRecentVisit = {
  id: string;
  path: string;
  label: string;
  pageTypeLabel: string;
  visitedAt: string;
  referrerLabel: string;
};

export type AnalyticsRangeSummary = {
  key: AnalyticsRangeKey;
  label: string;
  days: number;
  totalViews: number;
  uniqueSessions: number;
  uniquePages: number;
  pageSummaries: AnalyticsPageSummary[];
  topPages: AnalyticsPageSummary[];
  pageTypeBreakdown: AnalyticsPageTypeSummary[];
  pageGroups: AnalyticsPageGroupSummary[];
  serviceSlugSummaries: AnalyticsSlugSummary[];
  articleSlugSummaries: AnalyticsSlugSummary[];
  topReferrers: AnalyticsReferrerSummary[];
  dailyViews: AnalyticsDailyPoint[];
  recentVisits: AnalyticsRecentVisit[];
};

export type AnalyticsOverview = {
  tableReady: boolean;
  hasData: boolean;
  allTimeViews: number;
  lastVisitedAt: string | null;
  ranges: Record<AnalyticsRangeKey, AnalyticsRangeSummary>;
};

type PageVisitRow = {
  id: string;
  path: string;
  page_type: string;
  page_slug: string | null;
  session_id: string;
  referrer: string | null;
  visited_at: string;
};

type SlugAggregate = {
  slug: string;
  label: string;
  path: string;
  views: number;
  lastVisitedAt: string | null;
};

type CatalogSlug = {
  slug: string;
  label: string;
  path: string;
};

const ANALYTICS_TIMEZONE = "Asia/Jakarta";
const RANGE_DEFINITIONS: Array<{ key: AnalyticsRangeKey; days: number; label: string }> = [
  { key: "7d", days: 7, label: "7 hari" },
  { key: "30d", days: 30, label: "30 hari" },
  { key: "90d", days: 90, label: "90 hari" },
];

function createEmptyRangeSummary(key: AnalyticsRangeKey, days: number, label: string): AnalyticsRangeSummary {
  return {
    key,
    label,
    days,
    totalViews: 0,
    uniqueSessions: 0,
    uniquePages: 0,
    pageSummaries: [],
    topPages: [],
    pageTypeBreakdown: [],
    pageGroups: [],
    serviceSlugSummaries: [],
    articleSlugSummaries: [],
    topReferrers: [],
    dailyViews: createDateKeys(days).map((date) => ({
      date,
      label: formatDayLabel(date),
      views: 0,
      uniqueSessions: 0,
    })),
    recentVisits: [],
  };
}

function isMissingRelationError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  return error.code === "42P01" || error.code === "PGRST205" || error.message?.includes("does not exist") || false;
}

function toDateKey(date: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: ANALYTICS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatDayLabel(dateKey: string) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: ANALYTICS_TIMEZONE,
    day: "2-digit",
    month: "short",
  }).format(new Date(`${dateKey}T00:00:00+07:00`));
}

function createDateKeys(days: number) {
  const dateKeys: string[] = [];
  const today = new Date();

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    dateKeys.push(toDateKey(date));
  }

  return dateKeys;
}

function toTimestamp(value: string | null | undefined) {
  return value ? new Date(value).getTime() : 0;
}

function sortByViewsAndLatest<T extends { views: number; lastVisitedAt: string | null }>(items: T[]) {
  return items.sort((left, right) => {
    if (right.views !== left.views) {
      return right.views - left.views;
    }

    return toTimestamp(right.lastVisitedAt) - toTimestamp(left.lastVisitedAt);
  });
}

function sortByLatestAndViews<T extends { views: number; lastVisitedAt: string }>(items: T[]) {
  return items.sort((left, right) => {
    const latestDiff = new Date(right.lastVisitedAt).getTime() - new Date(left.lastVisitedAt).getTime();

    if (latestDiff !== 0) {
      return latestDiff;
    }

    return right.views - left.views;
  });
}

function updateSlugAggregate(
  targetMap: Map<string, SlugAggregate>,
  slug: string,
  label: string,
  path: string,
  visitedAt: string
) {
  const existing = targetMap.get(slug) ?? {
    slug,
    label,
    path,
    views: 0,
    lastVisitedAt: visitedAt,
  };

  existing.views += 1;

  if (toTimestamp(visitedAt) > toTimestamp(existing.lastVisitedAt)) {
    existing.lastVisitedAt = visitedAt;
  }

  targetMap.set(slug, existing);
}

function mergeCatalogIntoSlugSummaries(targetMap: Map<string, SlugAggregate>, catalog: CatalogSlug[]) {
  catalog.forEach((item) => {
    if (!targetMap.has(item.slug)) {
      targetMap.set(item.slug, {
        slug: item.slug,
        label: item.label,
        path: item.path,
        views: 0,
        lastVisitedAt: null,
      });
    }
  });
}

async function getServiceCatalog() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("services")
    .select("slug, nama, aktif, nomor_urut")
    .eq("aktif", true)
    .order("nomor_urut", { ascending: true });

  if (error) {
    return SERVICES.map((service) => ({
      slug: service.slug,
      label: service.title,
      path: `/layanan/${service.slug}`,
    }));
  }

  return ((data as Array<{ slug: string; nama: string }>) || []).map((service) => ({
    slug: service.slug,
    label: service.nama,
    path: `/layanan/${service.slug}`,
  }));
}

async function getArticleCatalog() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("articles")
    .select("slug, judul, published, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    return ARTICLES.map((article) => ({
      slug: article.slug,
      label: article.title,
      path: `/artikel/${article.slug}`,
    }));
  }

  return ((data as Array<{ slug: string; judul: string }>) || []).map((article) => ({
    slug: article.slug,
    label: article.judul,
    path: `/artikel/${article.slug}`,
  }));
}

function buildRangeSummary(
  visits: PageVisitRow[],
  key: AnalyticsRangeKey,
  days: number,
  label: string,
  catalogs: {
    serviceCatalog: CatalogSlug[];
    articleCatalog: CatalogSlug[];
  }
): AnalyticsRangeSummary {
  const dateKeys = createDateKeys(days);
  const dateKeySet = new Set(dateKeys);
  const filteredVisits = visits.filter((visit) => dateKeySet.has(toDateKey(new Date(visit.visited_at))));

  const pageMap = new Map<
    string,
    {
      path: string;
      label: string;
      pageType: string;
      pageTypeLabel: string;
      pageSlug: string | null;
      views: number;
      sessions: Set<string>;
      lastVisitedAt: string;
    }
  >();
  const pageTypeMap = new Map<
    string,
    {
      pageType: string;
      pageTypeLabel: string;
      views: number;
      sessions: Set<string>;
      pages: Set<string>;
    }
  >();
  const pageGroupMap = new Map<
    string,
    {
      key: string;
      label: string;
      views: number;
      pages: Set<string>;
      lastVisitedAt: string;
      detailType: "service" | "article" | null;
    }
  >();
  const serviceSlugMap = new Map<string, SlugAggregate>();
  const articleSlugMap = new Map<string, SlugAggregate>();
  const referrerMap = new Map<string, number>();
  const dailyMap = new Map<string, { views: number; sessions: Set<string> }>();
  const allSessions = new Set<string>();

  filteredVisits.forEach((visit) => {
    const classified = classifyPublicPath(visit.path);
    const resolvedPageType = visit.page_type || classified.pageType;
    const resolvedPageSlug = visit.page_slug ?? classified.pageSlug;
    const pageKey = visit.path;
    const dailyKey = toDateKey(new Date(visit.visited_at));
    const pageEntry = pageMap.get(pageKey) ?? {
      path: visit.path,
      label: classified.label,
      pageType: resolvedPageType,
      pageTypeLabel: getPageTypeLabel(resolvedPageType),
      pageSlug: resolvedPageSlug,
      views: 0,
      sessions: new Set<string>(),
      lastVisitedAt: visit.visited_at,
    };

    pageEntry.views += 1;
    pageEntry.sessions.add(visit.session_id);

    if (new Date(visit.visited_at) > new Date(pageEntry.lastVisitedAt)) {
      pageEntry.lastVisitedAt = visit.visited_at;
    }

    pageMap.set(pageKey, pageEntry);
    allSessions.add(visit.session_id);

    const pageTypeEntry = pageTypeMap.get(resolvedPageType) ?? {
      pageType: resolvedPageType,
      pageTypeLabel: getPageTypeLabel(resolvedPageType),
      views: 0,
      sessions: new Set<string>(),
      pages: new Set<string>(),
    };

    pageTypeEntry.views += 1;
    pageTypeEntry.sessions.add(visit.session_id);
    pageTypeEntry.pages.add(visit.path);
    pageTypeMap.set(resolvedPageType, pageTypeEntry);

    const pageGroup = getPageVisitGroup(resolvedPageType);
    const pageGroupEntry = pageGroupMap.get(pageGroup.key) ?? {
      key: pageGroup.key,
      label: pageGroup.label,
      views: 0,
      pages: new Set<string>(),
      lastVisitedAt: visit.visited_at,
      detailType: pageGroup.detailType,
    };

    pageGroupEntry.views += 1;
    pageGroupEntry.pages.add(visit.path);

    if (new Date(visit.visited_at) > new Date(pageGroupEntry.lastVisitedAt)) {
      pageGroupEntry.lastVisitedAt = visit.visited_at;
    }

    pageGroupMap.set(pageGroup.key, pageGroupEntry);

    if (resolvedPageType === "service_detail" && resolvedPageSlug) {
      updateSlugAggregate(serviceSlugMap, resolvedPageSlug, pageEntry.label, visit.path, visit.visited_at);
    }

    if (resolvedPageType === "article_detail" && resolvedPageSlug) {
      updateSlugAggregate(articleSlugMap, resolvedPageSlug, pageEntry.label, visit.path, visit.visited_at);
    }

    const referrerLabel = getReferrerLabel(visit.referrer);
    referrerMap.set(referrerLabel, (referrerMap.get(referrerLabel) ?? 0) + 1);

    const dailyEntry = dailyMap.get(dailyKey) ?? { views: 0, sessions: new Set<string>() };
    dailyEntry.views += 1;
    dailyEntry.sessions.add(visit.session_id);
    dailyMap.set(dailyKey, dailyEntry);
  });

  mergeCatalogIntoSlugSummaries(serviceSlugMap, catalogs.serviceCatalog);
  mergeCatalogIntoSlugSummaries(articleSlugMap, catalogs.articleCatalog);

  const pageSummaries = sortByViewsAndLatest(
    Array.from(pageMap.values()).map((page) => ({
      path: page.path,
      label: page.label,
      pageType: page.pageType,
      pageTypeLabel: page.pageTypeLabel,
      pageSlug: page.pageSlug,
      views: page.views,
      uniqueSessions: page.sessions.size,
      lastVisitedAt: page.lastVisitedAt,
    }))
  );

  const topPages = pageSummaries.slice(0, 10);

  const pageTypeBreakdown = Array.from(pageTypeMap.values())
    .map((pageType) => ({
      pageType: pageType.pageType,
      pageTypeLabel: pageType.pageTypeLabel,
      views: pageType.views,
      uniqueSessions: pageType.sessions.size,
      uniquePages: pageType.pages.size,
    }))
    .sort((left, right) => right.views - left.views);

  const pageGroups = sortByLatestAndViews(
    Array.from(pageGroupMap.values()).map((pageGroup) => ({
      key: pageGroup.key,
      label: pageGroup.label,
      views: pageGroup.views,
      uniquePages: pageGroup.pages.size,
      lastVisitedAt: pageGroup.lastVisitedAt,
      detailType: pageGroup.detailType,
    }))
  );

  const serviceSlugSummaries = sortByViewsAndLatest(Array.from(serviceSlugMap.values()));
  const articleSlugSummaries = sortByViewsAndLatest(Array.from(articleSlugMap.values()));

  const topReferrers = Array.from(referrerMap.entries())
    .map(([referrerLabel, views]) => ({
      label: referrerLabel,
      views,
    }))
    .sort((left, right) => right.views - left.views)
    .slice(0, 8);

  const dailyViews = dateKeys.map((dateKey) => {
    const entry = dailyMap.get(dateKey);

    return {
      date: dateKey,
      label: formatDayLabel(dateKey),
      views: entry?.views ?? 0,
      uniqueSessions: entry?.sessions.size ?? 0,
    };
  });

  const recentVisits = filteredVisits.slice(0, 50).map((visit) => {
    const classified = classifyPublicPath(visit.path);
    const resolvedPageType = visit.page_type || classified.pageType;

    return {
      id: visit.id,
      path: visit.path,
      label: classified.label,
      pageTypeLabel: getPageTypeLabel(resolvedPageType),
      visitedAt: visit.visited_at,
      referrerLabel: getReferrerLabel(visit.referrer),
    };
  });

  return {
    key,
    label,
    days,
    totalViews: filteredVisits.length,
    uniqueSessions: allSessions.size,
    uniquePages: pageMap.size,
    pageSummaries,
    topPages,
    pageTypeBreakdown,
    pageGroups,
    serviceSlugSummaries,
    articleSlugSummaries,
    topReferrers,
    dailyViews,
    recentVisits,
  };
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const adminClient = createAdminClient();
  const since = new Date();
  since.setDate(since.getDate() - 100);

  const [countResult, recentResult, serviceCatalog, articleCatalog] = await Promise.all([
    adminClient.from("page_visits").select("id", { count: "exact", head: true }),
    adminClient
      .from("page_visits")
      .select("id, path, page_type, page_slug, session_id, referrer, visited_at")
      .gte("visited_at", since.toISOString())
      .order("visited_at", { ascending: false })
      .limit(10000),
    getServiceCatalog(),
    getArticleCatalog(),
  ]);

  if (isMissingRelationError(countResult.error) || isMissingRelationError(recentResult.error)) {
    return {
      tableReady: false,
      hasData: false,
      allTimeViews: 0,
      lastVisitedAt: null,
      ranges: RANGE_DEFINITIONS.reduce(
        (accumulator, range) => {
          accumulator[range.key] = createEmptyRangeSummary(range.key, range.days, range.label);
          return accumulator;
        },
        {} as Record<AnalyticsRangeKey, AnalyticsRangeSummary>
      ),
    };
  }

  if (countResult.error) {
    throw countResult.error;
  }

  if (recentResult.error) {
    throw recentResult.error;
  }

  const visits = (recentResult.data ?? []) as PageVisitRow[];
  const ranges = RANGE_DEFINITIONS.reduce(
    (accumulator, range) => {
      accumulator[range.key] = buildRangeSummary(visits, range.key, range.days, range.label, {
        serviceCatalog,
        articleCatalog,
      });
      return accumulator;
    },
    {} as Record<AnalyticsRangeKey, AnalyticsRangeSummary>
  );

  return {
    tableReady: true,
    hasData: Boolean(countResult.count),
    allTimeViews: countResult.count ?? 0,
    lastVisitedAt: visits[0]?.visited_at ?? null,
    ranges,
  };
}
