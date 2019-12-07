import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class WebService {
    constructor(private http: HttpClient) {
    }

    API_URL = 'http://localhost:5000';

    private recipeListArr;
    private recipeListSub = new Subject();
    public recipeList = this.recipeListSub.asObservable();

    getRecipes(page: number) {
        return this.http.get(`${this.API_URL}/recipes${page > 1 ? `?p=${page}` : ''}`).subscribe(response => {
            this.recipeListArr = response;
            this.recipeListSub.next(this.recipeListArr);
        });
    }


    private recipeDataObj;
    private recipeDataSub = new Subject();
    public recipeData = this.recipeDataSub.asObservable();

    getRecipe(id: string) {
        return this.http.get(`${this.API_URL}/recipe/${id}`).subscribe(response => {
            this.recipeDataObj = [response];
            this.recipeDataSub.next(this.recipeDataObj);
        });
    }
}
