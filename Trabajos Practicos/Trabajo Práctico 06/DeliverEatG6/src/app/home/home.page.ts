import { Component } from '@angular/core';
import {HomeService} from '../services/home.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  comercio
  constructor(private homeService:HomeService) {}

  ngOnInit() {
    this.comercio = this.homeService.getComercios();
    console.log(this.comercio)
  }
}
