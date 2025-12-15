import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPokemonComponent } from './modal-pokemon.component';

describe('ModalPokemonComponent', () => {
  let component: ModalPokemonComponent;
  let fixture: ComponentFixture<ModalPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPokemonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
