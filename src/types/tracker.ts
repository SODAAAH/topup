export interface MilestoneConfig {
  id: string;
  threshold: number;
  reward: number;
}

export interface EventConfig {
  skinName: string;
  eventSubtitle: string;
  currencyName: string;
  requiredRemnants: number;
  optimisticDraws: number;
  backupDraws: number;
  extendedDraws: number;
  conservativeDraws: number;
  safetyDraws: number;
  contingencyDraws: number;
  milestones: readonly MilestoneConfig[];
  totalMilestoneBonus: number;
  optimisticBenchmarkRate: number;
  backupBenchmarkRate: number;
  extendedBenchmarkRate: number;
  conservativeBenchmarkRate: number;
  safetyBenchmarkRate: number;
  contingencyBenchmarkRate: number;
}

export type DrawSourceMode = 'manual' | 'ledger';

export interface TrackerInputs {
  draws: number | '';
  remnants: number | '';
  customClaimedMilestones?: Record<string, boolean>;
  drawSourceMode?: DrawSourceMode;
}

export type VerdictType = 'green' | 'blue' | 'yellow' | 'orange' | 'red' | 'neutral';

export type ConfidenceLevel = 'none' | 'very_early' | 'limited' | 'informative';

export type EstimateCategory =
  | 'below_100'
  | 'between_100_110'
  | 'between_110_115'
  | 'between_115_120'
  | 'above_120'
  | 'above_115'
  | 'goal_reached'
  | 'unavailable';

export interface MilestoneStatus {
  id: string;
  threshold: number;
  reward: number;
  unlocked: boolean;
  claimed: boolean;
}

export interface BenchmarkComparison {
  name: string;
  targetDraws: number;
  benchmarkRate: number;
  projectedRemnants: number;
  differenceFromGoal: number;
  requiredRateForRemaining: number | null;
  drawsRemainingToTarget: number;
  willReachGoal: boolean;
}

export interface CalculationResult {
  draws: number;
  currentRemnants: number;
  claimedMilestonesBonus: number;
  unclaimedUnlockedBonus: number;
  futureLockedBonus: number;
  totalEventMilestoneBonus: number;
  drawGeneratedRemnants: number;
  trueAverage: number | null;
  verdict: VerdictType;
  verdictTitle: string;
  verdictMessage: string;
  isGoalReached: boolean;
  goalReachedTitle: string;
  goalReachedMessage: string;
  confidence: ConfidenceLevel;
  confidenceTitle: string;
  confidenceMessage: string;
  remnantsRemaining: number;
  progressPercentage: number;
  diffFromOptimisticBenchmark: number | null;
  diffFromBackupBenchmark: number | null;
  diffFromConservativeBenchmark: number | null;
  diffFromSafetyBenchmark: number | null;
  estimatedTotalDraws: number | null;
  estimatedAdditionalDraws: number | null;
  estimateCategory: EstimateCategory;
  optimisticComparison: BenchmarkComparison;
  backupComparison: BenchmarkComparison;
  conservativeComparison: BenchmarkComparison;
  safetyComparison: BenchmarkComparison;
  milestones: MilestoneStatus[];
  isValid: boolean;
  validationError?: string;
}

export type ScheduleTaskStatus = 'pending' | 'completed' | 'skipped' | 'modified';

export interface ScheduleTask {
  id: string;
  date: string;
  displayDate: string;
  dayNumber: number;
  title: string;
  periodLabel?: string;
  phase?: string;
  tasksText: string[];
  plannedDraws: number;
  actualDraws: number;
  plannedBlueDiamonds: number;
  actualBlueDiamonds: number;
  plannedPromoDiamonds: number;
  actualPromoDiamonds: number;
  freeTokens: number;
  rechargeTier: string;
  rechargePhpMin: number;
  rechargePhpMax: number;
  actualPhp: number;
  status: ScheduleTaskStatus;
  notes: string;
}

export interface PurchaseRecord {
  id: string;
  date: string;
  rechargeType: string;
  diamondsReceived: number;
  actualPhp: number;
  notes: string;
}

export interface TipidPlanState {
  tasks: ScheduleTask[];
  startingPromoDiamonds: number;
  nov24Expenditure: number;
  extraDrawCostPerDraw: number;
  purchases: PurchaseRecord[];
}

export type ActiveTab = 'tracker' | 'tipid-plan' | 'diamond-budget' | 'plan-vs-actual';
