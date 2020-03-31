import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from './shopping.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  @Input() userContentSelection: string;
  
  ingredients: Ingredient[] = [
    new Ingredient("tomatoes", 3),
    new Ingredient("minced beef", 1)
  ];

  constructor(private shoppingService: ShoppingService) { }

  ngOnInit(): void {
  }

  addProduct(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }
}
