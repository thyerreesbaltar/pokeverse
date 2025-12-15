import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualPokemonComponent } from './qual-pokemon.component';

describe('QualPokemonComponent', () => {
  let component: QualPokemonComponent;
  let fixture: ComponentFixture<QualPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualPokemonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
