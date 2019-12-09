import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {WebService} from './web.service';
import {AppComponent} from './app.component';

import {HomeComponent} from './home/home.component';
import {RecipesComponent} from './recipes/recipes.component';
import {RecipeComponent} from './recipe/recipe.component';
import {LoginComponent} from './login/login.component';
import {ReactiveFormsModule} from '@angular/forms';

const routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'recipes', component: RecipesComponent},
    {path: 'recipes/:page', component: RecipesComponent},
    {path: 'recipe/:id', component: RecipeComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        RecipesComponent,
        RecipeComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        ReactiveFormsModule
    ],
    providers: [WebService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
