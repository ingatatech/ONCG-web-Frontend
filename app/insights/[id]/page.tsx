
export async function generateStaticParams() {
  const insights = await fetchInsights("isActive=true&limit=100");
  const data = insights.insights || insights.data || insights;

  return (data || []).map((item: any) => ({
    id: item.id.toString(),
  }));
}
import InsightPage from "@/components/InsightsPage/Insights";
import { fetchInsights } from "@/lib/api";



export default function InsightsDetailPage({ params }: { params: { id: string } }) {
  return <InsightPage id={params.id} />
}

