import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

import {AuthService} from '../../auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss', '../auth.scss']
})
export class RegisterComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    }

    registerForm;

    ngOnInit() {
        this.authService.user.subscribe(user => {
            if (user.token) {
                this.router.navigate(['']);
            }
        });

        this.registerForm = this.formBuilder.group({
            name: '',
            username: '',
            email: '',
            password: '',
            passwordConfirm: ''
        });
    }

    submit() {
        const {name, username, email, password} = this.registerForm.value;
        this.authService.register(name, username, email, password);
        // this.authService.register(username, password);
    }
}
