import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

import {AuthService, getDefaultUserObject} from '../../auth/auth.service';
import {RecipeService} from '../recipes.service';
import {isEqual} from 'lodash';

@Component({
    selector: 'app-recipe',
    templateUrl: './recipe.component.html',
    styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

    constructor(private recipeService: RecipeService,
                private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder) {
        this.recipe = null;
        this.comments = [];
    }

    recipe: any;
    comments: [];
    commentBox;
    token: string = null;

    ngOnInit() {
        const {id} = this.route.snapshot.params;

        this.commentBox = this.formBuilder.group({
            body: ''
        });

        this.authService.user.subscribe(user => {
            if (!isEqual(user, getDefaultUserObject())) {
                this.token = user.token;
            } else {
                this.token = null;
            }
        });
        this.recipeService.data.subscribe(data => {
            this.recipe = data;
        });
        this.recipeService.comments.subscribe(comments => {
            this.comments = comments;
        });

        this.recipeService.getRecipe(id, this.token);
        this.recipeService.getRecipeComments(id);
    }

    comment() {
        const {id} = this.route.snapshot.params;
        const {body} = this.commentBox.value;
        this.recipeService.comment(id, body, this.token);
        this.commentBox = this.formBuilder.group({
            body: ''
        });
    }

    bookmark() {
        const {id} = this.route.snapshot.params;
        this.recipeService.bookmarkRecipe(id, this.token);
    }

    unbookmark() {
        const {id} = this.route.snapshot.params;
        this.recipeService.unbookmarkRecipe(id, this.token);
    }

    copyLink(){
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = `http://localhost:4200/recipe/${this.route.snapshot.params.id}`;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }
}
