import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RecipeService} from '../../recipes.service';

@Component({
    selector: 'app-search-bar',
    templateUrl: './bar.component.html',
    styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

    constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
        this.searchForm = this.formBuilder.group({
            criteria: ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    searchForm: FormGroup;
    criteria: string = null;

    ngOnInit() {
        try {
            const urlIndex = (index) => {
                if (url[index] && url[index].path) {
                    return url[index].path;
                } else {
                    return null;
                }
            };
            const {url, params} = this.route.snapshot;
            if (urlIndex(0) === 'recipes' && urlIndex(1) === 'search') {
                this.searchForm.controls.criteria.setValue(params.criteria);
            }
        } catch (e) {
            console.warn(e);
        }
    }

    search() {
        document.getElementById('input-criteria').focus();
        if (this.searchForm.valid) {
            const {criteria} = this.searchForm.value;
            if (criteria !== this.criteria) {
                this.router.navigate(['recipes', 'search', criteria]).then(() => {
                    this.recipeService.searchRecipes(criteria);
                });
            }
        }
    }

    isInvalid(control) {
        const {controls} = this.searchForm;
        if (controls[control].value.length > 0) {
            return controls[control].invalid && controls[control].touched;
        } else {
            return false;
        }
    }
}
