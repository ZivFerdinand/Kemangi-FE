import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reason-modal',
  templateUrl: './reason-modal.html',
  styleUrls: ['./reason-modal.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ReasonModal implements OnInit {
  @Input() title: string | undefined;
  @Input() message: string | undefined;
  @Input() btnOkText: string | undefined;
  @Input() btnCancelText: string | undefined;
  @Input() formGroup!: FormGroup;
  @Input() errorMessages!: {
    [controlName: string]: {
      [errorKey: string]: (error?: any) => string;
    };
  };

  isModalOpen: boolean = true;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit() {
    const noteControl = this.formGroup.get('note');

    if (noteControl && !noteControl.hasValidator?.(Validators.maxLength(200))) {
      noteControl.addValidators(Validators.maxLength(200));
      noteControl.updateValueAndValidity({ emitEvent: false });
    }

    if (noteControl && !noteControl.hasValidator?.(Validators.minLength(10))) {
      noteControl.addValidators(Validators.minLength(10));
      noteControl.updateValueAndValidity({ emitEvent: false });
    }

    noteControl?.valueChanges.subscribe((value) => {
      if (value && value.length > 200) {
        noteControl.setValue(value.substring(0, 200), { emitEvent: false });
      }
    });
  }

  public decline() {
    this.activeModal.close(false);
    this.clearFormState();
  }

  public accept() {
    if (this.formGroup.valid) {
      this.activeModal.close(true);
      this.clearFormState();
    }
  }

  public dismiss() {
    this.isModalOpen = false;
    this.clearFormState();
    this.activeModal.dismiss();
  }

  private clearFormState() {
    setTimeout(() => {
      this.formGroup.markAsPristine();
      this.formGroup.markAsUntouched();
      this.formGroup.reset();
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  showError(controlName: string, errorType: string): boolean {
    const control = this.formGroup.get(controlName);
    return !!(
      control &&
      control.hasError(errorType) &&
      (control.touched || control.dirty)
    );
  }

  onKeyDown(event: KeyboardEvent, controlName: string) {
    const control = this.formGroup.get(controlName);
    const value = control?.value ?? '';
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];

    if (value.length >= 200 && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.formGroup.get(controlName);

    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return null;
    }

    const errors = control.errors;
    const config = this.errorMessages?.[controlName];

    if (!config) return null;

    const firstErrorKey = Object.keys(errors)[0];
    const resolver = config[firstErrorKey];

    return resolver ? resolver(errors[firstErrorKey]) : null;
  }
}
