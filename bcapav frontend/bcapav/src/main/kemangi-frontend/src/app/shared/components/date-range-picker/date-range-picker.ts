import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  NgbCalendar,
  NgbDate,
  NgbDatepicker,
} from '@ng-bootstrap/ng-bootstrap';

export interface DateRange {
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
}

export interface DatePayload {
  name: string;
  date: NgbDate | null;
}

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [NgbDatepicker],
  providers: [DatePipe],
  templateUrl: './date-range-picker.html',
  styleUrl: './date-range-picker.scss',
})
export class DateRangePickerComponent implements OnInit, OnChanges {
  private calendar = inject(NgbCalendar);
  private elementRef = inject(ElementRef<HTMLElement>);
  private datePipe = inject(DatePipe);

  @Input() displayMonths = 2;
  @Input() required = false;
  @Input() name: string = '';

  @Input() outsideDays: 'visible' | 'collapsed' | 'hidden' = 'hidden';

  @Input() minDate: NgbDate | null = null;
  @Input() maxDate: NgbDate | null = null;

  @Input() fromDate: NgbDate | null = null;
  @Input() toDate: NgbDate | null = null;

  @Input() placeholder = 'Select date range';

  @Input() dateFormat = 'dd-MMM-yyyy';

  @Input() closeOnRangeSelect = true;

  @Input()
  set disabled(value: boolean) {
    this._disabled = value;

    if (value && this.isOpen) {
      this.isOpen = false;
    }
  }
  get disabled(): boolean {
    return this._disabled;
  }
  private _disabled = false;

  @HostBinding('class.disabled')
  @HostBinding('attr.disabled')
  get hostDisabled(): true | null {
    return this._disabled ? true : null;
  }

  @Output() fromDateChange = new EventEmitter<DatePayload | null>();
  @Output() toDateChange = new EventEmitter<DatePayload | null>();

  @Output() rangeSelected = new EventEmitter<DateRange>();

  @Output() touched = new EventEmitter<void>();

  hoveredDate: NgbDate | null = null;
  isOpen = false;
  isTouched = false;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fromDate'] || changes['toDate']) {
      this.hoveredDate = null;
    }
  }

  toggle() {
    if (this.disabled) {
      return;
    }
    this.isOpen = !this.isOpen;
  }

  open() {
    if (this.disabled) {
      return;
    }
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.markAsTouched();
  }

  markAsTouched() {
    if (!this.isTouched) {
      this.isTouched = true;
      this.touched.emit();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.isOpen &&
      !this.elementRef.nativeElement.contains(event.target as Node)
    ) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen) {
      this.close();
    }
  }

  onDateSelection(date: NgbDate) {
    if (this.disabled) {
      return;
    }

    if (!this.fromDate) {
      this.fromDate = date;
      this.fromDateChange.emit({ name: this.name, date: this.fromDate });
      return;
    }

    if (this.fromDate && !this.toDate) {
      if (date.equals(this.fromDate)) {
        return;
      }
      if (date.after(this.fromDate)) {
        this.toDate = date;
        this.toDateChange.emit({ name: this.name, date: this.toDate });
        this.rangeSelected.emit({
          fromDate: this.fromDate,
          toDate: this.toDate,
        });
      } else {
        this.fromDate = date;
        this.fromDateChange.emit({ name: this.name, date: this.fromDate });
      }
      return;
    }

    if (date.equals(this.fromDate)) {
      this.toDate = null;
      this.toDateChange.emit({ name: this.name, date: this.toDate });
      return;
    }

    this.fromDate = date;
    this.toDate = null;
    this.fromDateChange.emit({ name: this.name, date: this.fromDate });
    this.toDateChange.emit({ name: this.name, date: this.toDate });
  }

  isHovered(date: NgbDate) {
    return !!(
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return !!(
      this.toDate &&
      this.fromDate &&
      date.after(this.fromDate) &&
      date.before(this.toDate)
    );
  }

  isRange(date: NgbDate) {
    return !!(
      (this.fromDate && date.equals(this.fromDate)) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  get displayLabel(): string {
    if (!this.fromDate) {
      return this.placeholder;
    }
    const from = this.formatDate(this.fromDate);
    if (!this.toDate) {
      return from;
    }
    return `${from} - ${this.formatDate(this.toDate)}`;
  }

  private formatDate(date: NgbDate): string {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return this.datePipe.transform(jsDate, this.dateFormat) ?? '';
  }

  clear() {
    if (this.disabled) {
      return;
    }
    this.fromDate = null;
    this.toDate = null;
    this.fromDateChange.emit(null);
    this.toDateChange.emit(null);
  }
}
