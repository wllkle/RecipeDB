import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {API_URL} from '../config';

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) {
        this._user = new Subject();
        this.user = this._user.asObservable();
        // this.getStoredUser();
    }

    private _user;
    public user;

    login(username: string, password: string) {
        let data = new FormData();
        data.append('username', username);
        data.append('password', password);

        return this.http.post(`${API_URL}/login`, data).subscribe(response => {
            console.log('response', response);
            localStorage.setItem('user', JSON.stringify(response));
            this._user.next(response);
        });
    }

    logout() {
        if (this.user['token']) {
            const httpOptions = {
                headers: new HttpHeaders({
                    'x-access-token': this.user['token']
                })
            };
            this.http.post(`${API_URL}/logout`, null, httpOptions).subscribe(response => {
                console.log(response);
            });
        }
    }

    getStoredUser() {
        const setNull = () => {
            console.log('setting null user');
            this._user.next({
                name: null,
                username: null,
                token: null,
                exp: null
            });
        };

        try {
            let user = localStorage.getItem('user');
            console.log('user', user);
            if (user && user.length > 0) {
                user = JSON.parse(user);
                console.log('user', user);
                const exp = new Date(user['exp']);
                if (exp > new Date()) {
                    this._user.next(user);
                } else {
                    setNull();
                }
            }
        } catch (e) {
            setNull();
        }
    }
}
