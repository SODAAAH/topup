import { DEFAULT_DUPLICATE_CONFIG } from '../config/eventConfig';
import { INITIAL_TIPID_STATE } from '../config/tipidPlanConfig';
import {
  DrawRecord,
  DrawSourceMode,
  DuplicateConversionConfig,
  DuplicateRarity,
  TipidPlanState,
  TrackerInputs,
} from '../types/tracker';

const STORAGE_KEY_CALC = 'kagura_ashen_remnant_tracker_v2_calc';
const STORAGE_KEY_TIPID = 'kagura_ashen_remnant_tracker_v2_tipid';
const STORAGE_KEY_HISTORY = 'kagura_ashen_remnant_tracker_v2_history';
const STORAGE_KEY_DUPLICATES = 'kagura_ashen_remnant_tracker_v2_duplicates';

export interface StoredCalcData {
  draws: number | '';
  remnants: number | '';
  customClaimedMilestones: Record<string, boolean>;
  drawSourceMode: DrawSourceMode;
  lastUpdated: string;
}

export function loadSavedCalcInputs(): StoredCalcData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CALC);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      draws: typeof parsed.draws === 'number' || parsed.draws === '' ? parsed.draws : '',
      remnants:
        typeof parsed.remnants === 'number' || parsed.remnants === '' ? parsed.remnants : '',
      customClaimedMilestones: parsed.customClaimedMilestones || {},
      drawSourceMode:
        parsed.drawSourceMode === 'ledger'
          ? 'ledger'
          : parsed.drawSourceMode === 'history'
          ? 'history'
          : 'manual',
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveCalcInputs(inputs: TrackerInputs): void {
  try {
    const data: StoredCalcData = {
      draws: inputs.draws,
      remnants: inputs.remnants,
      customClaimedMilestones: inputs.customClaimedMilestones || {},
      drawSourceMode: inputs.drawSourceMode || 'manual',
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_CALC, JSON.stringify(data));
  } catch {
    return;
  }
}

export function loadSavedTipidState(): TipidPlanState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TIPID);
    if (!raw) return INITIAL_TIPID_STATE;
    const parsed = JSON.parse(raw);
    return {
      tasks:
        Array.isArray(parsed.tasks) && parsed.tasks.length > 0
          ? parsed.tasks
          : INITIAL_TIPID_STATE.tasks,
      startingPromoDiamonds:
        typeof parsed.startingPromoDiamonds === 'number' ? parsed.startingPromoDiamonds : 0,
      nov24Expenditure: typeof parsed.nov24Expenditure === 'number' ? parsed.nov24Expenditure : 211,
      extraDrawCostPerDraw:
        typeof parsed.extraDrawCostPerDraw === 'number' ? parsed.extraDrawCostPerDraw : 50,
      purchases: Array.isArray(parsed.purchases) ? parsed.purchases : INITIAL_TIPID_STATE.purchases,
    };
  } catch {
    return INITIAL_TIPID_STATE;
  }
}

export function saveTipidState(state: TipidPlanState): void {
  try {
    localStorage.setItem(STORAGE_KEY_TIPID, JSON.stringify(state));
  } catch {
    return;
  }
}

export function loadSavedDrawRecords(): DrawRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((r) => r && typeof r.drawNumber === 'number')
      .sort((a, b) => a.drawNumber - b.drawNumber);
  } catch {
    return [];
  }
}

export function saveDrawRecords(records: DrawRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(records));
  } catch {
    return;
  }
}

export function clearDrawRecords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch {
    return;
  }
}

export function loadSavedDuplicateConfig(): DuplicateConversionConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DUPLICATES);
    if (!raw) return DEFAULT_DUPLICATE_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      emote: typeof parsed.emote === 'number' ? parsed.emote : DEFAULT_DUPLICATE_CONFIG.emote,
      basic: typeof parsed.basic === 'number' ? parsed.basic : DEFAULT_DUPLICATE_CONFIG.basic,
      elite: typeof parsed.elite === 'number' ? parsed.elite : DEFAULT_DUPLICATE_CONFIG.elite,
      special:
        typeof parsed.special === 'number' ? parsed.special : DEFAULT_DUPLICATE_CONFIG.special,
      epic: typeof parsed.epic === 'number' ? parsed.epic : DEFAULT_DUPLICATE_CONFIG.epic,
      exclusive_epic:
        typeof parsed.exclusive_epic === 'number'
          ? parsed.exclusive_epic
          : DEFAULT_DUPLICATE_CONFIG.exclusive_epic,
      legend: typeof parsed.legend === 'number' ? parsed.legend : DEFAULT_DUPLICATE_CONFIG.legend,
      other: typeof parsed.other === 'number' ? parsed.other : DEFAULT_DUPLICATE_CONFIG.other,
      unverified: parsed.unverified || DEFAULT_DUPLICATE_CONFIG.unverified,
    };
  } catch {
    return DEFAULT_DUPLICATE_CONFIG;
  }
}

export function saveDuplicateConfig(config: DuplicateConversionConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_DUPLICATES, JSON.stringify(config));
  } catch {
    return;
  }
}

export function exportDrawHistoryCSV(records: DrawRecord[]): string {
  const headers = [
    'DrawNumber',
    'Timestamp',
    'DirectRemnants',
    'DuplicateRarity',
    'DuplicateRemnants',
    'TotalRemnants',
    'Notes',
  ];
  const rows = records.map((r) => [
    r.drawNumber,
    `"${r.timestamp || ''}"`,
    r.directRemnants,
    r.duplicateRarity,
    r.duplicateRemnants,
    r.totalRemnants,
    `"${(r.notes || '').replace(/"/g, '""')}"`,
  ]);
  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export function importDrawHistoryCSV(
  csvText: string,
  existingRecords: DrawRecord[] = []
): DrawRecord[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length <= 1) return existingRecords;

  const recordsMap = new Map<number, DrawRecord>();
  existingRecords.forEach((r) => recordsMap.set(r.drawNumber, r));

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    const parts: string[] = [];
    let inQuotes = false;
    let currentPart = '';

    for (let c = 0; c < line.length; c += 1) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(currentPart.trim());
        currentPart = '';
      } else {
        currentPart += char;
      }
    }
    parts.push(currentPart.trim());

    if (parts.length >= 6) {
      const drawNum = parseInt(parts[0], 10);
      if (!Number.isNaN(drawNum) && drawNum > 0) {
        const timestamp = parts[1].replace(/^"|"$/g, '') || new Date().toISOString();
        const direct = parseInt(parts[2], 10) || 0;
        const rarity = (parts[3] || 'none') as DuplicateRarity;
        const duplicate = parseInt(parts[4], 10) || 0;
        const total = parseInt(parts[5], 10) || direct + duplicate;
        const notes = parts[6] ? parts[6].replace(/^"|"$/g, '').replace(/""/g, '"') : '';

        const record: DrawRecord = {
          id: `draw-${drawNum}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          drawNumber: drawNum,
          timestamp,
          directRemnants: Math.max(0, direct),
          duplicateRarity: rarity,
          duplicateRemnants: Math.max(0, duplicate),
          totalRemnants: Math.max(0, total),
          notes,
        };
        recordsMap.set(drawNum, record);
      }
    }
  }

  return Array.from(recordsMap.values()).sort((a, b) => a.drawNumber - b.drawNumber);
}

export function clearCalcData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CALC);
  } catch {
    return;
  }
}

export function clearTipidData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_TIPID);
  } catch {
    return;
  }
}

export function clearAllTrackerData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CALC);
    localStorage.removeItem(STORAGE_KEY_TIPID);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    localStorage.removeItem(STORAGE_KEY_DUPLICATES);
  } catch {
    return;
  }
}

export function exportFullBackupJSON(
  calcInputs: TrackerInputs,
  tipidState: TipidPlanState,
  drawRecords: DrawRecord[] = [],
  duplicateConfig: DuplicateConversionConfig = DEFAULT_DUPLICATE_CONFIG
): string {
  const payload = {
    version: '3.0.0',
    exportTimestamp: new Date().toISOString(),
    calculator: calcInputs,
    tipidPlan: tipidState,
    drawHistory: drawRecords,
    duplicateConfig,
  };
  return JSON.stringify(payload, null, 2);
}

export function importFullBackupJSON(
  jsonString: string
): {
  calc: TrackerInputs;
  tipid: TipidPlanState;
  drawRecords?: DrawRecord[];
  duplicateConfig?: DuplicateConversionConfig;
} | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') return null;

    const calc: TrackerInputs = {
      draws:
        typeof parsed.calculator?.draws === 'number' || parsed.calculator?.draws === ''
          ? parsed.calculator.draws
          : '',
      remnants:
        typeof parsed.calculator?.remnants === 'number' || parsed.calculator?.remnants === ''
          ? parsed.calculator.remnants
          : '',
      customClaimedMilestones: parsed.calculator?.customClaimedMilestones || {},
      drawSourceMode:
        parsed.calculator?.drawSourceMode === 'ledger'
          ? 'ledger'
          : parsed.calculator?.drawSourceMode === 'history'
          ? 'history'
          : 'manual',
    };

    const tipid: TipidPlanState = {
      tasks:
        Array.isArray(parsed.tipidPlan?.tasks) && parsed.tipidPlan.tasks.length > 0
          ? parsed.tipidPlan.tasks
          : INITIAL_TIPID_STATE.tasks,
      startingPromoDiamonds:
        typeof parsed.tipidPlan?.startingPromoDiamonds === 'number'
          ? parsed.tipidPlan.startingPromoDiamonds
          : 0,
      nov24Expenditure:
        typeof parsed.tipidPlan?.nov24Expenditure === 'number'
          ? parsed.tipidPlan.nov24Expenditure
          : 211,
      extraDrawCostPerDraw:
        typeof parsed.tipidPlan?.extraDrawCostPerDraw === 'number'
          ? parsed.tipidPlan.extraDrawCostPerDraw
          : 50,
      purchases: Array.isArray(parsed.tipidPlan?.purchases) ? parsed.tipidPlan.purchases : [],
    };

    const drawRecords: DrawRecord[] = Array.isArray(parsed.drawHistory)
      ? parsed.drawHistory.filter((r: DrawRecord) => r && typeof r.drawNumber === 'number')
      : [];

    const duplicateConfig: DuplicateConversionConfig = parsed.duplicateConfig
      ? {
          emote:
            typeof parsed.duplicateConfig.emote === 'number'
              ? parsed.duplicateConfig.emote
              : DEFAULT_DUPLICATE_CONFIG.emote,
          basic:
            typeof parsed.duplicateConfig.basic === 'number'
              ? parsed.duplicateConfig.basic
              : DEFAULT_DUPLICATE_CONFIG.basic,
          elite:
            typeof parsed.duplicateConfig.elite === 'number'
              ? parsed.duplicateConfig.elite
              : DEFAULT_DUPLICATE_CONFIG.elite,
          special:
            typeof parsed.duplicateConfig.special === 'number'
              ? parsed.duplicateConfig.special
              : DEFAULT_DUPLICATE_CONFIG.special,
          epic:
            typeof parsed.duplicateConfig.epic === 'number'
              ? parsed.duplicateConfig.epic
              : DEFAULT_DUPLICATE_CONFIG.epic,
          exclusive_epic:
            typeof parsed.duplicateConfig.exclusive_epic === 'number'
              ? parsed.duplicateConfig.exclusive_epic
              : DEFAULT_DUPLICATE_CONFIG.exclusive_epic,
          legend:
            typeof parsed.duplicateConfig.legend === 'number'
              ? parsed.duplicateConfig.legend
              : DEFAULT_DUPLICATE_CONFIG.legend,
          other:
            typeof parsed.duplicateConfig.other === 'number'
              ? parsed.duplicateConfig.other
              : DEFAULT_DUPLICATE_CONFIG.other,
          unverified: parsed.duplicateConfig.unverified || DEFAULT_DUPLICATE_CONFIG.unverified,
        }
      : DEFAULT_DUPLICATE_CONFIG;

    return { calc, tipid, drawRecords, duplicateConfig };
  } catch {
    return null;
  }
}
