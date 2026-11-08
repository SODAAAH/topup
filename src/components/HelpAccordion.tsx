import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export const HelpAccordion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-[#E9E6E0] rounded-lg overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#F7F6F2] transition-colors text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-[#B52E45] shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold text-[#292929]">
            How does this calculator work?
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#74716D] hidden sm:inline">
            {isOpen ? 'Collapse guide' : 'Read guide'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-[#98948D]" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#98948D]" aria-hidden="true" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-[#E9E6E0] space-y-4 text-xs text-[#5C5853] bg-[#FBFBFA]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-white border border-[#E9E6E0] space-y-1">
              <h4 className="font-semibold text-[#292929]">
                1. True average vs. raw average
              </h4>
              <p className="text-[#74716D] leading-relaxed">
                As you pull, the event awards one-time milestone rewards at 15, 20, 30, 40, and 50 draws (up to 105 total remnants). If we simply divided your inventory balance by your draws, those free bonus remnants would falsely inflate your draw average. This calculator subtracts claimed milestone bonuses first so you see your genuine pull rate.
              </p>
            </div>

            <div className="p-4 rounded bg-white border border-[#E9E6E0] space-y-1">
              <h4 className="font-semibold text-[#292929]">
                2. The 14.95 optimistic benchmark
              </h4>
              <p className="text-[#74716D] leading-relaxed">
                To reach 1,600 remnants in 100 draws, normal pulls must generate 1,495 remnants (1,600 minus 105 milestone bonuses). 1,495 divided by 100 draws equals <strong>14.95 remnants per draw</strong>. Averaging 14.95 or higher means you are on pace for a ~100-draw completion.
              </p>
            </div>

            <div className="p-4 rounded bg-white border border-[#E9E6E0] space-y-1">
              <h4 className="font-semibold text-[#292929]">
                3. The 13.59 backup & 13.00 extended benchmarks
              </h4>
              <p className="text-[#74716D] leading-relaxed">
                For the Tipid Plan 110-draw backup scenario, normal pulls require 1,495 remnants, which is <strong>13.5909 remnants per draw</strong> (1,495 / 110). If pulls extend to the 115-draw cushion, the required rate is exactly <strong>13.00 remnants per draw</strong> (1,495 / 115).
              </p>
            </div>

            <div className="p-4 rounded bg-white border border-[#E9E6E0] space-y-1">
              <h4 className="font-semibold text-[#292929]">
                4. Early gacha variance & fluctuation
              </h4>
              <p className="text-[#74716D] leading-relaxed">
                During the first 20 draws, a single lucky pull or a string of low-yield draws causes sharp swings in your average. Do not panic if your pace looks low in early draws — sample size naturally stabilizes as you approach 50 pulls.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded bg-white border border-[#E9E6E0] text-[#74716D] space-y-0.5">
            <span className="font-semibold text-[#292929] block">
              5. 115 draws is a planning target, not hard pity
            </span>
            <p className="leading-relaxed">
              Mobile Legends events use pseudo-random RNG for individual crest/remnant drops and duplicate conversions. The 115-draw mark is a reliable mathematical benchmark observed across community draws, but it is not an in-game guaranteed hard ceiling. Actual results depend on personal RNG.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
