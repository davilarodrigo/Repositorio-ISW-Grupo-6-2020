import { Component } from '@angular/core';
import {HomeService} from '../services/home.service';
import{ProductoService} from '../services/producto.service';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  selectorFechaVisible: boolean = false;
  selectorTarjetaVisible: boolean = false;
  precio=0
  producto=[];
  comercio;
  FormReg: FormGroup;
  
  //Formulario del domicilio
  createFormGroupDomicilio(){
    return new FormGroup({
      ciudad: new FormControl('',[Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
      calle: new FormControl('',[Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
      numero: new FormControl('',[Validators.required, Validators.maxLength(5)]),
      piso: new FormControl(''),
      departamento: new FormControl('')
    });
  }
  domicilio: FormGroup;
  //Metodo de pago efectivo
  createFormGroupMetodoPagoEfectivo(){
    return new FormGroup({
      efectivo: new FormControl('')
    });
  }
  metodoPagoEfectivo: FormGroup;

  //Metodo de pago tarjeta
    createFormGroupMetodoPagoTarjeta(){
      return new FormGroup({
        //numero tarjeta solo empieza en 4 / expiracion MMAA / codSeguridad 3 
        numeroTarjeta: new FormControl(''),
        nombreTarjeta: new FormControl('',[Validators.required, Validators.maxLength(20), Validators.minLength(5)]),
        expiracion: new FormControl('',[Validators.required, Validators.maxLength(5), Validators.minLength(5)]),
        codSeguridad: new FormControl('',[Validators.required, Validators.maxLength(3), Validators.minLength(3)]),
      });
    }
    metodoPagoTarjeta: FormGroup;

  constructor(
    private homeService:HomeService, 
    private productoService:ProductoService) {
      this.domicilio = this.createFormGroupDomicilio();
      this.metodoPagoEfectivo = this.createFormGroupMetodoPagoEfectivo();
      this.metodoPagoTarjeta = this.createFormGroupMetodoPagoTarjeta();
    }
  //Domicilio - metodo de pago
  resetearFormulario(){
    this.domicilio.reset();
    this.metodoPagoEfectivo.reset();
    this.metodoPagoTarjeta.reset();
  }
  get ciudad() {
    return this.domicilio.get('ciudad');
  }
  get calle() {
    return this.domicilio.get('calle');
  }
  get numero() {
    return this.domicilio.get('numero');
  }

  get efectivo(){
    return this.metodoPagoEfectivo.get('numero');
  }

  get numeroTarjeta(){
    return this.metodoPagoTarjeta.get('numeroTarjeta');
  }
    get nombreTarjeta(){
    return this.metodoPagoTarjeta.get('nombreTarjeta');
  }
  get expiracion(){
    return this.metodoPagoTarjeta.get('expiracion');
  }
    get codSeguridad(){
    return this.metodoPagoTarjeta.get('codSeguridad');
  }


  //Mensajes de error 
  public errorMessages = {
    ciudad: [
      { type: 'required', message: 'Se requiere el nombre de la ciudad' },
      { type: 'maxlength', message: 'El nombre de la ciudad no puede ser mayor a 50 caracteres'},
      { type: 'minlength', message: 'El nombre de la ciudad debe tener como mínimo 3 caracteres'}
    ],
    calle: [
      { type: 'required', message: 'Se requiere el nombre de la calle' },
      { type: 'maxlength', message: 'El nombre de la calle no puede ser mayor a 50 caracteres' },
      { type: 'minlength', message: 'El nombre de la calle debe tener como mínimo 3 caracteres'}
    ],
    numero: [
      { type: 'required', message: 'Se requiere el número del domicilio' },
      { type: 'maxlength', message: 'El número del domicilio no puede ser mayor a 5 caracteres'},
    ],
    numeroTarjeta: [
      { type: 'required', message: 'Se requiere el número de tarjeta' },
      { type: 'maxlength', message: 'El número de tarjeta debe ser de 16 caracteres'},
      { type: 'minlength', message: 'El número de tarjeta debe ser de 16 caracteres'},
    ],
    nombreTarjeta: [
      { type: 'required', message: 'Se requiere el nombre del titular de la tarjeta' },
      { type: 'maxlength', message: 'El nombre del titular de la tarjeta debe tener como mínimo 3 caracteres'},
      { type: 'minlength', message: 'El nombre del titular de la tarjeta debe tener como máximo 20 caracteres'},
    ],
    expiracion: [
      { type: 'required', message: 'Se requiere la fecha de expiración de la tarjeta' },
      { type: 'maxlength', message: 'La fecha de expiración de la tarjeta debe ser de 4 caracteres'},
      { type: 'minlength', message: 'La fecha de expiración de la tarjeta debe ser de 4 caracteres'},
    ],
    codSeguridad: [
      { type: 'required', message: 'Se requiere el código de seguridad de la tarjeta' },
      { type: 'maxlength', message: 'El código de seguridad de la tarjeta debe ser de 3 caracteres'},
      { type: 'minlength', message: 'El código de seguridad de la tarjeta debe ser de 3 caracteres'},
    ],
    
  };
  

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

  ocultarSelectorTarjeta(){
    this.selectorTarjetaVisible=false;
  }  
  
  mostrarSelectorTarjeta(){
    this.selectorTarjetaVisible=true;
  }


}
