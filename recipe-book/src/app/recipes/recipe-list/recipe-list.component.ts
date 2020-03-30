import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe("Tasty Ultimate Lasagna", "the best yummy lasagna ever", "https://img.buzzfeed.com/video-api-prod/assets/01cfdd3c80844c63baae4784b53df3f4/FB_2.jpg"),
    new Recipe("Banana Bread", "yummy in the tummy", "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/55ac7efd43d74a6ead6576b4bfb28d7e/FB_Syphus_BananaBread_v3.jpg")
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
