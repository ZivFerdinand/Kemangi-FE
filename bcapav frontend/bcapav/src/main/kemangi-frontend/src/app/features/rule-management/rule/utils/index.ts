import {
  RuleDetailsForm,
  RuleDetailsSubrulesForm,
  Pipeline,
  PipelineForm,
  PipelineDetail,
  PipelineDetailsForm,
  RulePayloadForm,
  PipelineDetailsPayloadForm,
} from '../domain/rule.model';
import { initCriteria } from '../data';
import { generateId } from '../../../../shared/utils/general';

export function mappingPipelineFormData(
  pipelineData: Pipeline,
): PipelineDetailsForm[] {
  const data: Pipeline = structuredClone({ ...pipelineData });

  switch (pipelineData.pipelineType) {
    case 'GETBALANCE':
      return data.pipelineDetails.map((pd: PipelineDetail) => {
        const criteria = pd.detail?.criteria
          ? Object.fromEntries(
              pd.detail?.criteria.map((item) => [item.key, item.value]),
            )
          : null;

        return {
          uiId: generateId(),
          function: pd.detail?.function || null,
          functionFormulaArg: null,
          eventType: pd.detail?.eventType || null,
          eventTypeExtra: null,
          groupBy: [],
          period: pd.detail?.period || null,
          unit: pd.detail?.unit || null,
          ttlType:
            pd.detail?.ttlType === 'SESSION_UPDATE'
              ? 'SESSIONUPDATE'
              : pd.detail?.ttlType
                ? pd.detail?.ttlType
                : null,
          criteria: { ...initCriteria, ...criteria },
          outcome: pd.detail?.outcome || null,
          outcomeExtra: null,
          operator: pd.detail?.operator || null,
          value: pd.detail?.value || null,
          varName: pd.varName,
          isMultiParam: false,
          dataType: null,
        };
      });

    case 'JOURNEY':
      return data.pipelineDetails.map((pd: PipelineDetail) => {
        const criteria = pd.detail?.criteria
          ? Object.fromEntries(
              pd.detail?.criteria.map((item) => [item.key, item.value]),
            )
          : null;

        return {
          uiId: generateId(),
          function: pd.detail?.function || null,
          functionFormulaArg: null,
          eventType: pd.detail?.eventType || null,
          eventTypeExtra: null,
          groupBy: [],
          period: pd.detail?.period || null,
          unit: pd.detail?.unit || null,
          ttlType:
            pd.detail?.ttlType === 'SESSION_UPDATE'
              ? 'SESSIONUPDATE'
              : pd.detail?.ttlType
                ? pd.detail?.ttlType
                : null,
          criteria: { ...initCriteria, ...criteria },
          outcome: pd.detail?.outcome || null,
          outcomeExtra: null,
          operator: pd.detail?.operator || null,
          value:
            pd.detail?.value === 'true'
              ? true
              : pd.detail?.value === 'false'
                ? false
                : pd.detail?.value
                  ? pd.detail?.value
                  : null,
          varName: pd.varName,
          isMultiParam: false,
          dataType: null,
        };
      });

    case 'GETHISTORICAL':
      return data.pipelineDetails.map((pd: PipelineDetail) => {
        const criteria = pd.detail?.criteria
          ? Object.fromEntries(
              pd.detail?.criteria.map((item) => [item.key, item.value]),
            )
          : null;

        const outcome = pd.detail?.outcome?.split(',') ?? [];

        return {
          uiId: generateId(),
          function: pd.detail?.function || null,
          functionFormulaArg: null,
          eventType: pd.detail?.eventType || null,
          eventTypeExtra: null,
          groupBy: [],
          period: pd.detail?.period || null,
          unit: pd.detail?.unit || null,
          ttlType:
            pd.detail?.ttlType === 'SESSION_UPDATE'
              ? 'SESSIONUPDATE'
              : pd.detail?.ttlType
                ? pd.detail?.ttlType
                : null,
          criteria: { ...initCriteria, ...criteria },
          outcome: outcome[0] || null,
          outcomeExtra: outcome[1] || null,
          operator: pd.detail?.operator || null,
          value: pd.detail?.value || null,
          varName: pd.varName,
          isMultiParam: outcome[1] ? true : false,
          dataType: null,
        };
      });

    case 'REALTIMEHISTORICAL':
      return data.pipelineDetails.map((pd: PipelineDetail) => {
        const criteria = pd.detail?.criteria
          ? Object.fromEntries(
              pd.detail?.criteria.map((item) => [item.key, item.value]),
            )
          : null;

        return {
          uiId: generateId(),
          function: pd.detail?.function || null,
          functionFormulaArg: null,
          eventType: pd.detail?.eventType || null,
          eventTypeExtra: null,
          groupBy: [],
          period: pd.detail?.period || null,
          unit: pd.detail?.unit || null,
          ttlType:
            pd.detail?.ttlType === 'SESSION_UPDATE'
              ? 'SESSIONUPDATE'
              : pd.detail?.ttlType
                ? pd.detail?.ttlType
                : null,
          criteria: { ...initCriteria, ...criteria },
          outcome: pd.detail?.outcome || null,
          outcomeExtra: null,
          operator: pd.detail?.operator || null,
          value: pd.detail?.value || null,
          varName: pd.varName,
          isMultiParam: false,
          dataType: null,
        };
      });

    case 'WATCHLIST':
      return data.pipelineDetails.map((pd: PipelineDetail) => {
        const criteria = pd.detail?.criteria
          ? Object.fromEntries(
              pd.detail?.criteria.map((item) => [item.key, item.value]),
            )
          : null;

        return {
          uiId: generateId(),
          function: pd.detail?.function || null,
          functionFormulaArg: null,
          eventType: pd.detail?.eventType || null,
          eventTypeExtra: null,
          groupBy: [],
          period: pd.detail?.period || null,
          unit: pd.detail?.unit || null,
          ttlType:
            pd.detail?.ttlType === 'SESSION_UPDATE'
              ? 'SESSIONUPDATE'
              : pd.detail?.ttlType
                ? pd.detail?.ttlType
                : null,
          criteria: { ...initCriteria, ...criteria },
          outcome: pd.detail?.outcome || null,
          outcomeExtra: null,
          operator: pd.detail?.operator || null,
          value:
            pd.detail?.value === 'true'
              ? true
              : pd.detail?.value === 'false'
                ? false
                : pd.detail?.value
                  ? pd.detail?.value
                  : null,
          varName: pd.varName,
          isMultiParam: false,
          dataType: null,
        };
      });

    case 'NULL':
      return data.pipelineDetails.map((pd: PipelineDetail) => {
        const splitEvent = pd.detail?.eventType
          ? pd.detail.eventType.split(',')
          : [];

        return {
          uiId: generateId(),
          function: pd.detail?.function || null,
          functionFormulaArg: null,
          eventType: splitEvent[0] ?? null,
          eventTypeExtra: splitEvent[1] ?? null,
          groupBy: [],
          period: pd.detail?.period || null,
          unit: pd.detail?.unit || null,
          ttlType:
            pd.detail?.ttlType === 'SESSION_UPDATE'
              ? 'SESSIONUPDATE'
              : pd.detail?.ttlType
                ? pd.detail?.ttlType
                : null,
          criteria: {
            ...initCriteria,
          },
          outcome: pd.detail?.outcome || null,
          outcomeExtra: null,
          operator: pd.detail?.operator || null,
          value: pd.detail?.value || null,
          varName: pd.varName,
          isMultiParam: false,
          dataType: null,
        };
      });

    default:
      return data.pipelineDetails.map((pd: PipelineDetail) => ({
        uiId: generateId(),
        function: pd.detail?.function || null,
        functionFormulaArg: null,
        eventType: pd.detail?.eventType || null,
        eventTypeExtra: null,
        groupBy: [],
        period: pd.detail?.period || null,
        unit: pd.detail?.unit || null,
        ttlType:
          pd.detail?.ttlType === 'SESSION_UPDATE'
            ? 'SESSIONUPDATE'
            : pd.detail?.ttlType
              ? pd.detail?.ttlType
              : null,
        criteria: {
          ...initCriteria,
        },
        outcome: pd.detail?.outcome || null,
        outcomeExtra: null,
        operator: pd.detail?.operator || null,
        value: pd.detail?.value || null,
        varName: pd.varName,
        isMultiParam: false,
        dataType: null,
      }));
  }
}

export function mappingRulePayload(formData: RuleDetailsForm): RulePayloadForm {
  const data: RuleDetailsForm = structuredClone({ ...formData });

  const { id, ...currentValue } = data;

  return {
    ...currentValue,
    ruleName: changeRuleName(currentValue),
    ruleEnd: currentValue.ruleEnd
      ? currentValue.ruleEnd
      : currentValue.ruleStart,
    listFiles: currentValue.listFiles ? currentValue.listFiles : [],
    subrules: currentValue.subrules.map((sub: RuleDetailsSubrulesForm) => {
      return {
        subruleId: sub.subruleId ?? null,
        subruleName: sub.subruleName ?? null,
        eventType: sub.eventType ?? null,
        hasPipeline: sub.hasPipeline,
        pipelines:
          sub.pipelines.length > 0
            ? sub.pipelines
                .filter((x: PipelineForm) => x.pipelineType !== null)
                .filter((x: PipelineForm) => x.pipelineType !== 'CUSTOM')
                .map((x: PipelineForm) => ({
                  pipelineType: x.pipelineType ?? null,
                  skipIfExists: x.skipIfExists ?? null,
                  varName: x.varName ?? null,
                  pipelineDetails: mappingPipelinePayloadData(x),
                }))
            : [],
        pipelineCustom: sub.pipelines
          .filter((x: PipelineForm) => x.pipelineCustomData !== undefined)
          .filter((x: PipelineForm) => x.pipelineCustomData !== null)
          .filter((x: PipelineForm) => x.pipelineCustomData !== '')
          .map((x: PipelineForm) => ({
            schemaJson: x.pipelineCustomData || '',
          })),
        autoAction:
          sub.autoAction.length > 0
            ? sub.autoAction.map((x) => ({
                channelType: x.channelType ?? null,
                templateId: x.templateId ?? null,
                limitFlag: x.limitFlag ?? null,
                key: x.key ?? null,
                threshold: Number(x.threshold) ?? null,
                period: Number(x.period) ?? null,
                unit: x.unit ?? null,
                description: x.description ?? null,
              }))
            : [],
        parameters:
          sub.parameters.length > 0
            ? sub.parameters.map((x) => ({
                functionName: x.functionName ?? null,
                parameter: `${x.parameter1}${x.parameter2 ? `,${x.parameter2}` : ''}`,
                operator: x.operator ?? null,
                value: x.value ?? null,
                dataGroupId: x.dataGroupId ?? null,
              }))
            : [],
      };
    }),
  };
}

export function mappingPipelinePayloadData(
  pipelineData: PipelineForm,
): PipelineDetailsPayloadForm[] {
  const data: PipelineForm = structuredClone({ ...pipelineData });

  switch (data.pipelineType) {
    case 'AGGREGATION':
      return structuredClone(
        data.pipelineDetails.map((pd: PipelineDetailsForm) => ({
          detail: {
            function: pd.function,
            eventType: `${pd.eventType}${pd.groupBy && pd.groupBy.length > 0 ? `,${pd.groupBy.join(',')}` : ''}`,
            period: Number(pd.period),
            unit: pd.unit,
            ttlType: pd.ttlType ?? 'SESSION',
            criteria: [],
            outcome: null,
            operator: pd.operator,
            value: pd.value,
          },
          varName: pd.varName,
        })),
      );

    case 'GETBALANCE':
      return structuredClone(
        data.pipelineDetails.map((pd: PipelineDetailsForm) => {
          const criteria = pd.criteria
            ? Object.entries(pd.criteria)
                .filter(([, value]) => value !== null)
                .map(([key, value]) => ({
                  key,
                  value,
                }))
            : [];
          return {
            detail: {
              function: null,
              eventType: null,
              period: null,
              unit: null,
              ttlType: 'SESSION',
              criteria: criteria,
              outcome: 'BALANCE',
              operator: pd.operator,
              value: pd.value,
            },
            varName: pd.varName,
          };
        }),
      );

    case 'JOURNEY':
      return structuredClone(
        data.pipelineDetails.map((pd: PipelineDetailsForm) => {
          const criteria = pd.criteria
            ? Object.entries(pd.criteria)
                .filter(([, value]) => value !== null)
                .map(([key, value]) => ({
                  key,
                  value,
                }))
            : [];

          return {
            detail: {
              function: null,
              eventType: null,
              period: pd.period,
              unit: pd.unit,
              ttlType: pd.ttlType ?? 'SESSION',
              criteria: criteria,
              outcome: pd.outcome,
              operator: pd.operator,
              value: pd.value,
            },
            varName: pd.varName,
          };
        }),
      );

    case 'WATCHLIST':
      return structuredClone(
        data.pipelineDetails.map((pd: PipelineDetailsForm) => {
          const criteria = pd.criteria
            ? Object.entries(pd.criteria)
                .filter(([, value]) => value !== null)
                .map(([key, value]) => ({
                  key,
                  value,
                }))
            : [];

          return {
            detail: {
              function: null,
              eventType: null,
              period: null,
              unit: null,
              ttlType: pd.ttlType ?? 'SESSION',
              criteria: criteria,
              outcome: pd.outcome,
              operator: pd.operator,
              value: pd.value,
            },
            varName: pd.varName,
          };
        }),
      );

    case 'NULL':
      return structuredClone(
        data.pipelineDetails.map((pd: PipelineDetailsForm) => ({
          detail: {
            function: pd.function,
            eventType: `${pd.eventType}${pd.eventTypeExtra ? `,${pd.eventTypeExtra}` : ''}`,
            period: null,
            unit: null,
            ttlType: pd.ttlType ?? 'SESSION',
            criteria: [],
            outcome: pd.outcome,
            operator: pd.operator,
            value: pd.value,
          },
          varName: pd.varName,
        })),
      );

    case 'GETHISTORICAL':
      return structuredClone(
        data.pipelineDetails.map((pd: PipelineDetailsForm) => {
          const criteria = pd.criteria
            ? Object.entries(pd.criteria)
                .filter(([, value]) => value !== null)
                .map(([key, value]) => ({
                  key,
                  value,
                }))
            : [];

          return {
            detail: {
              function: pd.function,
              eventType: null,
              period: null,
              unit: null,
              ttlType: pd.ttlType ?? 'SESSION',
              criteria: criteria,
              outcome: `${pd.outcome}${pd.outcomeExtra ? `,${pd.outcomeExtra}` : ''}`,
              operator: pd.operator,
              value: pd.value,
            },
            varName: pd.varName,
          };
        }),
      );

    case 'REALTIMEHISTORICAL':
      return structuredClone(
        data.pipelineDetails.map((pd: PipelineDetailsForm) => {
          const criteria = pd.criteria
            ? Object.entries(pd.criteria)
                .filter(([, value]) => value !== null)
                .map(([key, value]) => ({
                  key,
                  value,
                }))
            : [];

          return {
            detail: {
              function: null,
              eventType: null,
              period: pd.period,
              unit: pd.unit,
              ttlType: pd.ttlType || 'SESSION',
              criteria: criteria,
              outcome: pd.outcome,
              operator: pd.operator,
              value: pd.value,
            },
            varName: pd.varName,
          };
        }),
      );

    default:
      return [];
  }
}

export function changeRuleName(data: any): string {
  const hasAutoBlock = data.subrules.some((subrule: any) =>
    subrule.autoAction?.some((a: any) => a.channelType === 'AUTOBLOCK'),
  );

  const currentName = data.ruleName;
  const baseName = currentName.startsWith('AB-')
    ? currentName.replace(/^(AB-)+/, '')
    : currentName;

  const ruleName: string = hasAutoBlock ? 'AB-' + baseName : baseName;

  return ruleName;
}

export function deletePrefixAB(data: string): string {
  const baseName = data.startsWith('AB-') ? data.replace(/^(AB-)+/, '') : data;

  return baseName;
}
