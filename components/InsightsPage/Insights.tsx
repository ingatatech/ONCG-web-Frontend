'use client'
import InsightModal from "@/components/insight-modal";
import { fetchInsightById,  } from "@/lib/api";


export default async function InsightPage({ id }: { id: string }) {
  const insight = await fetchInsightById(id);
  return <InsightModal
  insight={insight}
  isOpen={true}
  onClose={() => {
    window.history.pushState({}, "", "/insights");
    // setInsight(null);
  }}
/>
;
}