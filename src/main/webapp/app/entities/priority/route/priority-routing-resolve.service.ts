import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPriority, Priority } from '../priority.model';
import { PriorityService } from '../service/priority.service';

@Injectable({ providedIn: 'root' })
export class PriorityRoutingResolveService implements Resolve<IPriority> {
  constructor(protected service: PriorityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPriority> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((priority: HttpResponse<Priority>) => {
          if (priority.body) {
            return of(priority.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Priority());
  }
}
