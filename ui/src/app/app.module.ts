import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {AuthService} from './auth.service';
import {WebService} from './web.service';
import {AppComponent} from './app.component';
import {NavComponent} from './nav/nav.component';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {RecipesComponent} from './recipes/recipes.component';
import {RecipeComponent} from './recipe/recipe.component';
import {SearchComponent} from './recipes/search/search.component';
import {AccountComponent} from './account/account.component';

const routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'recipes', component: RecipesComponent},
    {path: 'recipes/search/:criteria', component: SearchComponent},
    {path: 'recipes/:page', component: RecipesComponent},
    {path: 'recipe/:id', component: RecipeComponent},
    {path: 'account', component: AccountComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        RecipesComponent,
        RecipeComponent,
        LoginComponent,
        NavComponent,
        RegisterComponent,
        SearchComponent,
        AccountComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        ReactiveFormsModule
    ],
    providers: [AuthService, WebService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
