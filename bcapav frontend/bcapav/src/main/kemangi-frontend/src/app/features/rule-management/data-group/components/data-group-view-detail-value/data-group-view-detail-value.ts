import {
  Component,
  Output,
  ElementRef,
  EventEmitter,
  ViewChild,
  signal,
  input,
  output,
  effect,
  computed,
  Input,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { TableComponent } from '../../../../../shared';
import { valuesColumnsDataGroupDetails } from '../../data';

@Component({
  selector: 'app-data-group-view-detail-value',
  standalone: true,
  templateUrl: './data-group-view-detail-value.html',
  styleUrls: [
    './data-group-view-detail-value.scss',
    '../../../../../shared/styles/index.scss',
  ],
  imports: [NgbPaginationModule, TableComponent],
})
export class DataGroupViewDetailValueComponent<T> {
  @Output() uploadFile = new EventEmitter();

  @Input() dataGroupName: string = '';

  @ViewChild('scrollArea') scrollArea!: ElementRef;

  data = input<string[]>([]);

  dataChange = output<string[]>();

  column: any[] = [...valuesColumnsDataGroupDetails];

  query = signal<string>('');

  appliedQuery = signal<string>('');

  values = signal<string[]>([]);

  pristine = signal(true);

  page = signal(1);

  pageSize = signal(10);

  sortField = signal<'value'>('value');

  sortDir = signal<'asc' | 'desc'>('asc');

  totalItems = computed(() => this.filteredValues().length);

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  isSortingEnabled = signal(false);

  start = (this.page() - 1) * this.pageSize();

  value = signal<string>('');

  index = signal<number | null>(null);

  filteredValues = computed(() => {
    const q = this.appliedQuery().trim().toLowerCase();
    const list = this.values();

    if (!q) return list;

    return list.filter((item) => item.toLowerCase().includes(q));
  });

  sortedValues = computed(() => {
    const data = [...this.filteredValues()];

    if (!this.isSortingEnabled()) {
      return data; // 👈 keep original order
    }

    const dir = this.sortDir();

    data.sort((a, b) => {
      const res = a.localeCompare(b, undefined, { sensitivity: 'base' });
      return dir === 'asc' ? res : -res;
    });

    return data;
  });

  pagedValues = computed(() => {
    const data = this.sortedValues();
    const page = this.page();
    const size = this.pageSize();

    const start = (page - 1) * size;
    const end = start + size;

    return data.slice(start, end);
  });

  startIndex = computed(() => {
    const total = this.totalItems();
    if (total === 0) return 0;

    return (this.page() - 1) * this.pageSize() + 1;
  });

  endIndex = computed(() => {
    const total = this.totalItems();
    if (total === 0) return 0;

    return Math.min(this.page() * this.pageSize(), total);
  });

  constructor(private datePipe: DatePipe) {
    effect(() => {
      const incoming = this.data();
      this.values.set([...incoming]);
    });
  }

  onPageChange(page: number) {
    this.page.set(page);
  }

  toggleSort(direction: 'asc' | 'desc', key?: 'value') {
    this.sortDir.set(direction);
    this.isSortingEnabled.set(true);
    this.page.set(1);
  }

  downloadFile() {
    const filtered = this.values();

    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Data Group'],
      ...filtered.map((v) => [v]),
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const dateNow = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    XLSX.writeFile(workbook, `${this.dataGroupName} - ${dateNow}.xlsx`);
  }

  findData() {
    this.appliedQuery.set(this.query());
    this.page.set(1);
  }
}
