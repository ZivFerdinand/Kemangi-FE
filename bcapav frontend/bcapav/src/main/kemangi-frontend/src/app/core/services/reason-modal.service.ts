import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReasonModal } from '../../shared';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ReasonModalService {
  constructor(private modalService: NgbModal) {}

  public reason(
    message: string,
    btnOkText: string = 'Discard',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'md' | 'lg' = 'md',
    approvalForm: FormGroup,
    errorMessages: {
      [controlName: string]: {
        [errorKey: string]: (error?: any) => string;
      };
    },
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ReasonModal, {
      size: dialogSize,
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.formGroup = approvalForm;
    modalRef.componentInstance.errorMessages = errorMessages;

    return modalRef.result;
  }
}
