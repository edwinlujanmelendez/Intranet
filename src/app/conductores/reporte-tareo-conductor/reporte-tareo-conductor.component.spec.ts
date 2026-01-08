import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTareoConductorComponent } from './reporte-tareo-conductor.component';

describe('ReporteTareoConductorComponent', () => {
  let component: ReporteTareoConductorComponent;
  let fixture: ComponentFixture<ReporteTareoConductorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteTareoConductorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteTareoConductorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
