import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {isEqual} from 'lodash';

import {AuthService, getDefaultUserObject} from '../auth.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit() {
        this.authService.user.subscribe(user => {
            if (isEqual(user, getDefaultUserObject())) {
                this.router.navigate(['login']);
            }
        });
    }

}
