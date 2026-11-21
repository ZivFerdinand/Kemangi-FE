import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FailedModal } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class FailedModalService {
  constructor(private modalService: NgbModal) {}

  public failed(
    type: string,
    errorCode: string,
    message: string,
    dialogSize: 'sm' | 'md' | 'lg' = 'md'
  ): Promise<boolean> {
    const modalRef = this.modalService.open(FailedModal, {
      size: dialogSize,
      centered: true,
    });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.errorCode = errorCode;
    modalRef.componentInstance.message = message;

    return modalRef.result;
  }
}
