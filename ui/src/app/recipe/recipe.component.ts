import {Component, OnInit} from '@angular/core';
import {WebService} from '../web.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-recipe',
    templateUrl: './recipe.component.html',
    styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

    constructor(private webService: WebService, private router: Router, private route: ActivatedRoute) {
    }

    data = null;

    async ngOnInit() {
        const {id} = this.route.snapshot.params;
        // if (id) {
        await this.webService.getRecipe(id);
        this.data = this.webService.recipeData;
        // } else {
        //     this.router.navigateByUrl('recipes')
        // }
    }
}
