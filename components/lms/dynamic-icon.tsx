import {
  Award,
  Flame,
  GraduationCap,
  Trophy,
  Zap,
  Rocket,
  Sparkles,
  Footprints,
  Star,
  Target,
  Medal,
  Crown,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  flame: Flame,
  "graduation-cap": GraduationCap,
  trophy: Trophy,
  zap: Zap,
  rocket: Rocket,
  sparkles: Sparkles,
  footprints: Footprints,
  star: Star,
  target: Target,
  medal: Medal,
  crown: Crown,
};

export function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] || Award;
  return <Icon className={className} />;
}
