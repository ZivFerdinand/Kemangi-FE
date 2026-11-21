import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.html',
  styleUrls: ['./confirmation-modal.scss'],
})
export class ConfirmationModal implements OnInit {
  @Input() title: string | undefined;
  @Input() message: string | undefined;
  @Input() btnOkText: string | undefined;
  @Input() btnCancelText: string | undefined;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit() {}

  public decline() {
    localStorage.setItem('formDiscarded', 'false');
    this.activeModal.close(false);
  }

  public accept() {
    localStorage.setItem('formDiscarded', 'true');
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }
}
