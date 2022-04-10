import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PriorityDetailComponent } from './priority-detail.component';

describe('Priority Management Detail Component', () => {
  let comp: PriorityDetailComponent;
  let fixture: ComponentFixture<PriorityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PriorityDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ priority: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PriorityDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PriorityDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load priority on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.priority).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
