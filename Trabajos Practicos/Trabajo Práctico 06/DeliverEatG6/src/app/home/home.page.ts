import { Component } from '@angular/core';
import {HomeService} from '../services/home.service';
import{ProductoService} from '../services/producto.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  precio=0
  producto=[];
  comercio;
  constructor(private homeService:HomeService, private productoService:ProductoService) {}

  ngOnInit() {
    this.comercio = this.homeService.getComercios();
    console.log(this.comercio)
    this.producto = this.productoService.getProductos(this.comercio.id);
  }

  cargarPedido(){
      let vueltas = Math.floor(Math.random() * this.producto.length);
      for (let index = 0; index < vueltas; index++) {
        let indice = Math.floor(Math.random() * this.producto.length);
        let cantidadPedida = Math.floor(Math.random() * 6);
        if(cantidadPedida == 0){
          cantidadPedida = 1 
        }
        const ionCard = document.createElement('ion-card');
        const nuevoProducto = document.createElement('ion-card-content');
        nuevoProducto.textContent= "("+"X " + cantidadPedida + ")  "+  this.producto[indice].nombre + ": "+"$"+this.producto[indice].precio;
        ionCard.appendChild(nuevoProducto);
        let buttonCargarPedido = document.querySelector('#mostrarPedido');
        let buttonBorrarPedido = document.querySelector('#cancelarPedido');
        buttonCargarPedido.setAttribute("disabled","true");
        buttonBorrarPedido.setAttribute("disabled","false");
        buttonCargarPedido.setAttribute("activated","true");
        buttonBorrarPedido.setAttribute("activated","false");
        let productList = document.querySelector('#productList');
        productList.appendChild(ionCard);
        this.precio += cantidadPedida * this.producto[indice].precio;
        console.log(this.precio);
      }
  }

  borrarPedido(){
    let productList = document.querySelector('#productList');
    while (productList.hasChildNodes()) {
      productList.removeChild(productList.firstChild);
    }
    let buttonCargarPedido = document.querySelector('#mostrarPedido');
    let buttonBorrarPedido = document.querySelector('#cancelarPedido');
    buttonBorrarPedido.setAttribute("disabled","true");
    buttonCargarPedido.setAttribute("disabled","false");
    buttonBorrarPedido.setAttribute("activated","true");
    buttonCargarPedido.setAttribute("activated","false");
  }

}
