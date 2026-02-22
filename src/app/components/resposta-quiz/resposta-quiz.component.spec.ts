import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespostaQuizComponent } from './resposta-quiz.component';

describe('RespostaQuizComponent', () => {
  let component: RespostaQuizComponent;
  let fixture: ComponentFixture<RespostaQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RespostaQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RespostaQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
