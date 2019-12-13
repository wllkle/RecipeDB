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

    ngOnInit() {
        this.webService.searchRecipes(this.route.snapshot.params.criteria);
    }

}
