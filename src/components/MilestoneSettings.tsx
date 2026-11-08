import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckSquare, Square, Lock } from 'lucide-react';
import { MilestoneStatus } from '../types/tracker';

interface MilestoneSettingsProps {
  milestones: MilestoneStatus[];
  claimedMilestonesBonus: number;
  unclaimedUnlockedBonus: number;
  draws: number;
  onToggleMilestone: (id: string, claimed: boolean) => void;
  onResetMilestones: () => void;
}

export const MilestoneSettings: React.FC<MilestoneSettingsProps> = ({
  milestones,
  claimedMilestonesBonus,
  unclaimedUnlockedBonus,
  draws,
  onToggleMilestone,
  onResetMilestones,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-[#E9E6E0] rounded-lg overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-[#F7F6F2] transition-colors text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <div>
          <span className="text-xs font-semibold text-[#292929]">
            Milestone settings
          </span>
          <span className="ml-2 text-xs text-[#74716D]">
            (Optional claim accuracy)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-[#74716D] hidden sm:block">
            <span>Claimed: <strong className="text-[#292929] font-mono tabular-nums">{claimedMilestonesBonus}</strong></span>
            {unclaimedUnlockedBonus > 0 && (
              <span className="ml-2 text-[#B52E45] font-semibold">
                (Unclaimed: +{unclaimedUnlockedBonus})
              </span>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-[#98948D]" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#98948D]" aria-hidden="true" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-[#E9E6E0] space-y-4 bg-[#FBFBFA]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5C5853] bg-white p-3 rounded border border-[#E9E6E0]">
            <p>
              By default, unlocked milestones are assumed collected in your inventory.
              Uncheck any milestone you have <strong>not yet claimed</strong> in-game so it is not subtracted from your pull average.
            </p>
            <button
              type="button"
              onClick={onResetMilestones}
              className="text-[#B52E45] hover:underline font-medium shrink-0 cursor-pointer self-start sm:self-center"
            >
              Reset to default
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {milestones.map((m) => {
              const isUnlocked = m.unlocked;
              const isClaimed = m.claimed;

              return (
                <div
                  key={m.id}
                  className={`p-3 rounded border text-xs transition-colors ${
                    !isUnlocked
                      ? 'bg-[#F7F6F2] border-[#E9E6E0] opacity-50'
                      : isClaimed
                      ? 'bg-white border-[#E9E6E0]'
                      : 'bg-[#FDF2F4] border-[#F8D2D9]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-semibold text-[#292929]">{m.threshold} draws</span>
                    <span className="text-[#B52E45] font-bold">+{m.reward}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#E9E6E0] flex items-center justify-between text-[11px]">
                    {!isUnlocked ? (
                      <span className="text-[#98948D] flex items-center gap-1">
                        <Lock className="w-3 h-3" aria-hidden="true" />
                        Locked ({draws}/{m.threshold})
                      </span>
                    ) : (
                      <label className="flex items-center gap-1.5 cursor-pointer select-none text-[#292929] font-medium">
                        <input
                          type="checkbox"
                          checked={isClaimed}
                          onChange={(e) => onToggleMilestone(m.id, e.target.checked)}
                          className="sr-only"
                        />
                        {isClaimed ? (
                          <CheckSquare className="w-3.5 h-3.5 text-[#1E7E4E]" aria-hidden="true" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-[#B52E45]" aria-hidden="true" />
                        )}
                        <span>{isClaimed ? 'Claimed' : 'Unclaimed'}</span>
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#74716D] pt-2 border-t border-[#E9E6E0]">
            <span>Included in inventory: <strong className="text-[#292929] font-mono tabular-nums">{claimedMilestonesBonus}</strong> remnants</span>
            <span>Unclaimed available: <strong className="text-[#B52E45] font-mono tabular-nums">{unclaimedUnlockedBonus}</strong> remnants</span>
            <span>Total event bonus: <strong className="text-[#292929] font-mono tabular-nums">105</strong> remnants</span>
          </div>
        </div>
      )}
    </div>
  );
};
