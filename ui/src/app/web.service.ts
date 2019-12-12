import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {API_URL} from '../config';

@Injectable()
export class WebService {
    constructor(private http: HttpClient) {
        this._topRecipes = new BehaviorSubject([]);
        this.topRecipes = this._topRecipes.asObservable();
    }

    private _topRecipes;
    public topRecipes;

    private _recipeList = new Subject();
    public recipeList = this._recipeList.asObservable();

    private _recipeData = new Subject();
    public recipeData = this._recipeData.asObservable();

    private _recipeComments = new Subject();
    public recipeComments = this._recipeComments.asObservable();

    getTopRecipes() {
        if (this._topRecipes.getValue().length === 0) {
            this.http.get(`${API_URL}/recipes/top`).subscribe(response => {
                this._topRecipes.next(response);
                console.log(response);
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
            this._recipeData.next([response]);
        });
    }

    getRecipeComments(id: string) {
        return this.http.get(`${API_URL}/recipe/${id}/comments`).subscribe(response => {
            console.log(response);
            this._recipeComments.next(response);
        });
    }
}
