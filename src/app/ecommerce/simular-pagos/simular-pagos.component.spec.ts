import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimularPagosComponent } from './simular-pagos.component';

describe('SimularPagosComponent', () => {
  let component: SimularPagosComponent;
  let fixture: ComponentFixture<SimularPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimularPagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimularPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
