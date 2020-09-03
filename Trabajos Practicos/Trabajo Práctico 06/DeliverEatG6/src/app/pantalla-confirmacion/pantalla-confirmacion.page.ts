import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pantalla-confirmacion',
  templateUrl: './pantalla-confirmacion.page.html',
  styleUrls: ['./pantalla-confirmacion.page.scss'],
})
export class PantallaConfirmacionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  presentAlert() {
    const alert = document.createElement('ion-alert');
    alert.message = "Esta user todavia no esta desarrollada !!!";
    alert.buttons = ["Ok"];
    document.body.appendChild(alert);
    return alert.present();
  }
}
