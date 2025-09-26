'use client';

import InsightModal from "@/components/insight-modal";
import { fetchInsightById } from "@/lib/api";
import { useState, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { useRouter } from "next/navigation";

interface InsightPageProps {
  id: string;
}

export default function InsightPage({ id }: InsightPageProps) {
  const [insight, setInsight] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
const router = useRouter();
  useEffect(() => {
    // fetch insight data on mount
    fetchInsightById(id).then((data) => {
      console.log("Fetched insight:", data); 
      setInsight(data);
    });
  }, [id]);

  if (!insight) return <LoadingSpinner />; 

  return (
    <InsightModal
      insight={insight}
      isOpen={isModalOpen}
      onClose={() => {
          setIsModalOpen(false); 
        router.push("/insights"); 
      }}
    />
  );
}
