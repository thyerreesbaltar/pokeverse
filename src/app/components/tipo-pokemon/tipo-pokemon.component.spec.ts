import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPokemonComponent } from './tipo-pokemon.component';

describe('TipoPokemonComponent', () => {
  let component: TipoPokemonComponent;
  let fixture: ComponentFixture<TipoPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoPokemonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
