import React from 'react';
import { Download, Upload } from 'lucide-react';
import { ActiveTab } from '../types/tracker';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onExport: () => void;
  onImportClick: () => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  onExport,
  onImportClick,
}) => {
  const tabs: Array<{ id: ActiveTab; label: string }> = [
    { id: 'tracker', label: 'Remnant Tracker' },
    { id: 'draw-history', label: 'Draw History & Stats' },
    { id: 'tipid-plan', label: 'Daily Tipid Plan' },
    { id: 'diamond-budget', label: 'Diamond & Budget' },
    { id: 'plan-vs-actual', label: 'Plan vs. Actual' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 border-b border-[#E9E6E0] pt-1">
      <nav
        className="flex items-center gap-1 sm:gap-2 overflow-x-auto flex-1 min-w-0 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 touch-manipulation"
        aria-label="Main Navigation"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-3 sm:px-4 py-2.5 min-h-[42px] text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer touch-manipulation flex items-center ${
                isActive
                  ? 'border-[#B52E45] text-[#B52E45] font-semibold'
                  : 'border-transparent text-[#74716D] hover:text-[#292929] hover:border-[#D5D0C5]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 pb-2 sm:pb-0 shrink-0 self-end sm:self-auto">
        <button
          type="button"
          onClick={onExport}
          className="min-h-[36px] px-2.5 py-1.5 rounded-md border border-[#E9E6E0] hover:bg-white text-xs font-medium text-[#74716D] hover:text-[#292929] transition-colors flex items-center gap-1.5 cursor-pointer bg-[#F7F6F2] touch-manipulation"
          title="Export JSON backup"
        >
          <Download className="w-3.5 h-3.5 text-[#98948D]" aria-hidden="true" />
          <span>Export</span>
        </button>

        <button
          type="button"
          onClick={onImportClick}
          className="min-h-[36px] px-2.5 py-1.5 rounded-md border border-[#E9E6E0] hover:bg-white text-xs font-medium text-[#74716D] hover:text-[#292929] transition-colors flex items-center gap-1.5 cursor-pointer bg-[#F7F6F2] touch-manipulation"
          title="Import JSON backup"
        >
          <Upload className="w-3.5 h-3.5 text-[#98948D]" aria-hidden="true" />
          <span>Import</span>
        </button>
      </div>
    </div>
  );
};
