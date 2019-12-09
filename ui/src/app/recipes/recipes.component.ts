import {Component, OnInit} from '@angular/core';
import {WebService} from '../web.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

    constructor(private webService: WebService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        let pageNum = 1;
        const {page} = this.route.snapshot.params;
        if (page) {
            pageNum = +page;
        }
        this.webService.getRecipes(pageNum);
    }
}
