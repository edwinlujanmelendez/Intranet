import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaBoletosComponent } from './auditoria-boletos.component';

describe('AuditoriaBoletosComponent', () => {
  let component: AuditoriaBoletosComponent;
  let fixture: ComponentFixture<AuditoriaBoletosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaBoletosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaBoletosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
