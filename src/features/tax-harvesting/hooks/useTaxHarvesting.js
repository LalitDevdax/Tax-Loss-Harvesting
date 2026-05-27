import { useState, useMemo, useEffect } from 'react';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { initialHoldings } from '../data/initialHoldings';
import { calculateHarvesting, USD_INR_RATE } from '../utils/taxCalculator';

const enrichedInitialHoldings = initialHoldings.map((item, index) => ({
  ...item,
  id: `coin-${item.coin.toLowerCase()}-${index}`,
  checked: false,
  amountToSell: 0
}));

export function useTaxHarvesting() {
  const [holdings, setHoldings] = useLocalStorage('koinx_holdings_list', enrichedInitialHoldings);
  const [capitalGains, setCapitalGains] = useLocalStorage('koinx_capital_gains', {
    stcg: { profits: 70200.88, losses: 1548.53 },
    ltcg: { profits: 5020, losses: 3050 }
  });
  const [currency, setCurrency] = useLocalStorage('koinx_currency_symbol', '₹');
  const [taxRate, setTaxRate] = useLocalStorage('koinx_tax_rate', 0.30); // default 30%
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock API call to simulate fetching holdings and capital gains with a loader state
  useEffect(() => {
    // Check if we need to mock load (only on initial load if localstorage is empty or we force it)
    const isFirstTime = !window.localStorage.getItem('koinx_holdings_list') || !window.localStorage.getItem('koinx_capital_gains');
    if (isFirstTime) {
      setIsLoading(true);
      setError(null);
      
      const holdingsApiPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(enrichedInitialHoldings);
        }, 800); // simulated network latency for Holdings API
      });

      const capitalGainsApiPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            capitalGains: {
              stcg: { profits: 70200.88, losses: 1548.53 },
              ltcg: { profits: 5020, losses: 3050 }
            }
          });
        }, 500); // simulated network latency for Capital Gains API
      });

      Promise.all([holdingsApiPromise, capitalGainsApiPromise])
        .then(([holdingsData, capitalGainsData]) => {
          setHoldings(holdingsData);
          setCapitalGains(capitalGainsData.capitalGains);
          setIsLoading(false);
        })
        .catch((err) => {
          setError('Failed to load portfolio details from mock APIs.');
          setIsLoading(false);
        });
    }
  }, []);

  // Calculate gains summary
  const calculations = useMemo(() => {
    return calculateHarvesting(holdings, capitalGains, taxRate, currency === '$');
  }, [holdings, capitalGains, taxRate, currency]);

  // Toggle selection
  const toggleHolding = (id) => {
    setHoldings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextChecked = !item.checked;
          return {
            ...item,
            checked: nextChecked,
            amountToSell: nextChecked ? item.totalHolding : 0
          };
        }
        return item;
      })
    );
  };

  // Update sell amount input
  const updateSellAmount = (id, value) => {
    setHoldings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const maxVal = item.totalHolding;
          const val = Math.min(maxVal, Math.max(0, Number(value) || 0));
          return {
            ...item,
            amountToSell: val,
            checked: val > 0
          };
        }
        return item;
      })
    );
  };

  // Add custom asset compliant with holdings API schema
  const addAsset = (asset) => {
    const rate = currency === '$' ? USD_INR_RATE : 1;
    const newAsset = {
      id: `custom-${asset.coin.toLowerCase()}-${Date.now()}`,
      coin: asset.coin.toUpperCase(),
      coinName: asset.coinName,
      logo: asset.logo || 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg',
      currentPrice: Number(asset.currentPrice) * rate,
      totalHolding: Number(asset.totalHolding),
      averageBuyPrice: Number(asset.averageBuyPrice) * rate,
      stcg: {
        balance: Number(asset.stcgBalance) || 0,
        gain: (Number(asset.stcgGain) || 0) * rate
      },
      ltcg: {
        balance: Number(asset.ltcgBalance) || 0,
        gain: (Number(asset.ltcgGain) || 0) * rate
      },
      checked: true, // precheck to run calculations automatically
      amountToSell: Number(asset.totalHolding)
    };

    setHoldings((prev) => [newAsset, ...prev]);
  };

  // Delete an asset
  const deleteAsset = (id) => {
    setHoldings((prev) => prev.filter((item) => item.id !== id));
  };

  // Reset holdings list back to initial mock API response
  const resetHoldings = () => {
    setIsTableLoading(true);
    setTimeout(() => {
      setHoldings(enrichedInitialHoldings);
      setCapitalGains({
        stcg: { profits: 70200.88, losses: 1548.53 },
        ltcg: { profits: 5020, losses: 3050 }
      });
      setIsTableLoading(false);
    }, 400);
  };

  return {
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
  };
}
