import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../notification.service';
import * as moment from 'moment';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

    constructor(private notificationService: NotificationService) {
    }

    notifications = null;

    ngOnInit() {
        this.notificationService.notifications.subscribe(data => {
            if (JSON.stringify(data) !== JSON.stringify({})) {
                this.notifications = Object.entries(data).map(n => {
                    // @ts-ignore
                    const date = moment(n[1].date).fromNow();
                    // @ts-ignore
                    delete n[1].date;
                    return {id: n[0], ...n[1], date};
                });
            } else {
                this.notifications = null;
            }
        });
    }
}
