import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder} from '@angular/forms';

import {AuthService} from '../../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss', '../auth.scss']
})
export class LoginComponent implements OnInit {

    constructor(private authService: AuthService, private route: ActivatedRoute, private formBuilder: FormBuilder) {
        // if(authService.)
    }

    loginForm;

    ngOnInit() {
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
