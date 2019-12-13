import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {API_URL} from '../config';
import {isEqual} from 'lodash';

@Injectable()
export class WebService {
    constructor(private http: HttpClient) {
        this._topRecipes = new BehaviorSubject([]);
        this.topRecipes = this._topRecipes.asObservable();

        this._recipeList = new BehaviorSubject([]);
        this.recipeList = this._recipeList.asObservable();

        this._recipeData = new Subject();
        this.recipeData = this._recipeData.asObservable();

        this._recipeComments = new BehaviorSubject([]);
        this.recipeComments = this._recipeComments.asObservable();

        this._recipeSearch = new BehaviorSubject([]);
        this.recipeSearch = this._recipeSearch.asObservable();
    }

    private _topRecipes;
    public topRecipes;

    private _recipeList;
    public recipeList;

    private _recipeData;
    public recipeData;

    private _recipeComments;
    public recipeComments;

    private _recipeSearch;
    public recipeSearch;

    getTopRecipes() {
        if (this._topRecipes.getValue().length === 0) {
            this.http.get(`${API_URL}/recipes/top`).subscribe(response => {
                this._topRecipes.next(response);
            });
        }
    }

    getRecipes(page: number) {
        this.http.get(`${API_URL}/recipes${page > 1 ? `?p=${page}` : ''}`).subscribe(response => {
            this._recipeList.next(response);
        });
    }

    getRecipe(id: string) {
        this.http.get(`${API_URL}/recipe/${id}`).subscribe(response => {
            this._recipeData.next(response);
        });
    }

    getRecipeComments(id: string) {
        this.http.get(`${API_URL}/recipe/${id}/comments`).subscribe(response => {
            this._recipeComments.next(response);
        });
    }

    searchRecipes(criteria: string, page?: number) {
        if (criteria.length > 0) {
            this.http.get(`${API_URL}/recipes/search?criteria=${criteria}${page > 1 ? `&p=${page}` : ''}`).subscribe(response => {
                if (!isEqual(response, this._recipeSearch.getValue())) {
                    this._recipeSearch.next(response);
                }
            });
        }
    }

    comment(id: string, body: string, token: string) {
        let data = new FormData();
        data.append('body', body);

        const headers = {
            headers: new HttpHeaders({'x-access-token': token})
        };

        this.http.post(`${API_URL}/recipe/${id}/comments`, data, headers).toPromise().then(response => {
            this._recipeComments.next(response);
        });
    }
}
