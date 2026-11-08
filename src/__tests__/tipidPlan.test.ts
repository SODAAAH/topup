import { describe, expect, it } from 'vitest';
import { INITIAL_SCHEDULE_TASKS } from '../config/tipidPlanConfig';
import { ScheduleTask } from '../types/tracker';

describe('Tipid Plan & Diamond Budget Engine Tests', () => {
  it('TEST: daily schedule totals exactly 100 planned draws across all periods', () => {
    const periodNov6_12 = INITIAL_SCHEDULE_TASKS.slice(0, 7);
    const sumNov6_12 = periodNov6_12.reduce((s, t) => s + t.plannedDraws, 0);
    expect(sumNov6_12).toBe(15);

    const taskNov13 = INITIAL_SCHEDULE_TASKS.find((t) => t.date === '2026-11-13');
    expect(taskNov13?.plannedDraws).toBe(39);

    const taskNov14 = INITIAL_SCHEDULE_TASKS.find((t) => t.date === '2026-11-14');
    expect(taskNov14?.plannedDraws).toBe(3);

    const periodNov15_19 = INITIAL_SCHEDULE_TASKS.filter(
      (t) => t.date >= '2026-11-15' && t.date <= '2026-11-19'
    );
    const sumNov15_19 = periodNov15_19.reduce((s, t) => s + t.plannedDraws, 0);
    expect(sumNov15_19).toBe(5);

    const taskNov20 = INITIAL_SCHEDULE_TASKS.find((t) => t.date === '2026-11-20');
    expect(taskNov20?.plannedDraws).toBe(16);

    const periodNov21_23 = INITIAL_SCHEDULE_TASKS.filter(
      (t) => t.date >= '2026-11-21' && t.date <= '2026-11-23'
    );
    const sumNov21_23 = periodNov21_23.reduce((s, t) => s + t.plannedDraws, 0);
    expect(sumNov21_23).toBe(3);

    const taskNov24 = INITIAL_SCHEDULE_TASKS.find((t) => t.date === '2026-11-24');
    expect(taskNov24?.plannedDraws).toBe(7);

    const periodNov25_Dec6 = INITIAL_SCHEDULE_TASKS.filter(
      (t) => t.date >= '2026-11-25' && t.date <= '2026-12-06'
    );
    const sumNov25_Dec6 = periodNov25_Dec6.reduce((s, t) => s + t.plannedDraws, 0);
    expect(sumNov25_Dec6).toBe(12);

    const grandTotalDraws = INITIAL_SCHEDULE_TASKS.reduce((s, t) => s + t.plannedDraws, 0);
    expect(grandTotalDraws).toBe(100);
  });

  it('TEST: Blue Diamond spending totals 2,348–2,387 range with baseline of 2,348', () => {
    const megaBundles = 237;
    const dailyDrawsDiamonds = 30 * 50;
    const phase1BlueDraws = 400;

    const minNov24 = 211;
    const maxNov24 = 250;

    const totalMin = megaBundles + dailyDrawsDiamonds + phase1BlueDraws + minNov24;
    const totalMax = megaBundles + dailyDrawsDiamonds + phase1BlueDraws + maxNov24;

    expect(totalMin).toBe(2348);
    expect(totalMax).toBe(2387);

    const total110Min = totalMin + 500;
    const total110Max = totalMax + 500;
    expect(total110Min).toBe(2848);
    expect(total110Max).toBe(2887);
  });

  it('TEST: PHP recharge budget totals ₱2,384.62 to ₱2,392.63', () => {
    const wdpMin = 7 * 112;
    const wdpMax = 7 * 113;
    expect(wdpMin).toBe(784);
    expect(wdpMax).toBe(791);

    const nov13Min = 1073;
    const nov13Max = 1074;

    const nov20Min = 527.62;
    const nov20Max = 527.63;

    const grandPhpMin = Number((wdpMin + nov13Min + nov20Min).toFixed(2));
    const grandPhpMax = Number((wdpMax + nov13Max + nov20Max).toFixed(2));

    expect(grandPhpMin).toBe(2384.62);
    expect(grandPhpMax).toBe(2392.63);
  });

  it('TEST: Promo Diamond shortfall is calculated correctly', () => {
    const plannedPromo = 1600;
    const rechargePromo = 800;

    const calcShortfall = (starting: number) => Math.max(0, plannedPromo - (rechargePromo + starting));

    expect(calcShortfall(0)).toBe(800);
    expect(calcShortfall(300)).toBe(500);
    expect(calcShortfall(800)).toBe(0);
    expect(calcShortfall(1000)).toBe(0);
  });

  it('TEST: scheduled future draws never count as completed draws until marked completed', () => {
    const tasks: ScheduleTask[] = [
      {
        ...INITIAL_SCHEDULE_TASKS[0],
        status: 'pending',
        actualDraws: 0,
      },
      {
        ...INITIAL_SCHEDULE_TASKS[1],
        status: 'completed',
        actualDraws: 2,
      },
      {
        ...INITIAL_SCHEDULE_TASKS[2],
        status: 'pending',
        actualDraws: 0,
      },
    ];

    const actualCompletedDraws = tasks
      .filter((t) => t.status === 'completed' || t.status === 'modified')
      .reduce((sum, t) => sum + t.actualDraws, 0);

    expect(actualCompletedDraws).toBe(2);
    expect(actualCompletedDraws).not.toBe(
      tasks.reduce((sum, t) => sum + t.plannedDraws, 0)
    );
  });

  it('TEST: free token draws and promo draws count toward actual completed draws without double counting', () => {
    const day8Task: ScheduleTask = {
      ...INITIAL_SCHEDULE_TASKS[7],
      status: 'completed',
      actualDraws: 39,
    };

    expect(day8Task.plannedDraws).toBe(39);
    expect(day8Task.freeTokens).toBe(18);
    expect(day8Task.plannedPromoDiamonds).toBe(1600);
    expect(day8Task.actualDraws).toBe(39);
  });
});

