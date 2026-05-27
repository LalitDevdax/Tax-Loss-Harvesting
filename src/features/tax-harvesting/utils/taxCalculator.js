/**
 * Tax calculator utility functions based on KoinX assignment instructions.
 * Computes capital gains offsets and savings using Indian VDA and global rules.
 * Supports dynamic currency conversion (default baseline is in INR).
 */

// Baseline from the Capital Gains API response (in INR Rupees)
export const BASELINE_GAINS = {
  stcg: {
    profits: 70200.88,
    losses: 1548.53
  },
  ltcg: {
    profits: 5020,
    losses: 3050
  }
};

// USDC exchange rate from holdings API used as the USD/INR conversion rate
export const USD_INR_RATE = 85.41;

/**
 * Calculates pre-harvesting net and realized gains, scaled for USD if needed
 */
export const getPreHarvestSummary = (capitalGains, isUsd = false) => {
  const rate = isUsd ? USD_INR_RATE : 1;
  
  const cg = capitalGains || BASELINE_GAINS;
  const stProfits = (cg.stcg?.profits || 0) / rate;
  const stLosses = (cg.stcg?.losses || 0) / rate;
  const ltProfits = (cg.ltcg?.profits || 0) / rate;
  const ltLosses = (cg.ltcg?.losses || 0) / rate;

  const stNet = stProfits - stLosses;
  const ltNet = ltProfits - ltLosses;
  const realisedGains = stNet + ltNet;
  
  return {
    stProfits,
    stLosses,
    stNet,
    ltProfits,
    ltLosses,
    ltNet,
    realisedGains
  };
};

/**
 * Calculates post-harvesting gains based on active holdings checkbox checklist and ratios, scaled for currency
 */
export const calculateHarvesting = (holdings, capitalGains, taxRate = 0.30, isUsd = false) => {
  const baseline = getPreHarvestSummary(capitalGains, isUsd);
  const rate = isUsd ? USD_INR_RATE : 1;

  let additionalStProfits = 0;
  let additionalStLosses = 0;
  let additionalLtProfits = 0;
  let additionalLtLosses = 0;

  holdings.forEach(item => {
    if (item.checked) {
      // Calculate fraction sold based on amount to sell input
      const totalHolding = Number(item.totalHolding) || 0;
      const sellAmount = Number(item.amountToSell) || 0;
      
      const ratio = totalHolding > 0 
        ? Math.min(1, Math.max(0, sellAmount / totalHolding)) 
        : 1;

      // Short-Term Capital Gains/Losses adjustments
      const stGain = ((item.stcg?.gain || 0) / rate) * ratio;
      if (stGain > 0) {
        additionalStProfits += stGain;
      } else if (stGain < 0) {
        additionalStLosses += Math.abs(stGain);
      }

      // Long-Term Capital Gains/Losses adjustments
      const ltGain = ((item.ltcg?.gain || 0) / rate) * ratio;
      if (ltGain > 0) {
        additionalLtProfits += ltGain;
      } else if (ltGain < 0) {
        additionalLtLosses += Math.abs(ltGain);
      }
    }
  });

  const stProfits = baseline.stProfits + additionalStProfits;
  const stLosses = baseline.stLosses + additionalStLosses;
  const stNet = stProfits - stLosses;

  const ltProfits = baseline.ltProfits + additionalLtProfits;
  const ltLosses = baseline.ltLosses + additionalLtLosses;
  const ltNet = ltProfits - ltLosses;

  const realisedGains = stNet + ltNet;

  // Show savings ONLY IF Pre-harvesting realised gains > Post-harvesting realised gains
  const gainsSaved = baseline.realisedGains - realisedGains;
  const taxSavings = gainsSaved > 0 ? Math.round(gainsSaved * taxRate) : 0;

  return {
    baseline,
    stProfits,
    stLosses,
    stNet,
    ltProfits,
    ltLosses,
    ltNet,
    realisedGains,
    taxSavings,
    gainsSaved
  };
};

/**
 * Clean currency formatter utility supporting multiple symbols
 */
export const formatCurrency = (val, currencySymbol = '₹') => {
  const num = Number(val);
  if (isNaN(num)) return `${currencySymbol}0.00`;
  
  const isNegative = num < 0;
  const absVal = Math.abs(num);
  
  let fractionDigits = 2;
  if (absVal > 0 && absVal < 0.0001) {
    fractionDigits = 8;
  } else if (absVal > 0 && absVal < 0.01) {
    fractionDigits = 6;
  } else if (absVal > 0 && absVal < 1) {
    fractionDigits = 4;
  }
  
  const formattedVal = absVal.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  });
  
  return `${isNegative ? '-' : ''}${currencySymbol}${formattedVal}`;
};
