import {Component, OnInit} from '@angular/core';
import {WebService} from '../web.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-recipe',
    templateUrl: './recipe.component.html',
    styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

    constructor(private webService: WebService, private route: ActivatedRoute) {
    }

    recipe = {};

    ngOnInit() {
        const {id} = this.route.snapshot.params;
        const goBack = () => {
            window.history.back();
        };

        if (id) {
            this.webService.getRecipe(id).then((response) => {
                console.log('recipe', response);
                this.recipe = response;
            }).catch((err) => {
                console.log('recipe error', err);
                goBack();
            });
        } else {
            goBack();
        }
    }
}
