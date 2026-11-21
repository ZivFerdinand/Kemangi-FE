import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPriorityBox } from '../../domain/alert-queue.model';

interface SourceBoxItems {
  name: string;
  sourceName: string;
  branchName: string;
  id: number | string;
}

interface BranchGroup {
  branchName: string;
  items: SourceBoxItems[];
}

interface Level {
  id: number;
  name: string;
  items: SourceBoxItems[];
}

interface PriorityBox {
  name: string;
  levels: Level[];
}

interface SourceBox {
  name: string;
  groups: BranchGroup[];
  searchQuery: string;
}

@Component({
  selector: 'app-rule-model-preview',
  templateUrl: './rule-model-preview.html',
  styleUrls: [
    './rule-model-preview.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule],
})
export class RuleModelPreview {
  @Input() set initialPriorityBoxes(boxes: PriorityBox[] | null | undefined) {
    if (!boxes) return;

    this.priorityBoxes = this.priorityBoxes.map((item) => {
      const updated = boxes.find((x) => x.name === item.name);

      return updated ? { ...item, ...updated } : item;
    });
  }

  priorityBoxes: PriorityBox[] = [
    { name: 'High', levels: [] },
    { name: 'Medium', levels: [] },
    { name: 'Low', levels: [] },
  ];
}
