var canvas;       //Variable para recuperar el canvas
var contexto;     //Variable para guardar el contexto del canvas
var ancho;        //Ancho del canvas
var altura;       //Alto del canvas
var esSeleccionado = false; //Variable para ver si es elegido el elemento
var esSeleccionado2 = false;
var esArrastrado = false; //Variable para ver si es arrastrado el elemento
var esRedimensionar = false; //Variable para ver si es elegido para redimensionar
var esConectar = false; //Variable para ver si es elegido para conectar
var mx, my;                 //Cordenadas del mouse
var mySel = -1;                  //Vaiable para guardar el elemento seleccionado
var mySel2 = -1;
var mySelCuadro = -1;            //Vaiable para guardar el cuadro de operacion seleccionado
var mySelCuadro2 = -1;
// Variables para el color y grosor del elemento seleccionado
var SelectColor ="#00CC00";
var SelectWidth = 2;
//Variables para las cajas de redimiensionado y conexion de nodos
var SelectBoxColor = 'darkred';
var SelectBoxSize = 6;
var mitad = SelectBoxSize/2;
var figurasX = [];      //Variable para las coordenadas X de las figuras
var figurasY = [];      //Variable para las coordenadas Y de las figuras
var figurasW = [];      //Variable para las coordenadas W de las figuras
var figurasH = [];      //Variable para las coordenadas H de las figuras
var cuadrosSelectX = []; //Variable para las coordenas en X de los cuadros para operaciones
var cuadrosSelectY = []; //Variable para las coordenas en X de los cuadros para operaciones
var offsetx, offsety;  //Offsets del mouse en la figura para moverla sin problemas
var ultimaX, ultimaY;
var coorCuadritoAntesX, coorCuadritoAntesY;

class figurasCanvas{
  constructor(nombre, arriba, der, abajo, izq, arribaRef, derRef, abajoRef, izqRef, texto) {
    this.nombre = nombre;
    this.arriba = arriba;
    this.der = der;
    this.abajo = abajo;
    this.izq = izq;
    this.arribaRef = arribaRef;
    this.derRef = derRef;
    this.abajoRef = abajoRef;
    this.izqRef = izqRef;
    this.texto = texto;
  }
}

var figs = []; //Variable para las figuras que existen en el canvas

//Funcion para inicializar los canvas y elementos requeridos para mover las cosas interactivamente
function init() {
  canvas = document.getElementById("diaCanvas"); //Obtenemos el canvas por su ID
  altura = canvas.height; //Obtenemos su alto
  ancho = canvas.width;   //Y su ancho
  contexto = canvas.getContext("2d");  //Obtenemos las propiedades del canvas para usarlo
  
  //canvas.addEventListener("mousedown", Arrastrar);
  canvas.addEventListener("mouseup", Dejar);
  canvas.addEventListener("click", Selecionar);
  canvas.addEventListener("mousedown", obtenerCoordenadas); //Añadimos un listener para cuando seleccionemos algo para mover
  
  for(var t=0;t<3;t++){
    figs.push(new figurasCanvas("cuadrado",-1,-1,-1,-1,-1,-1,-1,-1, "jajas"));
  }
  
  var coords = ": " + figs[0].nombre + ", " + figs[0].izq;
  document.getElementById("demo").innerHTML = coords
  figurasX.push(200);
  figurasX.push(350);
  figurasX.push(25);
  figurasY.push(200);
  figurasY.push(250);
  figurasY.push(90);
  figurasW.push(40);
  figurasW.push(40);
  figurasW.push(25);
  figurasH.push(40);
  figurasH.push(40);
  figurasH.push(25);
  contexto.strokeRect(200,200,40,40);
  contexto.strokeRect(350,250,40,40);
  contexto.strokeRect(25,90,25,25);
  contexto.strokeRect(0,0,10,10);
  triag();
}

/*Funcion que toma las coordenadas del objeto seleccionado y pone nuevas
coordenadas a los cuadros de seleccion*/
function CoodenadasRedimSelect(){
    // 0  1  2
    // 3     4
    // 5  6  7
  cuadrosSelectX[0] = figurasX[mySel];
  cuadrosSelectY[0] = figurasY[mySel];
  
  cuadrosSelectX[1] = figurasX[mySel]+figurasW[mySel]/2-mitad;
  cuadrosSelectY[1] = figurasY[mySel];
  
  cuadrosSelectX[2] = figurasX[mySel]+figurasW[mySel]-SelectBoxSize;
  cuadrosSelectY[2] = figurasY[mySel];
  
  cuadrosSelectX[3] = figurasX[mySel];
  cuadrosSelectY[3] = figurasY[mySel]+figurasH[mySel]/2-mitad;
  
  cuadrosSelectX[4] = figurasX[mySel]+figurasW[mySel]-SelectBoxSize;
  cuadrosSelectY[4] = figurasY[mySel]+figurasH[mySel]/2-mitad;
  
  cuadrosSelectX[5] = figurasX[mySel];
  cuadrosSelectY[5] = figurasY[mySel]+figurasH[mySel]-SelectBoxSize;

  cuadrosSelectX[6] = figurasX[mySel]+figurasW[mySel]/2-mitad;
  cuadrosSelectY[6] = figurasY[mySel]+figurasH[mySel]-SelectBoxSize;
  
  cuadrosSelectX[7] = figurasX[mySel]+figurasW[mySel]-SelectBoxSize;
  cuadrosSelectY[7] = figurasY[mySel]+figurasH[mySel]-SelectBoxSize;
}

/*Funcion que sirve para seleccionar una figura y hacer operaciones con esta*/
function Selecionar(event){
  var mx = event.clientX; //Obtenemos la coordenada X del mouse dentro del canvas
  var my = event.clientY; //Obtenemos la coordenada Y del mouse dentro del canvas
  l = figurasCanvas.length; //Obtenemos la cantidad de objetos que hay en el canvas
  //Verificamos en la cola cual es el que estamos seleccionando
  for (var i = l-1; i >= 0; i--) {
    //Si existe
    if((mx>=figurasX[i]&&mx<=figurasX[i]+figurasW[i])&&(my>=figurasY[i]&&my<=figurasY[i]+figurasH[i])){
      mySel = i; //Obtenemos la figura seleccionada
      if(mySel2 == -1){
        //|| (mySelCuadro != -1 && mySel2 != -1)
        esSeleccionado = true;
        break;
      }
      else{
        esSeleccionado = false;
        esSeleccionado2 = true;
        break;
      }
    }
    else{
      esSeleccionado = false;
      esSeleccionado2 = false;
    }
  }
  if(!esSeleccionado && !esSeleccionado2){
    mySel = -1;
    mySelCuadro = -1;
    mySel2 = -1;
    mySelCuadro2 = -1;
  }
  if(esSeleccionado){
    var coordsxD = "nom: " + figs[mySel].nombre + " izq, " 
    + figs[mySel].izq+ " der, " 
    + figs[mySel].der+ " arr, " 
    + figs[mySel].arriba+ " aba, " + figs[mySel].abajo
    + " Sel1 " + esSeleccionado
    + " sel2 " + esSeleccionado2
    + " mysel1 " + mySel
    + " mysel2 " + mySel2
    + " cuadrito1 "+ mySelCuadro
    + " cuadrito2 "+ mySelCuadro2;
    document.getElementById("demo").innerHTML = coordsxD;
  }
  else if(esSeleccionado2){
    var coordslol = "es de verdad pepega "
    document.getElementById("demo2").innerHTML = coordslol;
  }
  
  //Ahora redibujamos todo para hacer las cosas si es que se selecciono alguna figura
  if(esSeleccionado||esSeleccionado2){
    l = figurasCanvas.length; //Obtenemos la cantidad de objetos que hay en el canvas
    contexto.clearRect(0, 0, canvas.width, canvas.height);  //Limpiamos el canvas
    for(var aux = l-1; aux >= 0; aux--){
      if(aux != mySel){
        //Si no es el que estamos seleccionando lo dejamos como estaba
        contexto.strokeRect(figurasX[aux],figurasY[aux],figurasW[aux],figurasH[aux]);
      }
      else{
        contexto.strokeStyle = SelectColor;
        contexto.lineWidth = SelectWidth;
        contexto.strokeRect(figurasX[aux],figurasY[aux],figurasW[aux],figurasH[aux]);
        CoodenadasRedimSelect();
        for (var j = 0; j < 8; j++) {
          contexto.strokeRect(cuadrosSelectX[j], cuadrosSelectY[j], SelectBoxSize, SelectBoxSize);
        }
        contexto.strokeStyle = "#000000";
        contexto.lineWidth = 1;
      }
    }
    for (var j=0; j<8; j++) {
      //Si existe
      if((mx>=cuadrosSelectX[j]&&mx<=(cuadrosSelectX[j]+SelectBoxSize))&&(my>=cuadrosSelectY[j]&&my<=(cuadrosSelectY[j]+SelectBoxSize))){
        mySelCuadro = j; //Obtenemos la figura seleccionada
        break;
      }
      else{
        mySelCuadro = -1;
      }
    }

    if(mySelCuadro == 0 || mySelCuadro == 2 || mySelCuadro == 5 || mySelCuadro == 7){
      esRedimensionar = true;
      var coords = "X coords: " + mx + ", Y coords: " + my+" red "+esRedimensionar;
      document.getElementById("demo").innerHTML = coords;
    }
    else if(mySelCuadro == 1 || mySelCuadro == 3 || mySelCuadro == 4 || mySelCuadro == 6){
      esConectar = true;
      ultimaX = cuadrosSelectX[mySelCuadro]+SelectBoxSize;
      ultimaY = cuadrosSelectY[mySelCuadro]+SelectBoxSize;
      if(esSeleccionado){
        coorCuadritoAntesX = cuadrosSelectX[mySelCuadro];
        coorCuadritoAntesY = cuadrosSelectY[mySelCuadro];
      }
      var coords = "X coords: " + mx + ", Y coords: " + my+" con "+esConectar+" cuadrito "+mySelCuadro
      +" x cuadrito "+cuadrosSelectX[mySelCuadro]+" y cuadrito "+cuadrosSelectY[mySelCuadro]
      + " Sel1 " + esSeleccionado
    + " sel2 " + esSeleccionado2
    + " mysel1 " + mySel
    + " mysel2 " + mySel2
    + " cuadrito1 "+ mySelCuadro
    + " cuadrito2 "+ mySelCuadro2;
      document.getElementById("demo").innerHTML = coords;
    }
    else{
      esRedimensionar = false;
      esConectar = false;
      esSeleccionado = false;
      var coords = "Falso ambos "+"nom: " 
    + figs[mySel].nombre + " izq, " 
    + figs[mySel].izq+ " der, " 
    + figs[mySel].der+ " arr, " 
    + figs[mySel].arriba+ " aba, " 
    + figs[mySel].abajo+ " Refizq, " 
    + figs[mySel].izqRef+ " Refder, " 
    + figs[mySel].derRef+ " Refarr, " 
    + figs[mySel].arribaRef+ " Refaba, " + figs[mySel].abajoRef
      + " Sel1 " + esSeleccionado
    + " sel2 " + esSeleccionado2
    + " mysel1 " + mySel
    + " mysel2 " + mySel2
    + " cuadrito1 "+ mySelCuadro
    + " cuadrito2 "+ mySelCuadro2;
      document.getElementById("demo").innerHTML = coords;
    }
    canvas.ondblclick = Arrastrar;
  }
  //esSeleccionado = false;
}

function CrearFlecha(event){
  var mx = event.clientX; //Obtenemos la coordenada X del mouse dentro del canvas
  var my = event.clientY; //Obtenemos la coordenada Y del mouse dentro del canvas
  if(esSeleccionado){
    contexto.strokeStyle = "#000000";
    contexto.lineWidth = SelectWidth;
    contexto.lineJoin = "round";
    contexto.beginPath();
    contexto.moveTo(ultimaX,ultimaY);
    contexto.lineTo(mx, my);
    contexto.stroke();
    ultimaX = mx;
    ultimaY = my;
    var coordsxD = "nom: " + figs[mySel].nombre + " izq, " 
  + figs[mySel].izq+ " der, " 
  + figs[mySel].der+ " arr, " 
  + figs[mySel].arriba+ " aba, " + figs[mySel].abajo
  + " Sel1 " + esSeleccionado
  + " sel2 " + esSeleccionado2
  + " mysel1 " + mySel
  + " mysel2 " + mySel2
  + " cuadrito1 "+ mySelCuadro
  + " cuadrito2 "+ mySelCuadro2;
  document.getElementById("demo").innerHTML = coordsxD;
  }
  else if(esSeleccionado2){
    contexto.strokeStyle = "#000000";
    contexto.lineWidth = SelectWidth;
    contexto.lineJoin = "round";
    contexto.beginPath();
    contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY+SelectBoxSize);
    contexto.lineTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]);
    contexto.stroke();
    switch (mySelCuadro) {
      case 1:
        figs[mySel].arriba = mySel2;
        figs[mySel].arribaRef = mySelCuadro2;
        break;
      case 4:
        figs[mySel].der = mySel2;
        figs[mySel].derRef = mySelCuadro2;
        break;
      case 6:
        figs[mySel].abajo = mySel2;
        figs[mySel].abajoRef = mySelCuadro2;
        break;
      case 3:
        figs[mySel].izq = mySel2;
        figs[mySel].izqRef = mySelCuadro2;
        break;
      default:
        break;
    }
    switch (mySelCuadro2) {
      case 1:
        figs[mySel2].arriba = mySel;
        figs[mySel2].arribaRef = mySelCuadro;
        break;
      case 4:
        figs[mySel2].der = mySel;
        figs[mySel2].derRef = mySelCuadro;
        break;
      case 6:
        figs[mySel2].abajo = mySel;
        figs[mySel2].abajoRef = mySelCuadro;
        break;
      case 3:
        figs[mySel2].izq = mySel;
        figs[mySel2].izqRef = mySelCuadro;
        break;
      default:
        break;
    }
  }
  if(mySel2 != -1 && !esSeleccionado){
    mySel2 = -1;
    mySelCuadro2 = -1;
    esSeleccionado2 = false;
  }
  else{
    mySel2 = mySel;
    if(mySelCuadro2==-1){
      mySelCuadro2 = mySelCuadro;
      mySelCuadro = -1;
    }
  }
}

function verificarLinea(event, mx, my){
   contexto.strokeStyle = "#000000";
      contexto.lineWidth = SelectWidth;
      contexto.lineJoin = "round";
      contexto.beginPath();
      contexto.moveTo(mx, my);
      contexto.lineTo(cuadroAnteriorX, cuadroAnteriorY);
      contexto.closePath();
      contexto.stroke();
}

function Arrastrar(event){
  if(esRedimensionar){
    canvas.onmousemove = Redimensionar;
  }
  else if(esConectar||esSeleccionado2){
    canvas.onmousemove = CrearFlecha;
  }
}
function Redimensionar(event){
  var viejaX = figurasX[mySel];
  var viejaY = figurasY[mySel];
  var l = figurasCanvas.length; //Obtenemos la cantidad de objetos que tenemos en el canvas
  var mx = event.clientX; //Obtenemos la coordenada X del mouse dentro del canvas
  var my = event.clientY; //Obtenemos la coordenada Y del mouse dentro del canvas
  switch (mySelCuadro) {
    case 0:
      figurasX[mySel] = mx;
      figurasY[mySel] = my;
      figurasW[mySel] += viejaX - mx;
      figurasH[mySel] += viejaY - my;
      contexto.strokeStyle = SelectColor;
      contexto.lineWidth = SelectWidth;
      contexto.strokeRect(mx,my,figurasW[mySel],figurasH[mySel]);
      contexto.strokeStyle = "#000000";
      contexto.lineWidth = 1;
      break;
    case 2:
      figurasY[mySel] = my;
      figurasW[mySel] = mx - viejaX;
      figurasH[mySel] += viejaY - my;
      contexto.strokeStyle = SelectColor;
      contexto.lineWidth = SelectWidth;
      contexto.strokeRect(figurasX[mySel],my,figurasW[mySel],figurasH[mySel]);
      contexto.strokeStyle = "#000000";
      contexto.lineWidth = 1;
      break;
    case 5:
      figurasX[mySel] = mx;
      figurasW[mySel] += viejaX - mx;
      figurasH[mySel] = my - viejaY;
      contexto.strokeStyle = SelectColor;
      contexto.lineWidth = SelectWidth;
      contexto.strokeRect(mx,figurasY[mySel],figurasW[mySel],figurasH[mySel]);
      contexto.strokeStyle = "#000000";
      contexto.lineWidth = 1;
      break;
    case 7:
      figurasW[mySel] = mx - viejaX;
      figurasH[mySel] = my - viejaY;
      contexto.strokeStyle = SelectColor;
      contexto.lineWidth = SelectWidth;
      contexto.strokeRect(figurasX[mySel],figurasY[mySel],figurasW[mySel],figurasH[mySel]);
      contexto.strokeStyle = "#000000";
      contexto.lineWidth = 1;
      break;
    default:
      break;
  }
  esRedimensionar = false;
  //canvas.onmouseup = Dejar;  //Cuando soltemos el boton del mouse se manda a la funcion Dejar
}

/*Funcion que verifica que donde se hace clic esta dentro de un objeto, si lo es pasamos a Mover el objeto*/
function obtenerCoordenadas(event){
  var mx = event.clientX; //Obtenemos la coordenada X del mouse dentro del canvas
  var my = event.clientY; //Obtenemos la coordenada Y del mouse dentro del canvas
  var l = figurasCanvas.length; //Obtenemos la cantidad de objetos que tenemos en el canvas
  //Buscamos si existe un objeto que tenga el pixel que el mouse hizo clic
  for (var i = l-1; i >= 0; i--) {
    //Si existe
    if((mx>=figurasX[i]&&mx<=figurasX[i]+figurasW[i])&&(my>=figurasY[i]&&my<=figurasY[i]+figurasH[i])){
      mySel = i; //Obtenemos la figura seleccionada
      esArrastrado = true;  //Inidicamos que fue seleccionada
      offsetx = mx-figurasX[i];
      offsety = my-figurasY[i];
      /*var jaja = "Hola " + mySel +" "+esSeleccionado;
      document.getElementById("demo").innerHTML = jaja;*/
      if(event.button == 0){
        canvas.onmousemove = Mover; //Llamamos a la funcion mover
      }
    }
    //Dibujamos las formas del canas en el respaldo
    //drawshape(rcontexto, figurasCanvas[i], 'black');
  }
}

/*Funcion que mueve a un elemento dentro del canvas*/
function Mover(event){
  //Si existio un elemento seleccionado
  if(esArrastrado){
    var mx = event.clientX; //Obtenemos la coordenada X del mouse dentro del canvas
    var my = event.clientY; //Obtenemos la coordenada Y del mouse dentro del canvas
    contexto.clearRect(0, 0, canvas.width, canvas.height);  //Limpiamos el canvas
    l = figurasCanvas.length; //Obtenemos la cantidad de objetos que hay en el canvas
    //Verificamos en la cola cual es el que estamos moviendo
    for(var aux = l-1; aux >= 0; aux--){
      if(aux != mySel){
        //Si no es el que estamos moviendo lo dejamos como estaba
        contexto.strokeRect(figurasX[aux],figurasY[aux],figurasW[aux],figurasH[aux]);
      }
      else{
        //Si es el que movemos, dibujamos con las nuevas coordenadas el objeto
        contexto.strokeStyle = SelectColor;
        contexto.lineWidth = SelectWidth;
        contexto.strokeRect(mx-offsetx,my-offsety,figurasW[mySel],figurasH[mySel]);
        figurasX[mySel] = mx-offsetx;
        figurasY[mySel] = my-offsety;
        contexto.strokeStyle = "#000000";
        contexto.lineWidth = 1;
      }
    }
  }
  canvas.onmouseup = Dejar;  //Cuando soltemos el boton del mouse se manda a la funcion Dejar
}

/*funcion que deselecciona el objeto que estamos moviendo*/
function Dejar(){
  esArrastrado = false;
  contexto.strokeStyle = "#000000";
  contexto.lineWidth = 1;
  contexto.clearRect(0, 0, canvas.width, canvas.height);  //Limpiamos el canvas
  l = figurasCanvas.length; //Obtenemos la cantidad de objetos que hay en el canvas
  //Verificamos en la cola cual es el que estamos moviendo
  for(var aux = l-1; aux >= 0; aux--){
    contexto.strokeRect(figurasX[aux],figurasY[aux],figurasW[aux],figurasH[aux]);
  }
  triag();
  dibujarConexiones;
}
function triag(){
  contexto.beginPath();
  contexto.moveTo(figurasX[2],figurasY[2]);
  contexto.lineTo(figurasX[2],figurasY[2]+figurasH[2]);
  contexto.lineTo(figurasX[2]+figurasW[2],figurasY[2]);
  contexto.closePath();
  contexto.fill();
}

function dibujarConexiones(){

}

/*Funcion para redibujar el canvas y pueda mover el objeto a donde queremos, 
solo lo hace si la variable que permite el refrescado del canvas esta activa */
function Dibujar(){

}
