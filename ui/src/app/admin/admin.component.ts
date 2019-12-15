import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {RecipeService} from '../recipes/recipes.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

    constructor(private authService: AuthService, private recipeService: RecipeService, private router: Router, private formBuilder: FormBuilder) {
        this.activePage = 'scrape';
        this.scrapeForm = this.formBuilder.group({
            url: ''
        });
    }

    activePage;
    scrapeForm;
    token: string = null;

    ngOnInit() {
        this.authService.user.subscribe(user => {
            if (user.admin) {
                this.token = user.token;
            } else {
                this.router.navigate(['login']);
            }
        });
    }

    changePage(page: string) {
        this.activePage = page;
    }

    scrape() {
        const {url} = this.scrapeForm.value;
        const navigate = (id) => {
            this.router.navigate(['recipe', id]);
        };
        this.recipeService.scrapeBbc(url, this.token, navigate);
    }
}
