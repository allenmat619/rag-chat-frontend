import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RagCore } from './rag-core';

describe('RagCore', () => {
  let component: RagCore;
  let fixture: ComponentFixture<RagCore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RagCore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RagCore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
