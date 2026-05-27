import React, { useState } from 'react';
import { Sun, Moon, HelpCircle } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { useTaxHarvesting } from './features/tax-harvesting/hooks/useTaxHarvesting';
import SummaryCards from './features/tax-harvesting/components/SummaryCards';
import HoldingsTable from './features/tax-harvesting/components/HoldingsTable';
import AddAssetModal from './features/tax-harvesting/components/AddAssetModal';
import JurisdictionBanner from './features/tax-harvesting/components/JurisdictionBanner';
import Tooltip from './components/ui/Tooltip';

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const {
    holdings,
    isLoading,
    isTableLoading,
    error,
    currency,
    setCurrency,
    taxRate,
    setTaxRate,
    calculations,
    toggleHolding,
    updateSellAmount,
    addAsset,
    deleteAsset,
    resetHoldings
  } = useTaxHarvesting();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sleek KoinX Logo
  const Logo = () => (
    <div className="flex items-center space-x-1 select-none cursor-pointer group">
      <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-500 group-hover:text-blue-600 transition-colors duration-300">
        Koin
      </span>
      <span className="text-xl font-bold tracking-tight text-amber-500">
        X
      </span>
      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2.5 animate-pulse" />
    </div>
  );

  // Modern Shimmer Loading skeleton
  const DashboardSkeleton = () => (
    <div className="space-y-6 animate-pulse mt-8">
      <div className="h-6 bg-slate-200 dark:bg-slate-800/80 rounded-lg w-40" />
      <div className="h-20 bg-slate-200 dark:bg-slate-800/80 rounded-2xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 bg-slate-200 dark:bg-slate-800/80 rounded-2xl" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800/80 rounded-2xl" />
      </div>
      <div className="bg-white/80 dark:bg-[#0e1322]/80 border border-slate-100/70 dark:border-slate-800 p-5 space-y-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-28" />
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-48" />
        </div>
        <div className="space-y-3 pt-3">
          <div className="h-9 bg-slate-100/60 dark:bg-slate-900/60 rounded w-full" />
          <div className="h-9 bg-slate-100/60 dark:bg-slate-900/60 rounded w-full" />
          <div className="h-9 bg-slate-100/60 dark:bg-slate-900/60 rounded w-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-16 flex flex-col transition-colors duration-500">
      {/* Global Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#080b13]/85 border-b border-slate-100/60 dark:border-slate-900/50 backdrop-blur-md px-4 sm:px-6 py-2.5 sm:py-3.5 transition-premium">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Logo />
          
          {/* Desktop Navigation Controls */}
          <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
            {/* Currency Pill Switcher (Minimal design) */}
            <div className="flex bg-slate-100/80 dark:bg-slate-900/60 p-0.5 rounded-lg text-[9px] sm:text-[10px] font-semibold tracking-wide text-slate-500 border border-slate-200/20 dark:border-slate-800/30">
              <button
                onClick={() => setCurrency('₹')}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md transition-premium cursor-pointer ${
                  currency === '₹' ? 'bg-white dark:bg-[#151c2d] text-slate-800 dark:text-slate-100 shadow-sm' : 'hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('$')}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md transition-premium cursor-pointer ${
                  currency === '$' ? 'bg-white dark:bg-[#151c2d] text-slate-800 dark:text-slate-100 shadow-sm' : 'hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                $ USD
              </button>
            </div>

            {/* Custom Tax rate controls (Sleek line style) */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/20 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-semibold text-slate-400 dark:text-slate-400">
              <span className="hidden sm:inline">TAX RATE:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={Math.round(taxRate * 100)}
                onChange={(e) => setTaxRate(Number(e.target.value) / 100)}
                className="w-8 sm:w-10 text-center bg-transparent border-b border-slate-300 dark:border-slate-750 focus:border-brand-accent outline-none text-slate-800 dark:text-slate-200 font-semibold text-[11px] sm:text-xs transition-premium"
              />
              <span>%</span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-slate-400 dark:text-slate-505 hover:text-slate-555 dark:hover:text-slate-400 transition-premium cursor-pointer active:scale-95"
              aria-label="Toggle visual theme"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>

          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="block sm:hidden p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-slate-500 dark:text-slate-450 transition-premium cursor-pointer active:scale-95"
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6 text-slate-700 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 flex-grow">
        {isLoading ? (
          <DashboardSkeleton />
        ) : error ? (
          <div className="p-8 bg-red-50/50 border border-red-200/55 text-red-700 dark:text-red-400 rounded-2xl mt-8 text-center animate-fade-in">
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={resetHoldings}
              className="mt-4 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-premium cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-6 mt-6 sm:mt-8">
            {/* Title row */}
            <div className="flex items-baseline space-x-1.5 sm:space-x-2 animate-fade-in">
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                Tax Loss Harvesting
              </h1>
              
              <Tooltip 
                content="Offset your capital losses against capital gains to minimize your tax liability."
                position="right"
              >
                <button className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-0.5 text-[9px] sm:text-2xs font-semibold transition-premium cursor-pointer select-none group">
                  <span>How it works?</span>
                  <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:scale-105 transition-transform duration-300" />
                </button>
              </Tooltip>
            </div>

            {/* Collapsible disclaimer banners */}
            <JurisdictionBanner currency={currency} />

            {/* Calculations Dashboard Cards */}
            <SummaryCards calculations={calculations} currency={currency} isTableLoading={isTableLoading} />

            {/* Asset checklist table */}
            <HoldingsTable
              holdings={holdings}
              currency={currency}
              toggleHolding={toggleHolding}
              updateSellAmount={updateSellAmount}
              deleteAsset={deleteAsset}
              resetHoldings={resetHoldings}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              isTableLoading={isTableLoading}
            />
          </div>
        )}
      </main>

      {/* Add Custom Position Form Modal */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addAsset}
      />

      {/* Mobile Drawer Settings Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden sm:hidden">
          {/* Backdrop screen overlay */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-xs w-72 bg-white dark:bg-[#0c0f18] border-l border-slate-100 dark:border-slate-800 shadow-2xl p-5 flex flex-col justify-between transform transition-transform duration-300 ease-out translate-x-0 animate-slide-in-right">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Settings</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Controls list */}
              <div className="space-y-5">
                {/* Currency selector */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Currency</span>
                  <div className="flex bg-slate-100 dark:bg-slate-900/60 p-0.5 rounded-lg text-[10px] font-semibold text-slate-500 border border-slate-200/25 dark:border-slate-850/20">
                    <button
                      onClick={() => {
                        setCurrency('₹');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex-1 py-2 rounded-md transition-premium cursor-pointer text-center text-[10px] ${
                        currency === '₹' ? 'bg-white dark:bg-[#151c2d] text-slate-800 dark:text-slate-100 shadow-sm' : 'hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      ₹ INR
                    </button>
                    <button
                      onClick={() => {
                        setCurrency('$');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex-1 py-2 rounded-md transition-premium cursor-pointer text-center text-[10px] ${
                        currency === '$' ? 'bg-white dark:bg-[#151c2d] text-slate-800 dark:text-slate-100 shadow-sm' : 'hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      $ USD
                    </button>
                  </div>
                </div>

                {/* Tax rate select */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Tax Simulation</span>
                  <div className="flex items-center justify-between bg-slate-100/40 dark:bg-slate-900/30 border border-slate-200/25 dark:border-slate-850/20 px-3.5 py-2.5 rounded-lg text-[10px] font-semibold text-slate-500">
                    <span className="font-semibold text-slate-450 dark:text-slate-550 uppercase">TAX RATE:</span>
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(taxRate * 100)}
                        onChange={(e) => setTaxRate(Number(e.target.value) / 100)}
                        className="w-12 text-center bg-transparent border-b border-slate-350 dark:border-slate-750 focus:border-brand-accent outline-none text-slate-800 dark:text-slate-100 font-bold text-xs"
                      />
                      <span className="text-slate-400">%</span>
                    </div>
                  </div>
                </div>

                {/* Theme switch */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Theme</span>
                  <button
                    onClick={() => {
                      toggleTheme();
                    }}
                    className="w-full flex items-center justify-between bg-slate-100/40 dark:bg-slate-900/30 border border-slate-200/25 dark:border-slate-850/20 px-3.5 py-2.5 rounded-lg text-[10px] font-semibold text-slate-500 cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <span className="font-semibold text-slate-450 dark:text-slate-550 uppercase">TOGGLE DARK THEME</span>
                    <div className="text-slate-650 dark:text-slate-200">
                      {isDark ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-[9px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wide">Dark</span>
                          <Sun className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Light</span>
                          <Moon className="w-3.5 h-3.5 text-indigo-500" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer inside drawer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 text-[9px] text-slate-400 text-center font-semibold">
              KoinX Tax Simulator v1.0.0
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
