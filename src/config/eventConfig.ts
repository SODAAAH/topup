import { EventConfig, MilestoneConfig } from '../types/tracker';

const MILESTONES: readonly MilestoneConfig[] = [
  { id: 'm15', threshold: 15, reward: 15 },
  { id: 'm20', threshold: 20, reward: 15 },
  { id: 'm30', threshold: 30, reward: 15 },
  { id: 'm40', threshold: 40, reward: 30 },
  { id: 'm50', threshold: 50, reward: 30 },
] as const;

const REQUIRED_REMNANTS = 1600;
const OPTIMISTIC_DRAWS = 100;
const BACKUP_DRAWS = 110;
const CONSERVATIVE_DRAWS = 115;

const TOTAL_MILESTONE_BONUS = MILESTONES.reduce((sum, item) => sum + item.reward, 0);

const OPTIMISTIC_BENCHMARK_RATE = Number(
  ((REQUIRED_REMNANTS - TOTAL_MILESTONE_BONUS) / OPTIMISTIC_DRAWS).toFixed(4)
);

const BACKUP_BENCHMARK_RATE = 13.5909;

const CONSERVATIVE_BENCHMARK_RATE = Number(
  ((REQUIRED_REMNANTS - TOTAL_MILESTONE_BONUS) / CONSERVATIVE_DRAWS).toFixed(4)
);

export const EVENT_CONFIG: EventConfig = {
  skinName: 'Kagura – Feast of Eternity',
  eventSubtitle: 'Feast of Eternity',
  currencyName: 'Ashen Remnants',
  requiredRemnants: REQUIRED_REMNANTS,
  optimisticDraws: OPTIMISTIC_DRAWS,
  backupDraws: BACKUP_DRAWS,
  extendedDraws: CONSERVATIVE_DRAWS,
  conservativeDraws: CONSERVATIVE_DRAWS,
  milestones: MILESTONES,
  totalMilestoneBonus: TOTAL_MILESTONE_BONUS,
  optimisticBenchmarkRate: OPTIMISTIC_BENCHMARK_RATE,
  backupBenchmarkRate: BACKUP_BENCHMARK_RATE,
  extendedBenchmarkRate: CONSERVATIVE_BENCHMARK_RATE,
  conservativeBenchmarkRate: CONSERVATIVE_BENCHMARK_RATE,
};

export function getMilestoneBonusAtDraws(draws: number, milestones = MILESTONES): number {
  return milestones
    .filter((m) => draws >= m.threshold)
    .reduce((sum, m) => sum + m.reward, 0);
}
