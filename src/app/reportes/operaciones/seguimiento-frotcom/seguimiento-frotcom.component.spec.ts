import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoFrotcomComponent } from './seguimiento-frotcom.component';

describe('SeguimientoFrotcomComponent', () => {
  let component: SeguimientoFrotcomComponent;
  let fixture: ComponentFixture<SeguimientoFrotcomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoFrotcomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoFrotcomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
