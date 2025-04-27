
/**
 * Utility functions for chart data processing
 */

/**
 * Generate chart data points for time series data
 */
export const generateChartData = (days = 30) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().substring(0, 10),
      value: Math.floor(Math.random() * 100)
    });
  }
  
  return data;
};

/**
 * Format currency values for chart tooltips
 */
export const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) {
    return '₹0';
  }
  return `₹${value.toLocaleString()}`;
};

/**
 * Get chart color values
 */
export const getChartColors = () => ({
  primary: '#8B5CF6',
  secondary: '#0EA5E9',
  accent: '#F59E0B',
  muted: '#64748B'
});
