import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  AlertCircle,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Compass,
} from 'lucide-react';
import { ScheduleTask, ScheduleTaskStatus } from '../types/tracker';

interface TipidPlanChecklistProps {
  tasks: ScheduleTask[];
  startingPromoDiamonds: number;
  onUpdateTask: (taskId: string, updates: Partial<ScheduleTask>) => void;
  onUpdateStartingPromo: (val: number) => void;
  onResetTasks: () => void;
}

export const TipidPlanChecklist: React.FC<TipidPlanChecklistProps> = ({
  tasks,
  startingPromoDiamonds,
  onUpdateTask,
  onUpdateStartingPromo,
  onResetTasks,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [collapseCompleted, setCollapseCompleted] = useState(false);
  const [flashTaskId, setFlashTaskId] = useState<string | null>(null);
  const pendingItemRef = useRef<HTMLDivElement | null>(null);

  const firstPendingId = useMemo(() => {
    return tasks.find((t) => t.status === 'pending')?.id;
  }, [tasks]);

  useEffect(() => {
    if (pendingItemRef.current && firstPendingId && firstPendingId !== tasks[0]?.id) {
      pendingItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  const handleJumpToPending = () => {
    if (pendingItemRef.current) {
      pendingItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const toggleNotes = (id: string) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStatusChange = (task: ScheduleTask, newStatus: ScheduleTaskStatus) => {
    if (newStatus === 'completed' && task.status !== 'completed') {
      setFlashTaskId(task.id);
      setTimeout(() => setFlashTaskId(null), 700);
      onUpdateTask(task.id, {
        status: newStatus,
        actualDraws: task.actualDraws > 0 ? task.actualDraws : task.plannedDraws,
        actualBlueDiamonds:
          task.actualBlueDiamonds > 0 ? task.actualBlueDiamonds : task.plannedBlueDiamonds,
        actualPromoDiamonds:
          task.actualPromoDiamonds > 0 ? task.actualPromoDiamonds : task.plannedPromoDiamonds,
        actualPhp: task.actualPhp > 0 ? task.actualPhp : task.rechargePhpMin,
      });
    } else {
      onUpdateTask(task.id, { status: newStatus });
    }
  };

  const totalPlannedDraws = tasks.reduce((sum, t) => sum + t.plannedDraws, 0);
  const totalActualDraws = tasks
    .filter((t) => t.status === 'completed' || t.status === 'modified')
    .reduce((sum, t) => sum + t.actualDraws, 0);

  const totalActualDiamonds = tasks
    .filter((t) => t.status === 'completed' || t.status === 'modified')
    .reduce((sum, t) => sum + t.actualBlueDiamonds, 0);

  const completedCount = tasks.filter((t) => t.status === 'completed' || t.status === 'modified').length;

  const promoAvailable = 800 + (startingPromoDiamonds || 0);
  const promoShortfall = Math.max(0, 1600 - promoAvailable);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'completed') return t.status === 'completed' || t.status === 'modified';
    if (filter === 'pending') return t.status === 'pending';
    return true;
  });

  const visibleTasks = useMemo(() => {
    return filteredTasks.filter((t) => {
      if (collapseCompleted && filter === 'all') {
        return t.status !== 'completed' && t.status !== 'modified';
      }
      return true;
    });
  }, [filteredTasks, collapseCompleted, filter]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="bg-white border border-[#E9E6E0] rounded-lg p-4 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#292929]">
              Daily Tipid Checklist & Event Roadmap
            </h2>
            <p className="text-xs text-[#74716D] mt-0.5">
              Your November 6 – December 6 Kagura draw schedule.
            </p>
          </div>

          <button
            type="button"
            onClick={onResetTasks}
            className="min-h-[36px] px-3 py-1.5 rounded-md border border-[#E9E6E0] hover:bg-[#F7F6F2] text-xs font-medium text-[#74716D] hover:text-[#292929] transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto touch-manipulation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#98948D]" aria-hidden="true" />
            <span>Reset plan</span>
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-[#74716D] mb-1.5">
            <span>Overall progress</span>
            <span className="font-mono font-medium text-[#292929] tabular-nums">
              {totalActualDraws} of {totalPlannedDraws} draws completed
            </span>
          </div>
          <div className="w-full bg-[#F0EDE6] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#B52E45] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totalActualDraws / totalPlannedDraws) * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-0 sm:divide-x divide-[#E9E6E0] pt-4 border-t border-[#E9E6E0]">
          <div className="pb-1 sm:pb-0 sm:pr-4">
            <span className="text-[11px] text-[#98948D] block">Draws completed</span>
            <div className="text-base sm:text-lg font-bold font-mono text-[#292929] mt-0.5 tabular-nums">
              {totalActualDraws} <span className="text-xs font-normal text-[#98948D]">/ {totalPlannedDraws}</span>
            </div>
          </div>

          <div className="pb-1 sm:pb-0 sm:px-4">
            <span className="text-[11px] text-[#98948D] block">Blue diamonds spent</span>
            <div className="text-base sm:text-lg font-bold font-mono text-[#292929] mt-0.5 tabular-nums">
              {totalActualDiamonds.toLocaleString()} <span className="text-xs font-normal text-[#98948D]">Dia</span>
            </div>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-4 border-t sm:border-t-0 border-[#E9E6E0]">
            <span className="text-[11px] text-[#98948D] block">Days tracked</span>
            <div className="text-base sm:text-lg font-bold font-mono text-[#292929] mt-0.5 tabular-nums">
              {completedCount} <span className="text-xs font-normal text-[#98948D]">/ {tasks.length}</span>
            </div>
          </div>

          <div className="pt-2 sm:pt-0 sm:pl-4 border-t sm:border-t-0 border-[#E9E6E0]">
            <span className="text-[11px] text-[#98948D] block">Promo diamond status</span>
            <div className="text-base sm:text-lg font-bold font-mono mt-0.5 tabular-nums">
              {promoShortfall > 0 ? (
                <span className="text-[#B52E45]">-{promoShortfall} needed</span>
              ) : (
                <span className="text-[#1E7E4E]">1,600 ready</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 rounded-lg bg-[#FAF9F5] border border-[#E9E6E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#9D7E3F] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-semibold text-[#292929] block">
              Promo Diamond requirement
            </span>
            <p className="text-[#5C5853] mt-0.5 leading-relaxed">
              November 13 schedules 20 draws requiring 1,600 Promo Diamonds. The recharge unlocks 800 Promo Diamonds.
              {promoShortfall > 0
                ? ` You currently need ${promoShortfall} additional Promo Diamonds from previous event tasks.`
                : ' Your starting balance covers the 1,600 Promo Diamond requirement.'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0 bg-white px-3 py-2 sm:py-1.5 rounded-md border border-[#E9E6E0]">
          <label htmlFor="promo-balance-input" className="text-xs text-[#74716D] whitespace-nowrap">
            Starting Promo:
          </label>
          <input
            id="promo-balance-input"
            type="number"
            inputMode="numeric"
            min="0"
            value={startingPromoDiamonds || ''}
            onChange={(e) => onUpdateStartingPromo(Math.max(0, parseInt(e.target.value, 10) || 0))}
            placeholder="0"
            className="w-20 px-2 py-1 sm:py-0.5 border border-[#E9E6E0] rounded text-xs font-mono text-right tabular-nums focus:outline-none focus:border-[#B52E45]"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 flex-wrap">
        <div className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex rounded-md bg-[#F4F2EC] p-0.5 border border-[#E9E6E0] text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`min-h-[36px] px-2.5 py-1.5 rounded text-center transition-all cursor-pointer touch-manipulation ${
              filter === 'all'
                ? 'bg-white text-[#292929] font-semibold shadow-xs'
                : 'text-[#74716D] hover:text-[#292929]'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`min-h-[36px] px-2.5 py-1.5 rounded text-center transition-all cursor-pointer touch-manipulation ${
              filter === 'pending'
                ? 'bg-white text-[#292929] font-semibold shadow-xs'
                : 'text-[#74716D] hover:text-[#292929]'
            }`}
          >
            Pending ({tasks.filter((t) => t.status === 'pending').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`min-h-[36px] px-2.5 py-1.5 rounded text-center transition-all cursor-pointer touch-manipulation ${
              filter === 'completed'
                ? 'bg-white text-[#292929] font-semibold shadow-xs'
                : 'text-[#74716D] hover:text-[#292929]'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {firstPendingId && (
            <button
              type="button"
              onClick={handleJumpToPending}
              className="min-h-[36px] px-3 py-1.5 rounded-md border border-[#E9E6E0] bg-white hover:bg-[#F7F6F2] text-xs font-medium text-[#5C5853] hover:text-[#292929] transition-colors flex items-center gap-1.5 cursor-pointer touch-manipulation"
            >
              <Compass className="w-3.5 h-3.5 text-[#B52E45]" aria-hidden="true" />
              <span>Jump to next task</span>
            </button>
          )}

          {completedCount > 0 && filter === 'all' && (
            <button
              type="button"
              onClick={() => setCollapseCompleted(!collapseCompleted)}
              className="min-h-[36px] px-3 py-1.5 rounded-md border border-[#E9E6E0] bg-white hover:bg-[#F7F6F2] text-xs font-medium text-[#74716D] hover:text-[#292929] transition-colors flex items-center gap-1.5 cursor-pointer touch-manipulation"
            >
              <span>{collapseCompleted ? 'Show completed' : `Collapse done (${completedCount})`}</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#E9E6E0] rounded-lg divide-y divide-[#E9E6E0] shadow-xs">
        {collapseCompleted && filter === 'all' && completedCount > 0 && (
          <div className="p-4 bg-[#FBFBFA] border-b border-[#E9E6E0] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#1E7E4E]" aria-hidden="true" />
              <span className="text-[#5C5853]">
                <strong className="text-[#292929]">{completedCount} completed days</strong> collapsed ({totalActualDraws} draws logged)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCollapseCompleted(false)}
              className="text-[#B52E45] font-semibold hover:underline cursor-pointer"
            >
              Show all
            </button>
          </div>
        )}

        {visibleTasks.map((task) => {
          const isDone = task.status === 'completed' || task.status === 'modified';
          const isSkipped = task.status === 'skipped';
          const hasNotes = Boolean(task.notes);

          return (
            <div
              key={task.id}
              ref={task.id === firstPendingId ? pendingItemRef : undefined}
              className={`p-4 sm:p-6 transition-all duration-300 ${
                flashTaskId === task.id
                  ? 'bg-[#EDF7F1] ring-1 ring-[#C7E9D5]'
                  : isDone
                  ? 'bg-white'
                  : isSkipped
                  ? 'bg-[#FBFBFA] opacity-60'
                  : 'bg-white'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3.5">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#F7F6F2] border border-[#E9E6E0] text-[#292929]">
                      {task.displayDate}
                    </span>
                    <h3 className="text-sm font-bold text-[#292929]">
                      Day {task.dayNumber} — {task.title}
                    </h3>
                    {task.phase && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FDF2F4] text-[#B52E45] border border-[#F8D2D9]">
                        {task.phase}
                      </span>
                    )}
                    {isDone && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1E7E4E]">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        Completed
                      </span>
                    )}
                  </div>

                  <ul className="text-xs text-[#5C5853] space-y-1 pt-1">
                    {task.tasksText.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#98948D] shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {task.rechargeTier !== 'None' && (
                    <div className="text-xs text-[#74716D] pt-1">
                      <span>Recharge: {task.rechargeTier}</span>
                      <span className="ml-1 text-[#292929] font-mono tabular-nums font-medium">
                        (₱{task.rechargePhpMin.toLocaleString()}{task.rechargePhpMax > task.rechargePhpMin ? `–₱${task.rechargePhpMax.toLocaleString()}` : ''})
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-stretch md:items-end gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E9E6E0]">
                  <div className="w-full md:w-auto grid grid-cols-4 md:flex items-center gap-1 bg-[#F4F2EC] p-0.5 rounded-md border border-[#E9E6E0] text-xs">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(task, 'completed')}
                      className={`min-h-[34px] px-2.5 py-1 rounded text-center transition-colors cursor-pointer touch-manipulation ${
                        task.status === 'completed'
                          ? 'bg-white text-[#1E7E4E] font-semibold shadow-xs'
                          : 'text-[#74716D] hover:text-[#292929]'
                      }`}
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(task, 'pending')}
                      className={`min-h-[34px] px-2.5 py-1 rounded text-center transition-colors cursor-pointer touch-manipulation ${
                        task.status === 'pending'
                          ? 'bg-white text-[#292929] font-semibold shadow-xs'
                          : 'text-[#74716D] hover:text-[#292929]'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(task, 'skipped')}
                      className={`min-h-[34px] px-2.5 py-1 rounded text-center transition-colors cursor-pointer touch-manipulation ${
                        task.status === 'skipped'
                          ? 'bg-white text-[#B52E45] font-semibold shadow-xs'
                          : 'text-[#74716D] hover:text-[#292929]'
                      }`}
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(task, 'modified')}
                      className={`min-h-[34px] px-2.5 py-1 rounded text-center transition-colors cursor-pointer touch-manipulation ${
                        task.status === 'modified'
                          ? 'bg-white text-[#A16207] font-semibold shadow-xs'
                          : 'text-[#74716D] hover:text-[#292929]'
                      }`}
                      title="Custom actual values"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-[#5C5853] font-mono tabular-nums">
                    <div className="flex items-center gap-1">
                      <span className="text-[#98948D]">Draws:</span>
                      <span className="text-[#74716D]">Plan {task.plannedDraws} /</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        value={task.actualDraws}
                        onChange={(e) =>
                          onUpdateTask(task.id, {
                            actualDraws: Math.max(0, parseInt(e.target.value, 10) || 0),
                            status: 'modified',
                          })
                        }
                        className="w-12 px-1.5 py-1 bg-white border border-[#E9E6E0] rounded text-center text-[#292929] font-bold focus:border-[#B52E45] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[#98948D]">Dia:</span>
                      <span className="text-[#74716D]">Plan {task.plannedBlueDiamonds} /</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        value={task.actualBlueDiamonds}
                        onChange={(e) =>
                          onUpdateTask(task.id, {
                            actualBlueDiamonds: Math.max(0, parseInt(e.target.value, 10) || 0),
                            status: 'modified',
                          })
                        }
                        className="w-16 px-1.5 py-1 bg-white border border-[#E9E6E0] rounded text-center text-[#292929] font-bold focus:border-[#B52E45] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleNotes(task.id)}
                    className="text-xs text-[#74716D] hover:text-[#292929] flex items-center gap-1 cursor-pointer self-start md:self-auto touch-manipulation py-1"
                  >
                    <span>{hasNotes ? 'Edit notes' : '+ Add notes / drops'}</span>
                    {expandedNotes[task.id] ? (
                      <ChevronUp className="w-3 h-3" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-3 h-3" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {expandedNotes[task.id] && (
                <div className="mt-3 pt-3 border-t border-[#E9E6E0]">
                  <textarea
                    rows={2}
                    value={task.notes}
                    onChange={(e) => onUpdateTask(task.id, { notes: e.target.value })}
                    placeholder="Record your actual pull results, duplicate conversions, or notes..."
                    className="w-full p-2.5 bg-white border border-[#E9E6E0] rounded-md text-xs text-[#292929] placeholder:text-[#98948D] focus:border-[#B52E45] focus:outline-none"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
