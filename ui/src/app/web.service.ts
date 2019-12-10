import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {API_URL} from '../config';

@Injectable()
export class WebService {
    constructor(private http: HttpClient) {
    }

    private recipeListSub = new Subject();
    public recipeList = this.recipeListSub.asObservable();

    private recipeDataSub = new Subject();
    public recipeData = this.recipeDataSub.asObservable();

    private recipeCommentsSub = new Subject();
    public recipeComments = this.recipeCommentsSub.asObservable();

    getRecipes(page: number) {
        return this.http.get(`${API_URL}/recipes${page > 1 ? `?p=${page}` : ''}`).subscribe(response => {
            this.recipeListSub.next(response);
        });
    }

    getRecipe(id: string) {
        return this.http.get(`${API_URL}/recipe/${id}`).subscribe(response => {
            this.recipeDataSub.next([response]);
        });
    }

    getRecipeComments(id: string) {
        return this.http.get(`${API_URL}/recipe/${id}/comments`).subscribe(response => {
            console.log(response)
            this.recipeCommentsSub.next(response);
        });
    }
}
