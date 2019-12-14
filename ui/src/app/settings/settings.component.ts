import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

import {isEqual} from 'lodash';

import {AuthService, getDefaultUserObject} from '../auth/auth.service';

@Component({
    selector: 'app-account',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    }

    activePage: string;
    user;

    passwordForm;

    ngOnInit() {
        this.authService.user.subscribe(user => {
            if (!isEqual(user, getDefaultUserObject())) {
                this.user = user;

                this.passwordForm = this.formBuilder.group({
                    old: '',
                    password: '',
                    confirm: ''
                });
            } else {
                this.router.navigate(['login']);
            }
        });

        this.activePage = 'profile';
    }

    changePage(page: string) {
        this.activePage = page;
    }
}
