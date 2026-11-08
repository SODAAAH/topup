import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Download,
  Upload,
  Settings2,
  Layers,
  Check,
} from 'lucide-react';
import {
  DrawRecord,
  DuplicateConversionConfig,
  DuplicateRarity,
} from '../types/tracker';

interface DrawHistorySectionProps {
  records: DrawRecord[];
  duplicateConfig: DuplicateConversionConfig;
  onAddRecords: (newRecords: DrawRecord[]) => void;
  onDeleteRecord: (id: string) => void;
  onClearHistory: () => void;
  onUpdateDuplicateConfig: (newConfig: DuplicateConversionConfig) => void;
  onExportCSV: () => void;
  onImportCSV: (file: File) => void;
}

interface BatchDraftRow {
  drawNumber: number;
  directRemnants: number | '';
  duplicateRarity: DuplicateRarity;
  duplicateRemnants: number | '';
  manualTotal: number | '';
  notes: string;
}

export const DrawHistorySection: React.FC<DrawHistorySectionProps> = ({
  records,
  duplicateConfig,
  onAddRecords,
  onDeleteRecord,
  onClearHistory,
  onUpdateDuplicateConfig,
  onExportCSV,
  onImportCSV,
}) => {
  const [batchSize, setBatchSize] = useState<number>(10);
  const [draftRows, setDraftRows] = useState<BatchDraftRow[]>(() =>
    createEmptyDraftRows(records.length + 1, 10)
  );
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [customBatchCount, setCustomBatchCount] = useState<number>(5);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  function createEmptyDraftRows(
    startDrawNumber: number,
    count: number
  ): BatchDraftRow[] {
    const rows: BatchDraftRow[] = [];
    for (let i = 0; i < count; i += 1) {
      rows.push({
        drawNumber: startDrawNumber + i,
        directRemnants: '',
        duplicateRarity: 'none',
        duplicateRemnants: '',
        manualTotal: '',
        notes: '',
      });
    }
    return rows;
  }

  const handleBatchSizeChange = (size: number) => {
    setBatchSize(size);
    const startNum = records.length + 1;
    setDraftRows(createEmptyDraftRows(startNum, size));
  };

  const handleCustomBatchGenerate = () => {
    if (customBatchCount > 0 && customBatchCount <= 50) {
      setBatchSize(customBatchCount);
      const startNum = records.length + 1;
      setDraftRows(createEmptyDraftRows(startNum, customBatchCount));
    }
  };

  const handleRowChange = (
    index: number,
    field: keyof BatchDraftRow,
    value: string | number
  ) => {
    setDraftRows((prev) => {
      const next = [...prev];
      const row = { ...next[index] };

      if (field === 'duplicateRarity') {
        const rarity = value as DuplicateRarity;
        row.duplicateRarity = rarity;
        if (rarity !== 'none') {
          row.duplicateRemnants = duplicateConfig[rarity as keyof DuplicateConversionConfig] as number || 0;
        } else {
          row.duplicateRemnants = '';
        }
      } else if (field === 'directRemnants') {
        row.directRemnants = value === '' ? '' : Math.max(0, Number(value));
      } else if (field === 'duplicateRemnants') {
        row.duplicateRemnants = value === '' ? '' : Math.max(0, Number(value));
      } else if (field === 'manualTotal') {
        row.manualTotal = value === '' ? '' : Math.max(0, Number(value));
      } else if (field === 'notes') {
        row.notes = String(value);
      }

      next[index] = row;
      return next;
    });
  };

  const calculateRowTotal = (row: BatchDraftRow): number => {
    if (typeof row.manualTotal === 'number' && row.manualTotal >= 0) {
      return row.manualTotal;
    }
    const direct = typeof row.directRemnants === 'number' ? row.directRemnants : 0;
    const duplicate = typeof row.duplicateRemnants === 'number' ? row.duplicateRemnants : 0;
    return direct + duplicate;
  };

  const handleCommitBatch = () => {
    const nowIso = new Date().toISOString();
    const newRecords: DrawRecord[] = draftRows.map((row, idx) => {
      const total = calculateRowTotal(row);
      const direct = typeof row.directRemnants === 'number' ? row.directRemnants : total;
      const duplicate = typeof row.duplicateRemnants === 'number' ? row.duplicateRemnants : 0;

      return {
        id: `draw-${row.drawNumber}-${Date.now()}-${idx}`,
        drawNumber: row.drawNumber,
        timestamp: nowIso,
        directRemnants: direct,
        duplicateRarity: row.duplicateRarity,
        duplicateRemnants: duplicate,
        totalRemnants: total,
        notes: row.notes,
      };
    });

    onAddRecords(newRecords);
    setFeedbackMsg(`Successfully recorded ${newRecords.length} draws!`);
    setTimeout(() => setFeedbackMsg(null), 3000);

    const nextStart = records.length + newRecords.length + 1;
    setDraftRows(createEmptyDraftRows(nextStart, batchSize));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportCSV(file);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="bg-white border border-[#E9E6E0] rounded-lg p-4 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9E6E0]">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[#292929] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B52E45]" aria-hidden="true" />
              <span>Record Draw Results (Batch Entry)</span>
            </h3>
            <p className="text-xs text-[#74716D] mt-0.5">
              Log individual draw yields from single or 10x pulls. Milestones are excluded automatically.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="min-h-[36px] px-3 py-1.5 rounded-md border border-[#E9E6E0] bg-[#FAF9F5] hover:bg-[#F2EFE9] text-xs font-medium text-[#5C5853] hover:text-[#292929] transition-colors flex items-center gap-1.5 cursor-pointer touch-manipulation"
            >
              <Settings2 className="w-3.5 h-3.5 text-[#98948D]" aria-hidden="true" />
              <span>Duplicate Rates</span>
            </button>

            <button
              type="button"
              onClick={onExportCSV}
              disabled={records.length === 0}
              className="min-h-[36px] px-3 py-1.5 rounded-md border border-[#E9E6E0] bg-white hover:bg-[#FAF9F5] text-xs font-medium text-[#5C5853] hover:text-[#292929] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer touch-manipulation"
            >
              <Download className="w-3.5 h-3.5 text-[#98948D]" aria-hidden="true" />
              <span>Export CSV</span>
            </button>

            <label className="min-h-[36px] px-3 py-1.5 rounded-md border border-[#E9E6E0] bg-white hover:bg-[#FAF9F5] text-xs font-medium text-[#5C5853] hover:text-[#292929] transition-colors flex items-center gap-1.5 cursor-pointer touch-manipulation">
              <Upload className="w-3.5 h-3.5 text-[#98948D]" aria-hidden="true" />
              <span>Import CSV</span>
              <input
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={handleFileInput}
              />
            </label>
          </div>
        </div>

        {isConfigOpen && (
          <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#E9E6E0] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#292929]">
                Duplicate Conversion Settings (Ashen Remnants per duplicate)
              </span>
              <span className="text-[11px] text-[#74716D]">
                *Values marked unverified can be customized to match your server drop table
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {[
                { key: 'emote', label: 'Battle Emote' },
                { key: 'basic', label: 'Basic Skin' },
                { key: 'elite', label: 'Elite Skin' },
                { key: 'special', label: 'Special Skin' },
                { key: 'epic', label: 'Epic Skin' },
                { key: 'exclusive_epic', label: 'Exclusive Epic' },
                { key: 'legend', label: 'Legend Skin' },
              ].map(({ key, label }) => {
                const isUnverified = duplicateConfig.unverified?.[key];
                const val = duplicateConfig[key as keyof DuplicateConversionConfig] as number;

                return (
                  <div key={key} className="p-2.5 rounded bg-white border border-[#E9E6E0] space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#5C5853] truncate">{label}</span>
                      {isUnverified && (
                        <span className="text-[9px] font-semibold text-[#A16207]">Unverified</span>
                      )}
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={val}
                      onChange={(e) =>
                        onUpdateDuplicateConfig({
                          ...duplicateConfig,
                          [key]: Math.max(0, parseInt(e.target.value, 10) || 0),
                        })
                      }
                      className="w-full px-2 py-1 border border-[#E9E6E0] rounded font-mono font-semibold text-xs text-[#292929] tabular-nums focus:outline-none focus:border-[#B52E45]"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#74716D]">Batch size:</span>
            {[1, 5, 10].map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => handleBatchSizeChange(sz)}
                className={`min-h-[32px] px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer touch-manipulation ${
                  batchSize === sz
                    ? 'bg-[#B52E45] text-white'
                    : 'bg-[#F7F6F2] hover:bg-[#EFECE6] border border-[#E9E6E0] text-[#292929]'
                }`}
              >
                {sz} {sz === 1 ? 'draw' : 'draws'}
              </button>
            ))}

            <div className="flex items-center gap-1 ml-2">
              <input
                type="number"
                min="1"
                max="50"
                value={customBatchCount}
                onChange={(e) => setCustomBatchCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-14 px-2 py-1 border border-[#E9E6E0] rounded text-center text-xs font-mono font-semibold tabular-nums focus:outline-none focus:border-[#B52E45]"
              />
              <button
                type="button"
                onClick={handleCustomBatchGenerate}
                className="min-h-[32px] px-2 py-1 rounded bg-[#F7F6F2] hover:bg-[#EFECE6] border border-[#E9E6E0] text-xs font-medium text-[#292929] cursor-pointer touch-manipulation"
              >
                Set
              </button>
            </div>
          </div>

          {feedbackMsg && (
            <div className="text-xs font-semibold text-[#1E7E4E] flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>{feedbackMsg}</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto border border-[#E9E6E0] rounded-md">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead className="bg-[#FAF9F5] border-b border-[#E9E6E0] text-[#74716D] font-medium">
              <tr>
                <th className="py-2.5 px-3 w-16">Draw #</th>
                <th className="py-2.5 px-3 w-28">Direct Drops</th>
                <th className="py-2.5 px-3 w-36">Duplicate Item</th>
                <th className="py-2.5 px-3 w-28">Duplicate Rem</th>
                <th className="py-2.5 px-3 w-28">Total Remnants</th>
                <th className="py-2.5 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E6E0] font-mono">
              {draftRows.map((row, idx) => {
                const total = calculateRowTotal(row);

                return (
                  <tr key={idx} className="hover:bg-[#FAF9F5]">
                    <td className="py-2 px-3 font-semibold text-[#292929]">
                      #{row.drawNumber}
                    </td>

                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={row.directRemnants}
                        onChange={(e) => handleRowChange(idx, 'directRemnants', e.target.value)}
                        className="w-20 px-2 py-1 bg-white border border-[#E9E6E0] rounded text-xs text-[#292929] tabular-nums focus:outline-none focus:border-[#B52E45]"
                      />
                    </td>

                    <td className="py-2 px-3">
                      <select
                        value={row.duplicateRarity}
                        onChange={(e) => handleRowChange(idx, 'duplicateRarity', e.target.value)}
                        className="w-32 px-2 py-1 bg-white border border-[#E9E6E0] rounded text-xs text-[#292929] focus:outline-none focus:border-[#B52E45] font-sans"
                      >
                        <option value="none">None (0)</option>
                        <option value="emote">Emote (+{duplicateConfig.emote})</option>
                        <option value="basic">Basic (+{duplicateConfig.basic})</option>
                        <option value="elite">Elite (+{duplicateConfig.elite})</option>
                        <option value="special">Special (+{duplicateConfig.special})</option>
                        <option value="epic">Epic (+{duplicateConfig.epic})</option>
                        <option value="exclusive_epic">Exclusive (+{duplicateConfig.exclusive_epic})</option>
                        <option value="legend">Legend (+{duplicateConfig.legend})</option>
                      </select>
                    </td>

                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={row.duplicateRemnants}
                        onChange={(e) => handleRowChange(idx, 'duplicateRemnants', e.target.value)}
                        className="w-20 px-2 py-1 bg-white border border-[#E9E6E0] rounded text-xs text-[#292929] tabular-nums focus:outline-none focus:border-[#B52E45]"
                      />
                    </td>

                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="0"
                        placeholder={String(total)}
                        value={row.manualTotal}
                        onChange={(e) => handleRowChange(idx, 'manualTotal', e.target.value)}
                        className="w-20 px-2 py-1 bg-white border border-[#E9E6E0] rounded text-xs font-bold text-[#B52E45] tabular-nums focus:outline-none focus:border-[#B52E45]"
                      />
                    </td>

                    <td className="py-2 px-3 font-sans">
                      <input
                        type="text"
                        placeholder="Optional note"
                        value={row.notes}
                        onChange={(e) => handleRowChange(idx, 'notes', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-[#E9E6E0] rounded text-xs text-[#5C5853] focus:outline-none focus:border-[#B52E45]"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#74716D]">
            Total batch remnants:{' '}
            <strong className="text-[#292929] font-mono">
              {draftRows.reduce((sum, r) => sum + calculateRowTotal(r), 0)} remnants
            </strong>
          </span>

          <button
            type="button"
            onClick={handleCommitBatch}
            className="min-h-[38px] px-4 py-2 rounded-md bg-[#B52E45] hover:bg-[#9B2539] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer touch-manipulation"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Save {draftRows.length} Draws to History</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E9E6E0] rounded-lg p-4 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E9E6E0]">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[#292929]">
              Recorded Draw Log ({records.length} draws)
            </h3>
            <p className="text-xs text-[#74716D]">
              Historical ledger of every individual pull result.
            </p>
          </div>

          {records.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="self-start sm:self-auto min-h-[36px] px-3 py-1.5 rounded-md border border-[#F8D2D9] text-[#B52E45] hover:bg-[#FDF2F4] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer touch-manipulation"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear Draw Log</span>
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#74716D]">
            No draws recorded yet. Use the batch entry table above to add your first pulls.
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto border border-[#E9E6E0] rounded-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-[#E9E6E0] text-[#74716D] font-medium sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Draw #</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Direct</th>
                  <th className="py-2.5 px-3">Duplicate Conversion</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Notes</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E6E0] font-mono text-[#292929]">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF9F5]">
                    <td className="py-2 px-3 font-semibold">#{r.drawNumber}</td>
                    <td className="py-2 px-3 text-[#74716D] font-sans">
                      {r.timestamp ? r.timestamp.split('T')[0] : '—'}
                    </td>
                    <td className="py-2 px-3">{r.directRemnants}</td>
                    <td className="py-2 px-3 text-[#5C5853] font-sans">
                      {r.duplicateRarity !== 'none'
                        ? `${r.duplicateRarity} (+${r.duplicateRemnants})`
                        : '—'}
                    </td>
                    <td className="py-2 px-3 font-bold text-[#B52E45]">
                      {r.totalRemnants}
                    </td>
                    <td className="py-2 px-3 text-[#74716D] font-sans truncate max-w-xs">
                      {r.notes || '—'}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(r.id)}
                        className="p-1 text-[#74716D] hover:text-[#B52E45] transition-colors cursor-pointer"
                        title={`Delete draw #${r.drawNumber}`}
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
