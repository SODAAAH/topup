import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CalculationResult } from '../types/tracker';
import { EVENT_CONFIG } from '../config/eventConfig';

interface DetailedStatsProps {
  result: CalculationResult;
}

export const DetailedStats: React.FC<DetailedStatsProps> = ({ result }) => {
  const formatDelta = (val: number | null) => {
    if (val === null) return null;
    if (val > 0) return `+${val.toFixed(2)}`;
    return val.toFixed(2);
  };

  const getDeltaBadge = (val: number | null) => {
    if (val === null) return null;
    if (val >= 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[11px] font-mono font-medium text-[#1E7E4E]">
          <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
          {formatDelta(val)}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-mono font-medium text-[#B52E45]">
        <ArrowDownRight className="w-3 h-3" aria-hidden="true" />
        {formatDelta(val)}
      </span>
    );
  };

  const getProjectionPaceBadge = () => {
    if (result.isGoalReached) {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FBF8F0] text-[#9D7E3F] border border-[#EFE2C6]">
          Goal reached
        </span>
      );
    }
    if (result.estimateCategory === 'below_100') {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#EDF7F1] text-[#1E7E4E] border border-[#C7E9D5]">
          Fast pace (&lt;100 draws)
        </span>
      );
    }
    if (result.estimateCategory === 'between_100_110') {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#EEF5FC] text-[#1D64C2] border border-[#C6DFFA]">
          Backup pace (100–110)
        </span>
      );
    }
    if (result.estimateCategory === 'between_110_115') {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FEF9EE] text-[#A16207] border border-[#F6E2B6]">
          Extended range (110–115)
        </span>
      );
    }
    if (result.estimateCategory === 'between_115_120') {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]">
          Safety range (115–120)
        </span>
      );
    }
    if (result.estimateCategory === 'above_120' || result.estimateCategory === 'above_115') {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FDF2F4] text-[#B52E45] border border-[#F8D2D9]">
          Above 120 draws
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F7F6F2] text-[#74716D] border border-[#E9E6E0]">
        Needs more draws
      </span>
    );
  };

  return (
    <div className="bg-white border border-[#E9E6E0] rounded-lg p-4 sm:p-7 shadow-xs space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 sm:pb-4 border-b border-[#E9E6E0]">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[#292929]">
            Performance details
          </h3>
          <p className="text-xs text-[#74716D]">
            Mathematical breakdown of inventory, true averages, and milestone rewards.
          </p>
        </div>
        <span className="text-xs text-[#98948D]">
          Target: {EVENT_CONFIG.requiredRemnants.toLocaleString()} remnants
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-[#E9E6E0]">
        <div>
          <span className="text-xs text-[#74716D] block">Current remnants</span>
          <div className="mt-1 text-xl sm:text-2xl font-bold font-mono text-[#292929] tabular-nums">
            {result.currentRemnants.toLocaleString()}{' '}
            <span className="text-xs font-normal text-[#98948D]">/ {EVENT_CONFIG.requiredRemnants.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-[#98948D] block mt-0.5">Inventory balance</span>
        </div>

        <div>
          <span className="text-xs text-[#74716D] block">Remnants remaining</span>
          <div className="mt-1 text-xl sm:text-2xl font-bold font-mono text-[#B52E45] tabular-nums">
            {result.remnantsRemaining.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#98948D] block mt-0.5">Required to claim skin</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-[#74716D]">
            <span>Goal progress</span>
            <span className="font-mono font-semibold text-[#292929] tabular-nums">{result.progressPercentage}%</span>
          </div>
          <div className="w-full bg-[#F0EDE6] rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-[#B52E45] h-full rounded-full transition-all duration-300"
              style={{ width: `${result.progressPercentage}%` }}
            />
          </div>
          <span className="text-[11px] text-[#98948D] block mt-1">
            {result.currentRemnants} of {EVENT_CONFIG.requiredRemnants} remnants reached
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-[#E9E6E0]">
        <div>
          <span className="text-xs text-[#74716D] block">Your true average</span>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-[#292929] tabular-nums">
            {result.trueAverage !== null ? result.trueAverage.toFixed(2) : '—'}
            <span className="text-xs font-normal text-[#74716D] ml-1">/ draw</span>
          </div>
          <span className="text-[11px] text-[#98948D] block mt-0.5">
            {result.statistics && result.statistics.ciLower !== null && result.statistics.ciUpper !== null
              ? `95% CI: ${result.statistics.ciLower.toFixed(2)}–${result.statistics.ciUpper.toFixed(2)}`
              : 'Milestones deducted'}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#74716D]">100-draw pace</span>
            {getDeltaBadge(result.diffFromOptimisticBenchmark)}
          </div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-[#292929] tabular-nums">
            {EVENT_CONFIG.optimisticBenchmarkRate.toFixed(2)}
            <span className="text-xs font-normal text-[#74716D] ml-1">/ draw</span>
          </div>
          <span className="text-[11px] text-[#98948D] block mt-0.5">Optimistic planning rate</span>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#74716D]">110-draw pace</span>
            {getDeltaBadge(result.diffFromBackupBenchmark)}
          </div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-[#292929] tabular-nums">
            {EVENT_CONFIG.backupBenchmarkRate.toFixed(2)}
            <span className="text-xs font-normal text-[#74716D] ml-1">/ draw</span>
          </div>
          <span className="text-[11px] text-[#98948D] block mt-0.5">Tipid Plan backup target</span>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#74716D]">115-draw pace</span>
            {getDeltaBadge(result.diffFromConservativeBenchmark)}
          </div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-[#292929] tabular-nums">
            {EVENT_CONFIG.conservativeBenchmarkRate.toFixed(2)}
            <span className="text-xs font-normal text-[#74716D] ml-1">/ draw</span>
          </div>
          <span className="text-[11px] text-[#98948D] block mt-0.5">Extended cushion target</span>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#74716D]">120-draw pace</span>
            {getDeltaBadge(result.diffFromSafetyBenchmark)}
          </div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-[#292929] tabular-nums">
            {EVENT_CONFIG.safetyBenchmarkRate.toFixed(2)}
            <span className="text-xs font-normal text-[#74716D] ml-1">/ draw</span>
          </div>
          <span className="text-[11px] text-[#98948D] block mt-0.5">Extra safety contingency</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-1 text-xs">
        <div className="space-y-1">
          <span className="font-semibold text-[#292929] block">Milestone rewards</span>
          <div className="text-sm font-mono text-[#5C5853] flex items-center flex-wrap gap-1">
            <span>Included:</span>
            <strong className="text-[#292929]">{result.claimedMilestonesBonus}</strong>
            <span>/ {EVENT_CONFIG.totalMilestoneBonus}</span>
            {result.unclaimedUnlockedBonus > 0 && (
              <span className="text-[#B52E45]">({result.unclaimedUnlockedBonus} unclaimed available)</span>
            )}
          </div>
          <p className="text-[11px] text-[#98948D]">
            Milestones contribute up to 105 total free bonus remnants.
          </p>
        </div>

        <div className="space-y-1 sm:text-right">
          <span className="font-semibold text-[#292929] block">Projected finishing draws</span>
          <div className="flex items-center sm:justify-end gap-2 text-sm font-mono flex-wrap">
            <span className="font-bold text-[#292929] text-base">
              {result.estimatedTotalDraws !== null
                ? `~${result.estimatedTotalDraws} draws`
                : result.trueAverage !== null && result.trueAverage > 0 && !result.isGoalReached
                ? '>500 draws'
                : '—'}
            </span>
            {result.estimatedAdditionalDraws !== null && result.estimatedAdditionalDraws > 0 && (
              <span className="text-xs text-[#74716D]">
                (+{result.estimatedAdditionalDraws} remaining)
              </span>
            )}
            {getProjectionPaceBadge()}
          </div>
          <p className="text-[11px] text-[#98948D]">
            {result.trueAverage !== null && result.trueAverage > 0 && result.estimatedTotalDraws === null && !result.isGoalReached
              ? 'Projection exceeds 500 draws at your current remnant rate.'
              : 'Estimated total draws required if historical true average persists.'}
          </p>
        </div>
      </div>
    </div>
  );
};
