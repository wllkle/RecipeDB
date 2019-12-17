import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ClickOutsideModule} from 'ng-click-outside';
import {NgxPaginationModule} from 'ngx-pagination';

import {AuthService} from './auth/auth.service';
import {RecipeService} from './recipes.service';

import {AppComponent} from './app.component';
import {NavComponent} from './nav/nav.component';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {RecipeComponent} from './recipe/recipe.component';
import {SearchComponent} from './search/search.component';
import {BookmarksComponent} from './bookmarks/bookmarks.component';
import {AdminComponent} from './admin/admin.component';
import {BarComponent} from './search/bar/bar.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {NotificationService} from './notification.service';

const routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'recipes/search/:criteria', component: SearchComponent},
    {path: 'recipes/search/:criteria/:page', component: SearchComponent},
    {path: 'recipe/:id', component: RecipeComponent},
    {path: 'bookmarks', component: BookmarksComponent},
    {path: 'admin', component: AdminComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        HomeComponent,
        RecipeComponent,
        LoginComponent,
        RegisterComponent,
        SearchComponent,
        BookmarksComponent,
        AdminComponent,
        BarComponent,
        NotificationsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        ReactiveFormsModule,
        NgbModule,
        ClickOutsideModule,
        NgxPaginationModule
    ],
    providers: [AuthService, NotificationService, RecipeService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
