import {Component, OnInit} from '@angular/core';

import {RecipeService} from '../recipes/recipes.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private recipeService: RecipeService) {
    }

    searchBox;

    ngOnInit() {
        this.recipeService.topRecipes();
    }
}
