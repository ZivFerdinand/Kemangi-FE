import {
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  ViewChild,
} from '@angular/core';

export interface DetailRuleTabItem {
  label: string;
  value: string;
  active?: boolean;
}

@Component({
  selector: 'app-detail-rule-tab',
  standalone: true,
  templateUrl: './detail-rule-tab.html',
  styleUrls: ['./detail-rule-tab.scss'],
})
export class DetailRuleTabComponent {
  @Input() tabs: DetailRuleTabItem[] = [];
  @Input() activeTab: string = '';
  @Input() isDisabledFn: (tab: string) => boolean = () => true;

  @Output() tabChange = new EventEmitter<string>();
  @Input() addTabFn: () => void = () => {};
  @Input() deleteTabFn: (index: number) => void = () => {};

  @ViewChild('scrollArea') scrollArea!: ElementRef;

  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;

  selectTab(value: string) {
    this.activeTab = value;
    this.tabChange.emit(value);
  }

  deleteTab(index: number) {
    this.deleteTabFn(index);
  }

  addTab() {
    if (this.addTabFn) {
      this.addTabFn();
    }
  }

  ngAfterViewInit(): void {
    const el: HTMLElement = this.scrollArea.nativeElement;

    // Mouse drag
    // el.addEventListener('mousedown', (e: MouseEvent) => {
    //   this.isDown = true;
    //   el.classList.add('active');
    //   this.startX = e.pageX - el.offsetLeft;
    //   this.scrollLeft = el.scrollLeft;
    // });

    // el.addEventListener('mouseleave', () => {
    //   this.isDown = false;
    //   el.classList.remove('active');
    // });

    // el.addEventListener('mouseup', () => {
    //   this.isDown = false;
    //   el.classList.remove('active');
    // });

    // el.addEventListener('mousemove', (e: MouseEvent) => {
    //   if (!this.isDown) return;
    //   e.preventDefault();
    //   const x = e.pageX - el.offsetLeft;
    //   const walk = (x - this.startX) * 1.8; // speed
    //   el.scrollLeft = this.scrollLeft - walk;
    // });

    // Touch drag
    el.addEventListener('touchstart', (e: TouchEvent) => {
      this.startX = e.touches[0].pageX - el.offsetLeft;
      this.scrollLeft = el.scrollLeft;
    });

    el.addEventListener('touchmove', (e: TouchEvent) => {
      const x = e.touches[0].pageX - el.offsetLeft;
      const walk = (x - this.startX) * 1.8;
      el.scrollLeft = this.scrollLeft - walk;
    });
  }
}
