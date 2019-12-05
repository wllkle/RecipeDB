import {Component, OnInit} from '@angular/core';
import {WebService} from '../web.service';

@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

    constructor(private webService: WebService) {
    }

    recipeList = [];

    ngOnInit() {
        this.webService.getRecipes().then((response) => {
            // @ts-ignore
            this.recipeList = response;
        }).catch((err) => {
            console.log('err', err);
        });
    }
}
