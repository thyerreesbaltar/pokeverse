import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemoriaComponent } from './pokemoria.component';

describe('PokemoriaComponent', () => {
  let component: PokemoriaComponent;
  let fixture: ComponentFixture<PokemoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
