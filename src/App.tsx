import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { CalculatorForm } from './components/CalculatorForm';
import { MilestoneSettings } from './components/MilestoneSettings';
import { VerdictBadge } from './components/VerdictBadge';
import { DetailedStats } from './components/DetailedStats';
import { ProjectionComparison } from './components/ProjectionComparison';
import { HelpAccordion } from './components/HelpAccordion';
import { TipidPlanChecklist } from './components/TipidPlanChecklist';
import { DiamondBudgetTracker } from './components/DiamondBudgetTracker';
import { PlanVsActualDashboard } from './components/PlanVsActualDashboard';
import { DrawHistorySection } from './components/DrawHistorySection';
import { StatisticalAnalysisCard } from './components/StatisticalAnalysisCard';
import { DrawDistributionChart } from './components/DrawDistributionChart';
import { ResetConfirmModal, ResetScope } from './components/ResetConfirmModal';
import {
  ActiveTab,
  DrawRecord,
  DuplicateConversionConfig,
  ScheduleTask,
  TipidPlanState,
  TrackerInputs,
} from './types/tracker';
import { calculateTrackerPace } from './utils/calculator';
import {
  loadSavedCalcInputs,
  saveCalcInputs,
  loadSavedTipidState,
  saveTipidState,
  loadSavedDrawRecords,
  saveDrawRecords,
  clearDrawRecords,
  loadSavedDuplicateConfig,
  saveDuplicateConfig,
  clearCalcData,
  clearAllTrackerData,
  exportFullBackupJSON,
  importFullBackupJSON,
  exportDrawHistoryCSV,
  importDrawHistoryCSV,
} from './utils/storage';
import { EVENT_CONFIG } from './config/eventConfig';
import { INITIAL_TIPID_STATE } from './config/tipidPlanConfig';
import { Info } from 'lucide-react';

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

  const [drawRecords, setDrawRecords] = useState<DrawRecord[]>(() => {
    return loadSavedDrawRecords();
  });

  const [duplicateConfig, setDuplicateConfig] = useState<DuplicateConversionConfig>(() => {
    return loadSavedDuplicateConfig();
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

  useEffect(() => {
    saveDrawRecords(drawRecords);
  }, [drawRecords]);

  useEffect(() => {
    saveDuplicateConfig(duplicateConfig);
  }, [duplicateConfig]);

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
    if (calcInputs.drawSourceMode === 'history') {
      const historyTotalRemnants = drawRecords.reduce((sum, r) => sum + r.totalRemnants, 0);
      return {
        ...calcInputs,
        draws: drawRecords.length,
        remnants: historyTotalRemnants,
      };
    }
    return calcInputs;
  }, [calcInputs, ledgerDraws, drawRecords]);

  const calculationResult = useMemo(() => {
    return calculateTrackerPace(effectiveInputs, EVENT_CONFIG, drawRecords);
  }, [effectiveInputs, drawRecords]);

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

  const handleAddDrawRecords = (newRecords: DrawRecord[]) => {
    setDrawRecords((prev) => {
      const map = new Map<number, DrawRecord>();
      prev.forEach((r) => map.set(r.drawNumber, r));
      newRecords.forEach((r) => map.set(r.drawNumber, r));
      return Array.from(map.values()).sort((a, b) => a.drawNumber - b.drawNumber);
    });
  };

  const handleDeleteDrawRecord = (id: string) => {
    setDrawRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearDrawHistory = () => {
    handleOpenReset('history');
  };

  const handleExportCSV = () => {
    const csvContent = exportDrawHistoryCSV(drawRecords);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kagura-draw-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const merged = importDrawHistoryCSV(text, drawRecords);
        setDrawRecords(merged);
      }
    };
    reader.readAsText(file);
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
      setDrawRecords([]);
    } else if (scope === 'calc') {
      clearCalcData();
      setCalcInputs({
        draws: '',
        remnants: '',
        customClaimedMilestones: {},
        drawSourceMode: 'manual',
      });
    } else if (scope === 'history') {
      clearDrawRecords();
      setDrawRecords([]);
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
    const jsonStr = exportFullBackupJSON(calcInputs, tipidState, drawRecords, duplicateConfig);
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
        if (imported.drawRecords) {
          setDrawRecords(imported.drawRecords);
        }
        if (imported.duplicateConfig) {
          setDuplicateConfig(imported.duplicateConfig);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const hasDataToReset =
    calcInputs.draws !== '' ||
    calcInputs.remnants !== '' ||
    Object.keys(calcInputs.customClaimedMilestones || {}).length > 0 ||
    drawRecords.length > 0 ||
    tipidState.tasks.some((t) => t.status !== 'pending') ||
    tipidState.purchases.length > 0;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#292929] flex flex-col selection:bg-[#B52E45] selection:text-white">
      <Header
        onResetClick={() => handleOpenReset('all')}
        hasDataToReset={hasDataToReset}
        onExportBackup={handleExportBackup}
        onImportBackup={(file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const content = event.target?.result as string;
            const imported = importFullBackupJSON(content);
            if (imported) {
              setCalcInputs(imported.calc);
              setTipidState(imported.tipid);
              if (imported.drawRecords) {
                setDrawRecords(imported.drawRecords);
              }
              if (imported.duplicateConfig) {
                setDuplicateConfig(imported.duplicateConfig);
              }
            }
          };
          reader.readAsText(file);
        }}
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
            <section aria-labelledby="tracker-heading" className="pt-1">
              <h2 id="tracker-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[#292929]">
                Track your pace to 1,600 Ashen Remnants
              </h2>
            </section>

            <section aria-labelledby="calculator-form-heading">
              <h3 id="calculator-form-heading" className="sr-only">Calculator Inputs</h3>
              <CalculatorForm
                inputs={calcInputs}
                ledgerDraws={ledgerDraws}
                historyDrawsCount={drawRecords.length}
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
                draws={calculationResult.draws}
                currentRemnants={calculationResult.currentRemnants}
                confidence={calculationResult.confidence}
                confidenceTitle={calculationResult.confidenceTitle}
                confidenceMessage={calculationResult.confidenceMessage}
              />
            </section>

            {drawRecords.length > 0 && (
              <section aria-labelledby="statistical-analysis-heading">
                <h3 id="statistical-analysis-heading" className="sr-only">Statistical Analysis</h3>
                <StatisticalAnalysisCard
                  result={calculationResult}
                  statistics={calculationResult.statistics}
                  totalDraws={calculationResult.draws}
                  recordedDrawsCount={drawRecords.length}
                />
              </section>
            )}

            {drawRecords.length > 0 && (
              <section aria-labelledby="distribution-chart-heading">
                <h3 id="distribution-chart-heading" className="sr-only">Performance Distribution</h3>
                <DrawDistributionChart
                  records={drawRecords}
                  meanAverage={calculationResult.trueAverage}
                />
              </section>
            )}

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

        {activeTab === 'draw-history' && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-150">
            <section aria-labelledby="stats-summary-heading">
              <h2 id="stats-summary-heading" className="sr-only">Statistical Sample Analysis</h2>
              <StatisticalAnalysisCard
                result={calculationResult}
                statistics={calculationResult.statistics}
                totalDraws={calculationResult.draws}
                recordedDrawsCount={drawRecords.length}
              />
            </section>

            <section aria-labelledby="draw-chart-heading">
              <h3 id="draw-chart-heading" className="sr-only">Draw Consistency & Rolling Average</h3>
              <DrawDistributionChart
                records={drawRecords}
                meanAverage={calculationResult.trueAverage}
              />
            </section>

            <section aria-labelledby="draw-history-log-heading">
              <h3 id="draw-history-log-heading" className="sr-only">Individual Draw Log & Batch Entry</h3>
              <DrawHistorySection
                records={drawRecords}
                duplicateConfig={duplicateConfig}
                onAddRecords={handleAddDrawRecords}
                onDeleteRecord={handleDeleteDrawRecord}
                onClearHistory={handleClearDrawHistory}
                onUpdateDuplicateConfig={setDuplicateConfig}
                onExportCSV={handleExportCSV}
                onImportCSV={handleImportCSV}
              />
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
            <span>Kagura Ashen Remnant Tracker • Mobile Legends: Bang Bang event companion</span>
          </div>
          <div className="text-[#74716D] text-center sm:text-right">
            <span>Benchmarks: 100 draws (14.95) • 110 draws (13.5909) • 115 draws (13.00) • 120 draws (12.4583)</span>
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
