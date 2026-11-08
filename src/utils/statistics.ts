import {
  BenchmarkCIComparison,
  RunningAveragePoint,
  SampleClassification,
  StatisticalSummary,
} from '../types/tracker';
import { EVENT_CONFIG } from '../config/eventConfig';

const STUDENT_T_95_TABLE: Record<number, number> = {
  1: 12.7062,
  2: 4.3027,
  3: 3.1824,
  4: 2.7764,
  5: 2.5706,
  6: 2.4469,
  7: 2.3646,
  8: 2.306,
  9: 2.2622,
  10: 2.2281,
  11: 2.201,
  12: 2.1788,
  13: 2.1604,
  14: 2.1448,
  15: 2.1314,
  16: 2.1199,
  17: 2.1098,
  18: 2.1009,
  19: 2.093,
  20: 2.086,
  21: 2.0796,
  22: 2.0739,
  23: 2.0687,
  24: 2.0639,
  25: 2.0595,
  26: 2.0555,
  27: 2.0518,
  28: 2.0484,
  29: 2.0452,
  30: 2.0423,
  31: 2.0395,
  32: 2.0369,
  33: 2.0345,
  34: 2.0322,
  35: 2.0301,
  36: 2.0281,
  37: 2.0262,
  38: 2.0244,
  39: 2.0227,
  40: 2.0211,
  42: 2.0181,
  44: 2.0154,
  46: 2.0129,
  48: 2.0106,
  50: 2.0086,
  55: 2.004,
  60: 2.0003,
  65: 1.9971,
  70: 1.9944,
  75: 1.9921,
  80: 1.9901,
  85: 1.9883,
  90: 1.9867,
  95: 1.9852,
  100: 1.984,
  105: 1.9828,
  110: 1.9818,
  115: 1.9808,
  120: 1.9799,
};

export function calculateStudentTCritical(df: number): number {
  if (df <= 0) return 1.96;
  const roundedDf = Math.round(df);
  if (STUDENT_T_95_TABLE[roundedDf] !== undefined) {
    return STUDENT_T_95_TABLE[roundedDf];
  }
  const z = 1.95996398454;
  const term1 = (z * z * z + z) / (4 * roundedDf);
  const term2 = (5 * Math.pow(z, 5) + 16 * Math.pow(z, 3) + 3 * z) / (96 * roundedDf * roundedDf);
  const term3 =
    (3 * Math.pow(z, 7) + 19 * Math.pow(z, 5) + 17 * Math.pow(z, 3) - 15 * z) /
    (384 * Math.pow(roundedDf, 3));
  return Number((z + term1 + term2 + term3).toFixed(4));
}

export function getSampleClassification(draws: number): SampleClassification {
  if (draws <= 0) {
    return {
      key: 'none',
      title: 'No Data Yet',
      message: 'No results recorded.',
      minDraws: 0,
      maxDraws: 0,
    };
  }
  if (draws < 30) {
    return {
      key: 'too_early',
      title: 'Too Early to Tell',
      message: 'Not enough results to judge your average.',
      minDraws: 1,
      maxDraws: 29,
    };
  }
  if (draws < 50) {
    return {
      key: 'preliminary',
      title: 'Rough Estimate',
      message: 'You have an initial idea, but your average can still change significantly.',
      minDraws: 30,
      maxDraws: 49,
    };
  }
  if (draws < 80) {
    return {
      key: 'moderately_informative',
      title: 'Getting More Reliable',
      message: 'Your results are becoming more informative.',
      minDraws: 50,
      maxDraws: 79,
    };
  }
  if (draws < 100) {
    return {
      key: 'good',
      title: 'Fairly Reliable',
      message: 'Your average is becoming a better representation of your recorded results.',
      minDraws: 80,
      maxDraws: 99,
    };
  }
  if (draws < 120) {
    return {
      key: 'strong',
      title: 'Highly Informative',
      message: 'You have a substantial number of recorded draws.',
      minDraws: 100,
      maxDraws: 119,
    };
  }
  return {
    key: 'strongest',
    title: 'Strongest Sample So Far',
    message: 'You have a large sample within your planned draw range.',
    minDraws: 120,
    maxDraws: null,
  };
}

export function calculateBootstrapCI(
  values: number[],
  resamples = 2000,
  randomSeed?: number
): [number, number] | null {
  const n = values.length;
  if (n < 2) return null;

  let seed = randomSeed ?? 123456789;
  const pseudoRandom = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const sampleMeans: number[] = new Array(resamples);

  for (let b = 0; b < resamples; b += 1) {
    let sum = 0;
    for (let i = 0; i < n; i += 1) {
      const idx = Math.floor(pseudoRandom() * n);
      sum += values[idx];
    }
    sampleMeans[b] = sum / n;
  }

  sampleMeans.sort((a, b) => a - b);

  const lowerIdx = Math.floor(resamples * 0.025);
  const upperIdx = Math.min(resamples - 1, Math.ceil(resamples * 0.975) - 1);

  return [
    Number(sampleMeans[lowerIdx].toFixed(2)),
    Number(sampleMeans[upperIdx].toFixed(2)),
  ];
}

export function compareCIToBenchmarks(
  ciLower: number | null,
  ciUpper: number | null
): BenchmarkCIComparison[] {
  const benchmarks = [
    { name: '100 draws', targetDraws: 100, rate: EVENT_CONFIG.optimisticBenchmarkRate },
    { name: '110 draws', targetDraws: 110, rate: EVENT_CONFIG.backupBenchmarkRate },
    { name: '115 draws', targetDraws: 115, rate: EVENT_CONFIG.conservativeBenchmarkRate },
    { name: '120 draws', targetDraws: 120, rate: EVENT_CONFIG.safetyBenchmarkRate },
  ];

  if (ciLower === null || ciUpper === null) {
    return benchmarks.map((b) => ({
      name: b.name,
      targetDraws: b.targetDraws,
      benchmarkRate: b.rate,
      status: 'indeterminate',
      message: `Sample size is too small to construct a reliable confidence interval relative to the ${b.name} benchmark.`,
    }));
  }

  return benchmarks.map((b) => {
    if (ciLower >= b.rate) {
      return {
        name: b.name,
        targetDraws: b.targetDraws,
        benchmarkRate: b.rate,
        status: 'above',
        message: `Your estimated average is above the ${b.name} benchmark, even at the lower end of your confidence interval.`,
      };
    }
    if (ciUpper < b.rate) {
      return {
        name: b.name,
        targetDraws: b.targetDraws,
        benchmarkRate: b.rate,
        status: 'below',
        message: `Your estimated average is below the ${b.name} benchmark based on your recorded results.`,
      };
    }
    return {
      name: b.name,
      targetDraws: b.targetDraws,
      benchmarkRate: b.rate,
      status: 'crosses',
      message: `Your results are still statistically uncertain relative to the ${b.name} benchmark.`,
    };
  });
}

export function calculateSampleStatistics(
  values: number[],
  directAmounts?: number[],
  duplicateAmounts?: number[]
): StatisticalSummary {
  const count = values.length;

  const totalDrawGeneratedRemnants = values.reduce((sum, v) => sum + v, 0);
  const totalDirectRemnants = directAmounts
    ? directAmounts.reduce((sum, v) => sum + v, 0)
    : totalDrawGeneratedRemnants;
  const totalDuplicateRemnants = duplicateAmounts
    ? duplicateAmounts.reduce((sum, v) => sum + v, 0)
    : 0;

  if (count === 0) {
    return {
      count: 0,
      totalDirectRemnants: 0,
      totalDuplicateRemnants: 0,
      totalDrawGeneratedRemnants: 0,
      mean: null,
      median: null,
      min: null,
      max: null,
      sampleVariance: null,
      sampleStandardDeviation: null,
      standardError: null,
      degreesOfFreedom: 0,
      tCritical: null,
      marginOfError: null,
      ciLower: null,
      ciUpper: null,
      ciWidth: null,
      bootstrapCILower: null,
      bootstrapCIUpper: null,
      isZeroVariance: false,
      benchmarkComparisons: compareCIToBenchmarks(null, null),
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[count - 1];
  const mean = Number((totalDrawGeneratedRemnants / count).toFixed(4));

  const median =
    count % 2 === 1
      ? sorted[Math.floor(count / 2)]
      : Number(((sorted[count / 2 - 1] + sorted[count / 2]) / 2).toFixed(2));

  if (count === 1) {
    return {
      count: 1,
      totalDirectRemnants,
      totalDuplicateRemnants,
      totalDrawGeneratedRemnants,
      mean,
      median,
      min,
      max,
      sampleVariance: null,
      sampleStandardDeviation: null,
      standardError: null,
      degreesOfFreedom: 0,
      tCritical: null,
      marginOfError: null,
      ciLower: null,
      ciUpper: null,
      ciWidth: null,
      bootstrapCILower: null,
      bootstrapCIUpper: null,
      isZeroVariance: true,
      benchmarkComparisons: compareCIToBenchmarks(null, null),
    };
  }

  const sumSquaredDiffs = values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0);
  const sampleVariance = Number((sumSquaredDiffs / (count - 1)).toFixed(6));
  const sampleStandardDeviation = Number(Math.sqrt(sampleVariance).toFixed(4));
  const standardError = Number((sampleStandardDeviation / Math.sqrt(count)).toFixed(4));
  const degreesOfFreedom = count - 1;
  const tCritical = calculateStudentTCritical(degreesOfFreedom);

  const isZeroVariance = sampleStandardDeviation === 0;

  let marginOfError = 0;
  let ciLower = mean;
  let ciUpper = mean;
  let ciWidth = 0;

  if (!isZeroVariance) {
    marginOfError = Number((tCritical * standardError).toFixed(4));
    ciLower = Number((mean - marginOfError).toFixed(2));
    ciUpper = Number((mean + marginOfError).toFixed(2));
    ciWidth = Number((ciUpper - ciLower).toFixed(2));
  }

  const bootstrap = calculateBootstrapCI(values);

  return {
    count,
    totalDirectRemnants,
    totalDuplicateRemnants,
    totalDrawGeneratedRemnants,
    mean: Number(mean.toFixed(2)),
    median,
    min,
    max,
    sampleVariance,
    sampleStandardDeviation,
    standardError,
    degreesOfFreedom,
    tCritical,
    marginOfError: Number(marginOfError.toFixed(2)),
    ciLower,
    ciUpper,
    ciWidth,
    bootstrapCILower: bootstrap ? bootstrap[0] : null,
    bootstrapCIUpper: bootstrap ? bootstrap[1] : null,
    isZeroVariance,
    benchmarkComparisons: compareCIToBenchmarks(ciLower, ciUpper),
  };
}

export function calculateRunningAverages(values: number[], windowSize = 5): RunningAveragePoint[] {
  let cumulative = 0;
  return values.map((val, idx) => {
    cumulative += val;
    const drawNumber = idx + 1;
    const runningAverage = Number((cumulative / drawNumber).toFixed(2));

    let rollingAverage: number | undefined = undefined;
    if (drawNumber >= windowSize) {
      let windowSum = 0;
      for (let j = idx - windowSize + 1; j <= idx; j += 1) {
        windowSum += values[j];
      }
      rollingAverage = Number((windowSum / windowSize).toFixed(2));
    }

    return {
      drawNumber,
      drawRemnants: val,
      runningAverage,
      rollingAverage,
    };
  });
}
