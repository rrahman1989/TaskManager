import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPriority, getPriorityIdentifier } from '../priority.model';

export type EntityResponseType = HttpResponse<IPriority>;
export type EntityArrayResponseType = HttpResponse<IPriority[]>;

@Injectable({ providedIn: 'root' })
export class PriorityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/priorities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(priority: IPriority): Observable<EntityResponseType> {
    return this.http.post<IPriority>(this.resourceUrl, priority, { observe: 'response' });
  }

  update(priority: IPriority): Observable<EntityResponseType> {
    return this.http.put<IPriority>(`${this.resourceUrl}/${getPriorityIdentifier(priority) as number}`, priority, { observe: 'response' });
  }

  partialUpdate(priority: IPriority): Observable<EntityResponseType> {
    return this.http.patch<IPriority>(`${this.resourceUrl}/${getPriorityIdentifier(priority) as number}`, priority, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPriority>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPriority[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPriorityToCollectionIfMissing(priorityCollection: IPriority[], ...prioritiesToCheck: (IPriority | null | undefined)[]): IPriority[] {
    const priorities: IPriority[] = prioritiesToCheck.filter(isPresent);
    if (priorities.length > 0) {
      const priorityCollectionIdentifiers = priorityCollection.map(priorityItem => getPriorityIdentifier(priorityItem)!);
      const prioritiesToAdd = priorities.filter(priorityItem => {
        const priorityIdentifier = getPriorityIdentifier(priorityItem);
        if (priorityIdentifier == null || priorityCollectionIdentifiers.includes(priorityIdentifier)) {
          return false;
        }
        priorityCollectionIdentifiers.push(priorityIdentifier);
        return true;
      });
      return [...prioritiesToAdd, ...priorityCollection];
    }
    return priorityCollection;
  }
}
