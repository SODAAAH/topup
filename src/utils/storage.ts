import { INITIAL_TIPID_STATE } from '../config/tipidPlanConfig';
import { DrawSourceMode, TipidPlanState, TrackerInputs } from '../types/tracker';

const STORAGE_KEY_CALC = 'kagura_ashen_remnant_tracker_v2_calc';
const STORAGE_KEY_TIPID = 'kagura_ashen_remnant_tracker_v2_tipid';

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
      remnants: typeof parsed.remnants === 'number' || parsed.remnants === '' ? parsed.remnants : '',
      customClaimedMilestones: parsed.customClaimedMilestones || {},
      drawSourceMode: parsed.drawSourceMode === 'ledger' ? 'ledger' : 'manual',
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
      drawSourceMode: inputs.drawSourceMode === 'ledger' ? 'ledger' : 'manual',
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
      tasks: Array.isArray(parsed.tasks) && parsed.tasks.length > 0 ? parsed.tasks : INITIAL_TIPID_STATE.tasks,
      startingPromoDiamonds: typeof parsed.startingPromoDiamonds === 'number' ? parsed.startingPromoDiamonds : 0,
      nov24Expenditure: typeof parsed.nov24Expenditure === 'number' ? parsed.nov24Expenditure : 211,
      extraDrawCostPerDraw: typeof parsed.extraDrawCostPerDraw === 'number' ? parsed.extraDrawCostPerDraw : 50,
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
  } catch {
    return;
  }
}

export function exportFullBackupJSON(calcInputs: TrackerInputs, tipidState: TipidPlanState): string {
  const payload = {
    version: '2.0.0',
    exportTimestamp: new Date().toISOString(),
    calculator: calcInputs,
    tipidPlan: tipidState,
  };
  return JSON.stringify(payload, null, 2);
}

export function importFullBackupJSON(
  jsonString: string
): { calc: TrackerInputs; tipid: TipidPlanState } | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') return null;

    const calc: TrackerInputs = {
      draws: typeof parsed.calculator?.draws === 'number' || parsed.calculator?.draws === '' ? parsed.calculator.draws : '',
      remnants: typeof parsed.calculator?.remnants === 'number' || parsed.calculator?.remnants === '' ? parsed.calculator.remnants : '',
      customClaimedMilestones: parsed.calculator?.customClaimedMilestones || {},
      drawSourceMode: parsed.calculator?.drawSourceMode === 'ledger' ? 'ledger' : 'manual',
    };

    const tipid: TipidPlanState = {
      tasks: Array.isArray(parsed.tipidPlan?.tasks) ? parsed.tipidPlan.tasks : INITIAL_TIPID_STATE.tasks,
      startingPromoDiamonds: typeof parsed.tipidPlan?.startingPromoDiamonds === 'number' ? parsed.tipidPlan.startingPromoDiamonds : 0,
      nov24Expenditure: typeof parsed.tipidPlan?.nov24Expenditure === 'number' ? parsed.tipidPlan.nov24Expenditure : 211,
      extraDrawCostPerDraw: typeof parsed.tipidPlan?.extraDrawCostPerDraw === 'number' ? parsed.tipidPlan.extraDrawCostPerDraw : 50,
      purchases: Array.isArray(parsed.tipidPlan?.purchases) ? parsed.tipidPlan.purchases : [],
    };

    return { calc, tipid };
  } catch {
    return null;
  }
}
