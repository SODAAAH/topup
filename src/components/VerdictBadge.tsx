import React from 'react';
import { TrendingUp, Target, AlertCircle, HelpCircle, Trophy, Compass } from 'lucide-react';
import { VerdictType } from '../types/tracker';

interface VerdictBadgeProps {
  verdict: VerdictType;
  title: string;
  message: string;
  trueAverage: number | null;
  isGoalReached: boolean;
  goalReachedTitle: string;
  goalReachedMessage: string;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  verdict,
  title,
  message,
  trueAverage,
  isGoalReached,
  goalReachedTitle,
  goalReachedMessage,
}) => {
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
    <div className="space-y-4">
      {isGoalReached && (
        <div className="p-5 rounded-lg bg-[#FBF8F0] border border-[#EFE2C6] flex items-start sm:items-center gap-3.5">
          <div className="p-2 rounded bg-white border border-[#EFE2C6] shrink-0 text-[#BE9B57]">
            <Trophy className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9D7E3F]">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
