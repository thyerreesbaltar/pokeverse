import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private jsonURL = "assets/db/db.json";
  constructor(
    private http: HttpClient
  ) { }


  getQuiz(): Observable<any>{
    return this.http.get(this.jsonURL);
  }
}
