import { Input, OnChanges, SimpleChanges } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPriorityBox } from '../../domain/alert-queue.model';
import { markItemChanges } from '../../utils';
@Component({
  selector: 'app-rule-model-view',
  templateUrl: './rule-model-view.html',
  styleUrls: ['./rule-model-view.scss', '../../../../shared/styles/index.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class RuleModelView implements OnChanges {
  @Input() data: ModelPriorityBox[] = [];
  @Input() prevData: ModelPriorityBox[] = [];

  modelsData: ModelPriorityBox[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    const newData = changes['data'];

    const prev = changes['prevData'];
    if (newData && newData.currentValue) {
      this.modelsData = newData.currentValue;
    }

    if (prev) {
      if (prev.currentValue) {
        if (this.data) {
          const result = markItemChanges(prev.currentValue, this.data);

          this.modelsData = result;
        }
      }
    }
  }
}
