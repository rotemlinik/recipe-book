import { NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    // loadChildren == tells angular to only load that component when user enter that route
    { 
      path: 'recipes', 
      loadChildren: () => import('./recipes/recipes.module').then(module => module.RecipesModule)
    },
    { 
      path: 'shopping-list', 
      loadChildren: () => import('./shopping-list/shopping-list.module').then(module => module.ShoppingListModule)
    },
    { 
      path: 'auth', 
      loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule)
    } 
];
  
@NgModule({
  // "PreloadAllModules" means initial bundle download is small - so initial loading is fast,
  // but when user starts browsing the website, other bundles are pre-loaded
  // so next navigation requests are kept fast 
    imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule] // makes it available at app module level
})
export class AppRoutingModule { }