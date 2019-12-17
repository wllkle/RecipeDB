import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';

import {AuthService} from '../auth.service';
import {NotificationService} from '../../notification.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../auth.scss']
})
export class LoginComponent implements OnInit {

    constructor(private authService: AuthService, private notificationService: NotificationService, private router: Router, private formBuilder: FormBuilder) {
    }

    loginForm;

    ngOnInit() {
        this.authService.user.subscribe(user => {
            if (user.token) {
                this.router.navigate(['']);
                this.notificationService.notify(`Welcome ${user.name}`);
            }
        });

        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    submit() {
        if (this.loginForm.valid) {
            const {username, password} = this.loginForm.value;
            this.authService.login(username, password);
        }
    }
}
