import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

import {WebService} from '../../web.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    constructor(private webService: WebService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    }

    searchBox;

    ngOnInit() {
        const {criteria} = this.route.snapshot.params;
        this.webService.searchRecipes(criteria);

        this.searchBox = this.formBuilder.group({criteria});
    }

    search() {
        const {criteria} = this.searchBox.value;
        this.webService.searchRecipes(criteria)
        this.router.navigate(['recipes', 'search', criteria]);
    }
}
