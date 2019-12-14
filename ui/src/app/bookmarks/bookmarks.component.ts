import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {RecipeService} from '../recipes/recipes.service';
import {AuthService} from '../auth/auth.service';

@Component({
    selector: 'app-bookmarks',
    templateUrl: './bookmarks.component.html',
    styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

    constructor(private recipeService: RecipeService, private authService: AuthService, private router: Router) {
    }

    token: string = null;
    bookmarks: [] = [];

    ngOnInit() {
        this.authService.user.subscribe(user => {
            if (user.token) {
                this.token = user.token;
            } else {
                this.router.navigate(['login']);
            }
        });
        this.recipeService.bookmarks.subscribe(bookmarks => {
            this.bookmarks = bookmarks;
        });
        if (this.token) {
            this.recipeService.getBookmarks(this.token);
        }
    }
}
