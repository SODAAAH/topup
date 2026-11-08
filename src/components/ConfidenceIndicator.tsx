import React from 'react';
import { AlertCircle, Gauge, CheckCircle } from 'lucide-react';
import { ConfidenceLevel } from '../types/tracker';

interface ConfidenceIndicatorProps {
  confidence: ConfidenceLevel;
  title: string;
  message: string;
  draws: number;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  title,
  message,
  draws,
}) => {
  if (confidence === 'none' || draws === 0) {
    return null;
  }

  const getStyle = () => {
    switch (confidence) {
      case 'very_early':
        return {
          wrapper: 'bg-[#FEF9EE] border-[#F6E2B6] text-[#A16207]',
          icon: AlertCircle,
          meterWidth: 'w-1/4',
          meterColor: 'bg-[#D97706]',
        };
      case 'limited':
        return {
          wrapper: 'bg-[#EEF5FC] border-[#C6DFFA] text-[#1D64C2]',
          icon: Gauge,
          meterWidth: 'w-3/5',
          meterColor: 'bg-[#2563EB]',
        };
      case 'informative':
      default:
        return {
          wrapper: 'bg-[#EDF7F1] border-[#C7E9D5] text-[#1E7E4E]',
          icon: CheckCircle,
          meterWidth: 'w-full',
          meterColor: 'bg-[#16A34A]',
        };
    }
  };

  const style = getStyle();
  const IconComponent = style.icon;

  return (
    <div className={`p-4 rounded-lg border ${style.wrapper} flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs`}>
      <div className="flex items-start gap-2.5">
        <IconComponent className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <div className="flex items-center gap-1.5 font-semibold">
            <span>{title}</span>
            <span className="font-mono tabular-nums text-[11px] opacity-80">({draws} draws)</span>
          </div>
          <p className="mt-0.5 opacity-90 leading-relaxed text-xs">
            {message}
          </p>
        </div>
      </div>

      <div className="sm:text-right shrink-0 min-w-[120px] pt-2 sm:pt-0 border-t sm:border-t-0 border-black/10">
        <span className="text-[10px] uppercase tracking-wider opacity-75 block mb-1">
          Sample reliability
        </span>
        <div className="w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
          <div className={`h-full ${style.meterWidth} ${style.meterColor} transition-all duration-300`} />
        </div>
      </div>
    </div>
  );
};
