import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PriorityService } from '../service/priority.service';
import { IPriority, Priority } from '../priority.model';

import { PriorityUpdateComponent } from './priority-update.component';

describe('Priority Management Update Component', () => {
  let comp: PriorityUpdateComponent;
  let fixture: ComponentFixture<PriorityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let priorityService: PriorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PriorityUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PriorityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PriorityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    priorityService = TestBed.inject(PriorityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const priority: IPriority = { id: 456 };

      activatedRoute.data = of({ priority });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(priority));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Priority>>();
      const priority = { id: 123 };
      jest.spyOn(priorityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ priority });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: priority }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(priorityService.update).toHaveBeenCalledWith(priority);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Priority>>();
      const priority = new Priority();
      jest.spyOn(priorityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ priority });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: priority }));
      saveSubject.complete();

      // THEN
      expect(priorityService.create).toHaveBeenCalledWith(priority);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Priority>>();
      const priority = { id: 123 };
      jest.spyOn(priorityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ priority });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(priorityService.update).toHaveBeenCalledWith(priority);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
