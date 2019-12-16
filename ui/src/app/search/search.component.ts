import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {range} from 'lodash';

import {RecipeService} from '../recipes.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
        this.results = {};
        this.pagination = [];
    }

    searchBox;
    results;
    pagination;

    ngOnInit() {
        const {criteria, page} = this.route.snapshot.params;
        if (page) {
            this.recipeService.searchRecipes(criteria, page);
        } else {
            this.recipeService.searchRecipes(criteria);
        }

        this.recipeService.search.subscribe(search => {
            this.results = search;
            this.pagination = range(search.pageCount);
        });

        this.searchBox = this.formBuilder.group({criteria});
    }

    next() {
        const {criteria} = this.route.snapshot.params;
        let {page} = this.route.snapshot.params;

        if (!page) {
            page = 2;
        } else {
            console.log('next page greater than pageCount?', +page > this.results.pageCount);
            if (+page < this.results.pageCount) {
                page = +page + 1;
            }
        }

        this.goToPage(criteria, page);
    }

    previous() {
        const {criteria} = this.route.snapshot.params;
        let {page} = this.route.snapshot.params;

        if (+page > 2) {
            page = +page - 1;
        } else {
            page = undefined;
        }

        this.goToPage(criteria, page);
    }

    goToPage(criteria, page) {
        window.scrollTo(0, 0);
        if (page) {
            this.recipeService.searchRecipes(criteria, page);
            this.router.navigate(['recipes', 'search', criteria, page]);

        } else {
            this.recipeService.searchRecipes(criteria);
            this.router.navigate(['recipes', 'search', criteria]);
        }
    }
}
