import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import uuid from 'uuid';


@Injectable()
export class NotificationService {
    constructor(private http: HttpClient) {
        this._notifications = new BehaviorSubject({});
        this.notifications = this._notifications.asObservable();
    }

    private _notifications;
    public notifications;

    notify(title: string, message: string) {
        const data = this._notifications.getValue();
        data[uuid.v4()] = {
            title,
            message,
            date: Date.now(),
        };
        this._notifications.next(data);
    }

    removeNotification(id) {
        const data = this._notifications.getValue();
        delete data[id];
        this._notifications.next(data);
    }
}
