import { describe, expect, it } from 'vitest';
import { calculateTrackerPace } from '../utils/calculator';
import { EVENT_CONFIG } from '../config/eventConfig';

describe('Kagura Ashen Remnant Tracker - Mathematical Engine', () => {
  it('TEST 1: 8 draws, 65 remnants -> true average 8.125, below extended pace, early sample', () => {
    const result = calculateTrackerPace({ draws: 8, remnants: 65 });

    expect(result.draws).toBe(8);
    expect(result.currentRemnants).toBe(65);
    expect(result.claimedMilestonesBonus).toBe(0);
    expect(result.trueAverage).toBe(8.125);
    expect(result.verdict).toBe('red');
    expect(result.verdictTitle).toBe('Below extended pace');
    expect(result.confidence).toBe('very_early');
    expect(result.confidenceMessage).toContain("you've only completed 8 draws");
  });

  it('TEST 2: 22 draws, 319 remnants, claimed milestone bonus 30 -> true average ~13.14, within 110–115 extended range', () => {
    const result = calculateTrackerPace({ draws: 22, remnants: 319 });

    expect(result.claimedMilestonesBonus).toBe(30);
    expect(result.drawGeneratedRemnants).toBe(289);
    expect(result.trueAverage).toBeCloseTo(13.1364, 2);
    expect(result.verdict).toBe('yellow');
    expect(result.verdictTitle).toBe('Within 110–115 extended range');
    expect(result.confidence).toBe('limited');
  });

  it('TEST 2B: 20 draws, 280 remnants -> true average 14.00, within 100–110 backup range', () => {
    const result = calculateTrackerPace({ draws: 20, remnants: 280 + 30 });

    expect(result.claimedMilestonesBonus).toBe(30);
    expect(result.drawGeneratedRemnants).toBe(280);
    expect(result.trueAverage).toBe(14.0);
    expect(result.verdict).toBe('blue');
    expect(result.verdictTitle).toBe('Within 100–110 backup range');
  });

  it('TEST 3: 50 draws with all 105 milestone rewards correctly subtracted', () => {
    const remnants = 800;
    const result = calculateTrackerPace({ draws: 50, remnants });

    expect(result.claimedMilestonesBonus).toBe(105);
    expect(result.drawGeneratedRemnants).toBe(800 - 105);
    expect(result.trueAverage).toBe(Number(((800 - 105) / 50).toFixed(4)));
    expect(result.confidence).toBe('informative');
  });

  it('TEST 4: 0 draws does not divide by zero and displays not-enough-data state', () => {
    const result = calculateTrackerPace({ draws: 0, remnants: 50 });

    expect(result.trueAverage).toBeNull();
    expect(result.verdict).toBe('neutral');
    expect(result.verdictTitle).toBe('Not enough data yet');
    expect(result.isValid).toBe(false);
  });

  it('TEST 5: remnants 1,600 or more shows goal reached', () => {
    const result = calculateTrackerPace({ draws: 95, remnants: 1600 });

    expect(result.isGoalReached).toBe(true);
    expect(result.goalReachedTitle).toBe('Goal reached!');
    expect(result.remnantsRemaining).toBe(0);
    expect(result.progressPercentage).toBe(100);
    expect(result.estimatedAdditionalDraws).toBe(0);
  });

  it('TEST 6: draw count past 50 does not add additional milestone rewards beyond 105', () => {
    const result70 = calculateTrackerPace({ draws: 70, remnants: 1000 });
    const result120 = calculateTrackerPace({ draws: 120, remnants: 1500 });

    expect(result70.claimedMilestonesBonus).toBe(105);
    expect(result120.claimedMilestonesBonus).toBe(105);
    expect(result70.futureLockedBonus).toBe(0);
    expect(result120.futureLockedBonus).toBe(0);
  });

  it('TEST 7: boundary tests for averages (12.99, 13.00, 13.5908, 13.5909, 14.94, 14.95)', () => {
    const belowExtended = calculateTrackerPace({
      draws: 100,
      remnants: 1299 + 105,
    });
    expect(belowExtended.trueAverage).toBe(12.99);
    expect(belowExtended.verdict).toBe('red');
    expect(belowExtended.verdictTitle).toBe('Below extended pace');

    const exactExtended = calculateTrackerPace({
      draws: 100,
      remnants: 1300 + 105,
    });
    expect(exactExtended.trueAverage).toBe(13.0);
    expect(exactExtended.verdict).toBe('yellow');
    expect(exactExtended.verdictTitle).toBe('Within 110–115 extended range');

    const exactBackup = calculateTrackerPace({
      draws: 10000,
      remnants: 135909 + 105,
    });
    expect(exactBackup.trueAverage).toBe(13.5909);
    expect(exactBackup.verdict).toBe('blue');
    expect(exactBackup.verdictTitle).toBe('Within 100–110 backup range');

    const highBackup = calculateTrackerPace({
      draws: 100,
      remnants: 1494 + 105,
    });
    expect(highBackup.trueAverage).toBe(14.94);
    expect(highBackup.verdict).toBe('blue');

    const exactOptimistic = calculateTrackerPace({
      draws: 20,
      remnants: 299 + 30,
    });
    expect(exactOptimistic.trueAverage).toBe(14.95);
    expect(exactOptimistic.verdict).toBe('green');
    expect(exactOptimistic.verdictTitle).toBe("You're above pace!");
  });

  it('TEST 8: unclaimed milestone rewards handling and future projection accounting', () => {
    const resultClaimed = calculateTrackerPace({
      draws: 20,
      remnants: 300,
      customClaimedMilestones: { m15: true, m20: true },
    });
    expect(resultClaimed.claimedMilestonesBonus).toBe(30);
    expect(resultClaimed.unclaimedUnlockedBonus).toBe(0);
    expect(resultClaimed.drawGeneratedRemnants).toBe(270);
    expect(resultClaimed.trueAverage).toBe(13.5);

    const resultUnclaimed = calculateTrackerPace({
      draws: 20,
      remnants: 270,
      customClaimedMilestones: { m15: false, m20: false },
    });
    expect(resultUnclaimed.claimedMilestonesBonus).toBe(0);
    expect(resultUnclaimed.unclaimedUnlockedBonus).toBe(30);
    expect(resultUnclaimed.drawGeneratedRemnants).toBe(270);
    expect(resultUnclaimed.trueAverage).toBe(13.5);

    expect(resultClaimed.trueAverage).toBe(resultUnclaimed.trueAverage);
    expect(resultUnclaimed.optimisticComparison.projectedRemnants).toBe(
      resultClaimed.optimisticComparison.projectedRemnants
    );
  });

  it('verifies configuration benchmarks for 100, 110, and 115 draws', () => {
    expect(EVENT_CONFIG.optimisticBenchmarkRate).toBe(14.95);
    expect(EVENT_CONFIG.backupBenchmarkRate).toBe(13.5909);
    expect(EVENT_CONFIG.conservativeBenchmarkRate).toBe(13.0);
  });
});
