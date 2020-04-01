import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

@Component({
  selector: 'app-recipe-idle',
  templateUrl: './recipe-idle.component.html',
  styleUrls: ['./recipe-idle.component.css']
})
export class RecipeIdleComponent implements OnInit {
  message: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.message = this.route.snapshot.data['message'];

    this.route.data.subscribe((data: Data) => {
      this.message = data['message'];
    })
  }

}
