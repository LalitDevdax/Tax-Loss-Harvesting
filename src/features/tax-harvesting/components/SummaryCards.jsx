import React from 'react';
import Card from '../../../components/ui/Card';
import { formatCurrency } from '../utils/taxCalculator';

export default function SummaryCards({ calculations, currency, isTableLoading }) {
  const {
    baseline = {},
    stProfits = 70200.88,
    stLosses = 1548.53,
    stNet = 68652.35,
    ltProfits = 5020,
    ltLosses = 3050,
    ltNet = 1970,
    realisedGains = 70622.35,
    taxSavings = 0,
    gainsSaved = 0
  } = calculations;

  const {
    stProfits: preStProfits = 70200.88,
    stLosses: preStLosses = 1548.53,
    stNet: preStNet = 68652.35,
    ltProfits: preLtProfits = 5020,
    ltLosses: preLtLosses = 3050,
    ltNet: preLtNet = 1970,
    realisedGains: preRealisedGains = 70622.35
  } = baseline;

  const renderLeftValue = (val) => {
    if (isTableLoading) {
      return (
        <span className="inline-block h-3 w-16 bg-slate-200/25 dark:bg-slate-700/40 rounded animate-pulse" />
      );
    }
    return formatCurrency(val, currency);
  };

  const renderRightValue = (val) => {
    if (isTableLoading) {
      return (
        <span className="inline-block h-3 w-16 bg-white/20 rounded animate-pulse" />
      );
    }
    return formatCurrency(val, currency);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
      {/* Pre-Harvesting Card (Left - Sleek Dark Card) */}
      <Card className="flex flex-col justify-between border-white/15 bg-[#0c0f19]/90 text-slate-200 p-4 sm:p-6 relative overflow-hidden transition-premium hover-card-lift shadow-sm">
        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:18px_18px] opacity-25 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 sm:mb-5 border-b border-white/15 pb-2.5 sm:pb-3">
            <h3 className="text-[10px] sm:text-xs font-semibold tracking-wider text-white uppercase">
              Pre Harvesting
            </h3>
            <span className="text-[8px] sm:text-[9px] font-medium tracking-wide px-1.5 sm:px-2 py-0.5 rounded bg-slate-900 border border-white/15 text-slate-400">Baseline</span>
          </div>

          <div className="space-y-3 sm:space-y-3.5">
            {/* Table Headers */}
            <div className="grid grid-cols-3 text-[8px] sm:text-[10px] font-semibold tracking-wider text-slate-405 dark:text-slate-400 uppercase text-right">
              <span className="text-left"></span>
              <span>Short-term</span>
              <span>Long-term</span>
            </div>

            {/* Profits */}
            <div className="grid grid-cols-3 text-[10px] sm:text-xs text-slate-400 text-right">
              <span className="text-left text-slate-500 text-[9px] sm:text-xs">Profits</span>
              <span className="text-slate-300 font-medium">{renderLeftValue(preStProfits)}</span>
              <span className="text-slate-300 font-medium">{renderLeftValue(preLtProfits)}</span>
            </div>

            {/* Losses */}
            <div className="grid grid-cols-3 text-[10px] sm:text-xs text-slate-400 text-right">
              <span className="text-left text-slate-500 text-[9px] sm:text-xs">Losses</span>
              <span className="text-red-400/80 font-medium">{renderLeftValue(preStLosses)}</span>
              <span className="text-red-400/80 font-medium">{renderLeftValue(preLtLosses)}</span>
            </div>

            {/* Net Gains */}
            <div className="grid grid-cols-3 text-[10px] sm:text-xs text-slate-400 text-right pb-2.5 sm:pb-3 border-b border-white/15">
              <span className="text-left text-slate-500 text-[9px] sm:text-xs">Net Gains</span>
              <span className="font-semibold text-slate-100">{renderLeftValue(preStNet)}</span>
              <span className="font-semibold text-slate-100">{renderLeftValue(preLtNet)}</span>
            </div>
          </div>
        </div>

        {/* Realised Capital Gains */}
        <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 flex items-baseline justify-between border-t border-white/15 relative z-10">
          <span className="text-[10px] sm:text-xs font-semibold text-white/90 uppercase tracking-wider">Realised Gains:</span>
          <span className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            {isTableLoading ? (
              <span className="inline-block h-5 sm:h-6 w-20 sm:w-24 bg-slate-200/25 dark:bg-slate-700/40 rounded animate-pulse" />
            ) : (
              formatCurrency(preRealisedGains, currency)
            )}
          </span>
        </div>
      </Card>

      {/* After-Harvesting Card (Right - Sleek Blue Gradient) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-4 sm:p-6 transition-premium hover-card-lift shadow-sm flex flex-col justify-between border border-white/20">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 sm:mb-5 border-b border-white/20 pb-2.5 sm:pb-3">
            <h3 className="text-[10px] sm:text-xs font-semibold tracking-wider text-white uppercase">
              After Harvesting
            </h3>
            <span className="text-[8px] sm:text-[9px] font-medium tracking-wide px-1.5 sm:px-2 py-0.5 rounded bg-white/10 text-blue-100 border border-white/20">Simulated</span>
          </div>

          <div className="space-y-3 sm:space-y-3.5">
            {/* Table Headers */}
            <div className="grid grid-cols-3 text-[8px] sm:text-[10px] font-semibold tracking-wider text-blue-200 uppercase text-right">
              <span className="text-left"></span>
              <span>Short-term</span>
              <span>Long-term</span>
            </div>

            {/* Profits */}
            <div className="grid grid-cols-3 text-[10px] sm:text-xs text-blue-100/90 text-right">
              <span className="text-left text-blue-200/50 text-[9px] sm:text-xs">Profits</span>
              <span className="font-medium">{renderRightValue(stProfits)}</span>
              <span className="font-medium">{renderRightValue(ltProfits)}</span>
            </div>

            {/* Losses */}
            <div className="grid grid-cols-3 text-[10px] sm:text-xs text-blue-150/90 text-right">
              <span className="text-left text-blue-200/50 text-[9px] sm:text-xs">Losses</span>
              <span className="font-medium text-blue-200">{renderRightValue(stLosses)}</span>
              <span className="font-medium text-blue-200">{renderRightValue(ltLosses)}</span>
            </div>

            {/* Net Gains */}
            <div className="grid grid-cols-3 text-[10px] sm:text-xs text-blue-150/90 text-right pb-2.5 sm:pb-3 border-b border-white/20">
              <span className="text-left text-blue-200/50 text-[9px] sm:text-xs">Net Gains</span>
              <span className="font-semibold text-white">{renderRightValue(stNet)}</span>
              <span className="font-semibold text-white">{renderRightValue(ltNet)}</span>
            </div>
          </div>
        </div>

        {/* Effective Capital Gains & Callouts */}
        <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-3.5 relative z-10">
          <div className="pt-2 sm:pt-2.5 flex items-baseline justify-between border-t border-white/20">
            <span className="text-[10px] sm:text-xs font-semibold text-white/90 uppercase tracking-wider">Effective Gains:</span>
            <span className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              {isTableLoading ? (
                <span className="inline-block h-5 sm:h-6 w-20 sm:w-24 bg-white/20 rounded animate-pulse" />
              ) : (
                formatCurrency(realisedGains, currency)
              )}
            </span>
          </div>

          {isTableLoading ? (
            <div className="bg-white/5 border border-white/5 rounded-xl p-2 sm:p-2.5 flex items-center justify-center select-none animate-pulse">
              <span className="h-3 w-32 bg-white/20 rounded" />
            </div>
          ) : taxSavings > 0 ? (
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-2.5 sm:p-3 flex items-center space-x-2 animate-pulse-subtle">
              <span className="text-sm">🎉</span>
              <p className="text-[10px] sm:text-xs font-semibold text-yellow-350 tracking-wide">
                You're going to save <span className="font-bold text-white underline decoration-yellow-400 decoration-1">{formatCurrency(taxSavings, currency)}</span>
              </p>
            </div>
          ) : gainsSaved > 0 ? (
            <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-xl p-2 sm:p-2.5 flex items-center space-x-2">
              <span className="text-xs sm:text-sm">📈</span>
              <p className="text-[9px] sm:text-2xs font-medium text-emerald-300">
                Gains reduced by <span className="font-bold text-white">{formatCurrency(gainsSaved, currency)}</span>.
              </p>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/5 rounded-xl p-2 sm:p-2.5 flex items-center justify-center select-none">
              <p className="text-[9px] sm:text-2xs font-medium text-blue-200/80">
                Select holdings below to offset tax liabilities.
              </p>
            </div>
          )}
      </div>
    </div>
  </div>
);
}
