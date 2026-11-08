import React from 'react';
import { AlertCircle, Link2, Edit3 } from 'lucide-react';
import { DrawSourceMode, TrackerInputs } from '../types/tracker';

interface CalculatorFormProps {
  inputs: TrackerInputs;
  ledgerDraws: number;
  onChange: (inputs: TrackerInputs) => void;
  onCalculate: () => void;
  validationError?: string;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  inputs,
  ledgerDraws,
  onChange,
  onCalculate,
  validationError,
}) => {
  const mode: DrawSourceMode = inputs.drawSourceMode || 'manual';

  const handleModeChange = (newMode: DrawSourceMode) => {
    if (newMode === 'ledger') {
      onChange({
        ...inputs,
        drawSourceMode: 'ledger',
        draws: ledgerDraws,
      });
    } else {
      onChange({
        ...inputs,
        drawSourceMode: 'manual',
      });
    }
  };

  const handleDrawsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mode === 'ledger') return;
    const val = e.target.value;
    if (val === '') {
      onChange({ ...inputs, draws: '' });
      return;
    }
    const parsed = parseInt(val, 10);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      onChange({ ...inputs, draws: parsed });
    }
  };

  const handleRemnantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange({ ...inputs, remnants: '' });
      return;
    }
    const parsed = parseInt(val, 10);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      onChange({ ...inputs, remnants: parsed });
    }
  };

  const addDraws = (amount: number) => {
    if (mode === 'ledger') return;
    const current = typeof inputs.draws === 'number' ? inputs.draws : 0;
    onChange({ ...inputs, draws: Math.max(0, current + amount) });
  };

  const addRemnants = (amount: number) => {
    const current = typeof inputs.remnants === 'number' ? inputs.remnants : 0;
    onChange({ ...inputs, remnants: Math.max(0, current + amount) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#E9E6E0] rounded-lg p-4 sm:p-7 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-[#E9E6E0]">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[#292929]">
            Calculator inputs
          </h3>
          <p className="text-xs text-[#74716D] mt-0.5">
            Enter your draw count and remnants balance to evaluate your pacing.
          </p>
        </div>

        <div className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex rounded-md bg-[#F4F2EC] p-0.5 border border-[#E9E6E0] text-xs">
          <button
            type="button"
            onClick={() => handleModeChange('manual')}
            className={`min-h-[38px] px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation ${
              mode === 'manual'
                ? 'bg-white text-[#292929] shadow-xs font-semibold'
                : 'text-[#74716D] hover:text-[#292929]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Manual input</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('ledger')}
            className={`min-h-[38px] px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation ${
              mode === 'ledger'
                ? 'bg-white text-[#292929] shadow-xs font-semibold'
                : 'text-[#74716D] hover:text-[#292929]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-[#B52E45]" aria-hidden="true" />
            <span>Synced from plan ({ledgerDraws})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-5">
        <div>
          <label
            htmlFor="draws-input"
            className="block text-xs font-semibold text-[#292929] mb-1.5 flex items-center justify-between"
          >
            <span>Draws completed</span>
            {mode === 'ledger' ? (
              <span className="text-[11px] font-medium text-[#1D64C2]">
                Synced from daily plan
              </span>
            ) : (
              <span className="text-[11px] font-normal text-[#98948D]">
                Total pulls
              </span>
            )}
          </label>
          <input
            id="draws-input"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={inputs.draws}
            onChange={handleDrawsChange}
            readOnly={mode === 'ledger'}
            placeholder="Enter your total draws"
            aria-label="Draws completed"
            aria-describedby="draws-help"
            className={`w-full px-3.5 py-3 sm:py-2.5 rounded-md border text-sm font-mono tabular-nums transition-colors min-h-[44px] ${
              mode === 'ledger'
                ? 'bg-[#F7F6F2] border-[#E9E6E0] text-[#74716D] cursor-not-allowed'
                : 'bg-white border-[#E9E6E0] text-[#292929] focus:outline-none focus:border-[#B52E45] focus:ring-1 focus:ring-[#B52E45]'
            }`}
          />
          <p id="draws-help" className="mt-1 text-xs text-[#74716D]">
            {mode === 'ledger'
              ? `Derived from ${ledgerDraws} actual completed draws logged in your Tipid Plan.`
              : 'Number of event draws pulled so far.'}
          </p>
          {mode === 'manual' && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-[#98948D] mr-0.5">Quick add:</span>
              <button
                type="button"
                onClick={() => addDraws(1)}
                className="px-2.5 py-1 rounded bg-[#F7F6F2] hover:bg-[#EFECE6] border border-[#E9E6E0] text-xs font-mono font-medium text-[#292929] transition-colors cursor-pointer touch-manipulation"
                title="Add 1 draw"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => addDraws(10)}
                className="px-2.5 py-1 rounded bg-[#F7F6F2] hover:bg-[#EFECE6] border border-[#E9E6E0] text-xs font-mono font-medium text-[#292929] transition-colors cursor-pointer touch-manipulation"
                title="Add 10 draws"
              >
                +10
              </button>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="remnants-input"
            className="block text-xs font-semibold text-[#292929] mb-1.5 flex items-center justify-between"
          >
            <span>Current Ashen Remnants</span>
            <span className="text-[11px] font-normal text-[#98948D]">
              Goal: 1,600
            </span>
          </label>
          <input
            id="remnants-input"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={inputs.remnants}
            onChange={handleRemnantsChange}
            placeholder="Enter your current remnants"
            aria-label="Current Ashen Remnants"
            aria-describedby="remnants-help"
            className="w-full px-3.5 py-3 sm:py-2.5 rounded-md border border-[#E9E6E0] bg-white text-[#292929] text-sm font-mono tabular-nums focus:outline-none focus:border-[#B52E45] focus:ring-1 focus:ring-[#B52E45] transition-colors min-h-[44px]"
          />
          <p id="remnants-help" className="mt-1 text-xs text-[#74716D]">
            Current remnant tokens in your in-game bag.
          </p>
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[#98948D] mr-0.5">Quick add:</span>
            {[3, 10, 20, 50, 80, 200, 400].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => addRemnants(amount)}
                className="px-2 py-1 rounded bg-[#F7F6F2] hover:bg-[#EFECE6] border border-[#E9E6E0] text-xs font-mono font-medium text-[#292929] transition-colors cursor-pointer touch-manipulation"
                title={`Add ${amount} remnants`}
              >
                +{amount}
              </button>
            ))}
          </div>
        </div>
      </div>

      {validationError && (
        <div className="mt-4 p-3 rounded-md bg-[#FDF2F4] border border-[#F8D2D9] text-xs text-[#B52E45] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{validationError}</span>
        </div>
      )}
    </form>
  );
};
