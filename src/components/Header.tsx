import React from 'react';
import { RotateCcw } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

interface HeaderProps {
  onResetClick: () => void;
  hasDataToReset: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onResetClick, hasDataToReset }) => {
  return (
    <header className="bg-white border-b border-[#E9E6E0] sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#292929]">
              Kagura Ashen Remnant Tracker
            </h1>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#BE9B57]" aria-hidden="true" />
            <span className="text-xs font-medium text-[#B52E45] bg-[#FDF2F4] px-2 py-0.5 rounded border border-[#F8D2D9]">
              {EVENT_CONFIG.eventSubtitle}
            </span>
          </div>
          <p className="text-xs text-[#74716D] mt-0.5">
            Mobile Legends: Bang Bang Legend Skin event companion
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0">
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
