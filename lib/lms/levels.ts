// XP Level definitions — progressive thresholds
export type Level = {
  level: number;
  title: string;
  xpRequired: number;
};

export const LEVELS: Level[] = [
  { level: 1, title: "Novice", xpRequired: 0 },
  { level: 2, title: "Learner", xpRequired: 50 },
  { level: 3, title: "Practitioner", xpRequired: 150 },
  { level: 4, title: "Specialist", xpRequired: 300 },
  { level: 5, title: "Expert", xpRequired: 500 },
  { level: 6, title: "Master", xpRequired: 800 },
  { level: 7, title: "Architect", xpRequired: 1200 },
  { level: 8, title: "Visionary", xpRequired: 1800 },
  { level: 9, title: "Legend", xpRequired: 2500 },
];

/** Get the level info for a given XP total */
export function getLevelForXp(xp: number): Level {
  let result = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) {
      result = level;
    } else {
      break;
    }
  }
  return result;
}

/** Get XP progress toward next level as a percentage (0-100) */
export function getXpProgressPercent(xp: number): number {
  const current = getLevelForXp(xp);
  const nextIndex = LEVELS.findIndex((l) => l.level === current.level + 1);
  if (nextIndex === -1) return 100; // Max level

  const next = LEVELS[nextIndex];
  const rangeXp = next.xpRequired - current.xpRequired;
  const earnedXp = xp - current.xpRequired;
  return Math.round((earnedXp / rangeXp) * 100);
}

/** Get XP needed for the next level (null if max) */
export function getXpForNextLevel(xp: number): number | null {
  const current = getLevelForXp(xp);
  const nextIndex = LEVELS.findIndex((l) => l.level === current.level + 1);
  if (nextIndex === -1) return null;
  return LEVELS[nextIndex].xpRequired;
}
