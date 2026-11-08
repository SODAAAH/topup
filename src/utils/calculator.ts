import { EVENT_CONFIG } from '../config/eventConfig';
import {
  BenchmarkComparison,
  CalculationResult,
  ConfidenceLevel,
  EstimateCategory,
  EventConfig,
  MilestoneStatus,
  TrackerInputs,
  VerdictType,
} from '../types/tracker';

export function calculateTrackerPace(
  inputs: TrackerInputs,
  config: EventConfig = EVENT_CONFIG
): CalculationResult {
  const rawDraws = inputs.draws;
  const rawRemnants = inputs.remnants;

  const drawsNum = typeof rawDraws === 'number' ? rawDraws : Number(rawDraws);
  const remnantsNum = typeof rawRemnants === 'number' ? rawRemnants : Number(rawRemnants);

  const hasDraws = rawDraws !== '' && !Number.isNaN(drawsNum) && drawsNum >= 0;
  const hasRemnants = rawRemnants !== '' && !Number.isNaN(remnantsNum) && remnantsNum >= 0;

  const draws = hasDraws ? Math.floor(drawsNum) : 0;
  const currentRemnants = hasRemnants ? Math.floor(remnantsNum) : 0;

  const milestoneStatuses: MilestoneStatus[] = config.milestones.map((milestone) => {
    const unlocked = draws >= milestone.threshold;
    let claimed = unlocked;
    if (inputs.customClaimedMilestones && Object.prototype.hasOwnProperty.call(inputs.customClaimedMilestones, milestone.id)) {
      claimed = unlocked && Boolean(inputs.customClaimedMilestones[milestone.id]);
    }
    return {
      id: milestone.id,
      threshold: milestone.threshold,
      reward: milestone.reward,
      unlocked,
      claimed,
    };
  });

  const claimedMilestonesBonus = milestoneStatuses
    .filter((m) => m.claimed)
    .reduce((sum, m) => sum + m.reward, 0);

  const unclaimedUnlockedBonus = milestoneStatuses
    .filter((m) => m.unlocked && !m.claimed)
    .reduce((sum, m) => sum + m.reward, 0);

  const futureLockedBonus = milestoneStatuses
    .filter((m) => !m.unlocked)
    .reduce((sum, m) => sum + m.reward, 0);

  const totalEventMilestoneBonus = config.totalMilestoneBonus;
  const isGoalReached = currentRemnants >= config.requiredRemnants;

  const buildBenchmarkComparison = (
    name: string,
    targetDraws: number,
    benchmarkRate: number,
    currentAverage: number | null
  ): BenchmarkComparison => {
    const milestonesAtTarget = config.milestones
      .filter((m) => targetDraws >= m.threshold)
      .reduce((sum, m) => sum + m.reward, 0);

    const projectedRemnants =
      currentAverage !== null
        ? Math.round((currentAverage * targetDraws) + milestonesAtTarget)
        : milestonesAtTarget;

    const differenceFromGoal = projectedRemnants - config.requiredRemnants;
    const remainingDraws = Math.max(0, targetDraws - draws);
    let requiredRateForRemaining: number | null = null;

    if (isGoalReached) {
      requiredRateForRemaining = 0;
    } else if (remainingDraws > 0) {
      const remainingMilestonesAvailable = Math.max(0, milestonesAtTarget - claimedMilestonesBonus);
      const remnantsNeededFromRemainingDraws = Math.max(
        0,
        config.requiredRemnants - currentRemnants - remainingMilestonesAvailable
      );
      requiredRateForRemaining = Number((remnantsNeededFromRemainingDraws / remainingDraws).toFixed(2));
    }

    return {
      name,
      targetDraws,
      benchmarkRate,
      projectedRemnants,
      differenceFromGoal,
      requiredRateForRemaining,
      drawsRemainingToTarget: remainingDraws,
      willReachGoal: projectedRemnants >= config.requiredRemnants,
    };
  };

  if (!hasDraws || !hasRemnants || draws === 0) {
    let missingInfo = 'Enter your total draws and current remnants to see your pace.';
    if (!hasDraws && !hasRemnants) {
      missingInfo = 'Both draws and remnant balance are missing. Enter them to begin.';
    } else if (!hasDraws || draws === 0) {
      missingInfo = 'You have not entered any completed draws yet (draw count is 0).';
    } else if (!hasRemnants) {
      missingInfo = 'Current Ashen Remnants balance is missing.';
    }

    const optimisticComp = buildBenchmarkComparison(
      'Optimistic Target',
      config.optimisticDraws,
      config.optimisticBenchmarkRate,
      null
    );

    const backupComp = buildBenchmarkComparison(
      'Backup Target',
      config.backupDraws,
      config.backupBenchmarkRate,
      null
    );

    const conservativeComp = buildBenchmarkComparison(
      'Extended Target',
      config.conservativeDraws,
      config.conservativeBenchmarkRate,
      null
    );

    const safetyComp = buildBenchmarkComparison(
      'Extra Safety Target',
      config.safetyDraws,
      config.safetyBenchmarkRate,
      null
    );

    const remnantsRemaining = Math.max(0, config.requiredRemnants - currentRemnants);
    const progressPercentage = Math.min(
      100,
      Number(((currentRemnants / config.requiredRemnants) * 100).toFixed(1))
    );

    return {
      draws,
      currentRemnants,
      claimedMilestonesBonus,
      unclaimedUnlockedBonus,
      futureLockedBonus,
      totalEventMilestoneBonus,
      drawGeneratedRemnants: Math.max(0, currentRemnants - claimedMilestonesBonus),
      trueAverage: null,
      verdict: 'neutral',
      verdictTitle: 'Not enough data yet',
      verdictMessage: missingInfo,
      isGoalReached,
      goalReachedTitle: 'Goal reached!',
      goalReachedMessage: `You have reached the required ${config.requiredRemnants.toLocaleString()} ${config.currencyName} goal.`,
      confidence: 'none',
      confidenceTitle: 'No Sample',
      confidenceMessage: 'Complete at least 1 draw to calculate your remnant pacing.',
      remnantsRemaining,
      progressPercentage,
      diffFromOptimisticBenchmark: null,
      diffFromBackupBenchmark: null,
      diffFromConservativeBenchmark: null,
      diffFromSafetyBenchmark: null,
      estimatedTotalDraws: null,
      estimatedAdditionalDraws: null,
      estimateCategory: isGoalReached ? 'goal_reached' : 'unavailable',
      optimisticComparison: optimisticComp,
      backupComparison: backupComp,
      conservativeComparison: conservativeComp,
      safetyComparison: safetyComp,
      milestones: milestoneStatuses,
      isValid: false,
      validationError: missingInfo,
    };
  }

  const drawGeneratedRemnants = Math.max(0, currentRemnants - claimedMilestonesBonus);
  const trueAverage = Number((drawGeneratedRemnants / draws).toFixed(4));

  const diffFromOptimisticBenchmark = Number(
    (trueAverage - config.optimisticBenchmarkRate).toFixed(2)
  );
  const diffFromBackupBenchmark = Number(
    (trueAverage - config.backupBenchmarkRate).toFixed(2)
  );
  const diffFromConservativeBenchmark = Number(
    (trueAverage - config.conservativeBenchmarkRate).toFixed(2)
  );
  const diffFromSafetyBenchmark = Number(
    (trueAverage - config.safetyBenchmarkRate).toFixed(2)
  );

  const remnantsRemaining = Math.max(0, config.requiredRemnants - currentRemnants);
  const progressPercentage = Math.min(
    100,
    Number(((currentRemnants / config.requiredRemnants) * 100).toFixed(1))
  );

  let verdict: VerdictType = 'neutral';
  let verdictTitle = '';
  let verdictMessage = '';

  if (trueAverage >= config.optimisticBenchmarkRate) {
    verdict = 'green';
    verdictTitle = "You're above pace!";
    verdictMessage =
      "Your remnant average is higher than the 100-draw benchmark. At your current average, you're trending toward reaching the 1,600-remnant goal in approximately 100 draws or fewer.";
  } else if (trueAverage >= config.backupBenchmarkRate) {
    verdict = 'blue';
    verdictTitle = 'Within 100–110 backup range';
    verdictMessage =
      "Your average is within the estimated 100–110 draw backup range. You're tracking comfortably within the primary backup plan.";
  } else if (trueAverage >= config.conservativeBenchmarkRate) {
    verdict = 'yellow';
    verdictTitle = 'Within 110–115 extended range';
    verdictMessage =
      'Your average is below the primary backup pace but still within the optional 115-draw extended planning target.';
  } else if (trueAverage >= config.safetyBenchmarkRate) {
    verdict = 'orange';
    verdictTitle = 'Within 115–120 planning range';
    verdictMessage =
      'Your average is below the 115-draw pace but tracking within the 120-draw extra safety contingency scenario.';
  } else {
    verdict = 'red';
    verdictTitle = 'Below 120-draw planning pace';
    verdictMessage =
      "Your current average is below the 120-draw planning pace. You can still reach the 1,600 goal with better drop rates in your remaining draws.";
  }

  let confidence: ConfidenceLevel = 'informative';
  let confidenceTitle = 'More Informative Sample';
  let confidenceMessage = '';

  if (draws < 20) {
    confidence = 'very_early';
    confidenceTitle = 'Very Early Sample';
    if (verdict === 'red') {
      confidenceMessage = `Your current average is below pace, but you've only completed ${draws} draw${draws === 1 ? '' : 's'}. Early results can fluctuate considerably. This is not a reliable prediction of your final outcome yet.`;
    } else if (verdict === 'orange' || verdict === 'yellow' || verdict === 'blue' || verdict === 'green') {
      confidenceMessage = `You've only completed ${draws} draw${draws === 1 ? '' : 's'}. Early drop rates fluctuate significantly with RNG. Continue tracking as you draw.`;
    } else {
      confidenceMessage = `Completed ${draws} draw${draws === 1 ? '' : 's'}. Sample size is very small.`;
    }
  } else if (draws < 50) {
    confidence = 'limited';
    confidenceTitle = 'Limited Sample';
    confidenceMessage = `You have completed ${draws} draws. A pacing trend is beginning to form, but normal variance can still alter your final remnant average.`;
  } else {
    confidence = 'informative';
    confidenceTitle = 'More Informative Sample';
    confidenceMessage = `With ${draws} draws completed and all milestones unlocked, your average provides a solid indicator of your remnant yield.`;
  }

  let estimatedTotalDraws: number | null = null;
  let estimatedAdditionalDraws: number | null = null;
  let estimateCategory: EstimateCategory = 'unavailable';

  if (isGoalReached) {
    estimatedTotalDraws = draws;
    estimatedAdditionalDraws = 0;
    estimateCategory = 'goal_reached';
  } else if (trueAverage > 0) {
    let resolvedN = -1;
    for (let candidateN = draws; candidateN <= 500; candidateN += 1) {
      const milestoneAtCandidate = config.milestones
        .filter((m) => candidateN >= m.threshold)
        .reduce((sum, m) => sum + m.reward, 0);

      const projectedAtCandidate = Math.round((trueAverage * candidateN) + milestoneAtCandidate);
      if (projectedAtCandidate >= config.requiredRemnants) {
        resolvedN = candidateN;
        break;
      }
    }

    if (resolvedN !== -1) {
      estimatedTotalDraws = resolvedN;
      estimatedAdditionalDraws = Math.max(0, resolvedN - draws);
      if (estimatedTotalDraws < config.optimisticDraws) {
        estimateCategory = 'below_100';
      } else if (estimatedTotalDraws <= config.backupDraws) {
        estimateCategory = 'between_100_110';
      } else if (estimatedTotalDraws <= config.conservativeDraws) {
        estimateCategory = 'between_110_115';
      } else if (estimatedTotalDraws <= config.safetyDraws) {
        estimateCategory = 'between_115_120';
      } else {
        estimateCategory = 'above_120';
      }
    }
  }

  const optimisticComparison = buildBenchmarkComparison(
    'Optimistic Target',
    config.optimisticDraws,
    config.optimisticBenchmarkRate,
    trueAverage
  );

  const backupComparison = buildBenchmarkComparison(
    'Backup Target',
    config.backupDraws,
    config.backupBenchmarkRate,
    trueAverage
  );

  const conservativeComparison = buildBenchmarkComparison(
    'Extended Target',
    config.conservativeDraws,
    config.conservativeBenchmarkRate,
    trueAverage
  );

  const safetyComparison = buildBenchmarkComparison(
    'Extra Safety Target',
    config.safetyDraws,
    config.safetyBenchmarkRate,
    trueAverage
  );

  return {
    draws,
    currentRemnants,
    claimedMilestonesBonus,
    unclaimedUnlockedBonus,
    futureLockedBonus,
    totalEventMilestoneBonus,
    drawGeneratedRemnants,
    trueAverage,
    verdict,
    verdictTitle,
    verdictMessage,
    isGoalReached,
    goalReachedTitle: 'Goal reached!',
    goalReachedMessage: `You have reached the required ${config.requiredRemnants.toLocaleString()} ${config.currencyName} goal. You can claim ${config.skinName} now!`,
    confidence,
    confidenceTitle,
    confidenceMessage,
    remnantsRemaining,
    progressPercentage,
    diffFromOptimisticBenchmark,
    diffFromBackupBenchmark,
    diffFromConservativeBenchmark,
    diffFromSafetyBenchmark,
    estimatedTotalDraws,
    estimatedAdditionalDraws,
    estimateCategory,
    optimisticComparison,
    backupComparison,
    conservativeComparison,
    safetyComparison,
    milestones: milestoneStatuses,
    isValid: true,
  };
}
