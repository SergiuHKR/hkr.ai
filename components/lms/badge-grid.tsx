import { BadgeCard } from "@/components/lms/badge-card";

type Achievement = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
};

type EarnedAchievement = {
  id: string;
  earned_at: string;
};

export function BadgeGrid({
  allAchievements,
  earnedAchievements,
}: {
  allAchievements: Achievement[];
  earnedAchievements: EarnedAchievement[];
}) {
  const earnedMap = new Map(
    earnedAchievements.map((ea) => [ea.id, ea.earned_at])
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {allAchievements.map((achievement) => {
        const earnedAt = earnedMap.get(achievement.id);
        return (
          <BadgeCard
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            icon={achievement.icon}
            earned={!!earnedAt}
            earnedAt={earnedAt}
          />
        );
      })}
    </div>
  );
}
