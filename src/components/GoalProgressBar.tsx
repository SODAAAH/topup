import React from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

interface GoalProgressBarProps {
  currentRemnants: number;
  remnantsRemaining: number;
  progressPercentage: number;
  isGoalReached: boolean;
}

export const GoalProgressBar: React.FC<GoalProgressBarProps> = ({
  currentRemnants,
  remnantsRemaining,
  progressPercentage,
  isGoalReached,
}) => {
  return (
    <div className="bg-white border border-[#E9E6E0] rounded-lg p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          {isGoalReached ? (
            <Trophy className="w-4 h-4 text-[#BE9B57] shrink-0" aria-hidden="true" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#B52E45] shrink-0" aria-hidden="true" />
          )}
          <span className="text-xs font-semibold text-[#292929]">
            Goal progress to {EVENT_CONFIG.requiredRemnants.toLocaleString()} Remnants
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-[#74716D]">
            <strong className="text-[#292929] font-mono tabular-nums font-semibold">
              {currentRemnants.toLocaleString()}
            </strong>{' '}
            / {EVENT_CONFIG.requiredRemnants.toLocaleString()}
          </span>
          <span className="font-mono font-bold text-[#B52E45] tabular-nums">
            {progressPercentage}%
          </span>
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuenow={currentRemnants}
        aria-valuemin={0}
        aria-valuemax={EVENT_CONFIG.requiredRemnants}
        aria-label="Progress to 1,600 Ashen Remnants"
        className="w-full bg-[#F0EDE6] rounded-full h-2.5 overflow-hidden"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isGoalReached ? 'bg-[#BE9B57]' : 'bg-[#B52E45]'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 text-[11px] text-[#98948D]">
        <span>0 remnants</span>
        <span>
          {isGoalReached ? (
            <strong className="text-[#1E7E4E] font-medium">Ready to claim skin</strong>
          ) : (
            `${remnantsRemaining.toLocaleString()} remnants remaining`
          )}
        </span>
        <span>{EVENT_CONFIG.requiredRemnants.toLocaleString()} remnants</span>
      </div>
    </div>
  );
};

