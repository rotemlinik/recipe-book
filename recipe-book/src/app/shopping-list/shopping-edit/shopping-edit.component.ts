import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from 'src/app/shopping-list/shopping.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @Output() addProductWasClicked = new EventEmitter<Ingredient>();
  @ViewChild('productNameInput') productNameInput: ElementRef;
  @ViewChild('productAmountInput') productAmountInput: ElementRef;

  constructor(private shoppingService: ShoppingService) { }

  ngOnInit(): void {
  }

  onClickAdd() {
    this.addProductWasClicked.emit(new Ingredient(
      this.productNameInput.nativeElement.value, 
      this.productAmountInput.nativeElement.value));
  }
}
