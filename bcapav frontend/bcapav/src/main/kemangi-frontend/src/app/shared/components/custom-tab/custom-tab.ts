import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface CustomTabItem {
  label: string;
  value: string;
  active?: boolean;
}

@Component({
  selector: 'app-custom-tab',
  standalone: true,
  templateUrl: './custom-tab.html',
  styleUrls: ['./custom-tab.scss'],
  host: {
    '[style.--tab-bg]': 'tabBg',
    '[style.--tab-btn-bg]': 'tabBtnBg',
    '[style.--tab-btn-color]': 'tabBtnColor',
    '[style.--tab-active-bg]': 'tabActiveBg',
    '[style.--tab-active-color]': 'tabActiveColor',
  },
})
export class CustomTabComponent {
  @Input() tabs: CustomTabItem[] = [];
  @Input() activeTab = '';
  @Input() isDisabledFn: (tab: string) => boolean = () => true;
  @Input() styleType: string | null = '';

  // 🎨 Custom colors
  @Input() tabBg = '#ffffff';
  @Input() tabBtnBg = '#ffffff';
  @Input() tabBtnColor = '#00335e';
  @Input() tabActiveBg = '#144e83';
  @Input() tabActiveColor = '#ffffff';

  @Output() tabChange = new EventEmitter<string>();

  selectTab(value: string) {
    this.activeTab = value;
    this.tabChange.emit(value);
  }
}
