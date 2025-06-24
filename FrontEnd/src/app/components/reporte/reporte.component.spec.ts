import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteOcupacionComponent } from './reporte.component';

describe('ReporteOcupacionComponent', () => {
  let component: ReporteOcupacionComponent;
  let fixture: ComponentFixture<ReporteOcupacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteOcupacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteOcupacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
