import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

    constructor(private authService: AuthService) {
    }

    navbarCollapsed = true;
    user = null;

    ngOnInit() {
        this.authService.user.subscribe(user => {
            this.user = user;
        });
    }

}
