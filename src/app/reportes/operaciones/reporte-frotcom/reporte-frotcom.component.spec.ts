import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteFrotcomComponent } from './reporte-frotcom.component';

describe('ReporteFrotcomComponent', () => {
  let component: ReporteFrotcomComponent;
  let fixture: ComponentFixture<ReporteFrotcomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteFrotcomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteFrotcomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
