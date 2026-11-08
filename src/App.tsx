import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { CalculatorForm } from './components/CalculatorForm';
import { MilestoneSettings } from './components/MilestoneSettings';
import { VerdictBadge } from './components/VerdictBadge';
import { ConfidenceIndicator } from './components/ConfidenceIndicator';
import { DetailedStats } from './components/DetailedStats';
import { ProjectionComparison } from './components/ProjectionComparison';
import { HelpAccordion } from './components/HelpAccordion';
import { TipidPlanChecklist } from './components/TipidPlanChecklist';
import { DiamondBudgetTracker } from './components/DiamondBudgetTracker';
import { PlanVsActualDashboard } from './components/PlanVsActualDashboard';
import { ResetConfirmModal, ResetScope } from './components/ResetConfirmModal';
import { ActiveTab, ScheduleTask, TipidPlanState, TrackerInputs } from './types/tracker';
import { calculateTrackerPace } from './utils/calculator';
import {
  loadSavedCalcInputs,
  saveCalcInputs,
  loadSavedTipidState,
  saveTipidState,
  clearCalcData,
  clearAllTrackerData,
  exportFullBackupJSON,
  importFullBackupJSON,
} from './utils/storage';
import { EVENT_CONFIG } from './config/eventConfig';
import { INITIAL_TIPID_STATE } from './config/tipidPlanConfig';
import { ShieldCheck, Info } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tracker');

  const [calcInputs, setCalcInputs] = useState<TrackerInputs>(() => {
    const saved = loadSavedCalcInputs();
    if (saved) {
      return {
        draws: saved.draws,
        remnants: saved.remnants,
        customClaimedMilestones: saved.customClaimedMilestones,
        drawSourceMode: saved.drawSourceMode || 'manual',
      };
    }
    return {
      draws: '',
      remnants: '',
      customClaimedMilestones: {},
      drawSourceMode: 'manual',
    };
  });

  const [tipidState, setTipidState] = useState<TipidPlanState>(() => {
    return loadSavedTipidState();
  });

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetScope, setResetScope] = useState<ResetScope>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    saveCalcInputs(calcInputs);
  }, [calcInputs]);

  useEffect(() => {
    saveTipidState(tipidState);
  }, [tipidState]);

  const ledgerDraws = useMemo(() => {
    return (tipidState.tasks || [])
      .filter((t) => t.status === 'completed' || t.status === 'modified')
      .reduce((sum, t) => sum + t.actualDraws, 0);
  }, [tipidState.tasks]);

  const actualBlueSpentFromTasks = useMemo(() => {
    return (tipidState.tasks || [])
      .filter((t) => t.status === 'completed' || t.status === 'modified')
      .reduce((sum, t) => sum + t.actualBlueDiamonds, 0);
  }, [tipidState.tasks]);

  const actualPromoSpentFromTasks = useMemo(() => {
    return (tipidState.tasks || [])
      .filter((t) => t.status === 'completed' || t.status === 'modified')
      .reduce((sum, t) => sum + t.actualPromoDiamonds, 0);
  }, [tipidState.tasks]);

  const effectiveInputs = useMemo(() => {
    if (calcInputs.drawSourceMode === 'ledger') {
      return {
        ...calcInputs,
        draws: ledgerDraws,
      };
    }
    return calcInputs;
  }, [calcInputs, ledgerDraws]);

  const calculationResult = useMemo(() => {
    return calculateTrackerPace(effectiveInputs, EVENT_CONFIG);
  }, [effectiveInputs]);

  const handleCalcChange = (newInputs: TrackerInputs) => {
    setCalcInputs(newInputs);
  };

  const handleToggleMilestone = (id: string, claimed: boolean) => {
    setCalcInputs((prev) => ({
      ...prev,
      customClaimedMilestones: {
        ...(prev.customClaimedMilestones || {}),
        [id]: claimed,
      },
    }));
  };

  const handleResetMilestones = () => {
    setCalcInputs((prev) => ({
      ...prev,
      customClaimedMilestones: {},
    }));
  };

  const handleUpdateTask = (taskId: string, updates: Partial<ScheduleTask>) => {
    setTipidState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));
  };

  const handleUpdateStartingPromo = (val: number) => {
    setTipidState((prev) => ({
      ...prev,
      startingPromoDiamonds: val,
    }));
  };

  const handleUpdateTipidState = (updates: Partial<TipidPlanState>) => {
    setTipidState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleOpenReset = (scope: ResetScope) => {
    setResetScope(scope);
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = (scope: ResetScope) => {
    if (scope === 'all') {
      clearAllTrackerData();
      setCalcInputs({
        draws: '',
        remnants: '',
        customClaimedMilestones: {},
        drawSourceMode: 'manual',
      });
      setTipidState(INITIAL_TIPID_STATE);
    } else if (scope === 'calc') {
      clearCalcData();
      setCalcInputs({
        draws: '',
        remnants: '',
        customClaimedMilestones: {},
        drawSourceMode: 'manual',
      });
    } else if (scope === 'tipid') {
      setTipidState((prev) => ({
        ...prev,
        tasks: INITIAL_TIPID_STATE.tasks,
      }));
    } else if (scope === 'budget') {
      setTipidState((prev) => ({
        ...prev,
        startingPromoDiamonds: 0,
        nov24Expenditure: 211,
        purchases: [],
      }));
    }
  };

  const handleExportBackup = () => {
    const jsonStr = exportFullBackupJSON(calcInputs, tipidState);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kagura-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importFullBackupJSON(content);
      if (imported) {
        setCalcInputs(imported.calc);
        setTipidState(imported.tipid);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const hasDataToReset =
    calcInputs.draws !== '' ||
    calcInputs.remnants !== '' ||
    Object.keys(calcInputs.customClaimedMilestones || {}).length > 0 ||
    tipidState.tasks.some((t) => t.status !== 'pending') ||
    tipidState.purchases.length > 0;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#292929] flex flex-col selection:bg-[#B52E45] selection:text-white">
      <Header
        onResetClick={() => handleOpenReset('all')}
        hasDataToReset={hasDataToReset}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-8 py-4 sm:py-8 space-y-5 sm:space-y-6">
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onExport={handleExportBackup}
          onImportClick={() => fileInputRef.current?.click()}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportFile}
          className="hidden"
          aria-hidden="true"
        />

        {activeTab === 'tracker' && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-150">
            <section aria-labelledby="tracker-heading" className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <span className="text-xs font-semibold text-[#B52E45]">
                    Pacing analysis
                  </span>
                  <h2 id="tracker-heading" className="text-xl sm:text-3xl font-bold tracking-tight text-[#292929]">
                    Track your pace to 1,600 Ashen Remnants
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#5C5853] bg-white px-3 py-1.5 rounded-md border border-[#E9E6E0] self-start sm:self-auto">
                  <ShieldCheck className="w-4 h-4 text-[#1E5D38] shrink-0" aria-hidden="true" />
                  <span>Offline deterministic engine</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#74716D] max-w-3xl leading-relaxed">
                Enter your total completed draws and your current Ashen Remnants balance below, or sync draws directly from your recorded Tipid Plan checklist. The calculator separates one-time milestone rewards from your normal pull rate to give you your true remnant average per draw and accurate forecasts toward the 1,600-remnant Kagura Legend Skin goal.
              </p>
            </section>

            <section aria-labelledby="calculator-form-heading">
              <h3 id="calculator-form-heading" className="sr-only">Calculator Inputs</h3>
              <CalculatorForm
                inputs={calcInputs}
                ledgerDraws={ledgerDraws}
                onChange={handleCalcChange}
                onCalculate={() => {}}
                validationError={calculationResult.validationError}
              />
            </section>

            <section aria-labelledby="milestone-settings-heading">
              <h3 id="milestone-settings-heading" className="sr-only">Milestone Claim Settings</h3>
              <MilestoneSettings
                milestones={calculationResult.milestones}
                claimedMilestonesBonus={calculationResult.claimedMilestonesBonus}
                unclaimedUnlockedBonus={calculationResult.unclaimedUnlockedBonus}
                draws={calculationResult.draws}
                onToggleMilestone={handleToggleMilestone}
                onResetMilestones={handleResetMilestones}
              />
            </section>

            <section aria-labelledby="verdict-heading" className="space-y-4">
              <h3 id="verdict-heading" className="sr-only">Pacing Verdict</h3>
              <VerdictBadge
                verdict={calculationResult.verdict}
                title={calculationResult.verdictTitle}
                message={calculationResult.verdictMessage}
                trueAverage={calculationResult.trueAverage}
                isGoalReached={calculationResult.isGoalReached}
                goalReachedTitle={calculationResult.goalReachedTitle}
                goalReachedMessage={calculationResult.goalReachedMessage}
              />

              <ConfidenceIndicator
                confidence={calculationResult.confidence}
                title={calculationResult.confidenceTitle}
                message={calculationResult.confidenceMessage}
                draws={calculationResult.draws}
              />
            </section>

            <section aria-labelledby="detailed-stats-heading">
              <h3 id="detailed-stats-heading" className="sr-only">Detailed Breakdown</h3>
              <DetailedStats result={calculationResult} />
            </section>

            <section aria-labelledby="projection-comparison-heading">
              <h3 id="projection-comparison-heading" className="sr-only">Projection Comparison</h3>
              <ProjectionComparison result={calculationResult} />
            </section>

            <section aria-labelledby="help-guide-heading">
              <h3 id="help-guide-heading" className="sr-only">Educational Guide</h3>
              <HelpAccordion />
            </section>
          </div>
        )}

        {activeTab === 'tipid-plan' && (
          <div className="animate-in fade-in duration-150">
            <TipidPlanChecklist
              tasks={tipidState.tasks}
              startingPromoDiamonds={tipidState.startingPromoDiamonds}
              onUpdateTask={handleUpdateTask}
              onUpdateStartingPromo={handleUpdateStartingPromo}
              onResetTasks={() => handleOpenReset('tipid')}
            />
          </div>
        )}

        {activeTab === 'diamond-budget' && (
          <div className="animate-in fade-in duration-150">
            <DiamondBudgetTracker
              state={tipidState}
              actualBlueSpentFromTasks={actualBlueSpentFromTasks}
              actualPromoSpentFromTasks={actualPromoSpentFromTasks}
              onUpdateState={handleUpdateTipidState}
              onResetBudget={() => handleOpenReset('budget')}
            />
          </div>
        )}

        {activeTab === 'plan-vs-actual' && (
          <div className="animate-in fade-in duration-150">
            <PlanVsActualDashboard
              calculationResult={calculationResult}
              tipidState={tipidState}
            />
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-[#E9E6E0] bg-white py-5 sm:py-6 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#74716D]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#98948D] shrink-0" aria-hidden="true" />
            <span>Kagura Ashen Remnant Tracker and Tipid Suite • Feast of Eternity event companion</span>
          </div>
          <div className="text-[#74716D] text-center sm:text-right">
            <span>Benchmarks: 100 draws (14.95) • 110 draws (13.5909) • 115 draws (13.00)</span>
          </div>
        </div>
      </footer>

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        defaultScope={resetScope}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};
