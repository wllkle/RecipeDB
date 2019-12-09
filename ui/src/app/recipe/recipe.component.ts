import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WebService} from '../web.service';

@Component({
    selector: 'app-recipe',
    templateUrl: './recipe.component.html',
    styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

    constructor(private webService: WebService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        const {id} = this.route.snapshot.params;
        this.webService.getRecipe(id);
    }
}
