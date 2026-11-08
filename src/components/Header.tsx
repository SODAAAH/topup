import React from 'react';
import { RotateCcw } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

interface HeaderProps {
  onResetClick: () => void;
  hasDataToReset: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onResetClick,
  hasDataToReset,
}) => {
  return (
    <header className="bg-white border-b border-[#E9E6E0] sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#292929]">
            Kagura Ashen Remnant Tracker
          </h1>
          <p className="text-xs text-[#74716D] mt-0.5">
            Mobile Legends: Bang Bang event companion
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-md bg-[#F7F6F2] border border-[#E9E6E0] text-xs font-medium text-[#5C5853] flex items-center gap-1.5">
            <span className="text-[#98948D]">Goal:</span>
            <strong className="text-[#292929] font-semibold tabular-nums">{EVENT_CONFIG.requiredRemnants.toLocaleString()} Remnants</strong>
          </div>

          <button
            type="button"
            onClick={onResetClick}
            disabled={!hasDataToReset}
            className="min-h-[36px] px-3 py-1.5 rounded-md border border-[#E9E6E0] hover:bg-[#F7F6F2] text-xs font-medium text-[#74716D] hover:text-[#292929] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer touch-manipulation"
            title="Reset tracker inputs"
            aria-label="Reset tracker inputs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#98948D]" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
