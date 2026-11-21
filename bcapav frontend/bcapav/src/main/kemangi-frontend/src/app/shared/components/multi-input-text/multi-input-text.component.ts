import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multi-input-text',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multi-input-text.component.html',
  styleUrls: ['./multi-input-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiInputTextComponent),
      multi: true,
    },
  ],
})
export class MultiInputTextComponent implements ControlValueAccessor {
  value: string[] = [];
  inputValue = '';
  disabled = false;
  @Input() placeholder: string = '';

  onChange: (value: string[]) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string[]): void {
    this.value = value || [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  addValue(email: string) {
    if (this.disabled) return;

    const trimmed = email.trim();
    if (!trimmed) return;

    if (!this.value.includes(trimmed)) {
      this.value = [...this.value, trimmed];
      this.onChange(this.value);
    }

    this.inputValue = '';
  }

  removeValue(email: string) {
    if (this.disabled) return;

    this.value = this.value.filter((e) => e !== email);
    this.onChange(this.value);
  }

  clearAll() {
    if (this.disabled) return;

    this.value = [];
    this.onChange(this.value);
  }

  handleKeydown(event: KeyboardEvent) {
    if (this.disabled) return;

    if (['Enter', 'Tab', ','].includes(event.key)) {
      event.preventDefault();
      this.addValue(this.inputValue);
    }

    if (event.key === 'Backspace' && !this.inputValue && this.value.length) {
      this.value = this.value.slice(0, -1);
      this.onChange(this.value);
    }
  }
}
