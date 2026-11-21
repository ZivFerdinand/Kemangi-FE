import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FailedModalEventService {
  private messageSource = new Subject<string>();

  message$ = this.messageSource.asObservable();

  emit(message: string) {
    this.messageSource.next(message);
  }
}
