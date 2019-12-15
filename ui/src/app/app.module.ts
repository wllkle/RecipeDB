import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ClickOutsideModule} from 'ng-click-outside';

import {AuthService} from './auth/auth.service';
import {RecipeService} from './recipes/recipes.service';

import {AppComponent} from './app.component';
import {NavComponent} from './nav/nav.component';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {RecipesComponent} from './recipes/recipes.component';
import {RecipeComponent} from './recipes/recipe/recipe.component';
import {SearchComponent} from './recipes/search/search.component';
import {SettingsComponent} from './settings/settings.component';
import {BookmarksComponent} from './bookmarks/bookmarks.component';

const routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'recipes', component: RecipesComponent},
    {path: 'recipes/search/:criteria', component: SearchComponent},
    {path: 'recipes/:page', component: RecipesComponent},
    {path: 'recipe/:id', component: RecipeComponent},
    {path: 'settings', component: SettingsComponent},
    {path: 'bookmarks', component: BookmarksComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        HomeComponent,
        RecipesComponent,
        RecipeComponent,
        LoginComponent,
        RegisterComponent,
        SearchComponent,
        SettingsComponent,
        BookmarksComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        ReactiveFormsModule,
        NgbModule,
        ClickOutsideModule
    ],
    providers: [AuthService, RecipeService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
