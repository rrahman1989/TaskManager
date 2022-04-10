import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPriority } from '../priority.model';
import { PriorityService } from '../service/priority.service';

@Component({
  templateUrl: './priority-delete-dialog.component.html',
})
export class PriorityDeleteDialogComponent {
  priority?: IPriority;

  constructor(protected priorityService: PriorityService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.priorityService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
