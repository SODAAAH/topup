import React, { useState, useMemo } from 'react';
import { BarChart3, LineChart, Table } from 'lucide-react';
import { DrawRecord } from '../types/tracker';
import { calculateRunningAverages } from '../utils/statistics';

interface DrawDistributionChartProps {
  records: DrawRecord[];
  meanAverage: number | null;
}

type FilterOption = '10' | '20' | '30' | 'all';

export const DrawDistributionChart: React.FC<DrawDistributionChartProps> = ({
  records,
  meanAverage,
}) => {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [showTable, setShowTable] = useState(false);

  const filteredRecords = useMemo(() => {
    if (filter === 'all') return records;
    const count = parseInt(filter, 10);
    return records.slice(-count);
  }, [records, filter]);

  const rawValues = useMemo(() => {
    return records.map((r) => r.totalRemnants);
  }, [records]);

  const runningProgression = useMemo(() => {
    return calculateRunningAverages(rawValues, 5);
  }, [rawValues]);

  const maxVal = useMemo(() => {
    if (filteredRecords.length === 0) return 30;
    const highest = Math.max(...filteredRecords.map((r) => r.totalRemnants));
    return Math.max(25, highest + 5);
  }, [filteredRecords]);

  if (records.length === 0) {
    return (
      <div className="bg-white border border-[#E9E6E0] rounded-lg p-5 sm:p-7 shadow-xs text-center space-y-2">
        <BarChart3 className="w-8 h-8 text-[#98948D] mx-auto" aria-hidden="true" />
        <h3 className="text-sm sm:text-base font-semibold text-[#292929]">
          How Your Draws Are Performing
        </h3>
        <p className="text-xs text-[#74716D] max-w-md mx-auto">
          No individual draws recorded yet. Enter your first batch of draws below to visualize individual yields, rolling averages, and pull consistency.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E9E6E0] rounded-lg p-4 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9E6E0]">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[#292929] flex items-center gap-2">
            <LineChart className="w-4 h-4 text-[#B52E45]" aria-hidden="true" />
            <span>How Your Draws Are Performing</span>
          </h3>
          <p className="text-xs text-[#74716D] mt-0.5">
            Individual pull yields, mean benchmark line ({meanAverage !== null ? `${meanAverage.toFixed(2)}/draw` : '—'}), and sample stability.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-md bg-[#F4F2EC] p-0.5 border border-[#E9E6E0] text-xs">
            {(['10', '20', '30', 'all'] as FilterOption[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFilter(opt)}
                className={`min-h-[32px] px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer touch-manipulation ${
                  filter === opt
                    ? 'bg-white text-[#292929] shadow-xs font-semibold'
                    : 'text-[#74716D] hover:text-[#292929]'
                }`}
              >
                {opt === 'all' ? 'All' : `Last ${opt}`}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowTable(!showTable)}
            className="min-h-[32px] px-2.5 py-1 rounded-md border border-[#E9E6E0] bg-[#FAF9F5] hover:bg-[#F2EFE9] text-xs font-medium text-[#5C5853] hover:text-[#292929] transition-colors flex items-center gap-1 cursor-pointer touch-manipulation"
          >
            <Table className="w-3.5 h-3.5 text-[#98948D]" aria-hidden="true" />
            <span>{showTable ? 'Hide Table' : 'Running Table'}</span>
          </button>
        </div>
      </div>

      <div className="pt-2">
        <div className="h-48 sm:h-56 w-full flex items-end gap-1 sm:gap-1.5 pt-6 pb-2 px-1 relative border-b border-[#E9E6E0]">
          {meanAverage !== null && meanAverage > 0 && (
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-[#B52E45]/60 z-10 pointer-events-none flex items-center justify-end pr-2"
              style={{
                bottom: `${Math.min(95, Math.max(5, (meanAverage / maxVal) * 100))}%`,
              }}
            >
              <span className="text-[10px] font-mono font-semibold bg-white px-1.5 py-0.5 rounded border border-[#B52E45]/40 text-[#B52E45]">
                Avg: {meanAverage.toFixed(2)}
              </span>
            </div>
          )}

          {filteredRecords.map((r) => {
            const heightPercent = Math.min(100, Math.max(8, (r.totalRemnants / maxVal) * 100));
            const isHigh = r.totalRemnants >= (meanAverage || 14);

            return (
              <div
                key={r.id}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                <div
                  className="w-full max-w-[28px] rounded-t transition-all duration-200 cursor-pointer"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: isHigh ? '#BE9B57' : '#D1CAC2',
                  }}
                />

                <div className="absolute -top-8 bg-[#292929] text-white text-[10px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-md">
                  #{r.drawNumber}: {r.totalRemnants} rem
                </div>

                <span className="text-[9px] font-mono text-[#98948D] mt-1 truncate">
                  {r.drawNumber}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#74716D] pt-2 px-1">
          <span>Draw progression (oldest → newest)</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#BE9B57]" />
              <span>Above average</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#D1CAC2]" />
              <span>Below average</span>
            </span>
          </div>
        </div>
      </div>

      {showTable && (
        <div className="pt-3 border-t border-[#E9E6E0] space-y-2">
          <h4 className="text-xs font-semibold text-[#292929]">
            Running Average Progression
          </h4>
          <div className="max-h-60 overflow-y-auto border border-[#E9E6E0] rounded-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-[#E9E6E0] text-[#74716D] font-medium sticky top-0">
                <tr>
                  <th className="py-2 px-3">Draw #</th>
                  <th className="py-2 px-3">Yield</th>
                  <th className="py-2 px-3">Running Avg</th>
                  <th className="py-2 px-3">Rolling 5-Draw</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E6E0] font-mono text-[#292929]">
                {runningProgression.map((p) => (
                  <tr key={p.drawNumber} className="hover:bg-[#FAF9F5]">
                    <td className="py-1.5 px-3">#{p.drawNumber}</td>
                    <td className="py-1.5 px-3">{p.drawRemnants}</td>
                    <td className="py-1.5 px-3 font-semibold text-[#B52E45]">
                      {p.runningAverage.toFixed(2)}
                    </td>
                    <td className="py-1.5 px-3 text-[#74716D]">
                      {p.rollingAverage !== undefined ? p.rollingAverage.toFixed(2) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

