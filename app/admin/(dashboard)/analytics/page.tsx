import { AnalyticsClient } from "./AnalyticsClient";
import { getAnalyticsOverview } from "@/lib/api/analytics";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalyticsOverview();

  return <AnalyticsClient analytics={analytics} />;
}
