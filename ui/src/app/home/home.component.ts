import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

import {RecipeService} from '../recipes/recipes.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private recipeService: RecipeService, private router: Router, private formBuilder: FormBuilder) {
    }

    searchBox;

    ngOnInit() {
        this.recipeService.topRecipes();

        this.searchBox = this.formBuilder.group({
            criteria: ''
        });
    }

    search() {
        const {criteria} = this.searchBox.value;
        this.router.navigate(['recipes', 'search', criteria]);
    }
}
