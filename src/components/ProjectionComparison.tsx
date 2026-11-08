import React from 'react';
import { Check, AlertCircle, Info } from 'lucide-react';
import { CalculationResult } from '../types/tracker';
import { EVENT_CONFIG } from '../config/eventConfig';

interface ProjectionComparisonProps {
  result: CalculationResult;
}

export const ProjectionComparison: React.FC<ProjectionComparisonProps> = ({ result }) => {
  const { optimisticComparison, backupComparison, conservativeComparison, draws, trueAverage } = result;

  const renderTargetCard = (
    targetName: string,
    targetDraws: number,
    benchmarkRate: number,
    comparison: typeof optimisticComparison,
    accentStyle: 'optimistic' | 'backup' | 'extended'
  ) => {
    const isCompleted = draws >= targetDraws;
    const surplus = comparison.differenceFromGoal;
    const reachesGoal = comparison.willReachGoal;

    const badgeStyle =
      accentStyle === 'optimistic'
        ? 'bg-[#EDF7F1] text-[#1E7E4E] border-[#C7E9D5]'
        : accentStyle === 'backup'
        ? 'bg-[#EEF5FC] text-[#1D64C2] border-[#C6DFFA]'
        : 'bg-[#FEF9EE] text-[#A16207] border-[#F6E2B6]';

    return (
      <div className="bg-white border border-[#E9E6E0] rounded-lg p-5 flex flex-col justify-between shadow-xs">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E6E0]">
            <div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeStyle}`}>
                {targetName}
              </span>
              <h4 className="mt-1.5 text-base font-bold text-[#292929]">
                {targetDraws} total draws
              </h4>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-[#98948D] block">Benchmark</span>
              <span className="font-mono text-xs font-semibold text-[#292929] tabular-nums">
                {benchmarkRate.toFixed(2)} / draw
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-baseline justify-between">
              <span className="text-[#74716D]">Projected at {targetDraws} draws:</span>
              <span className="font-mono text-base font-bold text-[#292929] tabular-nums">
                {trueAverage !== null ? comparison.projectedRemnants.toLocaleString() : '—'}
                <span className="text-xs font-normal text-[#98948D] ml-1">/ 1,600</span>
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-[#74716D]">Goal difference:</span>
              <span className={`font-mono font-semibold tabular-nums ${
                trueAverage === null
                  ? 'text-[#98948D]'
                  : surplus >= 0
                  ? 'text-[#1E7E4E]'
                  : 'text-[#B52E45]'
              }`}>
                {trueAverage !== null
                  ? surplus >= 0
                    ? `+${surplus.toLocaleString()} surplus`
                    : `${surplus.toLocaleString()} deficit`
                  : '—'}
              </span>
            </div>

            <div className="pt-2 border-t border-[#E9E6E0] space-y-1">
              <div className="flex items-baseline justify-between text-[#74716D]">
                <span>Remaining to target:</span>
                <span className="font-mono text-[#292929] font-medium tabular-nums">
                  {isCompleted ? 'Target passed' : `${comparison.drawsRemainingToTarget} draws`}
                </span>
              </div>

              {!isCompleted && comparison.requiredRateForRemaining !== null && (
                <div className="flex items-baseline justify-between text-[#74716D]">
                  <span>Required in remaining:</span>
                  <span className="font-mono font-bold text-[#292929] tabular-nums">
                    {comparison.requiredRateForRemaining.toFixed(2)} / draw
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E9E6E0] text-xs">
          {trueAverage === null ? (
            <span className="text-[#98948D]">Enter draws to see projections</span>
          ) : reachesGoal ? (
            <div className="flex items-center gap-1.5 text-[#1E7E4E] font-medium">
              <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Projected to reach 1,600 by draw {targetDraws}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#B52E45]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Needs +{Math.abs(surplus)} more remnants</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h3 className="text-base font-semibold text-[#292929]">
            Where are you heading?
          </h3>
          <p className="text-xs text-[#74716D]">
            Three planning targets: Optimistic (100 draws), Backup (110 draws), and Extended (115 draws).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderTargetCard(
          'Optimistic',
          EVENT_CONFIG.optimisticDraws,
          EVENT_CONFIG.optimisticBenchmarkRate,
          optimisticComparison,
          'optimistic'
        )}

        {renderTargetCard(
          'Backup',
          EVENT_CONFIG.backupDraws,
          EVENT_CONFIG.backupBenchmarkRate,
          backupComparison,
          'backup'
        )}

        {renderTargetCard(
          'Extended',
          EVENT_CONFIG.conservativeDraws,
          EVENT_CONFIG.conservativeBenchmarkRate,
          conservativeComparison,
          'extended'
        )}
      </div>

      <div className="p-3.5 rounded-lg bg-[#F7F6F2] border border-[#E9E6E0] text-xs text-[#74716D] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#98948D] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          All benchmarks deduct the 105 guaranteed milestone remnants (1,600 - 105 = 1,495 remnants from pulls). The 100-draw optimistic mark requires 14.95 remnants per draw, the 110-draw Tipid backup scenario requires 13.5909 remnants per draw, and the 115-draw extended cushion requires 13.00 remnants per draw.
        </p>
      </div>
    </div>
  );
};
