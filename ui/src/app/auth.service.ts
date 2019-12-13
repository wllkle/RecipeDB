import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {API_URL} from '../config';

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) {
        this._user = new BehaviorSubject(getDefaultUserObject());
        this.user = this._user.asObservable();
        this.getStoredUser();
    }

    private _user;
    public user;

    setState(value) {
        this._user.next(value);
    }

    register(name: string, username: string, email: string, password: string) {
        let data = new FormData();
        data.append('name', name);
        data.append('email', email);
        data.append('username', username);
        data.append('password', password);

        return this.http.post(`${API_URL}/register`, data).toPromise().then(response => {
            this.login(username, password);
        }).catch(error => {
            console.log(error);
        });
    }

    login(username: string, password: string) {
        let data = new FormData();
        data.append('username', username);
        data.append('password', password);

        this.http.post(`${API_URL}/login`, data).toPromise().then(response => {
            localStorage.setItem('user', JSON.stringify(response));
            this.setState(response);
        }).catch(error => {
            console.log(error);
        });
    }

    logout() {
        const token = this._user.getValue().token;
        if (token && token.length > 0) {
            const headers = {
                headers: new HttpHeaders({'x-access-token': token})
            };
            this.http.post(`${API_URL}/logout`, null, headers).toPromise().then(response => {
                this._user.next(getDefaultUserObject());
                localStorage.removeItem('user');
            }).catch(error => {
                console.log(error);
            });
        }
    }

    getStoredUser() {
        try {
            const user = localStorage.getItem('user');
            if (user && user.length > 0) {
                const userObj = JSON.parse(user);
                if (new Date(userObj.exp) > new Date()) {
                    this._user.next(userObj);
                } else {
                    this._user.next(getDefaultUserObject());
                }
            }
        } catch (e) {
            console.log(e);
            this._user.next(getDefaultUserObject());
        }
    }
}

export const getDefaultUserObject = () => {
    return {
        name: null,
        username: null,
        token: null,
        exp: null
    };
};
