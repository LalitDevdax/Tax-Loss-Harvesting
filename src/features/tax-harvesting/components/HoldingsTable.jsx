import React, { useState } from 'react';
import Checkbox from '../../../components/ui/Checkbox';
import { formatCurrency, USD_INR_RATE } from '../utils/taxCalculator';

const handleImageError = (e) => {
  e.target.src = 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
};

export default function HoldingsTable({
  holdings,
  currency,
  toggleHolding,
  updateSellAmount,
  deleteAsset,
  resetHoldings,
  onOpenAddModal,
  isTableLoading
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortKey, setSortKey] = useState('coin');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const processedHoldings = holdings
    .filter(item => {
      const matchesSearch =
        item.coin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.coinName.toLowerCase().includes(searchTerm.toLowerCase());
        
      if (!matchesSearch) return false;
      
      if (filterType === 'LOSS_ONLY') {
        return (item.stcg?.gain || 0) < 0 || (item.ltcg?.gain || 0) < 0;
      }
      if (filterType === 'GAIN_ONLY') {
        return (item.stcg?.gain || 0) > 0 || (item.ltcg?.gain || 0) > 0;
      }
      if (filterType === 'CHECKED_ONLY') {
        return item.checked;
      }
      return true;
    })
    .sort((a, b) => {
      let valA, valB;
      if (sortKey === 'coin') {
        valA = a.coin;
        valB = b.coin;
      } else if (sortKey === 'value') {
        valA = (a.totalHolding || 0) * (a.currentPrice || 0);
        valB = (b.totalHolding || 0) * (b.currentPrice || 0);
      } else if (sortKey === 'stcg') {
        valA = a.stcg?.gain || 0;
        valB = b.stcg?.gain || 0;
      } else if (sortKey === 'ltcg') {
        valA = a.ltcg?.gain || 0;
        valB = b.ltcg?.gain || 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const isAllChecked = processedHoldings.length > 0 && processedHoldings.every(item => item.checked);
  
  const handleHeaderCheckboxChange = () => {
    const targetState = !isAllChecked;
    processedHoldings.forEach(item => {
      if (item.checked !== targetState) {
        toggleHolding(item.id);
      }
    });
  };

  const hasMore = processedHoldings.length > visibleCount;

  // Premium Skeleton Row to refresh inside Holdings Table
  const SkeletonRow = () => (
    <tr className="animate-pulse border-b border-slate-100/50 dark:border-slate-900/50">
      <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
        <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded mx-auto" />
      </td>
      <td className="py-3 sm:py-4 px-2 sm:px-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-5 h-5 sm:w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="space-y-1 w-12 sm:w-20">
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-1.5 bg-slate-100/60 dark:bg-slate-800/60 rounded hidden sm:block" />
          </div>
        </div>
      </td>
      <td className="py-3 sm:py-4 px-2 sm:px-4">
        <div className="space-y-1">
          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-10 sm:w-16 ml-auto" />
          <div className="h-1.5 bg-slate-100/60 dark:bg-slate-800/60 rounded w-6 sm:w-10 ml-auto" />
        </div>
      </td>
      <td className="py-3 sm:py-4 px-2 sm:px-4">
        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-8 sm:w-14 ml-auto" />
      </td>
      <td className="py-3 sm:py-4 px-2 sm:px-4">
        <div className="space-y-1">
          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-10 sm:w-16 ml-auto" />
          <div className="h-1.5 bg-slate-100/60 dark:bg-slate-800/60 rounded w-6 sm:w-10 ml-auto" />
        </div>
      </td>
      <td className="py-3 sm:py-4 px-2 sm:px-4">
        <div className="space-y-1">
          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-10 sm:w-16 ml-auto" />
          <div className="h-1.5 bg-slate-100/60 dark:bg-slate-800/60 rounded w-6 sm:w-10 ml-auto" />
        </div>
      </td>
      <td className="py-3 sm:py-4 px-2 sm:px-4 text-right">
        <div className="h-5 sm:h-7 bg-slate-100 dark:bg-slate-800 rounded w-16 sm:w-32 inline-block" />
      </td>
      <td className="py-3 sm:py-4 px-2 sm:px-4"></td>
    </tr>
  );

  const getFilterIcon = (type) => {
    switch (type) {
      case 'ALL':
        return (
          <div className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-400 transition-colors duration-300">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        );
      case 'LOSS_ONLY':
        return (
          <div className="w-5 h-5 rounded bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0 text-red-500 dark:text-red-400 transition-colors duration-300">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        );
      case 'GAIN_ONLY':
        return (
          <div className="w-5 h-5 rounded bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-500 dark:text-emerald-400 transition-colors duration-300">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        );
      case 'CHECKED_ONLY':
        return (
          <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-500 dark:text-blue-400 transition-colors duration-300">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/80 dark:bg-[#0e1322]/80 border border-slate-100/70 dark:border-slate-900/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] transition-premium animate-slide-up">
      {/* Table Title and Filters */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-900/50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Portfolio Positions</h3>
          <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Asset balances fetched dynamically</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80 rounded-lg pl-8 pr-3 py-1.5 text-[10px] sm:text-[11px] outline-none transition-premium focus:border-brand-accent/50 focus:bg-white dark:focus:bg-slate-900 text-slate-700 dark:text-slate-200 placeholder-slate-400"
            />
            <svg className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Custom Dropdown Filter (Ultra-premium UI) */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80 rounded-lg pl-2 pr-3 py-1 text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-200 font-semibold flex items-center justify-between gap-1.5 hover:bg-slate-100/55 dark:hover:bg-slate-900/40 transition-premium cursor-pointer select-none active:scale-[0.98] shadow-sm"
            >
              <div className="flex items-center space-x-1.5">
                {getFilterIcon(filterType)}
                <span>{
                  filterType === 'ALL' ? 'All Positions' :
                  filterType === 'LOSS_ONLY' ? 'Loss Positions' :
                  filterType === 'GAIN_ONLY' ? 'Gain Positions' :
                  filterType === 'CHECKED_ONLY' ? 'Selected Only' : 'Filter'
                }</span>
              </div>
              <svg className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute left-0 top-full mt-2 w-52 bg-white dark:bg-[#0c0f18] border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md p-1.5 z-50 animate-fade-in text-[10px] sm:text-[11px] font-medium text-slate-700 dark:text-slate-200">
                  {[
                    { value: 'ALL', label: 'All Positions' },
                    { value: 'LOSS_ONLY', label: 'Loss Positions' },
                    { value: 'GAIN_ONLY', label: 'Gain Positions' },
                    { value: 'CHECKED_ONLY', label: 'Selected Only' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilterType(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-premium flex items-center justify-between cursor-pointer select-none ${
                        filterType === option.value ? 'text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-500/10 font-bold' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {getFilterIcon(option.value)}
                        <span>{option.label}</span>
                      </div>
                      {filterType === option.value && (
                        <svg className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort Controls (Ghost design) */}
          <div className="flex border border-slate-200/60 dark:border-slate-800/80 rounded-lg overflow-hidden text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <button
              onClick={() => handleSort('coin')}
              className={`px-2.5 py-1.5 transition-colors border-r border-slate-200/60 dark:border-slate-800/80 cursor-pointer ${
                sortKey === 'coin' ? 'bg-slate-100/85 dark:bg-slate-800 text-brand-accent' : 'bg-slate-50/50 dark:bg-slate-900/50'
              }`}
            >
              Coin {sortKey === 'coin' && (sortOrder === 'asc' ? '▲' : '▼')}
            </button>
            <button
              onClick={() => handleSort('value')}
              className={`px-2.5 py-1.5 transition-colors cursor-pointer ${
                sortKey === 'value' ? 'bg-slate-100/85 dark:bg-slate-800 text-brand-accent' : 'bg-slate-50/50 dark:bg-slate-900/50'
              }`}
            >
              Value {sortKey === 'value' && (sortOrder === 'asc' ? '▲' : '▼')}
            </button>
          </div>

          {/* Outline Add Button */}
          <button
            onClick={onOpenAddModal}
            className="border border-brand-accent/35 text-brand-accent hover:bg-brand-accent hover:text-white font-semibold text-[10px] sm:text-[11px] px-3 py-1.5 rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            + Add Asset
          </button>

          {/* Ghost Reset Button */}
          <button
            onClick={resetHoldings}
            className="border border-slate-200 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-900 text-slate-500 font-semibold text-[10px] sm:text-[11px] px-2.5 py-1.5 rounded-lg transition-premium cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table viewport - Desktop View */}
      <div className="hidden sm:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-slate-50/40 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-900/50 text-[9px] sm:text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <th className="py-2.5 sm:py-4 px-2 sm:px-4 w-8 sm:w-12 text-center">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={handleHeaderCheckboxChange}
                    className="w-3.5 h-3.5 sm:w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-brand-accent focus:ring-brand-accent cursor-pointer"
                  />
                </div>
              </th>
              <th className="py-2.5 sm:py-4 px-2 sm:px-4">Asset</th>
              <th className="py-2.5 sm:py-4 px-2 sm:px-4 text-right">Holdings & Buy Cost</th>
              <th className="py-2.5 sm:py-4 px-2 sm:px-4 text-right">Current Price</th>
              <th className="py-2.5 sm:py-4 px-2 sm:px-4 text-right">Short-Term Gain</th>
              <th className="py-2.5 sm:py-4 px-2 sm:px-4 text-right">Long-Term Gain</th>
              <th className="py-2.5 sm:py-4 px-2 sm:px-4 text-right">Amount to Sell</th>
              <th className="py-2.5 sm:py-4 px-2 sm:px-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50 dark:divide-slate-900/50 text-[10px] sm:text-xs font-normal">
            {isTableLoading ? (
              Array(visibleCount).fill(0).map((_, i) => <SkeletonRow key={i} />)
            ) : (
              processedHoldings.slice(0, visibleCount).map((item) => {
                const rate = currency === '$' ? USD_INR_RATE : 1;
                const averageBuyPriceScaled = item.averageBuyPrice / rate;
                const currentPriceScaled = item.currentPrice / rate;
                const stcgGain = (item.stcg?.gain || 0) / rate;
                const ltcgGain = (item.ltcg?.gain || 0) / rate;

                return (
                  <tr
                    key={item.id}
                    className={`transition-all duration-300 hover:bg-slate-50/30 dark:hover:bg-slate-800/5 ${
                      item.checked ? 'bg-blue-50/10 dark:bg-blue-900/5' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          id={`check-${item.id}`}
                          checked={item.checked}
                          onChange={() => toggleHolding(item.id)}
                        />
                      </div>
                    </td>

                    {/* Coin logo & ticker */}
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-2 sm:space-x-3 group">
                        <img
                          src={item.logo}
                          alt={`${item.coin} logo`}
                          onError={handleImageError}
                          className="w-5 h-5 sm:w-6 h-6 rounded-full object-cover bg-white p-0.5 border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-800 dark:text-slate-100 block leading-tight text-[10px] sm:text-xs">
                            {item.coin}
                          </span>
                          <span 
                            className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate hidden sm:block max-w-[130px] lg:max-w-[200px]"
                            title={item.coinName}
                          >
                            {item.coinName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Balance / Avg Buy Price */}
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-right font-medium">
                      <span className="text-slate-800 dark:text-slate-100 block font-medium text-[10px] sm:text-xs">
                        {item.totalHolding < 0.000001 && item.totalHolding > 0 
                          ? item.totalHolding.toExponential(2) 
                          : item.totalHolding.toLocaleString('en-US', { maximumFractionDigits: 4 })
                        } {item.coin}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 font-normal">
                        Avg: {formatCurrency(averageBuyPriceScaled, currency)}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-right font-medium text-slate-700 dark:text-slate-200 text-[10px] sm:text-xs">
                      {formatCurrency(currentPriceScaled, currency)}
                    </td>

                    {/* STCG */}
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-right font-medium text-[10px] sm:text-xs">
                      <div className={`${stcgGain < 0 ? 'text-red-500' : stcgGain > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {stcgGain > 0 ? '+' : ''}
                        {formatCurrency(stcgGain, currency)}
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 font-normal block mt-0.5">
                        Bal: {item.stcg?.balance < 0.000001 && item.stcg?.balance > 0
                          ? item.stcg.balance.toExponential(2)
                          : (item.stcg?.balance || 0).toLocaleString('en-US', { maximumFractionDigits: 4 })
                        } {item.coin}
                      </span>
                    </td>

                    {/* LTCG */}
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-right font-medium text-[10px] sm:text-xs">
                      <div className={`${ltcgGain < 0 ? 'text-red-500' : ltcgGain > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {ltcgGain > 0 ? '+' : ''}
                        {formatCurrency(ltcgGain, currency)}
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 font-normal block mt-0.5">
                        Bal: {item.ltcg?.balance < 0.000001 && item.ltcg?.balance > 0
                          ? item.ltcg.balance.toExponential(2)
                          : (item.ltcg?.balance || 0).toLocaleString('en-US', { maximumFractionDigits: 4 })
                        } {item.coin}
                      </span>
                    </td>

                    {/* Sell Input */}
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-right">
                      {item.checked ? (
                        <div className="relative inline-block w-24 sm:w-40 animate-fade-in">
                          <input
                            type="number"
                            step="any"
                            min="0"
                            max={item.totalHolding}
                            value={item.amountToSell === 0 ? '' : item.amountToSell}
                            onChange={(e) => updateSellAmount(item.id, e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-lg py-1 sm:py-1.5 pl-2 sm:pl-3 pr-8 sm:pr-14 text-[9px] sm:text-2xs font-semibold text-slate-800 dark:text-white outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 text-right transition-premium"
                          />
                          <span className="absolute right-1.5 sm:right-2.5 top-2 sm:top-2.5 text-[8px] sm:text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase pointer-events-none">
                            {item.coin}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-350 dark:text-slate-650 font-normal">-</span>
                      )}
                    </td>

                    {/* Actions (Delete) */}
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                      {item.id.startsWith('custom-') ? (
                        <button
                          onClick={() => deleteAsset(item.id)}
                          className="text-slate-350 hover:text-red-500 hover:scale-105 active:scale-95 transition-all duration-300 p-1 cursor-pointer"
                          title="Delete position"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      ) : (
                        <div className="w-3.5 h-3.5" />
                      )}
                    </td>
                  </tr>
                );
              })
            )}

            {!isTableLoading && processedHoldings.length === 0 && (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400 dark:text-slate-600 font-medium text-[10px] sm:text-xs">
                  <svg className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  No matching assets found in portfolio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table viewport - Mobile Card View */}
      <div className="block sm:hidden divide-y divide-slate-100/50 dark:divide-slate-900/50">
        {isTableLoading ? (
          // Mobile Shimmer loader card
          Array(visibleCount).fill(0).map((_, i) => (
            <div key={i} className="p-4 space-y-3.5 animate-pulse bg-white/50 dark:bg-[#0e1322]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800" />
                  <div className="space-y-1">
                    <div className="w-12 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded" />
                  </div>
                </div>
                <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded" />
                  <div className="w-10 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
                <div className="space-y-1 text-right">
                  <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded ml-auto" />
                  <div className="w-10 h-3 bg-slate-100 dark:bg-slate-800 rounded ml-auto" />
                </div>
                <div className="space-y-1">
                  <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded" />
                  <div className="w-10 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
                <div className="space-y-1 text-right">
                  <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded ml-auto" />
                  <div className="w-10 h-3 bg-slate-100 dark:bg-slate-800 rounded ml-auto" />
                </div>
              </div>
            </div>
          ))
        ) : processedHoldings.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-650 font-medium text-[10px] sm:text-xs">
            <svg className="w-10 h-10 mx-auto mb-3 text-slate-350 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            No matching assets found in portfolio.
          </div>
        ) : (
          processedHoldings.slice(0, visibleCount).map((item) => {
            const rate = currency === '$' ? USD_INR_RATE : 1;
            const averageBuyPriceScaled = item.averageBuyPrice / rate;
            const currentPriceScaled = item.currentPrice / rate;
            const stcgGain = (item.stcg?.gain || 0) / rate;
            const ltcgGain = (item.ltcg?.gain || 0) / rate;

            return (
              <div
                key={item.id}
                className={`p-4 space-y-3.5 transition-all duration-300 ${
                  item.checked ? 'bg-blue-50/10 dark:bg-blue-900/5' : ''
                }`}
              >
                {/* Header Row: logo, names, checkbox */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={item.logo}
                      alt={`${item.coin} logo`}
                      onError={handleImageError}
                      className="w-5 h-5 rounded-full object-cover bg-white p-0.5 border border-slate-100 dark:border-slate-800"
                    />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] block leading-tight">
                        {item.coin}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium block">
                        {item.coinName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {item.id.startsWith('custom-') && (
                      <button
                        onClick={() => deleteAsset(item.id)}
                        className="text-slate-350 hover:text-red-500 p-1 cursor-pointer active:scale-90 transition-transform"
                        title="Delete position"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    <Checkbox
                      id={`check-mobile-${item.id}`}
                      checked={item.checked}
                      onChange={() => toggleHolding(item.id)}
                    />
                  </div>
                </div>

                {/* Details Grid (2x2) */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[10px] font-normal leading-normal">
                  {/* Holdings & Buy Cost */}
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">Holdings & Buy Cost</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.totalHolding < 0.000001 && item.totalHolding > 0 
                        ? item.totalHolding.toExponential(2) 
                        : item.totalHolding.toLocaleString('en-US', { maximumFractionDigits: 4 })
                      } {item.coin}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 block text-[9px] mt-0.5 font-normal">
                      Avg: {formatCurrency(averageBuyPriceScaled, currency)}
                    </span>
                  </div>

                  {/* Current Price */}
                  <div className="text-right">
                    <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">Current Price</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(currentPriceScaled, currency)}
                    </span>
                  </div>

                  {/* STCG */}
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">Short-Term Gain</span>
                    <span className={`font-semibold ${stcgGain < 0 ? 'text-red-500' : stcgGain > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {stcgGain > 0 ? '+' : ''}
                      {formatCurrency(stcgGain, currency)}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 block text-[9px] mt-0.5 font-normal">
                      Bal: {item.stcg?.balance < 0.000001 && item.stcg?.balance > 0
                        ? item.stcg.balance.toExponential(2)
                        : (item.stcg?.balance || 0).toLocaleString('en-US', { maximumFractionDigits: 4 })
                      } {item.coin}
                    </span>
                  </div>

                  {/* LTCG */}
                  <div className="text-right">
                    <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">Long-Term Gain</span>
                    <span className={`font-semibold ${ltcgGain < 0 ? 'text-red-500' : ltcgGain > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {ltcgGain > 0 ? '+' : ''}
                      {formatCurrency(ltcgGain, currency)}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 block text-[9px] mt-0.5 font-normal">
                      Bal: {item.ltcg?.balance < 0.000001 && item.ltcg?.balance > 0
                        ? item.ltcg.balance.toExponential(2)
                        : (item.ltcg?.balance || 0).toLocaleString('en-US', { maximumFractionDigits: 4 })
                      } {item.coin}
                    </span>
                  </div>
                </div>

                {/* Amount to Sell Input */}
                {item.checked && (
                  <div className="pt-2 border-t border-slate-100/50 dark:border-slate-800/55 flex items-center justify-between gap-3 animate-fade-in">
                    <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Amount to Sell</span>
                    <div className="relative w-36">
                      <input
                        type="number"
                        step="any"
                        min="0"
                        max={item.totalHolding}
                        value={item.amountToSell === 0 ? '' : item.amountToSell}
                        onChange={(e) => updateSellAmount(item.id, e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-lg py-1 px-2.5 pr-10 text-[10px] font-bold text-slate-800 dark:text-white outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 text-right transition-premium"
                      />
                      <span className="absolute right-2 top-1.5 text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase pointer-events-none">
                        {item.coin}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer (View All control) */}
      {processedHoldings.length > 0 && (
        <div className="p-4 bg-slate-50/20 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-900/50 flex items-center justify-between text-[10px] sm:text-[11px] font-medium">
          {hasMore ? (
            <button
              onClick={() => setVisibleCount(processedHoldings.length)}
              className="text-brand-accent hover:text-brand transition-all duration-300 hover:scale-[1.01] cursor-pointer select-none font-bold uppercase tracking-wider text-3xs sm:text-2xs"
            >
              View All ({processedHoldings.length} assets)
            </button>
          ) : processedHoldings.length > 6 ? (
            <button
              onClick={() => setVisibleCount(6)}
              className="text-brand-accent hover:text-brand transition-all duration-300 hover:scale-[1.01] cursor-pointer select-none font-bold uppercase tracking-wider text-3xs sm:text-2xs"
            >
              Show Less
            </button>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">
              Showing {processedHoldings.length} of {processedHoldings.length} entries
            </span>
          )}
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            {holdings.filter(h => h.checked).length} selected for offset simulations
          </span>
        </div>
      )}
    </div>
  );
}
