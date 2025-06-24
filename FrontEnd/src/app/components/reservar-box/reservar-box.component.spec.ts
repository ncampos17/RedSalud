import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservarBoxComponent } from './reservar-box.component';

describe('ReservarBoxComponent', () => {
  let component: ReservarBoxComponent;
  let fixture: ComponentFixture<ReservarBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservarBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservarBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});