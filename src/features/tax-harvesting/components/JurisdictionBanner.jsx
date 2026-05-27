import React from 'react';
import Accordion from '../../../components/ui/Accordion';

export default function JurisdictionBanner({ currency }) {
  const getBannerTitle = () => {
    return (
      <div className="flex items-center space-x-2 text-blue-500 dark:text-blue-400 font-semibold transition-premium">
        <svg className="w-3.5 h-3.5 sm:w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] sm:text-2xs font-semibold uppercase tracking-wider">Important Notes & Disclaimers</span>
      </div>
    );
  };

  return (
    <Accordion
      title={getBannerTitle()}
      defaultOpen={true}
      className="border-blue-100/50 dark:border-slate-800/40 bg-blue-50/10 dark:bg-blue-900/5 animate-slide-up"
      titleClassName="p-3 sm:p-4"
    >
      <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 space-y-2.5 sm:space-y-3 leading-relaxed font-normal p-3 sm:p-4">
        {currency === '₹' && (
          <div className="p-2 sm:p-3 bg-amber-500/5 border border-amber-500/10 text-amber-700 dark:text-amber-400 rounded-xl mb-2 sm:mb-3 font-medium text-[10px] sm:text-xs">
            ⚠️ Tax-loss harvesting is currently not allowed under Indian VDA (Virtual Digital Asset) tax regulations. 
            Under Section 115BBH of the Income Tax Act, losses from trading one crypto cannot offset gains from another.
            Please consult your tax advisor before making decisions.
          </div>
        )}

        <ul className="list-disc list-inside pl-0.5 space-y-1 sm:space-y-1.5 font-normal">
          <li>
            <span className="font-semibold text-slate-700 dark:text-slate-200">Indian Regulations Note:</span> Tax-loss harvesting does not apply to VDA gains under current Indian tax law. For custom simulation, gains and losses can be set off here.
          </li>
          <li>
            Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.
          </li>
          <li>
            Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.
          </li>
          <li>
            Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term unless specified.
          </li>
          <li>
            Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.
          </li>
        </ul>
      </div>
    </Accordion>
  );
}
