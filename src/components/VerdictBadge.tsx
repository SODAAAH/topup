import React, { useState } from 'react';
import { TrendingUp, Target, AlertCircle, HelpCircle, Trophy, Compass, Copy, Check } from 'lucide-react';
import { ConfidenceLevel, VerdictType } from '../types/tracker';

interface VerdictBadgeProps {
  verdict: VerdictType;
  title: string;
  message: string;
  trueAverage: number | null;
  isGoalReached: boolean;
  goalReachedTitle: string;
  goalReachedMessage: string;
  draws?: number;
  currentRemnants?: number;
  confidence?: ConfidenceLevel;
  confidenceTitle?: string;
  confidenceMessage?: string;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  verdict,
  title,
  message,
  trueAverage,
  isGoalReached,
  goalReachedTitle,
  goalReachedMessage,
  draws = 0,
  currentRemnants = 0,
  confidence,
  confidenceTitle,
  confidenceMessage,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = async () => {
    if (trueAverage === null) return;
    const text = `Kagura Ashen Remnants: ${draws} draws • ${currentRemnants} remnants • ${trueAverage.toFixed(2)}/draw (${title})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getVerdictTheme = () => {
    switch (verdict) {
      case 'green':
        return {
          wrapper: 'bg-[#EDF7F1] border-[#C7E9D5]',
          text: 'text-[#1E7E4E]',
          dot: 'bg-[#1E7E4E]',
          tag: 'bg-[#DEEFE5] text-[#1E7E4E]',
          icon: TrendingUp,
        };
      case 'blue':
        return {
          wrapper: 'bg-[#EEF5FC] border-[#C6DFFA]',
          text: 'text-[#1D64C2]',
          dot: 'bg-[#1D64C2]',
          tag: 'bg-[#DFEDF9] text-[#1D64C2]',
          icon: Compass,
        };
      case 'yellow':
        return {
          wrapper: 'bg-[#FEF9EE] border-[#F6E2B6]',
          text: 'text-[#A16207]',
          dot: 'bg-[#A16207]',
          tag: 'bg-[#FDF0D5] text-[#A16207]',
          icon: Target,
        };
      case 'orange':
        return {
          wrapper: 'bg-[#FFF7ED] border-[#FED7AA]',
          text: 'text-[#C2410C]',
          dot: 'bg-[#C2410C]',
          tag: 'bg-[#FFEDD5] text-[#C2410C]',
          icon: Target,
        };
      case 'red':
        return {
          wrapper: 'bg-[#FDF2F4] border-[#F8D2D9]',
          text: 'text-[#B52E45]',
          dot: 'bg-[#B52E45]',
          tag: 'bg-[#F9DEE3] text-[#B52E45]',
          icon: AlertCircle,
        };
      case 'neutral':
      default:
        return {
          wrapper: 'bg-white border-[#E9E6E0]',
          text: 'text-[#5C5853]',
          dot: 'bg-[#98948D]',
          tag: 'bg-[#F4F2EC] text-[#5C5853]',
          icon: HelpCircle,
        };
    }
  };

  const theme = getVerdictTheme();
  const IconComponent = theme.icon;

  return (
    <div className="space-y-4" aria-live="polite">
      {isGoalReached && (
        <div className="p-5 rounded-lg bg-[#FBF8F0] border border-[#EFE2C6] flex items-start sm:items-center gap-3.5">
          <div className="p-2 rounded bg-white border border-[#EFE2C6] shrink-0 text-[#BE9B57]">
            <Trophy className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#9D7E3F]">
                Achievement
              </span>
              <h4 className="text-sm font-bold text-[#292929]">
                {goalReachedTitle}
              </h4>
            </div>
            <p className="mt-0.5 text-xs text-[#5C5853]">
              {goalReachedMessage}
            </p>
          </div>
        </div>
      )}

      <div className={`p-5 sm:p-6 rounded-lg border ${theme.wrapper} transition-colors`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-2 rounded bg-white/80 shrink-0 ${theme.text}`}>
              <IconComponent className="w-5 h-5" aria-hidden="true" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`w-2 h-2 rounded-full ${theme.dot}`} aria-hidden="true" />
                <h3 className={`text-base sm:text-lg font-bold tracking-tight ${theme.text}`}>
                  {title}
                </h3>
                {trueAverage !== null && (
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold tabular-nums ${theme.tag}`}>
                    {trueAverage.toFixed(2)} / draw
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs sm:text-sm text-[#5C5853] leading-relaxed max-w-3xl">
                {message}
              </p>

              {confidenceMessage && draws > 0 && confidence !== 'none' && (
                <div className="mt-2.5 pt-2 border-t border-black/10 text-xs text-[#5C5853] flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-[#292929]">{confidenceTitle} ({draws} draws):</span>
                  <span>{confidenceMessage}</span>
                </div>
              )}
            </div>
          </div>

          {trueAverage !== null && (
            <button
              type="button"
              onClick={handleCopySummary}
              className="self-start sm:self-center min-h-[36px] px-3 py-1.5 rounded-md bg-white border border-[#E9E6E0] hover:bg-[#F7F6F2] text-xs font-medium text-[#5C5853] hover:text-[#292929] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer touch-manipulation"
              title="Copy pacing result summary"
              aria-label="Copy pacing result summary"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1E7E4E]" aria-hidden="true" />
                  <span className="text-[#1E7E4E]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#98948D]" aria-hidden="true" />
                  <span>Copy summary</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
