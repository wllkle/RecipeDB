import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {WebService} from './web.service';
import {AppComponent} from './app.component';

import {HomeComponent} from './home/home.component';
import {RecipesComponent} from './recipes/recipes.component';
import {RecipeComponent} from './recipe/recipe.component';

const routes = [
    {path: '', component: HomeComponent},
    {path: 'recipes', component: RecipesComponent},
    {path: 'recipes/:page', component: RecipesComponent},
    {path: 'recipe/:id', component: RecipeComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        RecipesComponent,
        RecipeComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes)
    ],
    providers: [WebService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
