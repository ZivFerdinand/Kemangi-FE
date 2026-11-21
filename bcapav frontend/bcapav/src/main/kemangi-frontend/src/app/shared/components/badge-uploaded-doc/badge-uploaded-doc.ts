import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-badge-uploaded-doc',
  standalone: true,
  templateUrl: './badge-uploaded-doc.html',
  styleUrls: ['./badge-uploaded-doc.scss'],
  imports: [],
})
export class BadgeUploadedDoc {
  @Output() clearFile = new EventEmitter<string>();
  @Output() downloadFile = new EventEmitter<any>();
  @Input() type: string = '';
  @Input() originalName: string = '';
  @Input() extension: string = '';
  @Input() generatedName: string = '';
  @Input() showClearBtn: boolean = true;

  removeFile(generatedName: string) {
    this.clearFile.emit(generatedName);
  }

  download() {
    this.downloadFile.emit();
  }
}
