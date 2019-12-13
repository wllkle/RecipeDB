import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

import {WebService} from '../web.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private webService: WebService, private router: Router, private formBuilder: FormBuilder) {
    }

    searchBox;

    ngOnInit() {
        this.webService.getTopRecipes();

        this.searchBox = this.formBuilder.group({
            criteria: ''
        });
    }

    search() {
        const {criteria} = this.searchBox.value;
        this.router.navigate(['recipes', 'search', criteria]);
    }
}
