import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WebService} from '../web.service';

@Component({
    selector: 'app-recipe',
    templateUrl: './recipe.component.html',
    styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

    constructor(private webService: WebService, private router: Router, private route: ActivatedRoute) {
    }

    navbarCollapsed = true;
    recipe;
    comments;

    ngOnInit() {
        const {id} = this.route.snapshot.params;
        this.webService.getRecipe(id);
        this.webService.getRecipeComments(id);

        this.webService.recipeData.subscribe(data => {
            this.recipe = data;
        });
        this.webService.recipeComments.subscribe(comments => {
            this.comments = comments;
            console.log(comments);
        });
    }
}
