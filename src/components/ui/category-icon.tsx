import { Construction, Droplets, Trash, WavesHorizontal, Ban, CircleQuestionMark } from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { Category } from "@/types/domain";

export function CategoryIcon({ category, ...props }: { category: Category } & LucideProps) {
  switch (category) {
    case "flood":
      return <WavesHorizontal {...props} />;
    case "waterlogging":
      return <Droplets {...props} />;
    case "blocked_canal":
      return <Ban {...props} />;
    case "waste_dumping":
      return <Trash {...props} />;
    case "damaged_infrastructure":
      return <Construction {...props} />;
    default:
      return <CircleQuestionMark {...props} />;
  }
}
