import React from 'react';
import { RotateCcw, Download, Upload } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

interface HeaderProps {
  onResetClick: () => void;
  hasDataToReset: boolean;
  onExportBackup?: () => void;
  onImportBackup?: (file: File) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onResetClick,
  hasDataToReset,
  onExportBackup,
  onImportBackup,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportBackup) {
      onImportBackup(file);
      e.target.value = '';
    }
  };

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

        <div className="flex items-center gap-2">
          <div className="hidden md:flex px-3 py-1.5 rounded-md bg-[#F7F6F2] border border-[#E9E6E0] text-xs font-medium text-[#5C5853] items-center gap-1.5">
            <span className="text-[#98948D]">Goal:</span>
            <strong className="text-[#292929] font-semibold tabular-nums">{EVENT_CONFIG.requiredRemnants.toLocaleString()} Remnants</strong>
          </div>

          {onExportBackup && (
            <button
              type="button"
              onClick={onExportBackup}
              className="min-h-[36px] px-2.5 py-1.5 rounded-md border border-[#E9E6E0] hover:bg-[#F7F6F2] text-xs font-medium text-[#74716D] hover:text-[#292929] transition-colors flex items-center gap-1.5 cursor-pointer touch-manipulation"
              title="Export backup data"
              aria-label="Export backup data"
            >
              <Download className="w-3.5 h-3.5 text-[#98948D]" aria-hidden="true" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          {onImportBackup && (
            <label
              className="min-h-[36px] px-2.5 py-1.5 rounded-md border border-[#E9E6E0] hover:bg-[#F7F6F2] text-xs font-medium text-[#74716D] hover:text-[#292929] transition-colors flex items-center gap-1.5 cursor-pointer touch-manipulation"
              title="Import backup data"
              aria-label="Import backup data"
            >
              <Upload className="w-3.5 h-3.5 text-[#98948D]" aria-hidden="true" />
              <span className="hidden sm:inline">Import</span>
              <input
                type="file"
                accept=".json,application/json"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
          )}

          <button
            type="button"
            onClick={onResetClick}
            disabled={!hasDataToReset}
            className="min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-md border border-[#E9E6E0] hover:bg-[#F7F6F2] text-xs font-medium text-[#74716D] hover:text-[#292929] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer touch-manipulation"
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
