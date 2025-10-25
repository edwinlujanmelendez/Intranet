import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenteSqlInteligenteComponent } from './asistente-sql-inteligente.component';

describe('AsistenteSqlInteligenteComponent', () => {
  let component: AsistenteSqlInteligenteComponent;
  let fixture: ComponentFixture<AsistenteSqlInteligenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsistenteSqlInteligenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenteSqlInteligenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
