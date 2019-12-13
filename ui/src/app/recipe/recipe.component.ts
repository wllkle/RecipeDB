import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

import {AuthService} from '../auth.service';
import {WebService} from '../web.service';

@Component({
    selector: 'app-recipe',
    templateUrl: './recipe.component.html',
    styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

    constructor(private webService: WebService,
                private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder) {
        this.recipe = null;
        this.comments = [];
    }

    navbarCollapsed = true;
    recipe: any;
    comments: [];
    commentBox;
    token: string = null;

    ngOnInit() {
        const {id} = this.route.snapshot.params;
        this.webService.getRecipe(id);
        this.webService.getRecipeComments(id);

        this.commentBox = this.formBuilder.group({
            body: ''
        });

        this.webService.recipeData.subscribe(data => {
            this.recipe = data;
        });
        this.webService.recipeComments.subscribe(comments => {
            this.comments = comments;
        });

        this.authService.user.subscribe(user => {
            this.token = user.token;
        });
    }

    comment() {
        const {id} = this.route.snapshot.params;
        const {body} = this.commentBox.value;
        this.webService.comment(id, body, this.token);
    }
}
