import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class WebService {
    constructor(private http: HttpClient) {
    }

    API_URL = 'http://localhost:5000';

    private __recipeList = [];
    private _recipeList = new Subject();
    public recipeList = this._recipeList.asObservable();

    private __recipeData = {};
    private _recipeData = new Subject();
    public recipeData = this._recipeData.asObservable();

    getRecipes() {
        return this.http.get(`${this.API_URL}/recipes`).subscribe(response => {
            this.__recipeList = response;
            this._recipeList.next(this.__recipeList);
        });
    }

    getRecipe(id: string) {
        if (this._recipeData[id]) {
            return this.__recipeData[id];
        }
        return this.http.get(`${this.API_URL}/recipe/${id}`).subscribe(response => {
            this.__recipeData = {
                ...this.__recipeData,
                [id]: response
            };
            this._recipeData.next(this.__recipeData);
        });
    }
}
