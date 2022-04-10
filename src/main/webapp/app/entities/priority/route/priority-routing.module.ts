import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PriorityComponent } from '../list/priority.component';
import { PriorityDetailComponent } from '../detail/priority-detail.component';
import { PriorityUpdateComponent } from '../update/priority-update.component';
import { PriorityRoutingResolveService } from './priority-routing-resolve.service';

const priorityRoute: Routes = [
  {
    path: '',
    component: PriorityComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PriorityDetailComponent,
    resolve: {
      priority: PriorityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PriorityUpdateComponent,
    resolve: {
      priority: PriorityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PriorityUpdateComponent,
    resolve: {
      priority: PriorityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(priorityRoute)],
  exports: [RouterModule],
})
export class PriorityRoutingModule {}
