import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {NotificationService} from '../notification.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

    constructor(private authService: AuthService, private notificationService: NotificationService) {
    }

    navbarCollapsed = true;
    dropdownCollapsed = true;
    user;

    ngOnInit() {
        this.authService.user.subscribe(user => {
            this.user = user;
        });
    }

    logout() {
        this.authService.logout().then(res => {
            this.notificationService.notify('Logged out', 'You have successfully logged out.');
        });
        this.dropdownCollapsed = true;
    }
}
