/**
 * Utility functions for formatting data in the admin interface
 */

/**
 * Format currency values in Brazilian Real (BRL)
 * @param value - The numeric value to format
 * @param showSign - Whether to show + or - sign (default: false)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, showSign: boolean = false): string {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (showSign) {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatter.format(value)}`;
  }

  return formatter.format(value);
}

/**
 * Format currency values with type-based styling
 * @param value - The numeric value to format
 * @param type - The transaction type (INCOME, EXPENSE, TRANSFER)
 * @returns Formatted currency string with appropriate sign
 */
export function formatTransactionAmount(value: number, type: 'INCOME' | 'EXPENSE' | 'TRANSFER'): string {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  switch (type) {
    case 'EXPENSE':
      return `-${formatter.format(value)}`;
    case 'INCOME':
      return `+${formatter.format(value)}`;
    case 'TRANSFER':
      return formatter.format(value);
    default:
      return formatter.format(value);
  }
}

/**
 * Format percentage values
 * @param value - The numeric percentage value
 * @param showSign - Whether to show + or - sign (default: true)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, showSign: boolean = true, decimals: number = 1): string {
  const formatted = value.toFixed(decimals);
  
  if (showSign) {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatted}%`;
  }
  
  return `${formatted}%`;
}

/**
 * Format date values in Brazilian format
 * @param dateString - ISO date string or Date object
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date, 
  options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }
): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

/**
 * Format datetime values in Brazilian format
 * @param dateString - ISO date string or Date object
 * @returns Formatted datetime string
 */
export function formatDateTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format relative time (e.g., "2 horas atrás", "ontem")
 * @param dateString - ISO date string or Date object
 * @returns Relative time string in Portuguese
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return 'Agora mesmo';
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  if (diffInDays === 1) return 'Ontem';
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} meses atrás`;
  
  return `${Math.floor(diffInDays / 365)} anos atrás`;
}

/**
 * Format large numbers with appropriate suffixes (K, M, B)
 * @param value - The numeric value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string
 */
export function formatLargeNumber(value: number, decimals: number = 1): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(decimals)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(decimals)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(decimals)}K`;
  }
  
  return value.toString();
}

/**
 * Format account balance with appropriate styling
 * @param balance - The account balance
 * @param accountType - The type of account
 * @returns Formatted balance string
 */
export function formatAccountBalance(balance: number, accountType: string): string {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // For credit cards, negative balance is actually positive (available credit)
  if (accountType === 'CREDIT_CARD') {
    return formatter.format(Math.abs(balance));
  }

  return formatter.format(balance);
}
