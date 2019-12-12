import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {API_URL} from '../config';

@Injectable()
export class WebService {
    constructor(private http: HttpClient) {
        this._topRecipes = new BehaviorSubject([]);
        this.topRecipes = this._topRecipes.asObservable();

        this._recipeList = new BehaviorSubject([]);
        this.recipeList = this._recipeList.asObservable();

        this._recipeData = new BehaviorSubject({});
        this.recipeData = this._recipeData.asObservable();

        this._recipeComments = new BehaviorSubject([]);
        this.recipeComments = this._recipeComments.asObservable();
    }

    private _topRecipes;
    public topRecipes;

    private _recipeList;
    public recipeList;

    private _recipeData;
    public recipeData;

    private _recipeComments;
    public recipeComments;

    getTopRecipes() {
        if (this._topRecipes.getValue().length === 0) {
            this.http.get(`${API_URL}/recipes/top`).subscribe(response => {
                this._topRecipes.next(response);
            });
        }
    }

    getRecipes(page: number) {
        return this.http.get(`${API_URL}/recipes${page > 1 ? `?p=${page}` : ''}`).subscribe(response => {
            this._recipeList.next(response);
        });
    }

    getRecipe(id: string) {
        return this.http.get(`${API_URL}/recipe/${id}`).subscribe(response => {
            this._recipeData.next(response);
        });
    }

    getRecipeComments(id: string) {
        return this.http.get(`${API_URL}/recipe/${id}/comments`).subscribe(response => {
            this._recipeComments.next(response);
        });
    }
}
