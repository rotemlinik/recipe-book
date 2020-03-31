import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  @Input() recipeItem: Recipe;
  @Output() recipeItemSelectionEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onSelect() {
    this.recipeItemSelectionEvent.emit();
  }
}
