import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraPreenchimentoComponent } from './barra-preenchimento.component';

describe('BarraPreenchimentoComponent', () => {
  let component: BarraPreenchimentoComponent;
  let fixture: ComponentFixture<BarraPreenchimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarraPreenchimentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarraPreenchimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
