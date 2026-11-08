import React, { useEffect, useState } from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

export type ResetScope = 'all' | 'calc' | 'tipid' | 'budget';

interface ResetConfirmModalProps {
  isOpen: boolean;
  defaultScope?: ResetScope;
  onClose: () => void;
  onConfirm: (scope: ResetScope) => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  defaultScope = 'all',
  onClose,
  onConfirm,
}) => {
  const [scope, setScope] = useState<ResetScope>(defaultScope);

  useEffect(() => {
    setScope(defaultScope);
  }, [defaultScope, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-md max-h-[92vh] flex flex-col rounded-xl bg-white border border-[#E9E6E0] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 border-b border-[#E9E6E0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 text-[#B52E45]">
            <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <h3 id="modal-title" className="font-semibold text-[#292929] text-base">
              Reset Confirmation
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#74716D] hover:text-[#292929] hover:bg-[#F7F6F2] transition-colors cursor-pointer touch-manipulation"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-3.5 sm:space-y-4 text-xs text-[#5C5853] overflow-y-auto">
          <p className="text-xs text-[#74716D]">
            Select which section data you wish to reset. Other sections will remain untouched.
          </p>

          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F6F2] border border-[#E9E6E0] cursor-pointer hover:border-[#D5D0C5] transition-colors touch-manipulation">
              <input
                type="radio"
                name="reset-scope"
                aria-label="Reset All Tracker Data"
                checked={scope === 'all'}
                onChange={() => setScope('all')}
                className="accent-[#B52E45] w-4 h-4 shrink-0"
              />
              <div>
                <span className="font-semibold text-[#292929] block text-xs">Reset All Tracker Data</span>
                <span className="text-[11px] text-[#74716D]">Clears calculator inputs, checklist progress, and purchase records.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F6F2] border border-[#E9E6E0] cursor-pointer hover:border-[#D5D0C5] transition-colors touch-manipulation">
              <input
                type="radio"
                name="reset-scope"
                aria-label="Reset Remnant Calculator Only"
                checked={scope === 'calc'}
                onChange={() => setScope('calc')}
                className="accent-[#B52E45] w-4 h-4 shrink-0"
              />
              <div>
                <span className="font-semibold text-[#292929] block text-xs">Reset Remnant Calculator Only</span>
                <span className="text-[11px] text-[#74716D]">Clears draws and remnants inputs. Preserves your Tipid Plan checklist.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F6F2] border border-[#E9E6E0] cursor-pointer hover:border-[#D5D0C5] transition-colors touch-manipulation">
              <input
                type="radio"
                name="reset-scope"
                aria-label="Reset Daily Tipid Plan Only"
                checked={scope === 'tipid'}
                onChange={() => setScope('tipid')}
                className="accent-[#B52E45] w-4 h-4 shrink-0"
              />
              <div>
                <span className="font-semibold text-[#292929] block text-xs">Reset Daily Tipid Plan Only</span>
                <span className="text-[11px] text-[#74716D]">Restores all 31 days to pending state. Preserves remnant calculator data.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F6F2] border border-[#E9E6E0] cursor-pointer hover:border-[#D5D0C5] transition-colors touch-manipulation">
              <input
                type="radio"
                name="reset-scope"
                aria-label="Reset Budget & Purchases Only"
                checked={scope === 'budget'}
                onChange={() => setScope('budget')}
                className="accent-[#B52E45] w-4 h-4 shrink-0"
              />
              <div>
                <span className="font-semibold text-[#292929] block text-xs">Reset Budget & Purchases Only</span>
                <span className="text-[11px] text-[#74716D]">Clears custom real-money purchase entries and Promo balances.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-[#F7F6F2] border-t border-[#E9E6E0] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-4 py-2 rounded-md border border-[#E9E6E0] bg-white hover:bg-[#F7F6F2] text-xs font-semibold text-[#5C5853] hover:text-[#292929] transition-colors cursor-pointer touch-manipulation text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(scope);
              onClose();
            }}
            className="min-h-[40px] px-4 py-2 rounded-md bg-[#B52E45] hover:bg-[#9E243A] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Confirm Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
