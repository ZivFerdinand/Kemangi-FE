import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateOrDash',
})
export class TruncateOrDashPipe implements PipeTransform {
  transform(value: string | null | undefined, limit: number = 50): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    if (value.length > limit) {
      return value.slice(0, limit) + '...';
    }

    return value;
  }
}
