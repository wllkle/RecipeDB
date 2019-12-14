import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

import {RecipeService} from '../recipes.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    }

    searchBox;

    ngOnInit() {
        const {criteria} = this.route.snapshot.params;
        this.recipeService.searchRecipes(criteria);

        this.searchBox = this.formBuilder.group({criteria});
    }

    search() {
        const {criteria} = this.searchBox.value;
        this.recipeService.searchRecipes(criteria)
        this.router.navigate(['recipes', 'search', criteria]);
    }
}
