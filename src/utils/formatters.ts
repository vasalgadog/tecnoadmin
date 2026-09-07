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

/**
 * Formatea un string "YYYY-MM-DDTHH:mm:ss" a "DD/MM/YYYY HH:mm"
 * Mantiene estrictamente el texto original de la BD sin alterar horas.
 */
export const formatDateTime = (isoString: string): string => {
  if (!isoString) return '-';

  // Extrae fecha y hora del string (ej: "2026-09-17T16:00:00" o "2026-09-17 16:00:00")
  const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})/);
  if (!match) return '-';

  const [, year, month, day, hour, minute] = match;
  return `${day}/${month}/${year} ${hour}:${minute}`;
};

/**
 * Formatea un string a solo fecha "DD/MM/YYYY"
 */
export const formatDateOnly = (isoString: string): string => {
  if (!isoString) return '-';

  const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return '-';

  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
};
