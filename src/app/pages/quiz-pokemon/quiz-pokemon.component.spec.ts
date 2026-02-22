import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizPokemonComponent } from './quiz-pokemon.component';

describe('QuizPokemonComponent', () => {
  let component: QuizPokemonComponent;
  let fixture: ComponentFixture<QuizPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizPokemonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
