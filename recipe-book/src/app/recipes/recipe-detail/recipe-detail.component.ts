import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import * as shoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import * as recipeActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;
  message = "are you sure you want to delete this recipe?";
  userClickedDeleteRecipe = false;
  @Output() close = new EventEmitter<void>();

  constructor(private route: ActivatedRoute,
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
    this.userClickedDeleteRecipe = true;
  }

  onConfirm() {
    this.userClickedDeleteRecipe = false;
    this.store.dispatch(new recipeActions.DeleteRecipe(this.id));
    this.router.navigate(['recipes']);
  }

  onCancel() {
    this.userClickedDeleteRecipe = false;
  }
}
