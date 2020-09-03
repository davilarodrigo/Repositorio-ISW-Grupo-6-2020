import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { ProductoService } from '../services/producto.service';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mostrarVISA:string = "*********";
  numeroTarjetaVISA:string;
  vuelto:number=0;
  modoPago:string = "Efectivo";
  limpiarValore:string = "";
  banderaMonto:boolean = false;
  fecha: Date = new Date();
  montoIngresado:number = 0;
  horaParcial: Date = new Date();
  horaSeleccionada:Date=new Date();
  corregirHora: boolean = false;
  diaSeleccionada:Date=new Date();
  horaModificada:Date = new Date();
  minutosModificados = this.horaModificada.getMinutes()+30;
  hora:Date;
  //hora = new Date(this.fecha.getFullYear(),this.fecha.getMonth(),this.fecha.getDate(),this.horaModificada.getHours(),this.minutosModificados,this.horaModificada.getMilliseconds());
  //hora = this.horaParcial.toLocaleString();
  selectorFechaVisible: boolean = false;
  selectorTarjetaVisible: boolean = false;
  precio:number = 0;
  producto = [];
  comercio;
  FormReg: FormGroup;

  //Formulario del domicilio
  createFormGroupDomicilio() {
    return new FormGroup({
      ciudad: new FormControl('', [Validators.required]),
      calle: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[-a-zA-Z0-9' 'ñÑ]{1,100}$/)]),
      numero: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99999)]),
      piso: new FormControl('', [Validators.min(-2),Validators.max(99)]),
      departamento: new FormControl('', [Validators.min(1) ,Validators.maxLength(2), Validators.pattern(/^[-a-zA-Z0-9' 'ñÑ]{1,2}$/)]),
      referencia: new FormControl('')
    });
  }
  domicilio: FormGroup;
  //Metodo de pago efectivo
  createFormGroupMetodoPagoEfectivo() {
    return new FormGroup({
      efectivo: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern("[0-9]*")])
    });
  }
  metodoPagoEfectivo: FormGroup;

  //Metodo de pago tarjeta
  createFormGroupMetodoPagoTarjeta() {
    return new FormGroup({
      //numero tarjeta solo empieza en 4 / expiracion MMAA / codSeguridad 3 
      numeroTarjeta: new FormControl('', [Validators.required, Validators.maxLength(16), Validators.minLength(16), Validators.pattern(/^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/)]),
      nombreTarjeta: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[-a-zA-Z' 'ñÑ]{1,100}$/)]),
      expiracion: new FormControl('', [Validators.required, Validators.maxLength(7), Validators.minLength(7), Validators.pattern(/^((0[1-9]|1[0-2])\/?(20[2-9][1-9]|[0-9]{2})|(09|10|11|12)\/?2020)$/)]),
      codSeguridad: new FormControl('', [Validators.required, Validators.max(999), Validators.min(0), Validators.pattern(/^[0-9]{3}$/)]),
    });
  }
  metodoPagoTarjeta: FormGroup;

  constructor(
    private homeService: HomeService,
    private loadingCtrl:LoadingController,
    private productoService: ProductoService) {
    this.domicilio = this.createFormGroupDomicilio();
    this.metodoPagoEfectivo = this.createFormGroupMetodoPagoEfectivo();
    this.metodoPagoTarjeta = this.createFormGroupMetodoPagoTarjeta();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      spinner:'bubbles',
      message: 'Por favor espere...',
      duration: 2000
    });
    await loading.present();
    console.log('Loading dismissed!');
  }
  resetearFormularioDomicilio(){
    this.domicilio.reset();
  }
  //Domicilio - metodo de pago
  resetearFormularioPago() {
    this.metodoPagoEfectivo.reset();
    this.metodoPagoTarjeta.reset();
    this.limpiarValore = "";
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
  get piso() {
    return this.domicilio.get('piso');
  }
  get departamento() {
    return this.domicilio.get('departamento');
  }

  get referencia() {
    return this.referencia.get('referencia');
  }

  get efectivo() {
    return this.metodoPagoEfectivo.get('efectivo');
  }

  get numeroTarjeta() {
    return this.metodoPagoTarjeta.get('numeroTarjeta');
  }
  get nombreTarjeta() {
    return this.metodoPagoTarjeta.get('nombreTarjeta');
  }
  get expiracion() {
    return this.metodoPagoTarjeta.get('expiracion');
  }
  get codSeguridad() {
    return this.metodoPagoTarjeta.get('codSeguridad');
  }


  //Mensajes de error 
  public errorMessages = {
    ciudad: [
      { type: 'required', message: 'Se requiere el nombre de la ciudad' },
      //{ type: 'maxlength', message: 'El nombre de la ciudad no puede ser mayor a 50 caracteres'},
      //{ type: 'minlength', message: 'El nombre de la ciudad debe tener como mínimo 3 caracteres'}
    ],
    calle: [
      { type: 'required', message: 'Se requiere el nombre de la calle' },
      { type: 'maxlength', message: 'El nombre de la calle no puede ser mayor a 50 caracteres' },
      { type: 'minlength', message: 'El nombre de la calle debe tener como mínimo 3 caracteres' },
      { type: 'pattern', message: 'El nombre de la calle ingresado no es valido' }
    ],
    numero: [
      { type: 'required', message: 'Se requiere el número del domicilio' },
      { type: 'max', message: 'El número del domicilio no puede ser mayor a 5 caracteres' },
      { type: 'min', message: 'El número del domicilio debe ser mayor a 1' }
    ],
    piso: [
      { type: 'maxlength', message: 'El número de piso no puede ser mayor a 3 caracteres' },
      { type: 'min', message: 'El número de piso debe ser mayor a -2' },
      { type: 'max', message: 'El número de piso debe ser menor a 99' }
    ],
    departamento: [
      { type: 'maxlength', message: 'El número de departamento no puede ser mayor a 2 caracteres' },
      { type: 'min', message: 'El número de departamento debe ser mayor a 0' }
    ],
    efectivo: [
      { type: 'min', message: 'El monto debe ser mayor a 0' },
      { type: 'required', message: 'El monto es requerido' },
      {type:'pattern', message:'Solo se pueden ingresar números'}
    ],

    numeroTarjeta: [
      { type: 'required', message: 'Se requiere el número de tarjeta' },
      //{ type: 'pattern', message: 'Unicamente se aceptan números' },
      { type: 'maxlength', message: 'El número de tarjeta debe ser de 16 caracteres' },
      { type: 'minlength', message: 'El número de tarjeta debe ser de 16 caracteres' },
      { type: 'pattern', message: 'El número de la tarjeta no es valido' }
    ],
    nombreTarjeta: [
      { type: 'required', message: 'Se requiere el nombre del titular de la tarjeta' },
      { type: 'maxlength', message: 'El nombre del titular de la tarjeta debe tener como máximo 50 caracteres' },
      { type: 'minlength', message: 'El nombre del titular de la tarjeta debe tener como mínimo 3 caracteres' },
      { type: 'pattern', message: 'El nombre del titular de la tarjeta ingresado no es valido' }
    ],
    expiracion: [
      { type: 'required', message: 'Se requiere la fecha de expiración de la tarjeta' },
      { type: 'pattern', message: 'Ingrese una fecha valida' },
      //{ type: 'maxlength', message: 'La fecha de expiración de la tarjeta debe ser de 4 caracteres' },
      //{ type: 'minlength', message: 'La fecha de expiración de la tarjeta debe ser de 4 caracteres' },
    ],
    codSeguridad: [
      { type: 'required', message: 'Se requiere el código de seguridad de la tarjeta' },
      { type: 'pattern', message: 'El patron del codigo de la tarjeta es de 3 caracteres' },
      //{ type: 'max', message: 'El código de seguridad de la tarjeta debe ser de hasta 3 caracteres' },
      //{ type: 'min', message: 'El código de seguridad de la tarjeta debe no debe ser menor a 000' },
    ],

  };


  //Aca se obtiene el comercio de forma dinamica, llamando a getComercios de "homeService"
  ngOnInit() {
    this.comercio = this.homeService.getComercios();
    console.log(this.comercio)
    this.producto = this.productoService.getProductos(this.comercio.id);
    if (this.minutosModificados > 60) {
      let horaFinal = this.horaModificada.getHours() + 1;
      this.minutosModificados = this.minutosModificados - 60;
      this.hora = new Date(this.fecha.getFullYear(),this.fecha.getMonth(),this.fecha.getDate(),horaFinal,this.minutosModificados,0);
    }
    else{
      this.hora = new Date(this.fecha.getFullYear(),this.fecha.getMonth(),this.fecha.getDate(),this.horaModificada.getHours(),this.minutosModificados,0);
    }
    console.log(this.minutosModificados);
    console.log(this.horaModificada.getHours());
    console.log(this.hora.toLocaleTimeString());
    console.log(this.domicilio.valid)
  }

  recargarComerio(){
    this.presentLoading();
    this.comercio = this.homeService.getComercios();
    this.producto = this.productoService.getProductos(this.comercio.id);
  }

  buscarFuncionClick() {
    let buttonPedido = document.querySelector('#mostrarPedido').getAttribute('name');
    let buttonRecargar = document.querySelector('#recargarComercio');
    let buttonRecargarComercio = document.querySelector('#recargarComercio').getAttribute('name');
    if (buttonPedido == "mostrarPedido") {
      this.cargarPedido();
      if (buttonRecargarComercio == "habilitado") {
        buttonRecargar.setAttribute("name","inhabilitado");
        buttonRecargar.setAttribute("disabled","true");
      }
    }
    if (buttonPedido == "borrarPedido") {
      this.borrarPedido();
      buttonRecargar.setAttribute("name","habilitado");
      buttonRecargar.setAttribute("disabled","false");
    }
  }
  //Esto sirve para cargar el pedido de forma dinamica en base al comercio que se eligio previamente
  cargarPedido() {
    let vueltas = Math.floor(Math.random() * 5);
    for (let index = 0; index < vueltas; index++) {
      let indice = Math.floor(Math.random() * 7);
      let cantidadPedida = Math.floor(Math.random() * 4);
      if (cantidadPedida == 0) {
        cantidadPedida = 1
      }
      //Por cada producto que pertenece al pedido generado se crea un ion-card
      const ionCard = document.createElement('ion-card');
      const nuevoProducto = document.createElement('ion-card-content');
      nuevoProducto.textContent = "(" + "X " + cantidadPedida + ")  " + this.producto[indice].nombre + ": " + "$" + this.producto[indice].precio;
      ionCard.appendChild(nuevoProducto);
      //Ademas se bloquea el botón para agregar pedidos y se habilita el botón para eliminar el pedido cargado previamente
      let buttonCargarPedido = document.querySelector('#mostrarPedido');
      let iconoButton = document.querySelector('#icono');
      iconoButton.setAttribute("name", "trash-outline");
      iconoButton.setAttribute("color", "danger");
      buttonCargarPedido.setAttribute("name", "borrarPedido");
      let productList = document.querySelector('#productList');
      productList.appendChild(ionCard);
      this.precio += cantidadPedida * this.producto[indice].precio;
      console.log(this.precio);
    }
  }

  //Esto sirve para eliminar el pedido cargado previamente y se habilita el botón "para agregar un nuevo pedido" y se bloquea el botón para eliminar pedidos
  borrarPedido() {
    let productList = document.querySelector('#productList');
    while (productList.hasChildNodes()) {
      productList.removeChild(productList.firstChild);
    }
    let buttonCargarPedido = document.querySelector('#mostrarPedido');
    let iconoButton = document.querySelector('#icono');
    iconoButton.setAttribute("name", "add-circle-outline");
    iconoButton.setAttribute("color", "primary");
    buttonCargarPedido.setAttribute("name", "mostrarPedido");
    this.precio = 0;
    console.log(this.precio);
  }

  ocultarSelectorFecha() {
    this.selectorFechaVisible = false;
  }

  mostrarSelectorFecha() {
    this.selectorFechaVisible = true;
  }

  ocultarSelectorTarjeta() {
    this.selectorTarjetaVisible = false;
    this.resetearFormularioPago();
    this.modoPago = "Efectivo";
    let iconoPago = document.querySelector('#iconoPago');
    iconoPago.setAttribute("name","cash-outline");
  }

  mostrarSelectorTarjeta() {
    this.selectorTarjetaVisible = true;
    this.resetearFormularioPago();
    this.modoPago = "Tarjeta VISA";
    let iconoPago = document.querySelector('#iconoPago');
    iconoPago.setAttribute("name","card-outline");
  }


  cambioFecha(event) {
    console.log('ionChange', event);
    console.log('Date', new Date(event.detail.value));
    let date = new Date(event.detail.value);
    this.diaSeleccionada = new Date(event.detail.value);
    console.log(date.getDate());
    console.log(this.diaSeleccionada.getDate());
    this.verificarHora(this.horaSeleccionada);
  }

  cambioHora(event) {
    console.log(this.diaSeleccionada.getDate());
    console.log(this.fecha.getDate());
    console.log('ionChange', event);
    console.log('Date', new Date(event.detail.value));
    let hourIngresada = new Date(event.detail.value);
    let hourActual = new Date();
    this.horaSeleccionada = hourIngresada;
    console.log(this.horaSeleccionada.getHours());
    if (this.diaSeleccionada.getDate() == this.fecha.getDate()) {
    // esto se tiene q ejecutar nomas cuando diaIngresado==DiaHoy
    if (this.corregirHora == false) {

      if (hourIngresada.getHours() < hourActual.getHours()) {
        console.log("hora es menor.");
        this.presentAlertHourInvalid();
        this.corregirHora = true;

      } else {

        if (hourIngresada.getHours() == hourActual.getHours()) {
          console.log("horas iguales.");
          if (hourActual.getMinutes() + 31 < hourIngresada.getMinutes()) {
            console.log("bien horas y minutos.")
          }
          //todo bien        
          else {
            console.log("minutos mal")
            this.presentAlertMinuteInvalid();
            this.corregirHora = true;
          }
        }else{if (hourActual.getHours()+1==hourIngresada.getHours() && hourActual.getMinutes()>=30 ){
          console.log("---esto significa q la hora de entra es en la proxima hora, y q estamos pasadas las y media (:'v)")
            if(hourIngresada.getMinutes()<hourActual.getMinutes()-30){
              console.log("todo muy mal");
              this.presentAlertMinuteInvalid();
              this.corregirHora = true;
            }
          }
        }
      }
    }//aca termina el else grande
    if (this.corregirHora) {
      this.reestablecerValorCampoHora();
    }else{
      console.log('Todo OK con la hora');
    }
  }
}
verificarHora(hora:Date) {
  console.log('Aca toy!!!!!!!!')
  console.log(this.diaSeleccionada.getDate());
  console.log(this.fecha.getDate());
  //console.log('ionChange', event);
  console.log('Date', new Date(hora.getHours()));
  let hourIngresada = new Date(hora);
  console.log(hourIngresada.getHours())
  let hourActual = new Date();
  this.horaSeleccionada = hourIngresada;
  console.log(this.horaSeleccionada.getHours());
  if (this.diaSeleccionada.getDate() == this.fecha.getDate()) {
  // esto se tiene q ejecutar nomas cuando diaIngresado==DiaHoy
  if (this.corregirHora == false) {

    if (hourIngresada.getHours() < hourActual.getHours()) {
      console.log("hora es menor.");
      this.presentAlertHourInvalid();
      this.corregirHora = true;

    } else {

      if (hourIngresada.getHours() == hourActual.getHours()) {
        console.log("horas iguales.");
        if (hourActual.getMinutes() + 31 < hourIngresada.getMinutes()) {
          console.log("bien horas y minutos.")
        }
        //todo bien        
        else {
          console.log("minutos mal")
          this.presentAlertMinuteInvalid();
          this.corregirHora = true;
        }
      }else{if (hourActual.getHours()+1==hourIngresada.getHours() && hourActual.getMinutes()>=30 ){
        console.log("---esto significa q la hora de entra es en la proxima hora, y q estamos pasadas las y media (:'v)")
          if(hourIngresada.getMinutes()<hourActual.getMinutes()-30){
            console.log("todo muy mal");
            this.presentAlertMinuteInvalid();
            this.corregirHora = true;
          }
        }
      }
    }
  }//aca termina el else grande
  if (this.corregirHora) {
    this.reestablecerValorCampoHora();
  }else{
    console.log('Todo OK con la hora');
  }
}
}
  reestablecerValorCampoHora() {
    let campoHora = document.querySelector('#hora');
    campoHora.setAttribute("value", this.hora.toString());
    console.log(this.hora.toString());
    this.corregirHora = false;

  }

  submit() {
    return false
  }
  presentAlertHourInvalid() {
    const alert = document.createElement('ion-alert');
    alert.header = "Hora incorrecta !!";
    alert.subHeader = "Seleccione nuevamente la hora";
    alert.message = "La hora que fue seleccionada es menor a la hora actual";
    alert.buttons = ["Ok"];
    document.body.appendChild(alert);
    return alert.present();
  }
  presentAlertMinuteInvalid() {
    const alert = document.createElement('ion-alert');
    alert.header = "Hora incorrecta !!";
    alert.subHeader = "Seleccione nuevamente la hora";
    alert.message = "No se puede hacer la entrega antes de los 30 min";
    alert.buttons = ["Ok"];
    document.body.appendChild(alert);
    return alert.present();
  }

  validarMonto(event){
    console.log(event.detail.value);
    this.montoIngresado = event.detail.value;
    console.log('Monto:' + this.montoIngresado)
    if (this.precio > 0 && this.montoIngresado > 0) {
      console.log('Hay pedido');
      if (this.montoIngresado >= this.precio) {
        console.log('Es mayor');
        this.borrarMensajeDeError();
        this.banderaMonto = false;
        this.vuelto = this.montoIngresado - this.precio;
      }else{
        if (this.montoIngresado.toString() == '') {
          console.log('Campo Vacio');
          this.borrarMensajeDeError();
          this.banderaMonto = false;
        }else{
          console.log('Es menor');
          if (this.banderaMonto == false) {
            const mensaje = document.createElement('label');
            mensaje.textContent = "El monto ingresado es menor al costo del pedido";
            document.querySelector('.error-message2').appendChild(mensaje);
            this.banderaMonto = true;
            //document.querySelector('#montoIngresado').setAttribute("class","invalid");
          }
        }
      }
    }else{
      console.log('No hay pedido');
      this.borrarMensajeDeError();
      this.banderaMonto = false;
      this.vuelto = 0;
    }
  }

  borrarMensajeDeError(){
    let mensajeError = document.querySelector('.error-message2');
    while (mensajeError.hasChildNodes()) {
      mensajeError.removeChild(mensajeError.firstChild);
    }
  }
  validarTarjeta(event){
    console.log(event.detail.value);
    let numeroTarjetap = event.detail.value;
    if (numeroTarjetap.length == 16) {
      this.recorrerTarjeta();
    }else{
      this.mostrarVISA = "*********";
    }
  }
  recorrerTarjeta(){
    this.mostrarVISA = '*****'+this.numeroTarjetaVISA[12]+this.numeroTarjetaVISA[13]+this.numeroTarjetaVISA[14]+this.numeroTarjetaVISA[15]
  }
}
