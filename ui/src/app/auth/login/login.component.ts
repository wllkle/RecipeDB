import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {WebService} from '../../web.service';
import {AuthService} from '../../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(private webService: WebService, private authService: AuthService, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    }

    loginForm;

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: '',
            password: ''
        });
    }

    submit() {
        this.authService.login('rob', 'rob');
    }
}
