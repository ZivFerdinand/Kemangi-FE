import { activeStatus } from '../../../../shared';
import {
  DataGroupCurrentTable,
  DataGroupDraftTable,
  DataGroupRequestedTable,
} from '../interfaces';

export interface ThresholdDetails {
  modelId: string;
  modelName: string;
  modelDescription: string;
  productType: string;
  afrisType: string;
  eventType: string;
  detectionType: string;
  attachment: any; // <-- allow any type
  createdByName: string;
  createdDt: string;
  activeStatus: boolean;
  lastApproval1Name: string;
  lastApproval2Name: string;
  lastApproval1Dt: string;
  lastApproval2Dt: string;
  lastUpdatedByName: string;
  lastUpdatedDt: string;
}

// 2. Export your default object with the type
export const thresholdDetailsDefault: ThresholdDetails = {
  modelId: '',
  modelName: '',
  modelDescription: '',
  productType: '',
  afrisType: '',
  eventType: '',
  detectionType: '',
  attachment: '', // can be string, object, file, etc.
  createdByName: '',
  createdDt: '',
  activeStatus: false,
  lastApproval1Name: '',
  lastApproval2Name: '',
  lastApproval1Dt: '',
  lastApproval2Dt: '',
  lastUpdatedByName: '',
  lastUpdatedDt: ''
};
