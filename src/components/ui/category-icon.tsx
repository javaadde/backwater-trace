import { Construction, Droplets, Trash, WavesHorizontal, Ban, CircleQuestionMark } from "lucide-react";
import type { Category } from "@/types/domain";

export function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  switch (category) {
    case "flood":
      return <WavesHorizontal className={className} />;
    case "waterlogging":
      return <Droplets className={className} />;
    case "blocked_canal":
      return <Ban className={className} />;
    case "waste_dumping":
      return <Trash className={className} />;
    case "damaged_infrastructure":
      return <Construction className={className} />;
    default:
      return <CircleQuestionMark className={className} />;
  }
}
