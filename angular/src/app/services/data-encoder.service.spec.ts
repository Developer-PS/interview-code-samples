import { TestBed } from '@angular/core/testing';

import { DataEncoderService } from './data-encoder.service';

describe('DataEncoderService', () => {
  let service: DataEncoderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataEncoderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
