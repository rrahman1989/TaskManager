import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPriority } from '../priority.model';
import { PriorityService } from '../service/priority.service';
import { PriorityDeleteDialogComponent } from '../delete/priority-delete-dialog.component';

@Component({
  selector: 'jhi-priority',
  templateUrl: './priority.component.html',
})
export class PriorityComponent implements OnInit {
  priorities?: IPriority[];
  isLoading = false;

  constructor(protected priorityService: PriorityService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.priorityService.query().subscribe({
      next: (res: HttpResponse<IPriority[]>) => {
        this.isLoading = false;
        this.priorities = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPriority): number {
    return item.id!;
  }

  delete(priority: IPriority): void {
    const modalRef = this.modalService.open(PriorityDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.priority = priority;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
