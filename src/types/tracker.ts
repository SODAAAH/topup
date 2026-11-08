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

export type DrawSourceMode = 'manual' | 'ledger' | 'history';

export type DuplicateRarity =
  | 'none'
  | 'emote'
  | 'basic'
  | 'elite'
  | 'special'
  | 'epic'
  | 'exclusive_epic'
  | 'legend'
  | 'other';

export interface DuplicateConversionConfig {
  emote: number;
  basic: number;
  elite: number;
  special: number;
  epic: number;
  exclusive_epic: number;
  legend: number;
  other: number;
  unverified: Record<string, boolean>;
}

export interface DrawRecord {
  id: string;
  drawNumber: number;
  timestamp: string;
  directRemnants: number;
  duplicateItem?: string;
  duplicateRarity: DuplicateRarity;
  duplicateRemnants: number;
  totalRemnants: number;
  notes?: string;
}

export type SampleClassificationKey =
  | 'none'
  | 'too_early'
  | 'preliminary'
  | 'moderately_informative'
  | 'good'
  | 'strong'
  | 'strongest';

export interface SampleClassification {
  key: SampleClassificationKey;
  title: string;
  message: string;
  minDraws: number;
  maxDraws: number | null;
}

export interface BenchmarkCIComparison {
  name: string;
  targetDraws: number;
  benchmarkRate: number;
  status: 'above' | 'crosses' | 'below' | 'indeterminate';
  message: string;
}

export interface StatisticalSummary {
  count: number;
  totalDirectRemnants: number;
  totalDuplicateRemnants: number;
  totalDrawGeneratedRemnants: number;
  mean: number | null;
  median: number | null;
  min: number | null;
  max: number | null;
  sampleVariance: number | null;
  sampleStandardDeviation: number | null;
  standardError: number | null;
  degreesOfFreedom: number;
  tCritical: number | null;
  marginOfError: number | null;
  ciLower: number | null;
  ciUpper: number | null;
  ciWidth: number | null;
  bootstrapCILower: number | null;
  bootstrapCIUpper: number | null;
  isZeroVariance: boolean;
  benchmarkComparisons: BenchmarkCIComparison[];
}

export interface RunningAveragePoint {
  drawNumber: number;
  drawRemnants: number;
  runningAverage: number;
  rollingAverage?: number;
}

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
  sampleClassification: SampleClassification;
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
  statistics?: StatisticalSummary;
  recordedDrawsCount?: number;
  missingDrawsCount?: number;
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

export type ActiveTab =
  | 'tracker'
  | 'draw-history'
  | 'tipid-plan'
  | 'diamond-budget'
  | 'plan-vs-actual';
