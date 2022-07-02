import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoFacturadosComponent } from './no-facturados.component';

describe('NoFacturadosComponent', () => {
  let component: NoFacturadosComponent;
  let fixture: ComponentFixture<NoFacturadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoFacturadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoFacturadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
