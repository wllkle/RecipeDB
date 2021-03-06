import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {isEqual} from 'lodash';
import * as moment from 'moment';

import {AuthService, getDefaultUserObject} from '../auth/auth.service';
import {RecipeService} from '../recipes.service';
import {NotificationService} from '../notification.service';

@Component({
    selector: 'app-recipe',
    templateUrl: './recipe.component.html',
    styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

    constructor(private recipeService: RecipeService,
                private authService: AuthService,
                private notificationService: NotificationService,
                private router: Router,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder) {
        this.recipe = null;
        this.comments = [];
    }

    recipe: any = null;
    comments: [] = null;
    commentBox;
    updateCommentBox;
    token: string = null;
    userId: string = null;
    admin: boolean = false;
    commentUpdate: string = null;
    commentUpdateValue: string = null;

    ngOnInit() {
        const {id} = this.route.snapshot.params;

        this.commentBox = this.formBuilder.group({
            body: ''
        });
        this.updateCommentBox = this.formBuilder.group({
            body: ['', Validators.required]
        });

        this.authService.user.subscribe(user => {
            if (!isEqual(user, getDefaultUserObject())) {
                this.token = user.token;
                this.userId = user.id;
                if (user.admin) {
                    this.admin = true;
                }
            } else {
                this.token = null;
            }
        });
        this.recipeService.data.subscribe(data => {
            if (data === null) {
                this.router.navigate(['']);
            } else {
                this.recipe = data;
            }
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

    updateComment() {
        if (this.updateCommentBox.valid) {
            const {body} = this.updateCommentBox.value;
            this.recipeService.updateComment(this.commentUpdate, body, this.token);
            this.commentUpdate = null;
            this.commentUpdateValue = null;
        }
    }

    deleteComment(id: string) {
        this.recipeService.deleteComment(id, this.token).then(res => {
            if (res) {
                if ((res as any).message) {
                    this.notificationService.notify('Comment deleted', (res as any).message);
                }
                if ((res as any).error) {
                    this.notificationService.notify('Error', (res as any).error);
                }
            }
        });
    }

    bookmark() {
        const {id} = this.route.snapshot.params;
        this.recipeService.bookmarkRecipe(id, this.token).then(res => {
            if (res) {
                if ((res as any).message) {
                    this.notificationService.notify('Bookmark added', (res as any).message);
                }
                if ((res as any).error) {
                    this.notificationService.notify('Error', (res as any).error);
                }
            }
        });
    }

    unbookmark() {
        const {id} = this.route.snapshot.params;
        this.recipeService.unbookmarkRecipe(id, this.token).then(res => {
            if (res) {
                if ((res as any).message) {
                    this.notificationService.notify('Bookmark removed', (res as any).message);
                }
                if ((res as any).error) {
                    this.notificationService.notify('Error', (res as any).error);
                }
            }
        });
    }

    copyLink() {
        const link = document.createElement('textarea');
        link.style.position = 'fixed';
        link.style.left = '0';
        link.style.top = '0';
        link.style.opacity = '0';
        link.value = `http://localhost:4200/recipe/${this.route.snapshot.params.id}`;
        document.body.appendChild(link);
        link.focus();
        link.select();
        document.execCommand('copy');
        document.body.removeChild(link);
        this.notificationService.notify('Link copied', 'A link to this recipe has been copied to your clipboard.');
    }

    delete() {
        const {id} = this.route.snapshot.params;
        this.recipeService.deleteRecipe(id, this.token).then(res => {
            if (res) {
                if ((res as any).message) {
                    this.notificationService.notify('Recipe deleted', (res as any).message);
                }
                if ((res as any).error) {
                    this.notificationService.notify('Error', (res as any).error);
                }
            }
        });
    }

    timeAgo(date) {
        return moment(date).fromNow();
    }
}
