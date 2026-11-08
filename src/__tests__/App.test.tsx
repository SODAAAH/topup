import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../App';

describe('Kagura Ashen Remnant Tracker - Integrated App Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initial state with empty inputs and neutral verdict', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: /Kagura Ashen Remnant Tracker/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your total draws/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your current remnants/i)).toBeInTheDocument();
    expect(screen.getByText(/NOT ENOUGH DATA YET/i)).toBeInTheDocument();
  });

  it('calculates below 120-draw planning pace with early draw sample warning for 8 draws and 65 remnants', () => {
    render(<App />);

    const drawsInput = screen.getByPlaceholderText(/Enter your total draws/i);
    const remnantsInput = screen.getByPlaceholderText(/Enter your current remnants/i);

    fireEvent.change(drawsInput, { target: { value: '8' } });
    fireEvent.change(remnantsInput, { target: { value: '65' } });

    expect(screen.getByText('Below 120-draw planning pace')).toBeInTheDocument();
    expect(screen.getByText(/Very Early Sample/i)).toBeInTheDocument();
    expect(screen.getByText(/you've only completed 8 draws/i)).toBeInTheDocument();
  });

  it('calculates within 110–115 extended range for 22 draws and 319 remnants', () => {
    render(<App />);

    const drawsInput = screen.getByPlaceholderText(/Enter your total draws/i);
    const remnantsInput = screen.getByPlaceholderText(/Enter your current remnants/i);

    fireEvent.change(drawsInput, { target: { value: '22' } });
    fireEvent.change(remnantsInput, { target: { value: '319' } });

    expect(screen.getByText('Within 110–115 extended range')).toBeInTheDocument();
    expect(screen.getByText(/Limited Sample/i)).toBeInTheDocument();
  });

  it('calculates above pace for 20 draws and 329 remnants', () => {
    render(<App />);

    const drawsInput = screen.getByPlaceholderText(/Enter your total draws/i);
    const remnantsInput = screen.getByPlaceholderText(/Enter your current remnants/i);

    fireEvent.change(drawsInput, { target: { value: '20' } });
    fireEvent.change(remnantsInput, { target: { value: '329' } });

    expect(screen.getByText("You're above pace!")).toBeInTheDocument();
  });

  it('navigates seamlessly between tabs and displays respective components', () => {
    render(<App />);

    const tipidPlanTab = screen.getByRole('button', { name: /Daily Tipid Plan/i });
    fireEvent.click(tipidPlanTab);
    expect(screen.getByText(/Daily Tipid Checklist & Event Roadmap/i)).toBeInTheDocument();
    expect(screen.getByText(/Day 1 — Event Launch & Mega Bundles/i)).toBeInTheDocument();

    const budgetTab = screen.getByRole('button', { name: /Diamond & Budget/i });
    fireEvent.click(budgetTab);
    expect(
      screen.getByText(/Diamond Budget & Real-Money Expense Tracker/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Blue Diamond Consumption/i)).toBeInTheDocument();
    expect(screen.getByText(/Promo Diamond Balance & Shortfall/i)).toBeInTheDocument();

    const planVsActualTab = screen.getByRole('button', { name: /Plan vs. Actual/i });
    fireEvent.click(planVsActualTab);
    expect(
      screen.getByText(/Plan vs. Actual Performance Dashboard/i)
    ).toBeInTheDocument();

    const trackerTab = screen.getByRole('button', { name: /Remnant Tracker/i });
    fireEvent.click(trackerTab);
    expect(screen.getByPlaceholderText(/Enter your total draws/i)).toBeInTheDocument();
  });

  it('switches between manual mode and synced ledger mode without overwriting', () => {
    render(<App />);

    const tipidPlanTab = screen.getByRole('button', { name: /Daily Tipid Plan/i });
    fireEvent.click(tipidPlanTab);

    const doneButtons = screen.getAllByRole('button', { name: /Done/i });
    fireEvent.click(doneButtons[0]);

    const trackerTab = screen.getByRole('button', { name: /Remnant Tracker/i });
    fireEvent.click(trackerTab);

    const syncButton = screen.getByRole('button', { name: /Synced from Plan/i });
    fireEvent.click(syncButton);

    const drawsInput = screen.getByPlaceholderText(/Enter your total draws/i) as HTMLInputElement;
    expect(drawsInput.value).toBe('6');
    expect(drawsInput).toHaveAttribute('readonly');

    const manualButton = screen.getByRole('button', { name: /Manual Input/i });
    fireEvent.click(manualButton);

    expect(drawsInput).not.toHaveAttribute('readonly');
  });

  it('shows goal reached state when remnants are 1,600 or more', () => {
    render(<App />);

    const drawsInput = screen.getByPlaceholderText(/Enter your total draws/i);
    const remnantsInput = screen.getByPlaceholderText(/Enter your current remnants/i);

    fireEvent.change(drawsInput, { target: { value: '95' } });
    fireEvent.change(remnantsInput, { target: { value: '1600' } });

    expect(screen.getByText(/ACHIEVEMENT/i)).toBeInTheDocument();
    expect(screen.getByText(/GOAL REACHED!/i)).toBeInTheDocument();
  });

  it('opens reset modal and allows resetting only the calculator while keeping other data', () => {
    render(<App />);

    const drawsInput = screen.getByPlaceholderText(/Enter your total draws/i) as HTMLInputElement;
    const remnantsInput = screen.getByPlaceholderText(/Enter your current remnants/i) as HTMLInputElement;

    fireEvent.change(drawsInput, { target: { value: '30' } });
    fireEvent.change(remnantsInput, { target: { value: '450' } });

    const resetBtn = screen.getByRole('button', { name: /Reset tracker inputs/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText(/Reset Confirmation/i)).toBeInTheDocument();

    const calcOnlyOption = screen.getByLabelText(/Reset Remnant Calculator Only/i);
    fireEvent.click(calcOnlyOption);

    const confirmBtn = screen.getByRole('button', { name: /Confirm Reset/i });
    fireEvent.click(confirmBtn);

    expect(drawsInput.value).toBe('');
    expect(remnantsInput.value).toBe('');
    expect(screen.getByText(/NOT ENOUGH DATA YET/i)).toBeInTheDocument();
  });

  it('increments draws and remnants using quick-add duplicate chips', () => {
    render(<App />);

    const drawsInput = screen.getByPlaceholderText(/Enter your total draws/i) as HTMLInputElement;
    const remnantsInput = screen.getByPlaceholderText(/Enter your current remnants/i) as HTMLInputElement;

    const add1DrawBtn = screen.getByTitle('Add 1 draw');
    const add10DrawBtn = screen.getByTitle('Add 10 draws');
    const add3RemnantsBtn = screen.getByTitle('Add 3 remnants');
    const add50RemnantsBtn = screen.getByTitle('Add 50 remnants');
    const add200RemnantsBtn = screen.getByTitle('Add 200 remnants');

    fireEvent.click(add1DrawBtn);
    expect(drawsInput.value).toBe('1');

    fireEvent.click(add10DrawBtn);
    expect(drawsInput.value).toBe('11');

    fireEvent.click(add3RemnantsBtn);
    expect(remnantsInput.value).toBe('3');

    fireEvent.click(add50RemnantsBtn);
    expect(remnantsInput.value).toBe('53');

    fireEvent.click(add200RemnantsBtn);
    expect(remnantsInput.value).toBe('253');
  });
});
