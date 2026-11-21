import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-failed-modal',
  templateUrl: './failed-modal.html',
  styleUrls: ['./failed-modal.scss'],
})
export class FailedModal implements OnInit {
  @Input() public type: any;
  @Input() public errorCode: any;
  @Input() public message: any;
  @Input() public title: any;

  constructor(
    public activeModal: NgbActiveModal,
    public modal: NgbModal,
  ) {}

  ngOnInit(): void {}

  onOkClicked() {
    this.activeModal.close(true);
  }
}
