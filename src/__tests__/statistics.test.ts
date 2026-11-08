import { describe, expect, it } from 'vitest';
import {
  calculateBootstrapCI,
  calculateRunningAverages,
  calculateSampleStatistics,
  calculateStudentTCritical,
  compareCIToBenchmarks,
  getSampleClassification,
} from '../utils/statistics';

describe('Statistical Analysis Engine - Unit Tests', () => {
  it('correctly maps all sample-size classifications and exact labels', () => {
    expect(getSampleClassification(0).title).toBe('No Data Yet');
    expect(getSampleClassification(0).message).toBe('No results recorded.');

    expect(getSampleClassification(29).title).toBe('Too Early to Tell');
    expect(getSampleClassification(29).message).toBe(
      'Not enough results to judge your average.'
    );

    expect(getSampleClassification(30).title).toBe('Rough Estimate');
    expect(getSampleClassification(30).message).toBe(
      'You have an initial idea, but your average can still change significantly.'
    );

    expect(getSampleClassification(49).title).toBe('Rough Estimate');

    expect(getSampleClassification(50).title).toBe('Getting More Reliable');
    expect(getSampleClassification(50).message).toBe(
      'Your results are becoming more informative.'
    );

    expect(getSampleClassification(79).title).toBe('Getting More Reliable');

    expect(getSampleClassification(80).title).toBe('Fairly Reliable');
    expect(getSampleClassification(80).message).toBe(
      'Your average is becoming a better representation of your recorded results.'
    );

    expect(getSampleClassification(99).title).toBe('Fairly Reliable');

    expect(getSampleClassification(100).title).toBe('Highly Informative');
    expect(getSampleClassification(100).message).toBe(
      'You have a substantial number of recorded draws.'
    );

    expect(getSampleClassification(119).title).toBe('Highly Informative');

    expect(getSampleClassification(120).title).toBe('Strongest Sample So Far');
    expect(getSampleClassification(120).message).toBe(
      'You have a large sample within your planned draw range.'
    );
  });

  it('calculates exact statistics for test dataset [10, 12, 8, 14, 6]', () => {
    const data = [10, 12, 8, 14, 6];
    const stats = calculateSampleStatistics(data);

    expect(stats.count).toBe(5);
    expect(stats.mean).toBe(10);
    expect(stats.median).toBe(10);
    expect(stats.min).toBe(6);
    expect(stats.max).toBe(14);
    expect(stats.degreesOfFreedom).toBe(4);

    expect(stats.sampleStandardDeviation).toBeCloseTo(3.1623, 3);
    expect(stats.standardError).toBeCloseTo(1.4142, 3);
    expect(stats.tCritical).toBeCloseTo(2.7764, 4);

    expect(stats.ciLower).toBeCloseTo(6.07, 1);
    expect(stats.ciUpper).toBeCloseTo(13.93, 1);
    expect(stats.ciWidth).toBeCloseTo(7.86, 1);
  });

  it('handles empty datasets and single-record datasets gracefully', () => {
    const emptyStats = calculateSampleStatistics([]);
    expect(emptyStats.count).toBe(0);
    expect(emptyStats.mean).toBeNull();
    expect(emptyStats.sampleStandardDeviation).toBeNull();
    expect(emptyStats.ciLower).toBeNull();

    const singleStats = calculateSampleStatistics([15]);
    expect(singleStats.count).toBe(1);
    expect(singleStats.mean).toBe(15);
    expect(singleStats.median).toBe(15);
    expect(singleStats.min).toBe(15);
    expect(singleStats.max).toBe(15);
    expect(singleStats.sampleStandardDeviation).toBeNull();
    expect(singleStats.standardError).toBeNull();
    expect(singleStats.ciLower).toBeNull();
  });

  it('handles zero-variance datasets when all draws yield identical remnants', () => {
    const zeroVarStats = calculateSampleStatistics([10, 10, 10, 10]);
    expect(zeroVarStats.count).toBe(4);
    expect(zeroVarStats.mean).toBe(10);
    expect(zeroVarStats.sampleStandardDeviation).toBe(0);
    expect(zeroVarStats.standardError).toBe(0);
    expect(zeroVarStats.isZeroVariance).toBe(true);
    expect(zeroVarStats.ciLower).toBe(10);
    expect(zeroVarStats.ciUpper).toBe(10);
  });

  it('calculates bootstrap confidence intervals using resampling', () => {
    const data = [10, 12, 8, 14, 6];
    const bootstrapCI = calculateBootstrapCI(data, 2000, 42);

    expect(bootstrapCI).not.toBeNull();
    if (bootstrapCI) {
      expect(bootstrapCI[0]).toBeLessThan(10);
      expect(bootstrapCI[1]).toBeGreaterThan(10);
      expect(bootstrapCI[0]).toBeGreaterThan(6.0);
      expect(bootstrapCI[1]).toBeLessThan(14.0);
    }
  });

  it('correctly compares confidence intervals against draw benchmarks', () => {
    const aboveComps = compareCIToBenchmarks(15.5, 17.0);
    expect(aboveComps[0].status).toBe('above');
    expect(aboveComps[0].message).toContain('above the 100 draws benchmark');

    const crossesComps = compareCIToBenchmarks(14.0, 16.0);
    expect(crossesComps[0].status).toBe('crosses');
    expect(crossesComps[0].message).toContain('statistically uncertain');

    const belowComps = compareCIToBenchmarks(10.0, 12.0);
    expect(belowComps[0].status).toBe('below');
    expect(belowComps[0].message).toContain('below the 100 draws benchmark');
  });

  it('calculates accurate Student t critical values across degrees of freedom', () => {
    expect(calculateStudentTCritical(1)).toBeCloseTo(12.7062, 3);
    expect(calculateStudentTCritical(4)).toBeCloseTo(2.7764, 4);
    expect(calculateStudentTCritical(9)).toBeCloseTo(2.2622, 4);
    expect(calculateStudentTCritical(29)).toBeCloseTo(2.0452, 4);
    expect(calculateStudentTCritical(120)).toBeCloseTo(1.9799, 4);
  });

  it('computes running and rolling averages correctly', () => {
    const values = [10, 20, 15, 5, 25, 15];
    const progression = calculateRunningAverages(values, 3);

    expect(progression).toHaveLength(6);
    expect(progression[0].runningAverage).toBe(10);
    expect(progression[1].runningAverage).toBe(15);
    expect(progression[2].runningAverage).toBe(15);
    expect(progression[2].rollingAverage).toBe(15);
    expect(progression[3].runningAverage).toBe(12.5);
    expect(progression[3].rollingAverage).toBeCloseTo(13.33, 2);
  });
});

