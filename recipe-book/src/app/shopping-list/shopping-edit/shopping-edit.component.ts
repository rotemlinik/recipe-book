import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShoppingService } from 'src/app/shopping-list/shopping.service';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('productNameInput') productNameInput: ElementRef;
  @ViewChild('productAmountInput') productAmountInput: ElementRef;

  constructor(private shoppingService: ShoppingService) { }

  ngOnInit(): void {
  }

  onClickAdd() {
    this.shoppingService.addProduct(new Ingredient(
      this.productNameInput.nativeElement.value, 
      this.productAmountInput.nativeElement.value));
  }
}
