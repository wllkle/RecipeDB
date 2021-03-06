import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {API_URL} from '../config';
import {isEqual} from 'lodash';

@Injectable()
export class RecipeService {
    constructor(private http: HttpClient) {
        this._top = new BehaviorSubject([]);
        this.top = this._top.asObservable();

        this._data = new BehaviorSubject({});
        this.data = this._data.asObservable();

        this._comments = new BehaviorSubject([]);
        this.comments = this._comments.asObservable();

        this._search = new Subject();
        this.search = this._search.asObservable();

        this._bookmarks = new BehaviorSubject([]);
        this.bookmarks = this._bookmarks.asObservable();
    }

    private _top;
    public top;

    private _data;
    public data;

    private _comments;
    public comments;

    private _search;
    public search;

    private _bookmarks;
    public bookmarks;

    getRecipe(id: string, token?: string) {
        let headers = null;
        if (token) {
            headers = {
                headers: new HttpHeaders({'x-access-token': token})
            };
            this.http.get(`${API_URL}/recipe/${id}`, headers).toPromise().then(response => {
                if (!isEqual(response, this._data.getValue())) {
                    this._data.next(response);
                }
            }).catch(error => {
                console.warn(error);
                this._data.next(null);
            });
        } else {
            this.http.get(`${API_URL}/recipe/${id}`).toPromise().then(response => {
                this._data.next(response);
            }).catch(error => {
                console.warn(error);
                this._data.next(null);
            });
        }
    }

    getRecipeComments(id: string) {
        this.http.get(`${API_URL}/recipe/${id}/comments`).toPromise().then(response => {
            this._comments.next(response);
        }).catch(error => {
            console.warn(error);
        });
    }

    comment(id: string, body: string, token: string) {
        let formData = new FormData();
        formData.append('body', body);

        const headers = {
            headers: new HttpHeaders({'x-access-token': token})
        };

        this.http.post(`${API_URL}/recipe/${id}/comments`, formData, headers).toPromise().then(response => {
            this._comments.next(response);
        });
    }

    updateComment(id: string, body: string, token: string) {
        let formData = new FormData();
        formData.append('body', body);

        const headers = {
            headers: new HttpHeaders({'x-access-token': token})
        };

        this.http.put(`${API_URL}/recipe/${id}/comments`, formData, headers).toPromise().then(response => {
            this._comments.next(response);
        });
    }

    deleteComment(id: string, token: string) {
        const headers = {
            headers: new HttpHeaders({'x-access-token': token})
        };
        return this.http.delete(`${API_URL}/recipe/${id}/comments`, headers).toPromise().then((response) => {
            this._comments.next(response);
            return {message: 'Your comment has been deleted successfully.'};
        }).catch(error => {
            return {error: 'An error occurred deleting this comment.'};
        });
    }

    bookmarkRecipe(id: string, token: string) {
        const headers = {
            headers: new HttpHeaders({'x-access-token': token})
        };
        return this.http.post(`${API_URL}/recipe/${id}/bookmark`, null, headers).toPromise().then(() => {
            const recipe = this._data.getValue();
            if (!recipe.bookmarked) {
                recipe.bookmarked = true;
                this._data.next(recipe);
            }
            return {message: `"${recipe.title}" has been added to your bookmarks.`};
        }).catch(error => {
            return {error: 'An error occurred bookmarking this recipe.'};
        });
    }

    unbookmarkRecipe(id: string, token: string) {
        const headers = {
            headers: new HttpHeaders({'x-access-token': token})
        };
        return this.http.delete(`${API_URL}/recipe/${id}/bookmark`, headers).toPromise().then(() => {
            const recipe = this._data.getValue();
            if (recipe.bookmarked) {
                recipe.bookmarked = false;
                this._data.next(recipe);
            }
            return {message: `"${recipe.title}" has been removed from your bookmarks.`};
        }).catch(error => {
            return {error: 'An error occurred removing this recipe from your bookmarks.'};
        });
    }

    searchRecipes(criteria: string, page?: number) {
        if (criteria.length > 0) {
            this.http.get(`${API_URL}/recipes/search?criteria=${criteria}${page > 1 ? `&p=${page}` : ''}`).toPromise().then(response => {
                this._search.next(response);
            }).catch(error => {
            });
        }
    }

    topRecipes() {
        if (this._top.getValue().length === 0) {
            this.http.get(`${API_URL}/recipes/top`).toPromise().then(response => {
                if (!isEqual(response, this._top.getValue())) {
                    this._top.next(response);
                }
            });
        }
    }

    getBookmarks(token: string) {
        const headers = {
            headers: new HttpHeaders({'x-access-token': token})
        };
        this.http.get(`${API_URL}/bookmarks`, headers).toPromise().then(response => {
            if (!isEqual(response, this._bookmarks.getValue())) {
                this._bookmarks.next(response);
            }
        }).catch(error => {
        });
    }

    scrapeBbc(url: string, token: string, navigate: Function) {
        let formData = new FormData();
        formData.append('url', url);
        const headers = {
            headers: new HttpHeaders({'x-access-token': token})
        };
        this.http.post(`${API_URL}/recipes`, formData, headers).toPromise().then(response => {
            if (response.hasOwnProperty('inserted')) {
                navigate(response['inserted']);
            }
        });
    }

    deleteRecipe(id: string, token: string) {
        const headers = {
            headers: new HttpHeaders({'x-access-token': token})
        };
        return this.http.delete(`${API_URL}/recipe/${id}`, headers).toPromise().then(() => {
            this.getRecipe(id, token);
            return {message: `Recipe has been deleted successfully.`};
        }).catch(error => {
            return {error: 'An error occurred deleting this recipe.'};
        });
    }
}
