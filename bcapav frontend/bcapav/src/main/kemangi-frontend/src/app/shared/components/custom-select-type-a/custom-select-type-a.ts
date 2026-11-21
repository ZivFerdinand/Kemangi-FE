import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

export interface OptionItem {
  name: string;
  value: any;
}

export interface OptionGroup {
  group: string;
  open?: boolean;
  items: OptionItem[];
}

@Component({
  standalone: true,
  selector: 'app-custom-select-type-a',
  templateUrl: './custom-select-type-a.html',
  styleUrls: ['./custom-select-type-a.scss', '../../styles/index.scss'],
  imports: [OverlayModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectTypeAComponent),
      multi: true,
    },
  ],
})
export class CustomSelectTypeAComponent implements ControlValueAccessor {
  @Input() options: OptionGroup[] = [];
  @Input() placeholder: string = 'Select option';
  @Input() required: boolean = false;
  @Input() errorMessage: string = 'This field is required';
  @Input() disabled: boolean = false;

  @Output() valueChange = new EventEmitter<OptionItem>();

  @ViewChild('trigger', { read: ElementRef }) trigger!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;

  searchTerm: string = '';

  private _value: any = null;

  isOpen = false;
  isTouched = false;

  selected: OptionItem | null = null;
  dropdownWidth = 0;

  onChange: any = () => {};
  onTouched: any = () => {};

  get filteredOptions(): OptionGroup[] {
    if (!this.searchTerm.trim()) {
      return this.options;
    }

    const keyword = this.searchTerm.toLowerCase();

    return this.options
      .map((group) => {
        const filteredItems = group.items.filter((item) =>
          item.name.toLowerCase().includes(keyword),
        );

        return {
          ...group,
          open: true,
          items: filteredItems,
        };
      })
      .filter((group) => group.items.length > 0);
  }

  get isInvalid(): boolean {
    return this.required && this.isTouched && !this.selected;
  }

  ngOnChanges() {
    if (this._value && this.options?.length) {
      this.writeValue(this._value);
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.dropdownWidth =
        this.trigger.nativeElement.getBoundingClientRect().width;

      this.searchTerm = '';

      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      });
    } else {
      this.isTouched = true;
    }
  }

  closeDropdown() {
    this.isOpen = false;
    this.isTouched = true;
    this.searchTerm = '';

    this.onTouched();
  }

  toggleGroup(group: OptionGroup) {
    group.open = !group.open;
  }

  select(item: OptionItem) {
    this.selected = item;
    this._value = item.value;

    this.isTouched = true;

    this.onChange(this._value);
    this.onTouched();

    this.valueChange.emit(item);

    this.searchTerm = '';
    this.isOpen = false;
  }

  writeValue(value: any): void {
    this._value = value;

    if (!this.options?.length) return;

    this.selected =
      this.options
        .flatMap((g) => g.items)
        .find((item) => item.value === value) || null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onTriggerClick(event: Event) {
    event.stopPropagation();

    if (!this.isOpen) {
      this.toggleDropdown();
    }
  }
}
