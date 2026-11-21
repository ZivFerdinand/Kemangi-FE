import {
  Component,
  Output,
  TemplateRef,
  ElementRef,
  EventEmitter,
  ViewChild,
  signal,
  inject,
  Input,
  input,
  output,
  effect,
  computed,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableComponent } from '../../../../../shared';
import { valuesColumns } from '../../data';
import {
  NgbModalRef,
  NgbModal,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';

import * as XLSX from 'xlsx';
import { InfoModalService } from '../../../../../core/services/info-modal.service';

@Component({
  selector: 'app-data-group-form-detail-value',
  standalone: true,
  templateUrl: './data-group-form-detail-value.html',
  styleUrls: [
    './data-group-form-detail-value.scss',
    '../../../../../shared/styles/index.scss',
  ],
  imports: [NgbPaginationModule, TableComponent],
})
export class DataGroupFormDetailValueComponent<T> {
  @Output() uploadFile = new EventEmitter();

  @ViewChild('scrollArea') scrollArea!: ElementRef;

  @Input() dataGroupName: string = '';

  data = input<string[]>([]);

  dataChange = output<string[]>();

  column: any[] = [...valuesColumns];

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

  selectedFile = signal<File | null>(null);

  modalRef!: NgbModalRef;

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

  private modalService = inject(NgbModal);

  constructor(
    private infoModalService: InfoModalService,
    private datePipe: DatePipe,
  ) {
    effect(() => {
      const incoming = this.data();
      this.values.set([...incoming]);
    });
  }

  onInput(event: Event) {
    if (this.pristine()) {
      this.pristine.set(false);
    }

    this.value.set((event.target as HTMLInputElement).value);
  }

  onBlur() {
    this.pristine.set(false);
  }

  hasValue(val: string): boolean {
    return this.values()?.some((v) => v?.toLowerCase() === val?.toLowerCase());
  }

  isEmpty(val: string): boolean {
    return !val || val.trim().length === 0;
  }

  isInvalid(): boolean {
    const val = this.value();
    return this.isEmpty(val) || this.hasValue(val);
  }

  onPageChange(page: number) {
    this.page.set(page);
  }

  toggleSort(direction: 'asc' | 'desc', key?: 'value') {
    this.sortDir.set(direction);
    this.isSortingEnabled.set(true);
    this.page.set(1);
  }

  submitValue() {
    if (this.index() !== null) {
      this.values.update((arr) =>
        arr.map((item, i) => {
          if (i === this.index()) {
            return this.value();
          }

          return item;
        }),
      );
    } else {
      this.values.update((arr) => [...arr, this.value()]);
    }

    this.dataChange.emit(this.values());

    this.close();
  }

  deleteValue(value: string) {
    const index = this.values().findIndex((n) => n === value);

    this.values.update(() => this.values().filter((_, i) => i !== index));
    this.dataChange.emit(this.values());
  }

  open(content: TemplateRef<any>, value?: string) {
    this.index.set(null);

    const index = this.values().findIndex((n) => n === value);

    if (index != null && index >= 0) {
      this.index.set(index);
    }

    if (value) {
      this.value.set(value);
    }

    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-value',
      centered: true,
      size: 'md',
    });
  }

  close() {
    this.value.set('');
    this.pristine.set(true);
    this.index.set(null);
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  getDuplicateValues<T extends Record<string, any>>(
    data: T[],
    key: keyof T,
  ): string[] {
    const count = new Map<string, number>();

    data.forEach((item) => {
      const value = String(item[key]).trim().toLowerCase();
      if (!value) return;

      count.set(value, (count.get(value) || 0) + 1);
    });

    return Array.from(count.entries())
      .filter(([_, c]) => c > 1)
      .map(([v]) => v);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file) return;

    input.value = '';

    const fileExtensions = file.name.split('.').pop()?.toLowerCase() ?? '';
    const validExtensions = ['xlsx', 'txt'];
    if (!validExtensions.includes(fileExtensions)) {
      this.infoModalService.info(
        'Error',
        'error',
        `Invalid file format. Only <b>.xlsx</b> or <b>.txt</b> files are allowed.`,
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      let jsonData: { 'Data Group': string }[] = [];

      if (file.name.endsWith('.txt')) {
        const text = e.target.result as string;

        const lines = text
          .split(/\r?\n/)
          .map((v) => v.trim())
          .filter(Boolean);

        const values = lines.slice(1);

        jsonData = values.map((v) => ({ 'Data Group': v }));
      }

      if (file.name.endsWith('.xlsx')) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        jsonData = XLSX.utils.sheet_to_json<any>(worksheet, {
          defval: '',
        });
      }

      const duplicates = this.getDuplicateValues(jsonData, 'Data Group');

      if (duplicates.length > 0) {
        this.infoModalService.info(
          'Error',
          'error',
          `File upload failed. Duplicate values found : <b>${duplicates.join(', ')}</b>.`,
        );
        return;
      }

      const valuesArray: string[] = jsonData.map((item) =>
        item['Data Group'].toString(),
      );

      if (this.values().length > 0) {
        this.values.set(valuesArray);
      } else {
        this.values.update((arr) => [...arr, ...valuesArray]);
      }

      this.dataChange.emit(this.values());

      this.infoModalService.info(
        'Success',
        'success',
        `File upload successfully. ${jsonData.length} data group values were uploaded.`,
      );
    };

    if (file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }

    this.selectedFile.set(file);
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
