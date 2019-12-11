import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {API_URL} from '../config';

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) {
        this._user.next({
            name: null,
            username: null,
            token: null,
        });
    }

    private _user = new Subject();
    public user = this._user.asObservable();

    login(username: string, password: string) {
        let data = new FormData();
        data.append('username', username);
        data.append('password', password);

        return this.http.post(`${API_URL}/login`, data).subscribe(response => {
            console.log('response', response);
            this._user.next(response);
        });
    }

    logout() {

        // if (this.user['token']) {
        //
        //     const httpOptions = {
        //         headers: new HttpHeaders({
        //             'x-access-token': this.user.token
        //         })
        //     };
        // }
        // this.http.post(`${API_URL}/logout`)
    }

    getStoredUser() {
        const user = localStorage.getItem('user');
        console.log(user);
        if (user) {
            return user;
        } else {
            return null;
        }
    }
}
