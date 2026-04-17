/**
 * Formats a given number or numeric string to Chilean Peso (CLP) layout.
 * Example: 15000 -> "$ 15.000"
 */
export const formatCLP = (value: string | number): string => {
  const numericValue = typeof value === 'string' ? value.replace(/[^\d]/g, '') : value;
  const parsed = parseInt(numericValue.toString(), 10);
  if (isNaN(parsed)) return '';

  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parsed);
};

/**
 * Strips everything except digits to parse raw integer values from CLP inputs.
 */
export const parseCLP = (value: string): number => {
  const numericValue = value.replace(/[^\d]/g, '');
  return parseInt(numericValue, 10) || 0;
};

/**
 * Formats a phone number into the Chilean Mobile layout.
 * Example: +56 9 1234 5678
 */
export const formatChileanPhone = (value: string): string => {
  if (!value) return '';

  let digits = value.replace(/[^\d]/g, '');
  
  if (digits.length === 0) return '';

  // Allow deleting the prefix entirely step-by-step
  if (digits === '5') return '+5';
  if (digits === '56') return '+56';

  // Strip prefix standard variants to isolate the max 9 local numbers
  if (digits.startsWith('56')) {
    digits = digits.slice(2);
  }

  // Generic safe formatting: +56 X XXXX XXXX
  // Works flawlessly for Mobile (9 1234 5678) 
  // and Santiago Landlines (2 1234 5678) 
  // and Regional (3 2123 4567 - visual offset)
  
  let formatted = '+56';
  
  if (digits.length > 0) {
    formatted += ` ${digits.substring(0, 1)}`;
  }
  if (digits.length > 1) {
    formatted += ` ${digits.substring(1, 5)}`;
  }
  if (digits.length > 5) {
    formatted += ` ${digits.substring(5, 9)}`;
  }

  return formatted;
};
