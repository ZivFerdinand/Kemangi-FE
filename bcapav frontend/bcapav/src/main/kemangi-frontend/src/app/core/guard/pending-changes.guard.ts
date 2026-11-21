import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationModalService } from '../services/confirmation-modal.service';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard
  implements CanDeactivate<ComponentCanDeactivate>
{
  constructor(public confirmationDialogService: ConfirmationModalService) {}

  canDeactivate(component: ComponentCanDeactivate): any {
    // if there are no pending changes, just allow deactivation; else confirm first
    if (localStorage.getItem(btoa('currentUser'))) {
      return component.canDeactivate()
        ? true
        : // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
          // when navigating away from your angular app, the browser will show a generic warning message
          // see http://stackoverflow.com/a/42207299/7307355
          this.confirmationDialogService.confirm(
            'Discard Changes',
            'Are you sure you want to discard all changes?'
          );
    } else {
      return true;
    }
  }
}
