import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as shoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;
  
  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params
    .pipe(
      map((params: Params) => +params['id']),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipeState => recipeState.recipes[this.id]))
    .subscribe(recipe => this.recipe = recipe)
  }

  onAddToShoppingList() {
    this.recipe.ingredients.forEach((ingredient) => {
      this.store.dispatch(new shoppingListActions.AddIngredient(ingredient));
    }) 
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['recipes']);
  }
}
