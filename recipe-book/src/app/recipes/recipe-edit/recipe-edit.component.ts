import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import * as shoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, 
              private recipeService: RecipeService,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    })
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.store
        .select('recipes')
        .pipe(map(recipeState => recipeState.recipes[this.id]))
        .subscribe(recipe => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;

          if (recipe['ingredients']) {
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(this.createIngredientFormGroup(ingredient.name, ingredient.amount));
            }
          }
        });
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, [Validators.required]),
      'imagePath': new FormControl(recipeImagePath, [Validators.required]),
      'description': new FormControl(recipeDescription, [Validators.required]),
      'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    const formValues = this.recipeForm.value;

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }

    this.backToPreviousRoute();
  }
 
  onAddIngredient() {
    this.ingredients.push(
      this.createIngredientFormGroup(null, null)
    );
  }

  onDeleteIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  onCancel() {
    this.ingredients.clear();
    this.backToPreviousRoute();
  }

  
  createIngredientFormGroup(name: string, amount: number) {
    return new FormGroup({
      'name': new FormControl(name, Validators.required),
      'amount': new FormControl(amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    })
  }

  get controls() {
    return this.ingredients.controls;
  }

  get ingredients() {
    return (<FormArray>this.recipeForm.get('ingredients'));
  }

  backToPreviousRoute() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}