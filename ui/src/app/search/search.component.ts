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
        this.results = {
            data: null,
            total: 0,
            page: 0,
        };
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

    goToPage(criteria, page) {
        if (page > 1) {
            this.recipeService.searchRecipes(criteria, page);
            this.router.navigate(['recipes', 'search', criteria, page]);

        } else {
            this.recipeService.searchRecipes(criteria);
            this.router.navigate(['recipes', 'search', criteria]);
        }
        window.scroll(0, 0);
    }
}
