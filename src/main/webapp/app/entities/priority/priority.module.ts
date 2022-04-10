import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PriorityComponent } from './list/priority.component';
import { PriorityDetailComponent } from './detail/priority-detail.component';
import { PriorityUpdateComponent } from './update/priority-update.component';
import { PriorityDeleteDialogComponent } from './delete/priority-delete-dialog.component';
import { PriorityRoutingModule } from './route/priority-routing.module';

@NgModule({
  imports: [SharedModule, PriorityRoutingModule],
  declarations: [PriorityComponent, PriorityDetailComponent, PriorityUpdateComponent, PriorityDeleteDialogComponent],
  entryComponents: [PriorityDeleteDialogComponent],
})
export class PriorityModule {}
