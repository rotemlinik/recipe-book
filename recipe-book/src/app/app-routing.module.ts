import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeIdleComponent } from './recipes/recipe-idle/recipe-idle.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { path: 'recipes', component: RecipesComponent, children: [
        { path: '', component: RecipeIdleComponent, data: {message: 'Please select a Recipe:)'} },
        { path: ':name', component: RecipeDetailComponent }
    ] },
    { path: 'shopping-list', component: ShoppingListComponent }
    /*{ path: 'servers', canActivateChild: [AuthGuard], component: ServersComponent, children: [
        { path: ':id', component: ServerComponent, resolve: {server: ServerResolver} },
        { path: ':id/edit', component: EditServerComponent, canDeactivate: [CanDeactivateGuard] }
    ]}, */
    /* { path: 'not-found', component: PageNotFoundComponent },
    { path: '**', redirectTo: 'not-found' }, */
];
  
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }