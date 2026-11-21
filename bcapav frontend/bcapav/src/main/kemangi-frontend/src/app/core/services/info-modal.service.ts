import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModal } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class InfoModalService {
  constructor(private modalService: NgbModal) {}

  public info(
    title: string,
    type: string,
    message: string,
    dialogSize: 'sm' | 'md' | 'lg' = 'md',
  ): Promise<boolean> {
    const modalRef = this.modalService.open(InfoModal, {
      size: dialogSize,
      centered: true,
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.message = message;

    return modalRef.result;
  }
}
