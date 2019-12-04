import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class WebService {
    constructor(private http: HttpClient) {
    }

    apiUrl = 'http://localhost:5000';

    getRecipes() {
        return this.http.get(`${this.apiUrl}/recipes`).toPromise();
    }

    getRecipe(id: string) {
        return this.http.get(`${this.apiUrl}/recipe/${id}`).toPromise();
    }
}
