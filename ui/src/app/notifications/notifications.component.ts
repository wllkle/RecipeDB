import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../notification.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

    constructor(private notificationService: NotificationService) {
    }

    notifications: string[] = null;

    ngOnInit() {
        this.notificationService.notifications.subscribe(data => {
            console.log(data);
            if (JSON.stringify(data) !== JSON.stringify({})) {
                this.notifications = Object.entries(data).map(notification => {
                    console.log('notification', notification);
                    return notification.toString()
                });
            }else {
                this.notifications = null;
            }
        });
    }
}
