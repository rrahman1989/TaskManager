import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPriority, Priority } from '../priority.model';

import { PriorityService } from './priority.service';

describe('Priority Service', () => {
  let service: PriorityService;
  let httpMock: HttpTestingController;
  let elemDefault: IPriority;
  let expectedResult: IPriority | IPriority[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PriorityService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      name: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Priority', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Priority()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Priority', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Priority', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new Priority()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Priority', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Priority', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPriorityToCollectionIfMissing', () => {
      it('should add a Priority to an empty array', () => {
        const priority: IPriority = { id: 123 };
        expectedResult = service.addPriorityToCollectionIfMissing([], priority);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(priority);
      });

      it('should not add a Priority to an array that contains it', () => {
        const priority: IPriority = { id: 123 };
        const priorityCollection: IPriority[] = [
          {
            ...priority,
          },
          { id: 456 },
        ];
        expectedResult = service.addPriorityToCollectionIfMissing(priorityCollection, priority);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Priority to an array that doesn't contain it", () => {
        const priority: IPriority = { id: 123 };
        const priorityCollection: IPriority[] = [{ id: 456 }];
        expectedResult = service.addPriorityToCollectionIfMissing(priorityCollection, priority);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(priority);
      });

      it('should add only unique Priority to an array', () => {
        const priorityArray: IPriority[] = [{ id: 123 }, { id: 456 }, { id: 57962 }];
        const priorityCollection: IPriority[] = [{ id: 123 }];
        expectedResult = service.addPriorityToCollectionIfMissing(priorityCollection, ...priorityArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const priority: IPriority = { id: 123 };
        const priority2: IPriority = { id: 456 };
        expectedResult = service.addPriorityToCollectionIfMissing([], priority, priority2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(priority);
        expect(expectedResult).toContain(priority2);
      });

      it('should accept null and undefined values', () => {
        const priority: IPriority = { id: 123 };
        expectedResult = service.addPriorityToCollectionIfMissing([], null, priority, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(priority);
      });

      it('should return initial array if no Priority is added', () => {
        const priorityCollection: IPriority[] = [{ id: 123 }];
        expectedResult = service.addPriorityToCollectionIfMissing(priorityCollection, undefined, null);
        expect(expectedResult).toEqual(priorityCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
