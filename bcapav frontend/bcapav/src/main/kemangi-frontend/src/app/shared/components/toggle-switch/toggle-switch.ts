import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  templateUrl: './toggle-switch.html',
  styleUrls: ['./toggle-switch.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleSwitch),
      multi: true,
    },
  ],
  imports: [NgbTooltipModule],
})
export class ToggleSwitch implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() styleType: string = '';
  @Input() tooltipMessage: string = '';

  @Output() checkedChange = new EventEmitter<boolean>();

  checked = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.checked = value ?? false;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(): void {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.onChange(this.checked);
    this.checkedChange.emit(this.checked);
    this.onTouched();
  }
}
