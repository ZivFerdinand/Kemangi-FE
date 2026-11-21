import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import {
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

import { AlertQueueService } from '../../api/services/alert-queue.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AlertQueueRuleModel } from '../../domain/alert-queue.model';
import { mappingDetailsBox } from '../../utils';
import { RuleModelPreview } from '../rule-model-preview/rule-model-preview';
import { CustomTabComponent, TabProps } from '../../../../shared';
import { alertRuleTabs } from '../../data';

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

interface RuleModelTabs {
  rule: TabProps[];
  threshold: TabProps[];
}

type RuleModelTabKey = 'rule' | 'threshold';

interface RuleModelTabActive {
  rule: string;
  threshold: string;
}

function groupByBranch(items: SourceBoxItems[]): BranchGroup[] {
  const order: string[] = [];
  const buckets = new Map<string, SourceBoxItems[]>();

  for (const item of items) {
    if (!buckets.has(item.branchName)) {
      buckets.set(item.branchName, []);
      order.push(item.branchName);
    }
    buckets.get(item.branchName)!.push(item);
  }

  return order.map((branchName) => ({
    branchName,
    items: buckets.get(branchName)!,
  }));
}
@Component({
  selector: 'app-rule-model-form',
  templateUrl: './rule-model-form.html',
  styleUrls: ['./rule-model-form.scss', '../../../../shared/styles/index.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    NgbAccordionModule,
    RuleModelPreview,
    CustomTabComponent,
  ],
})
export class RuleModelForm implements OnInit, OnDestroy {
  private initialDataReady = false;
  private dropdownRuleReady = false;
  private dropdownThresholdReady = false;
  private nextLevelId = 1;

  tabs: RuleModelTabs = { rule: alertRuleTabs, threshold: alertRuleTabs };
  activeTab: RuleModelTabActive = { rule: 'all', threshold: 'all' };

  @Output() priorityBoxesChange = new EventEmitter<PriorityBox[]>();
  @Input() set initialData(data: AlertQueueRuleModel[] | null | undefined) {
    if (!data) return;
    this.convertInitData(data);
  }

  @Input() mode: string = '';

  @Input() set initialPriorityBoxes(boxes: PriorityBox[] | null | undefined) {
    if (!boxes) return;

    this.priorityBoxes = this.priorityBoxes.map((item) => {
      const updated = boxes.find((x) => x.name === item.name);

      return updated ? { ...item, ...updated } : item;
    });
    this.bumpNextLevelId(boxes);
    this.removeAssignedItemsFromSource();
  }

  constructor(
    private readonly alertQueueService: AlertQueueService,
    private readonly toast: ToastService,
  ) {}

  dropdownRule: any[] = [];
  dropdownThreshold: any[] = [];

  private ruleSub?: Subscription;
  private thresholdSub?: Subscription;

  ngOnInit(): void {
    this.getRuleMasterData(null);
    this.getThresholdMasterData(null);
  }

  getTabKey(name: string): RuleModelTabKey {
    return name.toLowerCase() as RuleModelTabKey;
  }

  handleTabChange(tab: string, type: string) {
    this.activeTab = { ...this.activeTab, [type]: tab };

    if (type === 'rule') {
      const payload: boolean = tab === 'all' ? false : true;
      this.getRuleMasterData(payload);
    }

    if (type === 'threshold') {
      const payload: boolean = tab === 'all' ? false : true;
      this.getThresholdMasterData(payload);
    }
  }

  convertInitData(data: AlertQueueRuleModel[]) {
    const boxes = mappingDetailsBox(data);

    this.priorityBoxes = this.priorityBoxes.map((item) => {
      const updated = boxes.find((x) => x.name === item.name);

      return updated ? { ...item, ...updated } : item;
    });

    if (this.priorityBoxes) {
      this.initialDataReady = true;
      this.syncDataFromInit(this.priorityBoxes);
    }
  }

  private removeAssignedItemsFromSource() {
    const assignedIds = new Set<number | string>();
    for (const box of this.priorityBoxes) {
      for (const level of box.levels) {
        for (const item of level.items) {
          assignedIds.add(item.id);
        }
      }
    }

    if (assignedIds.size === 0) return;

    for (const sourceBox of this.sourceBoxes) {
      for (const group of sourceBox.groups) {
        group.items = group.items.filter((item) => !assignedIds.has(item.id));
      }
    }
  }

  private bumpNextLevelId(boxes: PriorityBox[]) {
    let maxId = 0;
    for (const box of boxes) {
      for (const level of box.levels) {
        maxId = Math.max(maxId, level.id);
      }
    }
    this.nextLevelId = Math.max(this.nextLevelId, maxId + 1);
  }

  getRuleMasterData(unassignment?: boolean | null) {
    this.ruleSub?.unsubscribe();
    this.ruleSub = this.alertQueueService
      .ruleMasterData(unassignment)
      .subscribe({
        next: (res: any) => {
          this.dropdownRule = res['data'];

          const result = this.dropdownRule.flatMap((productType) =>
            productType.items.map((item: any) => ({
              name: item.item_name,
              sourceName: 'Rule',
              branchName: productType.product_type,
              id: item.item_id,
            })),
          );

          this.sourceBoxes = this.sourceBoxes.map((sourceBox) => {
            if (sourceBox.name === 'Rule') {
              return {
                ...sourceBox,
                groups: groupByBranch(result),
              };
            }

            return sourceBox;
          });

          this.dropdownRuleReady = true;

          this.syncDataFromInit(this.priorityBoxes);
        },
        error: this.handleError('Something went wrong!'),
      });
  }

  getThresholdMasterData(unassignment?: boolean | null) {
    this.thresholdSub?.unsubscribe();

    this.thresholdSub = this.alertQueueService
      .thresholdMasterData(unassignment)
      .subscribe({
        next: (res: any) => {
          this.dropdownThreshold = res['data'];

          const result = this.dropdownThreshold.flatMap((productType) =>
            productType.items.map((item: any) => ({
              name: item.item_name,
              sourceName: 'Threshold',
              branchName: productType.product_type,
              id: item.item_id,
            })),
          );

          this.sourceBoxes = this.sourceBoxes.map((sourceBox) => {
            if (sourceBox.name === 'Threshold') {
              return {
                ...sourceBox,
                groups: groupByBranch(result),
              };
            }

            return sourceBox;
          });

          this.dropdownThresholdReady = true;

          this.syncDataFromInit(this.priorityBoxes);
        },
        error: this.handleError('Something went wrong!'),
      });
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }

  private emitPriorityBoxesChange() {
    this.priorityBoxesChange.emit(this.priorityBoxes);
  }

  sourceBoxes: SourceBox[] = [
    {
      name: 'Rule',
      groups: [],
      searchQuery: '',
    },
    {
      name: 'Threshold',
      groups: [],
      searchQuery: '',
    },
  ];

  priorityBoxes: PriorityBox[] = [
    { name: 'High', levels: [] },
    { name: 'Medium', levels: [] },
    { name: 'Low', levels: [] },
  ];

  get allDropListIds(): string[] {
    const ids: string[] = [];
    for (const box of this.sourceBoxes) {
      for (const group of box.groups) {
        ids.push(this.sourceGroupListId(box, group));
      }
    }
    for (const box of this.priorityBoxes) {
      for (const level of box.levels) {
        ids.push(this.levelListId(box, level));
      }
    }
    return ids;
  }

  sourceGroupListId(box: SourceBox, group: BranchGroup): string {
    return `source-${box.name}-${group.branchName}`;
  }

  totalSourceItems(box: SourceBox): number {
    return box.groups.reduce((sum, g) => sum + g.items.length, 0);
  }

  matchesSearch(box: SourceBox, item: SourceBoxItems): boolean {
    const q = box.searchQuery.trim().toLowerCase();
    if (!q) return true;
    return item.name.toLowerCase().includes(q);
  }

  visibleSourceItems(box: SourceBox): number {
    return box.groups.reduce((sum, g) => sum + this.visibleCount(box, g), 0);
  }

  visibleCount(box: SourceBox, group: BranchGroup): number {
    return group.items.filter((item) => this.matchesSearch(box, item)).length;
  }

  levelListId(box: PriorityBox, level: Level): string {
    return `${box.name}-level-${level.id}`;
  }

  totalItems(box: PriorityBox): number {
    return box.levels.reduce((sum, l) => sum + l.items.length, 0);
  }

  addLevel(box: PriorityBox) {
    box.levels.push({
      id: this.nextLevelId++,
      name: `Priority ${box.levels.length + 1}`,
      items: [],
    });

    this.emitPriorityBoxesChange();
  }

  deleteLevel(box: PriorityBox, index: number) {
    const level = box.levels[index];
    if (!level) return;

    if (level.items.length > 0) {
      this.returnItemsToSource(level.items);
    }

    box.levels.splice(index, 1);
    this.renumberLevels(box);
    this.emitPriorityBoxesChange();
  }

  clearAllLevels(box: PriorityBox) {
    const items = box.levels.flatMap((l) => l.items);
    if (items.length > 0) this.returnItemsToSource(items);

    box.levels = [];
    this.emitPriorityBoxesChange();
  }

  private returnItemsToSource(items: SourceBoxItems[]) {
    const sources = new Set(items.map((i) => i.sourceName));
    sources.forEach((name) => this.refreshSource(name));
  }

  private refreshSource(sourceName: string) {
    const key = this.getTabKey(sourceName);
    const unassignment = this.activeTab[key] !== 'all';

    if (key === 'rule') this.getRuleMasterData(unassignment);
    else this.getThresholdMasterData(unassignment);
  }

  private renumberLevels(box: PriorityBox) {
    box.levels.forEach((level, idx) => {
      level.name = `Priority ${idx + 1}`;
    });
  }

  deleteItem(items: SourceBoxItems[], item: SourceBoxItems) {
    const index = items.findIndex((i) => i.id === item.id);
    if (index === -1) return;

    const ok = window.confirm(`Delete "${item.name}"? This cannot be undone.`);
    if (!ok) return;

    items.splice(index, 1);
  }

  deleteItemFromLevel(level: Level, item: SourceBoxItems) {
    const index = level.items.findIndex((i) => i.id === item.id);
    if (index === -1) return;

    level.items.splice(index, 1);
    this.returnItemsToSource([item]);
    this.emitPriorityBoxesChange();
  }

  drop(event: CdkDragDrop<SourceBoxItems[]>) {
    const toSource = event.container.id.startsWith('source-');
    const fromSource = event.previousContainer.id.startsWith('source-');

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else if (toSource && !fromSource) {
      const [item] = event.previousContainer.data.splice(
        event.previousIndex,
        1,
      );
      this.returnItemsToSource([item]);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.emitPriorityBoxesChange();
  }

  syncDataFromInit(data: PriorityBox[]) {
    if (!this.dropdownRuleReady || !this.dropdownThresholdReady) {
      return;
    }

    this.bumpNextLevelId(data);
    this.removeAssignedItemsFromSource();
  }

  ngOnDestroy(): void {
    this.ruleSub?.unsubscribe();
    this.thresholdSub?.unsubscribe();
  }
}
