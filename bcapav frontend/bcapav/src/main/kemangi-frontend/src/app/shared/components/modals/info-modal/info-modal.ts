import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.html',
  styleUrls: ['./info-modal.scss'],
})
export class InfoModal implements OnInit {
  @Input() public type: any;
  @Input() public message: any;
  @Input() public title: any;

  constructor(
    public activeModal: NgbActiveModal,
    public modal: NgbModal,
  ) {}

  ngOnInit(): void {}

  onOkClicked() {
    this.activeModal.dismiss();
  }
}
