import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {RecipeService} from './recipes.service';

@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

    constructor(private recipeService: RecipeService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        let pageNum = 1;
        const {page} = this.route.snapshot.params;
        if (page) {
            pageNum = +page;
        }
        this.recipeService.getRecipes(pageNum);
    }
}
