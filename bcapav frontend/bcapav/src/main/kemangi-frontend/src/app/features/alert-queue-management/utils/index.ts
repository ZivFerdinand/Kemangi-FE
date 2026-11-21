import { RuleModelApi } from '../../approval/alert-queue-management/api/models/alert-queue.model';
import {
  AlertQueueRuleModel,
  ModelPriorityBox,
  PriorityBox,
} from '../domain/alert-queue.model';
import { capitalize } from '../../../shared/utils/string.util';
import { MODEL_PRIORITY_BOX_INIT } from '../data';

export function mappingModelPriorityBox(
  ruleModelData: RuleModelApi[],
): ModelPriorityBox[] {
  const data: RuleModelApi[] = ruleModelData;

  const convertPhaseOne = data.reduce(
    (acc, item) => {
      const priority_type = (acc[item.priority_type] ??= {});
      const priority_level = (priority_type[item.priority_level] ??= []);
      priority_level.push(item);
      return acc;
    },
    {} as Record<any, Record<any, typeof data>>,
  );

  const convertPhaseTwo: ModelPriorityBox[] = Object.entries(
    convertPhaseOne,
  ).map(([priority_type, priority_level]) => ({
    priority: Number(priority_type),
    name:
      Number(priority_type) === 1
        ? 'High Priority'
        : Number(priority_type) === 2
          ? 'Medium Priority'
          : 'Low Priority',
    levels: Object.entries(priority_level).map(([level, items]) => ({
      level: Number(level),

      items: (items as any[])
        .map((x) => ({
          name: x.item_name,
          sourceName: x.item_type,
          branchName: x.product_type,
          id: x.item_id,
          position: x.priority_seq,
        }))
        .sort((a, b) => a.position - b.position),
    })),
  }));

  const result = [
    ...new Map(
      [...MODEL_PRIORITY_BOX_INIT, ...convertPhaseTwo].map((item) => [
        item.priority,
        item,
      ]),
    ).values(),
  ];

  return result;
}

export function mappingPriorityBox(
  ruleModelData: RuleModelApi[],
): PriorityBox[] {
  const data: RuleModelApi[] = ruleModelData;

  const convertPhaseOne = data.reduce(
    (acc, item) => {
      const priority_type = (acc[item.priority_type] ??= {});
      const priority_level = (priority_type[item.priority_level] ??= []);
      priority_level.push(item);
      return acc;
    },
    {} as Record<any, Record<any, typeof data>>,
  );

  const convertPhaseTwo: PriorityBox[] = Object.entries(convertPhaseOne).map(
    ([priority_type, priority_level]) => ({
      name:
        Number(priority_type) === 1
          ? 'High Priority'
          : Number(priority_type) === 2
            ? 'Medium Priority'
            : 'Low Priority',
      levels: Object.entries(priority_level).map(([level, items]) => ({
        id: Number(level),
        name: `Priority ${Number(level)}`,
        items: (items as any[]).map((x) => ({
          name: x.item_name,
          sourceName: capitalize(x.item_type),
          branchName: x.product_type,
          id: x.item_id,
        })),
      })),
    }),
  );

  return convertPhaseTwo;
}

export function mappingDetailsBox(
  ruleModelData: AlertQueueRuleModel[],
): PriorityBox[] {
  const data: AlertQueueRuleModel[] = ruleModelData;

  const convertPhaseOne = data.reduce(
    (acc, item) => {
      const priority_type = (acc[item.priorityType] ??= {});
      const priority_level = (priority_type[item.priorityLevel] ??= []);
      priority_level.push(item);
      return acc;
    },
    {} as Record<any, Record<any, typeof data>>,
  );

  const convertPhaseTwo: PriorityBox[] = Object.entries(convertPhaseOne).map(
    ([priority_type, priority_level]) => ({
      name:
        Number(priority_type) === 1
          ? 'High'
          : Number(priority_type) === 2
            ? 'Medium'
            : 'Low',
      levels: Object.entries(priority_level).map(([level, items]) => ({
        id: Number(level),
        name: `Priority ${Number(level)}`,
        items: (items as any[]).map((x) => ({
          name: x.itemName,
          sourceName: capitalize(x.itemType),
          branchName: x.productType,
          id: x.itemId,
        })),
      })),
    }),
  );

  return convertPhaseTwo;
}

type Item = {
  name: string;
  sourceName: string;
  branchName: string;
  id: string;
  position: number;
  highlight?: boolean;
};

type WithId = { id: string | number };

type LevelLike<I extends WithId> = { level: number; items: I[] };
type GroupLike<I extends WithId, L extends LevelLike<I>> = {
  priority: number;
  levels: L[];
};

const isSameItem = (a: Record<string, unknown>, b: Record<string, unknown>) =>
  a['name'] === b['name'] &&
  a['sourceName'] === b['sourceName'] &&
  a['branchName'] === b['branchName'] &&
  a['id'] === b['id'] &&
  a['position'] === b['position'];

export const markItemChanges = <
  I extends WithId & { highlight?: boolean },
  L extends LevelLike<I>,
  G extends GroupLike<I, L>,
>(
  A: G[],
  B: G[],
): G[] =>
  B.map((bGroup) => {
    const aGroup = A.find((g) => g.priority === bGroup.priority);

    return {
      ...bGroup,
      levels: bGroup.levels.map((bLevel) => {
        const aLevel = aGroup?.levels.find((l) => l.level === bLevel.level);
        const aItems = new Map<string | number, I>(
          (aLevel?.items ?? []).map((i) => [i.id, i]),
        );

        // const startedFromZero = aItems.size === 0;

        return {
          ...bLevel,
          items: bLevel.items.map((bItem) => {
            const aItem = aItems.get(bItem.id);
            const changed = !aItem || !isSameItem(aItem, bItem);
            return { ...bItem, highlight: changed };
          }),
        };
      }),
    };
  });
