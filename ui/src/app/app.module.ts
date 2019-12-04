import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {WebService} from './web.service';
import {AppComponent} from './app.component';
import {RecipesComponent} from './recipes/recipes.component';

@NgModule({
    declarations: [
        AppComponent,
        RecipesComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [WebService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
