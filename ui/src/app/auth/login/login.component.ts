import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

import {AuthService} from '../../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss', '../auth.scss']
})
export class LoginComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    }

    loginForm;

    ngOnInit() {
        this.authService.user.subscribe(user => {
            if (user.token) {
                this.router.navigate(['']);
            }
        });

        this.loginForm = this.formBuilder.group({
            username: '',
            password: ''
        });
    }

    submit() {
        const {username, password} = this.loginForm.value;
        this.authService.login(username, password);
    }
}
