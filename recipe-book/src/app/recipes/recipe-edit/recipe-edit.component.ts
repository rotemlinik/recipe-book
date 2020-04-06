import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService) { }

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
      console.log("XXXXXXXXX INIT FORM - EDIT MODE XXXXXXXXX")
      const recipe = this.recipeService.getRecipe(this.id);

      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;

      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(this.createIngredientFormGroup(ingredient.name, ingredient.amount));
        }
      }
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
  }
 
  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      this.createIngredientFormGroup(null, null)
    );
  }
  
  createIngredientFormGroup(name: string, amount: number) {
    return new FormGroup({
      'name': new FormControl(name, Validators.required),
      'amount': new FormControl(amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    })
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }
}