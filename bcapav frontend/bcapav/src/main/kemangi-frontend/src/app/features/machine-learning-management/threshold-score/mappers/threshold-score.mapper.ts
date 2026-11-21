import {
  ThresholdQuery,
  ThresholdApprovalQuery,
  ThresholdCurrentListParams,
  ThresholdRequestedListParams,
} from '../interfaces';

export function mapThresholdQuery(
  data: ThresholdQuery,
): ThresholdCurrentListParams {
  const { sortDir, ...rest } = data;

  return { ...rest, sort_dir: sortDir };
}

export function mapThresholdApprovalQuery(
  data: ThresholdApprovalQuery,
): ThresholdRequestedListParams {
  const { sortDir, ...rest } = data;

  return { ...rest, sort_dir: sortDir };
}
