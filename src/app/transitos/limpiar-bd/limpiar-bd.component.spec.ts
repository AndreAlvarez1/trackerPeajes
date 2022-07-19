import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimpiarBdComponent } from './limpiar-bd.component';

describe('LimpiarBdComponent', () => {
  let component: LimpiarBdComponent;
  let fixture: ComponentFixture<LimpiarBdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimpiarBdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimpiarBdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
