import React, { useState } from 'react';
import Input from '../../../components/ui/Input';

export default function AddAssetModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    coin: '',
    coinName: '',
    logo: '',
    currentPrice: '',
    totalHolding: '',
    averageBuyPrice: '',
    stcgBalance: '',
    stcgGain: '',
    ltcgBalance: '',
    ltcgGain: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.coin || !formData.coinName || !formData.totalHolding || !formData.currentPrice || !formData.averageBuyPrice) {
      alert('Please fill out all required fields.');
      return;
    }

    onAdd(formData);

    setFormData({
      coin: '',
      coinName: '',
      logo: '',
      currentPrice: '',
      totalHolding: '',
      averageBuyPrice: '',
      stcgBalance: '',
      stcgGain: '',
      ltcgBalance: '',
      ltcgGain: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-[#0c0f18] border border-slate-100 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl z-10 animate-fade-in custom-scrollbar max-h-[85vh] overflow-y-auto transition-premium">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Add Custom Position
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs font-normal">
          {/* Symbol / Name */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="coin"
              label="Coin Symbol *"
              placeholder="e.g. SOL"
              value={formData.coin}
              onChange={handleChange}
              required
            />
            <Input
              id="coinName"
              label="Coin Name *"
              placeholder="e.g. Solana"
              value={formData.coinName}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            id="logo"
            label="Logo Image URL (Optional)"
            placeholder="e.g. https://domain.com/logo.png"
            value={formData.logo}
            onChange={handleChange}
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              id="totalHolding"
              label="Balance *"
              type="number"
              step="any"
              min="0"
              placeholder="e.g. 5.2"
              value={formData.totalHolding}
              onChange={handleChange}
              required
            />
            <Input
              id="currentPrice"
              label="Price *"
              type="number"
              step="any"
              min="0"
              placeholder="e.g. 145"
              value={formData.currentPrice}
              onChange={handleChange}
              required
            />
            <Input
              id="averageBuyPrice"
              label="Avg Buy *"
              type="number"
              step="any"
              min="0"
              placeholder="e.g. 110"
              value={formData.averageBuyPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Unrealized Gains / Losses
            </h4>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="stcgGain"
                  label="STCG Gain/Loss"
                  type="number"
                  step="any"
                  placeholder="e.g. -200"
                  value={formData.stcgGain}
                  onChange={handleChange}
                />
                <Input
                  id="stcgBalance"
                  label="STCG Balance"
                  type="number"
                  step="any"
                  placeholder="e.g. 2.1"
                  value={formData.stcgBalance}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="ltcgGain"
                  label="LTCG Gain/Loss"
                  type="number"
                  step="any"
                  placeholder="e.g. 400"
                  value={formData.ltcgGain}
                  onChange={handleChange}
                />
                <Input
                  id="ltcgBalance"
                  label="LTCG Balance"
                  type="number"
                  step="any"
                  placeholder="e.g. 3.1"
                  value={formData.ltcgBalance}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-500 transition-premium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-brand-accent hover:bg-brand text-white rounded-lg text-xs font-semibold shadow-sm transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
            >
              Add Position
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
