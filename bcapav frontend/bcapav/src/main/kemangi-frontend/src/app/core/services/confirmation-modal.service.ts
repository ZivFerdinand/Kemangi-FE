import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModal } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationModalService {
  constructor(private modalService: NgbModal) {}

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'Discard',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'md' | 'lg' = 'md'
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationModal, {
      size: dialogSize,
      centered: true,
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }
}
