import React from 'react';
import {
  BarChart3,
  Dices,
  Coins,
  DollarSign,
  Compass,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { CalculationResult, TipidPlanState } from '../types/tracker';
import { EVENT_CONFIG } from '../config/eventConfig';

interface PlanVsActualDashboardProps {
  calculationResult: CalculationResult;
  tipidState: TipidPlanState;
}

export const PlanVsActualDashboard: React.FC<PlanVsActualDashboardProps> = ({
  calculationResult,
  tipidState,
}) => {
  const tasks = tipidState.tasks || [];
  const purchases = tipidState.purchases || [];

  const completedOrModifiedTasks = tasks.filter(
    (t) => t.status === 'completed' || t.status === 'modified'
  );

  const plannedDrawsToDate = completedOrModifiedTasks.reduce((sum, t) => sum + t.plannedDraws, 0);
  const actualDrawsCompleted = completedOrModifiedTasks.reduce((sum, t) => sum + t.actualDraws, 0);
  const totalPlannedEventDraws = tasks.reduce((sum, t) => sum + t.plannedDraws, 0);

  const drawDiff = actualDrawsCompleted - plannedDrawsToDate;
  const drawCompletionPct = totalPlannedEventDraws > 0
    ? Math.min(100, (actualDrawsCompleted / totalPlannedEventDraws) * 100)
    : 0;

  const plannedBlueDiamondsToDate = completedOrModifiedTasks.reduce(
    (sum, t) => sum + t.plannedBlueDiamonds,
    0
  );
  const actualBlueDiamondsSpent = completedOrModifiedTasks.reduce(
    (sum, t) => sum + t.actualBlueDiamonds,
    0
  );
  const totalPlannedBlue = 2348;
  const diamondDiff = plannedBlueDiamondsToDate - actualBlueDiamondsSpent;
  const actualPromoUsed = completedOrModifiedTasks.reduce((sum, t) => sum + t.actualPromoDiamonds, 0);

  const totalDiamondsPurchased = purchases.reduce((sum, p) => sum + p.diamondsReceived, 0);
  const remainingInGameDiamonds = Math.max(0, totalDiamondsPurchased - actualBlueDiamondsSpent);

  const plannedPhpMax = 2392.63;
  const actualPhpExpenditure = purchases.reduce((sum, p) => sum + p.actualPhp, 0);
  const remainingPhpBudget = plannedPhpMax - actualPhpExpenditure;
  const financialDiff = plannedPhpMax - actualPhpExpenditure;

  const narrativeInsights: string[] = [];

  if (completedOrModifiedTasks.length > 0) {
    if (drawDiff > 0) {
      narrativeInsights.push(`You are ${drawDiff} draw${drawDiff === 1 ? '' : 's'} ahead of your planned schedule for logged dates.`);
    } else if (drawDiff < 0) {
      narrativeInsights.push(`You are ${Math.abs(drawDiff)} draw${Math.abs(drawDiff) === 1 ? '' : 's'} behind your planned schedule for logged dates.`);
    } else {
      narrativeInsights.push(`Your actual draw pace matches your planned schedule.`);
    }

    if (diamondDiff > 0) {
      narrativeInsights.push(`You spent ${diamondDiff} fewer Blue Diamonds than expected so far.`);
    } else if (diamondDiff < 0) {
      narrativeInsights.push(`You spent ${Math.abs(diamondDiff)} more Blue Diamonds than originally projected.`);
    }
  }

  if (calculationResult.isValid && calculationResult.trueAverage !== null) {
    if (calculationResult.verdict === 'green') {
      narrativeInsights.push(
        `Your true average of ${calculationResult.trueAverage.toFixed(2)}/draw puts you above the 100-draw optimistic pace.`
      );
    } else if (calculationResult.verdict === 'blue') {
      narrativeInsights.push(
        `Your current remnant average of ${calculationResult.trueAverage.toFixed(2)} is within the 110-draw backup range.`
      );
    } else if (calculationResult.verdict === 'yellow') {
      narrativeInsights.push(
        `Your average of ${calculationResult.trueAverage.toFixed(2)} is in the 110–115 extended target cushion.`
      );
    } else if (calculationResult.verdict === 'red') {
      narrativeInsights.push(
        `Your remnant average of ${calculationResult.trueAverage.toFixed(2)} is below extended planning pace.`
      );
    }
  }

  if (purchases.length > 0) {
    if (remainingPhpBudget >= 0) {
      narrativeInsights.push(
        `You have ₱${remainingPhpBudget.toFixed(2)} remaining within your planned ₱${plannedPhpMax.toFixed(2)} budget ceiling.`
      );
    } else {
      narrativeInsights.push(
        `You are ₱${Math.abs(remainingPhpBudget).toFixed(2)} over the planned ₱${plannedPhpMax.toFixed(2)} budget ceiling.`
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E9E6E0]">
        <div>
          <span className="text-xs font-semibold text-[#B52E45]">
            Variance and audit
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#292929] flex items-center gap-2 mt-0.5">
            <BarChart3 className="w-5 h-5 text-[#BE9B57]" aria-hidden="true" />
            Plan vs. Actual Performance Dashboard
          </h2>
          <p className="text-xs text-[#74716D] mt-1">
            Cross-examines actual checklist progress and purchases against the master plan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-white border border-[#E9E6E0] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-[#74716D] mb-1">
              <span className="font-semibold text-[#292929]">Draw progress</span>
              <Dices className="w-4 h-4 text-[#B52E45]" aria-hidden="true" />
            </div>

            <div className="my-2">
              <div className="text-2xl font-bold text-[#292929] flex items-baseline justify-between tabular-nums">
                <span>{actualDrawsCompleted}</span>
                <span className="text-xs font-normal text-[#74716D]">
                  / {totalPlannedEventDraws} planned
                </span>
              </div>
              <div className="w-full bg-[#E9E6E0] rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div
                  className="bg-[#B52E45] h-full rounded-full transition-all duration-300"
                  style={{ width: `${drawCompletionPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E9E6E0] text-xs text-[#5C5853] space-y-1">
            <div className="flex justify-between">
              <span className="text-[#74716D]">Planned to date:</span>
              <span className="font-semibold text-[#292929] tabular-nums">{plannedDrawsToDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#74716D]">Schedule variance:</span>
              <span className={`font-semibold tabular-nums ${drawDiff >= 0 ? 'text-[#1E5D38]' : 'text-[#8E3146]'}`}>
                {drawDiff >= 0 ? `+${drawDiff} draws ahead` : `${drawDiff} draws behind`}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-white border border-[#E9E6E0] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-[#74716D] mb-1">
              <span className="font-semibold text-[#292929]">Diamond progress</span>
              <Coins className="w-4 h-4 text-[#BE9B57]" aria-hidden="true" />
            </div>

            <div className="my-2">
              <div className="text-2xl font-bold text-[#292929] flex items-baseline justify-between tabular-nums">
                <span>{actualBlueDiamondsSpent.toLocaleString()}</span>
                <span className="text-xs font-normal text-[#74716D]">
                  / {totalPlannedBlue.toLocaleString()} plan
                </span>
              </div>
              <div className="text-xs text-[#74716D] mt-1">
                Promo used: <strong className="font-semibold text-[#292929] tabular-nums">{actualPromoUsed}</strong>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E9E6E0] text-xs text-[#5C5853] space-y-1">
            <div className="flex justify-between">
              <span className="text-[#74716D]">Purchased diamonds:</span>
              <span className="font-semibold text-[#292929] tabular-nums">{totalDiamondsPurchased.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#74716D]">Inventory balance:</span>
              <span className="font-semibold text-[#292929] tabular-nums">{remainingInGameDiamonds.toLocaleString()} Dia</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-white border border-[#E9E6E0] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-[#74716D] mb-1">
              <span className="font-semibold text-[#292929]">Financial progress</span>
              <DollarSign className="w-4 h-4 text-[#1E5D38]" aria-hidden="true" />
            </div>

            <div className="my-2">
              <div className="text-2xl font-bold text-[#292929] tabular-nums">
                ₱{actualPhpExpenditure.toFixed(2)}
              </div>
              <span className="text-xs text-[#74716D]">
                Planned ceiling: ₱{plannedPhpMax.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E9E6E0] text-xs text-[#5C5853] space-y-1">
            <div className="flex justify-between">
              <span className="text-[#74716D]">Remaining budget:</span>
              <span className={`font-semibold tabular-nums ${remainingPhpBudget >= 0 ? 'text-[#1E5D38]' : 'text-[#8E3146]'}`}>
                ₱{remainingPhpBudget.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#74716D]">Variance:</span>
              <span className={`font-semibold tabular-nums ${financialDiff >= 0 ? 'text-[#1E5D38]' : 'text-[#8E3146]'}`}>
                {financialDiff >= 0 ? `₱${financialDiff.toFixed(2)} under` : `₱${Math.abs(financialDiff).toFixed(2)} over`}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-white border border-[#E9E6E0] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-[#74716D] mb-1">
              <span className="font-semibold text-[#292929]">Remnant progress</span>
              <Compass className="w-4 h-4 text-[#B52E45]" aria-hidden="true" />
            </div>

            <div className="my-2">
              <div className="text-2xl font-bold text-[#292929] flex items-baseline justify-between tabular-nums">
                <span>{calculationResult.currentRemnants}</span>
                <span className="text-xs font-normal text-[#74716D]">
                  / {EVENT_CONFIG.requiredRemnants}
                </span>
              </div>
              <div className="text-xs text-[#74716D] mt-1">
                True average: <strong className="font-semibold text-[#292929] tabular-nums">{calculationResult.trueAverage !== null ? `${calculationResult.trueAverage.toFixed(2)}/draw` : '—'}</strong>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E9E6E0] text-xs text-[#5C5853] space-y-1">
            <div className="flex justify-between">
              <span className="text-[#74716D]">Current pace:</span>
              <span className="font-semibold text-[#292929]">{calculationResult.verdictTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#74716D]">Estimated total draws:</span>
              <span className="font-semibold text-[#292929] tabular-nums">
                {calculationResult.estimatedTotalDraws !== null ? `~${calculationResult.estimatedTotalDraws}` : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-lg bg-white border border-[#E9E6E0] space-y-3">
        <h3 className="text-sm font-semibold text-[#292929] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#B52E45]" aria-hidden="true" />
          Data-driven narrative analysis
        </h3>

        {narrativeInsights.length > 0 ? (
          <div className="space-y-2 text-xs text-[#292929]">
            {narrativeInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-md bg-[#F7F6F2] border border-[#E9E6E0]">
                <CheckCircle2 className="w-4 h-4 text-[#1E5D38] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed">{insight}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#74716D]">
            Log your daily checklist tasks or purchases to generate real-time comparison insights.
          </p>
        )}
      </div>
    </div>
  );
};
