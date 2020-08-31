import { Component } from '@angular/core';
import {HomeService} from '../services/home.service';
import{ProductoService} from '../services/producto.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  selectorFechaVisible: boolean = false;
  precio=0
  producto=[];
  comercio;
  constructor(private homeService:HomeService, private productoService:ProductoService) {}

  //Aca se obtiene el comercio de forma dinamica, llamando a getComercios de "homeService"
  ngOnInit() {
    this.comercio = this.homeService.getComercios();
    console.log(this.comercio)
    this.producto = this.productoService.getProductos(this.comercio.id);
  }

  //Esto sirve para cargar el pedido de forma dinamica en base al comercio que se eligio previamente
  cargarPedido(){
    let vueltas = Math.floor(Math.random() * this.producto.length);
    for (let index = 0; index < vueltas; index++) {
      let indice = Math.floor(Math.random() * this.producto.length);
      let cantidadPedida = Math.floor(Math.random() * 6);
      if(cantidadPedida == 0){
        cantidadPedida = 1 
      }
      //Por cada producto que pertenece al pedido generado se crea un ion-card
      const ionCard = document.createElement('ion-card');
      const nuevoProducto = document.createElement('ion-card-content');
      nuevoProducto.textContent= "("+"X " + cantidadPedida + ")  "+  this.producto[indice].nombre + ": "+"$"+this.producto[indice].precio;
      ionCard.appendChild(nuevoProducto);
      //Ademas se bloquea el botón para agregar pedidos y se habilita el botón para eliminar el pedido cargado previamente
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

  //Esto sirve para eliminar el pedido cargado previamente y se habilita el botón "para agregar un nuevo pedido" y se bloquea el botón para eliminar pedidos
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

  ocultarSelectorFecha(){
    this.selectorFechaVisible=false;
  }  
  
  mostrarSelectorFecha(){
    this.selectorFechaVisible=true;
  }
}
