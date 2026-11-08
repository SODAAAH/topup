import React, { useState } from 'react';
import {
  Coins,
  Sparkles,
  DollarSign,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Sliders,
} from 'lucide-react';
import { PurchaseRecord, TipidPlanState } from '../types/tracker';

interface DiamondBudgetTrackerProps {
  state: TipidPlanState;
  actualBlueSpentFromTasks: number;
  actualPromoSpentFromTasks: number;
  onUpdateState: (updates: Partial<TipidPlanState>) => void;
  onResetBudget: () => void;
}

export const DiamondBudgetTracker: React.FC<DiamondBudgetTrackerProps> = ({
  state,
  actualBlueSpentFromTasks,
  actualPromoSpentFromTasks,
  onUpdateState,
  onResetBudget,
}) => {
  const [newPurchaseDate, setNewPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPurchaseType, setNewPurchaseType] = useState('Weekly Diamond Pass');
  const [newPurchaseDia, setNewPurchaseDia] = useState<number | ''>(210);
  const [newPurchasePhp, setNewPurchasePhp] = useState<number | ''>(112);
  const [newPurchaseNotes, setNewPurchaseNotes] = useState('');

  const nov24Exp = state.nov24Expenditure || 211;
  const extraCostPerDraw = state.extraDrawCostPerDraw || 50;

  const plannedBlue100Baseline = 237 + 1500 + 400 + 211;
  const plannedBlue100ActualNov24 = 237 + 1500 + 400 + nov24Exp;

  const extra10DrawsCost = extraCostPerDraw * 10;
  const plannedBlue110Baseline = plannedBlue100Baseline + 500;
  const plannedBlue110Actual = plannedBlue100ActualNov24 + extra10DrawsCost;

  const startingPromo = state.startingPromoDiamonds || 0;
  const promoReceived = 800;
  const totalPromoAvailable = startingPromo + promoReceived;
  const plannedPromoConsumption = 1600;
  const promoShortfall = Math.max(0, plannedPromoConsumption - totalPromoAvailable);
  const promoRemaining = Math.max(0, totalPromoAvailable - actualPromoSpentFromTasks);

  const plannedPhpMin = 2384.62;
  const plannedPhpMax = 2392.63;

  const purchases = state.purchases || [];
  const totalActualPhp = purchases.reduce((sum, p) => sum + p.actualPhp, 0);
  const totalDiamondsFromPurchases = purchases.reduce((sum, p) => sum + p.diamondsReceived, 0);

  const remainingPhpBudget = plannedPhpMax - totalActualPhp;
  const isOverBudget = totalActualPhp > plannedPhpMax;
  const budgetDifference = Math.abs(totalActualPhp - plannedPhpMax);

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPurchasePhp || newPurchasePhp <= 0) return;

    const record: PurchaseRecord = {
      id: `purch-${Date.now()}`,
      date: newPurchaseDate,
      rechargeType: newPurchaseType,
      diamondsReceived: Number(newPurchaseDia) || 0,
      actualPhp: Number(newPurchasePhp),
      notes: newPurchaseNotes,
    };

    onUpdateState({
      purchases: [record, ...purchases],
    });

    setNewPurchaseNotes('');
  };

  const handleDeletePurchase = (id: string) => {
    onUpdateState({
      purchases: purchases.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9E6E0]">
        <div>
          <span className="text-xs font-semibold text-[#B52E45]">
            Resource and expense ledger
          </span>
          <h2 className="text-lg sm:text-2xl font-bold text-[#292929] flex items-center gap-2 mt-0.5">
            <Coins className="w-5 h-5 text-[#BE9B57]" aria-hidden="true" />
            Diamond Budget & Real-Money Expense Tracker
          </h2>
          <p className="text-xs text-[#74716D] mt-1">
            Accounting ledger for normal pulls, Promo reserves, and out-of-pocket recharge tiers.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetBudget}
          className="self-start sm:self-auto min-h-[36px] px-3 py-1.5 rounded-md border border-[#E9E6E0] hover:bg-[#F7F6F2] text-xs font-medium text-[#74716D] hover:text-[#292929] transition-colors cursor-pointer touch-manipulation"
        >
          Reset budget data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div className="p-4 sm:p-5 rounded-lg bg-white border border-[#E9E6E0] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E6E0]">
            <h3 className="text-sm font-semibold text-[#292929] flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#B52E45]" aria-hidden="true" />
              Blue Diamond Consumption
            </h3>
            <span className="text-xs font-medium text-[#74716D] tabular-nums">
              Planned: 2,348–2,387
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-md bg-[#F7F6F2] border border-[#E9E6E0] gap-2">
              <span className="text-[#5C5853]">Mega Draw bundles (1×10, 1×49, 2×89)</span>
              <span className="font-semibold text-[#292929] tabular-nums shrink-0">237 Dia</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-md bg-[#F7F6F2] border border-[#E9E6E0] gap-2">
              <span className="text-[#5C5853]">Daily discounted draws (30 days × 50 Dia)</span>
              <span className="font-semibold text-[#292929] tabular-nums shrink-0">1,500 Dia</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-md bg-[#F7F6F2] border border-[#E9E6E0] gap-2">
              <span className="text-[#5C5853]">Phase 1 Blue draws (20 draws × 20 Dia)</span>
              <span className="font-semibold text-[#292929] tabular-nums shrink-0">400 Dia</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-md bg-[#F7F6F2] border border-[#E9E6E0] gap-2">
              <span className="text-[#5C5853]">Nov 24 Phase 2 single draws (211–250)</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <input
                  type="number"
                  inputMode="numeric"
                  min="211"
                  max="250"
                  value={nov24Exp}
                  onChange={(e) =>
                    onUpdateState({
                      nov24Expenditure: Math.max(211, Math.min(250, parseInt(e.target.value, 10) || 211)),
                    })
                  }
                  aria-label="Nov 24 Phase 2 single draws expenditure"
                  className="w-16 px-2 py-1 bg-white border border-[#E9E6E0] rounded text-center text-[#292929] font-semibold text-xs focus:outline-none focus:border-[#B52E45] tabular-nums"
                />
                <span className="text-[#98948D]">Dia</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-md bg-[#FDFCFB] border border-[#E9E6E0] flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-[#292929] block">Total 100-draw Blue Diamonds</span>
              <span className="text-[#74716D]">Source guide baseline: 2,348 Dia</span>
            </div>
            <span className="text-base font-bold text-[#B52E45] tabular-nums">
              {plannedBlue100ActualNov24} Dia
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E9E6E0] text-[#74716D]">
            <span>Recorded spent in checklist</span>
            <span className="font-semibold text-[#292929] tabular-nums">{actualBlueSpentFromTasks.toLocaleString()} Dia</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-lg bg-white border border-[#E9E6E0] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E6E0]">
            <h3 className="text-sm font-semibold text-[#292929] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#BE9B57]" aria-hidden="true" />
              Promo Diamond Balance & Shortfall
            </h3>
            <span className="text-xs font-medium text-[#74716D]">
              Tracked separately
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-md bg-[#F7F6F2] border border-[#E9E6E0] gap-2">
              <span className="text-[#5C5853]">Starting Promo Diamonds held</span>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={startingPromo || ''}
                onChange={(e) =>
                  onUpdateState({
                    startingPromoDiamonds: Math.max(0, parseInt(e.target.value, 10) || 0),
                  })
                }
                placeholder="0"
                aria-label="Starting Promo Diamonds held"
                className="w-20 px-2 py-1 bg-white border border-[#E9E6E0] rounded text-center text-[#292929] font-semibold text-xs focus:outline-none focus:border-[#B52E45] tabular-nums"
              />
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-md bg-[#F7F6F2] border border-[#E9E6E0] gap-2">
              <span className="text-[#5C5853]">Phase 1 recharge reward (1,000 tier)</span>
              <span className="font-semibold text-[#1E5D38] tabular-nums shrink-0">+800 Promo</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-md bg-[#F7F6F2] border border-[#E9E6E0] gap-2">
              <span className="text-[#5C5853]">Planned Phase 1 draw consumption (20 × 80)</span>
              <span className="font-semibold text-[#B52E45] tabular-nums shrink-0">1,600 Promo</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-md bg-[#F7F6F2] border border-[#E9E6E0] gap-2">
              <span className="text-[#5C5853]">Actual Promo spent from checklist</span>
              <span className="font-semibold text-[#292929] tabular-nums shrink-0">{actualPromoSpentFromTasks} Promo</span>
            </div>
          </div>

          <div className="p-3.5 rounded-md bg-[#FDFCFB] border border-[#E9E6E0] flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-[#292929] block">Promo Diamond status</span>
              <span className="text-[#74716D]">
                {promoShortfall > 0 ? 'Additional Promo required' : 'Sufficient balance available'}
              </span>
            </div>
            <span className={`text-base font-bold tabular-nums ${promoShortfall > 0 ? 'text-[#8E3146]' : 'text-[#1E5D38]'}`}>
              {promoShortfall > 0 ? `-${promoShortfall} Shortfall` : `+${promoRemaining} Ready`}
            </span>
          </div>

          <p className="text-[11px] text-[#74716D]">
            Promo Diamonds are strictly separated from Blue Diamonds to avoid misleading total counts.
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-lg bg-white border border-[#E9E6E0] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E9E6E0]">
          <div>
            <h3 className="text-sm font-semibold text-[#292929] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#BE9B57]" aria-hidden="true" />
              100-draw vs 110-draw spending comparison
            </h3>
            <p className="text-xs text-[#74716D] mt-0.5">
              Evaluates additional diamond requirements if the 110-draw backup target is utilized.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#5C5853] pt-1 sm:pt-0">
            <span>Extra draw cost:</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={extraCostPerDraw}
              onChange={(e) =>
                onUpdateState({
                  extraDrawCostPerDraw: Math.max(0, parseInt(e.target.value, 10) || 50),
                })
              }
              aria-label="Extra draw cost in diamonds per draw"
              className="w-16 px-2 py-1 bg-white border border-[#E9E6E0] rounded text-center text-[#292929] font-semibold text-xs focus:outline-none focus:border-[#B52E45] tabular-nums"
            />
            <span className="text-[#98948D]">Dia/draw</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E9E6E0]">
            <span className="text-xs font-semibold text-[#1E5D38] block mb-1">
              100 Draws (Optimistic)
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#292929] tabular-nums">
              {plannedBlue100Baseline.toLocaleString()}{' '}
              <span className="text-xs text-[#74716D] font-normal">Dia baseline</span>
            </div>
            <div className="mt-2 text-xs text-[#5C5853] space-y-1">
              <p>Possible range: <strong className="font-semibold text-[#292929] tabular-nums">2,348–2,387 Dia</strong></p>
              <p className="text-[#74716D]">Based on standard daily pulls plus Phase 1 and 2 free tokens.</p>
            </div>
          </div>

          <div className="p-4 rounded-md bg-[#F7F6F2] border border-[#E9E6E0]">
            <span className="text-xs font-semibold text-[#292929] block mb-1">
              110 Draws (Tipid Backup)
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#292929] tabular-nums">
              {plannedBlue110Baseline.toLocaleString()}{' '}
              <span className="text-xs text-[#74716D] font-normal">Dia baseline</span>
            </div>
            <div className="mt-2 text-xs text-[#5C5853] space-y-1">
              <p>Possible range: <strong className="font-semibold text-[#292929] tabular-nums">2,848–2,887 Dia</strong></p>
              <p className="text-[#74716D]">+500 Blue Diamonds (+10 draws @ {extraCostPerDraw} Dia/draw) over baseline.</p>
              <p className="text-[#74716D]">Adjusted with Nov 24 setting: <strong className="font-semibold text-[#292929] tabular-nums">{plannedBlue110Actual} Dia</strong></p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-lg bg-white border border-[#E9E6E0] space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9E6E0]">
          <div>
            <h3 className="text-sm font-semibold text-[#292929] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#1E5D38]" aria-hidden="true" />
              Real-money expense tracking (PHP)
            </h3>
            <p className="text-xs text-[#74716D] mt-0.5">
              Planned recharge out-of-pocket: ₱{plannedPhpMin.toLocaleString()} – ₱{plannedPhpMax.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs flex-wrap">
            <span className="text-[#74716D]">Recharged: <strong className="text-[#292929] tabular-nums">+{totalDiamondsFromPurchases.toLocaleString()} Dia</strong></span>
            <span className="text-[#D8D5CD]">|</span>
            <span className="text-[#74716D]">Actual paid:</span>
            <span className="text-base font-bold text-[#292929] tabular-nums">₱{totalActualPhp.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <div className="p-3 rounded-md bg-[#F7F6F2] border border-[#E9E6E0]">
            <span className="text-xs text-[#74716D] block">7 WDP passes (Days 1–7)</span>
            <span className="text-sm font-semibold text-[#292929] mt-0.5 block tabular-nums">₱784–₱791</span>
            <span className="text-[11px] text-[#98948D]">7 × ₱112–₱113 per pass</span>
          </div>
          <div className="p-3 rounded-md bg-[#F7F6F2] border border-[#E9E6E0]">
            <span className="text-xs text-[#74716D] block">Nov 13 recharge (Phase 1)</span>
            <span className="text-sm font-semibold text-[#292929] mt-0.5 block tabular-nums">₱1,073–₱1,074</span>
            <span className="text-[11px] text-[#98948D]">1,000 Diamonds tier (1,163 Dia)</span>
          </div>
          <div className="p-3 rounded-md bg-[#F7F6F2] border border-[#E9E6E0]">
            <span className="text-xs text-[#74716D] block">Nov 20 recharge (Phase 2)</span>
            <span className="text-sm font-semibold text-[#292929] mt-0.5 block tabular-nums">₱527.62–₱527.63</span>
            <span className="text-[11px] text-[#98948D]">500 Diamonds tier (570 Dia)</span>
          </div>
        </div>

        <div className="p-4 rounded-md bg-[#FDFCFB] border border-[#E9E6E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-[#292929] block">Budget variance status</span>
            <span className="text-[#74716D]">
              {isOverBudget
                ? `You have exceeded the maximum planned ₱${plannedPhpMax.toFixed(2)} budget by ₱${budgetDifference.toFixed(2)}.`
                : `You have ₱${remainingPhpBudget.toFixed(2)} remaining within the planned ₱${plannedPhpMax.toFixed(2)} budget ceiling.`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isOverBudget ? (
              <span className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#FDF2F4] text-[#8E3146] border border-[#F8D2D9] flex items-center gap-1 tabular-nums">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                Over budget by ₱{budgetDifference.toFixed(2)}
              </span>
            ) : (
              <span className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#EDF7F1] text-[#1E5D38] border border-[#C5E8D2] flex items-center gap-1 tabular-nums">
                <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
                Under budget (₱{remainingPhpBudget.toFixed(2)} left)
              </span>
            )}
          </div>
        </div>

        <div className="pt-2">
          <h4 className="text-xs font-semibold text-[#292929] mb-3 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-[#B52E45]" aria-hidden="true" />
            Record real-money purchase entry
          </h4>

          <form onSubmit={handleAddPurchase} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div>
              <label htmlFor="purch-date" className="block text-xs text-[#74716D] mb-1">Date</label>
              <input
                id="purch-date"
                type="date"
                value={newPurchaseDate}
                onChange={(e) => setNewPurchaseDate(e.target.value)}
                className="w-full px-2.5 py-2 sm:py-1.5 bg-white border border-[#E9E6E0] rounded-md text-xs text-[#292929] focus:outline-none focus:border-[#B52E45] min-h-[40px] sm:min-h-0"
              />
            </div>
            <div>
              <label htmlFor="purch-type" className="block text-xs text-[#74716D] mb-1">Tier / Pack</label>
              <input
                id="purch-type"
                type="text"
                value={newPurchaseType}
                onChange={(e) => setNewPurchaseType(e.target.value)}
                placeholder="e.g. Weekly Diamond Pass"
                className="w-full px-2.5 py-2 sm:py-1.5 bg-white border border-[#E9E6E0] rounded-md text-xs text-[#292929] focus:outline-none focus:border-[#B52E45] min-h-[40px] sm:min-h-0"
              />
            </div>
            <div>
              <label htmlFor="purch-dia" className="block text-xs text-[#74716D] mb-1">Diamonds received</label>
              <input
                id="purch-dia"
                type="number"
                inputMode="numeric"
                min="0"
                value={newPurchaseDia}
                onChange={(e) => setNewPurchaseDia(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="w-full px-2.5 py-2 sm:py-1.5 bg-white border border-[#E9E6E0] rounded-md text-xs text-[#292929] focus:outline-none focus:border-[#B52E45] tabular-nums min-h-[40px] sm:min-h-0"
              />
            </div>
            <div>
              <label htmlFor="purch-php" className="block text-xs text-[#74716D] mb-1">Actual PHP paid</label>
              <input
                id="purch-php"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={newPurchasePhp}
                onChange={(e) => setNewPurchasePhp(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-2.5 py-2 sm:py-1.5 bg-white border border-[#E9E6E0] rounded-md text-xs font-semibold text-[#292929] focus:outline-none focus:border-[#B52E45] tabular-nums min-h-[40px] sm:min-h-0"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 sm:py-2 px-3 rounded-md bg-[#B52E45] hover:bg-[#9E243A] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer min-h-[42px] touch-manipulation"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add purchase</span>
              </button>
            </div>
          </form>
        </div>

        {purchases.length > 0 && (
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pt-2">
            <table className="w-full text-xs text-left border border-[#E9E6E0] rounded-md overflow-hidden bg-white min-w-[500px]">
              <thead className="bg-[#F7F6F2] text-[#5C5853] font-medium border-b border-[#E9E6E0]">
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Recharge type</th>
                  <th className="p-2.5">Diamonds received</th>
                  <th className="p-2.5">Amount paid (PHP)</th>
                  <th className="p-2.5">Notes</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E6E0]">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FDFCFB] transition-colors">
                    <td className="p-2.5 text-[#5C5853] tabular-nums whitespace-nowrap">{p.date}</td>
                    <td className="p-2.5 font-medium text-[#292929]">{p.rechargeType}</td>
                    <td className="p-2.5 font-semibold text-[#292929] tabular-nums">+{p.diamondsReceived}</td>
                    <td className="p-2.5 font-bold text-[#292929] tabular-nums whitespace-nowrap">₱{p.actualPhp.toFixed(2)}</td>
                    <td className="p-2.5 text-[#74716D] max-w-xs truncate">{p.notes || '—'}</td>
                    <td className="p-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeletePurchase(p.id)}
                        className="p-1.5 rounded text-[#98948D] hover:text-[#8E3146] hover:bg-[#FDF2F4] transition-colors cursor-pointer touch-manipulation"
                        title="Delete entry"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
