import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

import {AuthService} from '../auth.service';
import {NotificationService} from '../../notification.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['../auth.scss']
})
export class RegisterComponent implements OnInit {

    constructor(private authService: AuthService, private notificationService: NotificationService, private router: Router, private formBuilder: FormBuilder) {
    }

    registerForm: FormGroup;

    ngOnInit() {
        this.authService.user.subscribe(user => {
            if (user.token) {
                this.router.navigate(['']);
            }
        });

        this.registerForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            username: ['', [Validators.required]],
            email: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            passwordConfirm: ''
        });
        this.registerForm.setValidators(this.passwordMatchValidator());
    }

    register() {
        if (this.registerForm.valid) {
            const {name, username, email, password} = this.registerForm.value;
            this.authService.register(name, username, email, password).then(res => {
                if (res) {
                    this.notificationService.notify('Login error', res.error);
                }
            });
        }else{

        }
    }

    passwordMatchValidator(): ValidatorFn {
        return (group: FormGroup): ValidationErrors => {
            const password = group.controls['password'];
            const passwordConfirm = group.controls['passwordConfirm'];
            if (password.value !== passwordConfirm.value) {
                passwordConfirm.setErrors({passwordMismatch: true});
            } else {
                passwordConfirm.setErrors(null);
            }
            return;
        };
    }

    isInvalid(control) {
        const {controls} = this.registerForm;
        return controls[control].invalid && controls[control].touched;
    }
}
