import { formatDate } from '@angular/common';

const LOCALE = 'id-ID';

export function formatDateId(
  value: string | number | Date,
  format = 'dd-MMM-yyyy HH:mm:ss',
): string {
  if (!value) return '-';
  return formatDate(value, format, LOCALE);
}
