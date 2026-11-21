import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NoteParamsApi } from '../models/note';

@Injectable({ providedIn: 'root' })
export class NotesService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public createNote(data: any) {
    return this.httpClient.post(`${this.base_URL}/note/create`, data);
  }

  public updateNote(data: any) {
    return this.httpClient.put(`${this.base_URL}/note/update`, data);
  }

  public deleteNote(id: number) {
    return this.httpClient.delete(`${this.base_URL}/note/delete/${id}`);
  }

  public noteList(param: NoteParamsApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/note/search?`, {
      params,
    });
  }

  public noteDetails(id: string) {
    return this.httpClient.get(`${this.base_URL}/note/detail/${id}`);
  }
}
