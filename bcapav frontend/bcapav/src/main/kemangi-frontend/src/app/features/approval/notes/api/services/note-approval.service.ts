import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';
import { NotesApprovalQueryApi } from '../models/note-approval';

@Injectable({ providedIn: 'root' })
export class NotesApprovalService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public noteApprovalList(param: NotesApprovalQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(`${this.base_URL}/note/approval/search?`, {
      params,
    });
  }

  public noteApprovalDetails(id: number) {
    return this.httpClient.get(`${this.base_URL}/note/approval/detail/${id}`);
  }

  public approveNote(data: any) {
    return this.httpClient.put(`${this.base_URL}/note/approval/approve`, data);
  }

  public rejectNote(data: any) {
    return this.httpClient.put(`${this.base_URL}/note/approval/reject`, data);
  }
}
