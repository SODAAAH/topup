import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Activity,
  Layers,
  Scale,
} from 'lucide-react';
import { CalculationResult, StatisticalSummary } from '../types/tracker';

interface StatisticalAnalysisCardProps {
  result: CalculationResult;
  statistics?: StatisticalSummary;
  totalDraws: number;
  recordedDrawsCount: number;
}

export const StatisticalAnalysisCard: React.FC<StatisticalAnalysisCardProps> = ({
  result,
  statistics,
  totalDraws,
  recordedDrawsCount,
}) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const stats = statistics || result.statistics;
  const classification = result.sampleClassification;

  const missingDraws = Math.max(0, totalDraws - recordedDrawsCount);

  return (
    <div className="bg-white border border-[#E9E6E0] rounded-lg p-4 sm:p-7 shadow-xs space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-[#E9E6E0]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm sm:text-base font-semibold text-[#292929] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#B52E45]" aria-hidden="true" />
              <span>Statistical Analysis & Sample Reliability</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F7F6F2] border border-[#E9E6E0] text-[#292929]">
              {classification.title}
            </span>
          </div>
          <p className="text-xs text-[#74716D] mt-1">
            {classification.message}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGuideOpen(!isGuideOpen)}
          className="self-start sm:self-auto min-h-[36px] px-3 py-1.5 rounded-md border border-[#E9E6E0] bg-[#FAF9F5] hover:bg-[#F2EFE9] text-xs font-medium text-[#5C5853] hover:text-[#292929] transition-colors flex items-center gap-1.5 cursor-pointer touch-manipulation"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#BE9B57]" aria-hidden="true" />
          <span>How reliable is my average?</span>
          {isGuideOpen ? (
            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      {isGuideOpen && (
        <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#E9E6E0] text-xs text-[#5C5853] space-y-3 animate-in fade-in duration-200">
          <h4 className="font-semibold text-[#292929] text-sm">
            Understanding Your Gacha Statistics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <strong className="text-[#292929] block">Why more draws improve your sample</strong>
              <p className="leading-relaxed">
                Early gacha draws are dominated by short-term RNG swings. A lucky duplicate or an unlucky streak of low drops heavily skews small samples. As draws increase, the sample mean converges toward your true expected yield.
              </p>
            </div>
            <div className="space-y-1.5">
              <strong className="text-[#292929] block">What sample standard deviation measures</strong>
              <p className="leading-relaxed">
                Standard deviation reflects how much your individual draw yields vary around your mean. High variation indicates wide fluctuations between pulls, while low variation indicates consistent token amounts.
              </p>
            </div>
            <div className="space-y-1.5">
              <strong className="text-[#292929] block">What the 95% confidence interval represents</strong>
              <p className="leading-relaxed">
                The 95% confidence interval reflects uncertainty around your estimated long-run average. It does not predict what your exact next draw will give; rather, it indicates the plausible range for your true average rate.
              </p>
            </div>
            <div className="space-y-1.5">
              <strong className="text-[#292929] block">Why large samples do not guarantee future luck</strong>
              <p className="leading-relaxed">
                Each draw is an independent random trial (subject to event drop mechanics). A 120-draw history gives a solid empirical picture of your past results, but does not alter future random outcomes.
              </p>
            </div>
          </div>
        </div>
      )}

      {missingDraws > 0 && (
        <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E9E6E0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#BE9B57] shrink-0" aria-hidden="true" />
            <span className="text-[#5C5853]">
              <strong className="text-[#292929]">{recordedDrawsCount} individual draws</strong> recorded out of {totalDraws} total completed draws ({missingDraws} unlogged).
            </span>
          </div>
          <span className="text-[11px] text-[#74716D]">
            Statistical variation is computed exclusively from logged individual draws.
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pb-5 border-b border-[#E9E6E0]">
        <div className="p-3 rounded-md bg-[#F7F6F2] border border-[#E9E6E0]">
          <span className="text-[11px] text-[#74716D] block">Sample Mean</span>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-[#292929] tabular-nums">
            {stats && stats.mean !== null ? stats.mean.toFixed(2) : '—'}
            <span className="text-xs font-normal text-[#74716D] ml-1">/ draw</span>
          </div>
          <span className="text-[10px] text-[#98948D] block mt-0.5">Direct + duplicates</span>
        </div>

        <div className="p-3 rounded-md bg-[#F7F6F2] border border-[#E9E6E0]">
          <span className="text-[11px] text-[#74716D] block">Median & Range</span>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-[#292929] tabular-nums">
            {stats && stats.median !== null ? stats.median.toFixed(1) : '—'}
            <span className="text-xs font-normal text-[#74716D] ml-1">
              ({stats?.min ?? '—'}–{stats?.max ?? '—'})
            </span>
          </div>
          <span className="text-[10px] text-[#98948D] block mt-0.5">Middle draw outcome</span>
        </div>

        <div className="p-3 rounded-md bg-[#F7F6F2] border border-[#E9E6E0]">
          <span className="text-[11px] text-[#74716D] block">Sample Std. Dev (s)</span>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-[#292929] tabular-nums">
            {stats && stats.sampleStandardDeviation !== null
              ? stats.sampleStandardDeviation.toFixed(2)
              : '—'}
          </div>
          <span className="text-[10px] text-[#98948D] block mt-0.5">Draw-to-draw variance</span>
        </div>

        <div className="p-3 rounded-md bg-[#F7F6F2] border border-[#E9E6E0]">
          <span className="text-[11px] text-[#74716D] block">Standard Error (SE)</span>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-[#292929] tabular-nums">
            {stats && stats.standardError !== null ? stats.standardError.toFixed(2) : '—'}
          </div>
          <span className="text-[10px] text-[#98948D] block mt-0.5">Estimation uncertainty</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-lg bg-[#FAF9F5] border border-[#E9E6E0] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-[#292929] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#BE9B57]" aria-hidden="true" />
              <span>95% Confidence Interval for Mean Yield</span>
            </span>
            <p className="text-xs text-[#74716D] mt-0.5">
              Two-sided Student's t distribution with {stats ? stats.degreesOfFreedom : 0} degrees of freedom (t = {stats?.tCritical?.toFixed(4) ?? '—'}).
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#74716D] block">Estimated Range</span>
            <span className="font-mono text-base sm:text-lg font-bold text-[#292929] tabular-nums">
              {stats && stats.ciLower !== null && stats.ciUpper !== null
                ? `${stats.ciLower.toFixed(2)} – ${stats.ciUpper.toFixed(2)}`
                : 'Need ≥ 2 draws'}
            </span>
          </div>
        </div>

        {stats && stats.ciLower !== null && stats.ciUpper !== null && (
          <div className="space-y-3 pt-2 border-t border-[#E9E6E0]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {stats.benchmarkComparisons.map((comp) => {
                const badgeColor =
                  comp.status === 'above'
                    ? 'text-[#1E7E4E] bg-[#EDF7F1] border-[#C7E9D5]'
                    : comp.status === 'below'
                    ? 'text-[#B52E45] bg-[#FDF2F4] border-[#F8D2D9]'
                    : comp.status === 'crosses'
                    ? 'text-[#A16207] bg-[#FEF9EE] border-[#F6E2B6]'
                    : 'text-[#74716D] bg-[#F7F6F2] border-[#E9E6E0]';

                return (
                  <div
                    key={comp.name}
                    className="p-3 rounded-md bg-white border border-[#E9E6E0] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#292929]">{comp.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${badgeColor}`}>
                        {comp.status === 'above'
                          ? 'Above CI'
                          : comp.status === 'below'
                          ? 'Below CI'
                          : comp.status === 'crosses'
                          ? 'Uncertain'
                          : 'Pending'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#74716D] block font-mono">
                      Target: {comp.benchmarkRate.toFixed(2)} / draw
                    </span>
                    <p className="text-[11px] text-[#5C5853] leading-relaxed">
                      {comp.message}
                    </p>
                  </div>
                );
              })}
            </div>

            {stats.bootstrapCILower !== null && stats.bootstrapCIUpper !== null && (
              <div className="text-[11px] text-[#74716D] flex items-center justify-between pt-1">
                <span>Supplementary Bootstrap 95% Percentile CI (2,000 resamples):</span>
                <span className="font-mono font-medium text-[#292929]">
                  {stats.bootstrapCILower.toFixed(2)} – {stats.bootstrapCIUpper.toFixed(2)} / draw
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
