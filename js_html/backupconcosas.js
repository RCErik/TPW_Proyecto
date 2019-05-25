var canvas;       //Variable para recuperar el canvas
var contexto;     //Variable para guardar el contexto del canvas
var ancho;        //Ancho del canvas
var altura;       //Alto del canvas
var esSeleccionado = false;       //Variable para ver si es elegido el elemento
var esSeleccionado2 = false;      //Variable para ver si un objeto es la seleccion 2
var esArrastrado = false;         //Variable para ver si es arrastrado el elemento
var esRedimensionar = false;      //Variable para ver si es elegido para redimensionar
var esConectar = false;           //Variable para ver si es elegido para conectar
var mySel = -1;                   //Vaiable para guardar el elemento seleccionado
var mySel2 = -1;                  //Variable para saber que objeto es la seleccion 2
var mySelCuadro = -1;             //Vaiable para guardar el cuadro de operacion seleccionado
var mySelCuadro2 = -1;            //Variable para saber el nodo del objeto 2 y conectarlos
// Variables para el color y grosor del elemento seleccionado
var SelectColor ="#00CC00";
var SelectWidth = 2;
//Variables para las cajas de redimiensionado y conexion de nodos
var SelectBoxColor = 'darkred';
var SelectBoxSize = 6;
var mitad = SelectBoxSize/2;
var figurasX = [];        //Variable para las coordenadas X de las figuras
var figurasY = [];        //Variable para las coordenadas Y de las figuras
var figurasW = [];        //Variable para las coordenadas W de las figuras
var figurasH = [];        //Variable para las coordenadas H de las figuras
var cuadrosSelectX = [];  //Variable para las coordenas en X de los cuadros para operaciones
var cuadrosSelectY = [];  //Variable para las coordenas en X de los cuadros para operaciones
var offsetx, offsety;     //Offsets del mouse en la figura para moverla sin problemas
var ultimaX, ultimaY;     //Variables para saber la ultima posicion del mouse mientras dibuja la linea
var coorCuadritoAntesX, coorCuadritoAntesY; //Variables para saber la ultima posicion del nodo del primer objeto
var esNuevo = true;
var tamañoFuente = 16;

//Clase para representar los cuadros de manera funcional
class figurasCanvas{
  constructor(nombre, arriba, der, abajo, izq, arribaRef, derRef, abajoRef, izqRef, texto) {
    this.nombre = nombre; //Nombre de la parte del diagrama
    //Cuatro variables para saber con quien esta conectado
    this.arriba = arriba;
    this.der = der;
    this.abajo = abajo;
    this.izq = izq;
    //Cuatro variables para saber a que nodo esta conectado
    this.arribaRef = arribaRef;
    this.derRef = derRef;
    this.abajoRef = abajoRef;
    this.izqRef = izqRef;
    this.texto = texto; //Texto que esta en el elemento
    //Variables de dibujo
    this.figColor = "#000000";
    this.figRelleno = "#ffffff";
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
  
  /*for(var t=0;t<3;t++){
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
  triag();*/
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
  l = figs.length; //Obtenemos la cantidad de objetos que hay en el canvas

  //Verificamos en la cola cual es el que estamos seleccionando
  for (var i = l-1; i >= 0; i--) {
    //Si existe
    if((mx>=figurasX[i]&&mx<=figurasX[i]+figurasW[i])&&
       (my>=figurasY[i]&&my<=figurasY[i]+figurasH[i])){
      mySel = i; //Obtenemos la figura seleccionada
      if(mySel2 == -1){
        //Si es la primera seleccion, lo indicamos y salimos del ciclo
        esSeleccionado = true;
        break;
      }
      else{
        //Si no, entonces es la segunda seleccion y salimos del ciclo
        esSeleccionado = false;
        esSeleccionado2 = true;
        break;
      }
    }
    else{
      //Si no seleccionamos nada, lo indicamos
      esSeleccionado = false;
      esSeleccionado2 = false;
    }
  }

  //Si no seleccionamos nada, reiniciamos las variables de seleccion y accion
  if(!esSeleccionado && !esSeleccionado2){
    mySel = -1;
    mySelCuadro = -1;
    mySel2 = -1;
    mySelCuadro2 = -1;
  }

  /*if(esSeleccionado){
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
  }*/
  
  //Ahora redibujamos todo para hacer las cosas si es que se selecciono alguna figura
  if(esSeleccionado||esSeleccionado2){
    l = figs.length; //Obtenemos la cantidad de objetos que hay en el canvas
    contexto.clearRect(0, 0, canvas.width, canvas.height);  //Limpiamos el canvas
    for(var aux = l-1; aux >= 0; aux--){
      if(aux != mySel){
        //Si no es el que estamos seleccionando lo dejamos como estaba
        contexto.strokeRect(figurasX[aux],figurasY[aux],figurasW[aux],figurasH[aux]);
      }
      else{
        //Cambiamos el color del pincel y de grosor
        contexto.strokeStyle = SelectColor;
        contexto.lineWidth = SelectWidth;
        //Dibujamos el cuadro
        contexto.strokeRect(figurasX[aux],figurasY[aux],figurasW[aux],figurasH[aux]);
        CoodenadasRedimSelect();  //Calculamos los cuadros de accion de la figura seleccionada
        for (var j = 0; j < 8; j++) {
          //Dibujamos los cuadros en la figura
          contexto.strokeRect(cuadrosSelectX[j], cuadrosSelectY[j], SelectBoxSize, SelectBoxSize);
        }
        //Ponemos el pincel como estaba.
        contexto.strokeStyle = "#000000";
        contexto.lineWidth = 1;
      }
    }
    //Ahora verificamos si se hizo clic en un cuadro de accion
    for (var j=0; j<8; j++) {
      //Si lo hizo
      if((mx>=cuadrosSelectX[j]&&mx<=(cuadrosSelectX[j]+SelectBoxSize))&&
         (my>=cuadrosSelectY[j]&&my<=(cuadrosSelectY[j]+SelectBoxSize))){
        mySelCuadro = j; //Obtenemos el nodo que selecciono
        break;  //Salimos del ciclo
      }
      else{
        mySelCuadro = -1; //Si no, lo indicamos
      }
    }

    //Si es un cuadro de redimension lo indicamos (las esquinas del cuadro)
    if(mySelCuadro == 0 || mySelCuadro == 2 || mySelCuadro == 5 || mySelCuadro == 7){
      esRedimensionar = true;
      var coords = "X coords: " + mx + ", Y coords: " + my+" red "+esRedimensionar;
      document.getElementById("demo").innerHTML = coords;
    }
    else if(mySelCuadro == 1 || mySelCuadro == 3 || mySelCuadro == 4 || mySelCuadro == 6){
      //Si es un cuadro de conexion lo indicamos (los puntos medios de las aristas)
      esConectar = true;
      //Ponemos las ultimas coordenadas para empezar a dibujar con el mouse
      ultimaX = cuadrosSelectX[mySelCuadro]+SelectBoxSize;
      ultimaY = cuadrosSelectY[mySelCuadro]+SelectBoxSize;
      //Si es la primera seleccion ponemos las coordenadas del nodo seleccionado
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
      //Si no selecciono ningun nodo lo indicamos
      esRedimensionar = false;
      esConectar = false;
      //esSeleccionado = false;

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
    //Si hace doble click pasamos a Arrastar
    canvas.ondblclick = Arrastrar;
  }
}

//Funcion que Redimensiona o Conecta dependiendo de la bandera
function Arrastrar(event){
  if(esRedimensionar){
    canvas.onmousemove = Redimensionar;
  }
  else if(esConectar||esSeleccionado2){
    canvas.onmousemove = CrearFlecha;
  }
}

//Funcion que crea la flecha entre los dos nodos seleccionados
function CrearFlecha(event){
  var mx = event.clientX; //Obtenemos la coordenada X del mouse dentro del canvas
  var my = event.clientY; //Obtenemos la coordenada Y del mouse dentro del canvas
  //Si es la primera seleccion se dibujara con el mouse la linea
  if(esSeleccionado){
    //Ponemos las caracteristicas de la linea
    contexto.strokeStyle = "#000000";
    contexto.lineWidth = SelectWidth;
    contexto.lineJoin = "round";
    contexto.beginPath();             //Empezamos el camino
    contexto.moveTo(ultimaX,ultimaY); //Nos ponemos en el nodo que se selecciono
    contexto.lineTo(mx, my);          //Nos movemos con el mouse
    contexto.stroke();                //Dibujamos la linea
    ultimaX = mx;                     //Ponemos ahora la nueva ultima coordenada de X
    ultimaY = my;                     //Y la coordenada de Y
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
    //Si es la segunda seleccion ponemos las caracteristicas de la linea
    contexto.strokeStyle = "#000000";
    contexto.lineWidth = SelectWidth;
    contexto.lineJoin = "round";

    //Ahora guardamos la referencia entre las conexiones, primero del segundo objeto seleccionado
    switch (mySelCuadro) {
      case 1:
      //Si es el nodo de arriba
        figs[mySel].arriba = mySel2;  //A la figura ponemos a que objeto se conecta
        figs[mySel].arribaRef = mySelCuadro2; //Y que nodo es
        //Dibujamos la flecha
        dibujarFlecha("abajo");
        break;
      case 4:
      //Si es el nodo de la derecha
        figs[mySel].der = mySel2; //A la figura ponemos a que objeto se conecta
        figs[mySel].derRef = mySelCuadro2;  //Y que nodo es
        //Dibujamos la flecha
        dibujarFlecha("izquierda");
        break;
      case 6:
      //Si es el nodo de abajo
        figs[mySel].abajo = mySel2; //A la figura ponemos a que objeto se conecta
        figs[mySel].abajoRef = mySelCuadro2;  //Y que nodo es
        //Dibujamos la flecha
        dibujarFlecha("arriba");
        break;
      case 3:
      //Si es el nodo de la izquierda
        figs[mySel].izq = mySel2; //A la figura ponemos a que objeto se conecta
        figs[mySel].izqRef = mySelCuadro2;  //Y que nodo es
        //Dibujamos la flecha
        dibujarFlecha("derecha");
        break;
      default:
        break;
    }
    //Ahora del primero
    switch (mySelCuadro2) {
      case 1:
      //Si es el nodo de arriba
        figs[mySel2].arriba = mySel;  //A la figura ponemos a que objeto se conecta
        figs[mySel2].arribaRef = mySelCuadro; //Y que nodo es
        break;
      case 4:
      //Si es el nodo de la derecha
        figs[mySel2].der = mySel; //A la figura ponemos a que objeto se conecta
        figs[mySel2].derRef = mySelCuadro;  //Y que nodo es
        break;
      case 6:
      //Si es el nodo de abajo
        figs[mySel2].abajo = mySel; //A la figura ponemos a que objeto se conecta
        figs[mySel2].abajoRef = mySelCuadro;  //Y que nodo es
        break;
      case 3:
      //Si es el nodo de la izquierda
        figs[mySel2].izq = mySel; //A la figura ponemos a que objeto se conecta
        figs[mySel2].izqRef = mySelCuadro;  //Y que nodo es
        break;
      default:
        break;
    }
  }

  //Condicionales para saber como continuar dependiendo de la seleccion
  if(mySel2 != -1 && !esSeleccionado){
    //Si se selecciona nada despues de empezar la conexion entre figuras
    mySel2 = -1;  //No se selecciona nada
    mySelCuadro2 = -1;  //No hay nodo
    esSeleccionado2 = false;  //No hay otra figura
  }
  else{
    //Si selecciono otra figura
    mySel2 = mySel; //Guardamos quien era la original
    if(mySelCuadro2==-1){
      mySelCuadro2 = mySelCuadro; //El nodo
      mySelCuadro = -1; //Y lo reiniciamos
    }
  }
}

function dibujarFlecha(lado){
  switch (lado) {
      case "arriba":
      //Si apunta arriba
        contexto.beginPath(); //Empezamos el camino
        //Nos ponemos en el nodo que se selecciono primero
        contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY+SelectBoxSize);
        //Nos movemos al segundo nodo para hacer el puente
        contexto.lineTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]+SelectBoxSize);
        contexto.stroke();  //Dibujamos la linea
        contexto.moveTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]+SelectBoxSize);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]+6, cuadrosSelectY[mySelCuadro]+SelectBoxSize+6);
        contexto.stroke();  //Dibujamos la linea
        contexto.moveTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]+SelectBoxSize);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]-6, cuadrosSelectY[mySelCuadro]+SelectBoxSize+6);
        contexto.stroke();  //Dibujamos la linea
        break;
      case "derecha":
      //Si apunta a la derecha
        contexto.beginPath(); //Empezamos el camino
        //Nos ponemos en el nodo que se selecciono primero
        contexto.moveTo(coorCuadritoAntesX,coorCuadritoAntesY);
        //Nos movemos al segundo nodo para hacer el puente
        contexto.lineTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]);
        contexto.stroke();  //Dibujamos la linea
        contexto.lineTo(cuadrosSelectX[mySelCuadro]-6, cuadrosSelectY[mySelCuadro]-6);
        contexto.stroke();  //Dibujamos la linea
        contexto.moveTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]-6, cuadrosSelectY[mySelCuadro]+6);
        contexto.stroke();  //Dibujamos la linea
        break;
      case "abajo":
      //Si apunta abajo
        contexto.beginPath(); //Empezamos el camino
        //Nos ponemos en el nodo que se selecciono primero
        contexto.moveTo(coorCuadritoAntesX,coorCuadritoAntesY);
        //Nos movemos al segundo nodo para hacer el puente
        contexto.lineTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]);
        contexto.stroke();  //Dibujamos la linea
        contexto.lineTo(cuadrosSelectX[mySelCuadro]-6, cuadrosSelectY[mySelCuadro]-6);
        contexto.stroke();  //Dibujamos la linea
        contexto.moveTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]+6, cuadrosSelectY[mySelCuadro]-6);
        contexto.stroke();  //Dibujamos la linea
        break;
      case "izquierda":
      //Si apunta a la izquierda
        contexto.beginPath(); //Empezamos el camino
        //Nos ponemos en el nodo que se selecciono primero
        contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY+SelectBoxSize);
        //Nos movemos al segundo nodo para hacer el puente
        contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize, cuadrosSelectY[mySelCuadro]);
        contexto.stroke();  //Dibujamos la linea
        contexto.moveTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize, cuadrosSelectY[mySelCuadro]);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize+6, cuadrosSelectY[mySelCuadro]+6);
        contexto.stroke();  //Dibujamos la linea
        contexto.moveTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize, cuadrosSelectY[mySelCuadro]);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize+6, cuadrosSelectY[mySelCuadro]-6);
        contexto.stroke();  //Dibujamos la linea
        break;
      default:
        break;
    }
}

/*Funcion que se encarga de redimensionar la figura si se
selecciona un nodo de los vertices*/
function Redimensionar(event){
  var viejaX = figurasX[mySel]; //Variable que guarda la coordenada X original
  var viejaY = figurasY[mySel]; //Variable que guarda la coordenada Y original
  var l = figs.length; //Obtenemos la cantidad de objetos que tenemos en el canvas
  var mx = event.clientX; //Obtenemos la coordenada X del mouse dentro del canvas
  var my = event.clientY; //Obtenemos la coordenada Y del mouse dentro del canvas
  //Dependiendo del nodo seleccionado se recalculan las dimensiones del nuevo cuadro
  switch (mySelCuadro) {
    case 0:
    //Esquina superior izquierda
      figurasX[mySel] = mx; //Nos movemos respecto al mouse en X
      figurasY[mySel] = my; //Y en la coordenada Y
      figurasW[mySel] += viejaX - mx; //Redimensionamos el ancho
      figurasH[mySel] += viejaY - my; //Y el alto del cuadro
      //Cambiamos las caracteristicas del pincel
      contexto.strokeStyle = SelectColor;
      contexto.lineWidth = SelectWidth;
      contexto.strokeRect(mx,my,figurasW[mySel],figurasH[mySel]);
      break;
    case 2:
    //Esquina superior derecha
      figurasY[mySel] = my; //Nos movemos en la coordenada Y
      figurasW[mySel] = mx - viejaX;  //Redimensionamos el ancho
      figurasH[mySel] += viejaY - my; //Y el alto del cuadro
      //Cambiamos las caracteristicas del pincel
      contexto.strokeStyle = SelectColor;
      contexto.lineWidth = SelectWidth;
      contexto.strokeRect(figurasX[mySel],my,figurasW[mySel],figurasH[mySel]);
      break;
    case 5:
    //Esquina inferior izquierda
      figurasX[mySel] = mx; //Nos movemos en la coordenada X
      figurasW[mySel] += viejaX - mx; //Redimensionamos el ancho
      figurasH[mySel] = my - viejaY;  //Y el alto del cuadro
      //Cambiamos las caracteristicas del pincel
      contexto.strokeStyle = SelectColor;
      contexto.lineWidth = SelectWidth;
      contexto.strokeRect(mx,figurasY[mySel],figurasW[mySel],figurasH[mySel]);
      break;
    case 7:
    //Esquina inferior derecha
      figurasW[mySel] = mx - viejaX;  //Redimensionamos el ancho
      figurasH[mySel] = my - viejaY;  //Y el alto del cuadro
      //Cambiamos las caracteristicas del pincel
      contexto.strokeStyle = SelectColor;
      contexto.lineWidth = SelectWidth;
      contexto.strokeRect(figurasX[mySel],figurasY[mySel],figurasW[mySel],figurasH[mySel]);
      break;
    default:
      break;
  }
  //Retornamos el pincel como anters
  contexto.strokeStyle = "#000000";
  contexto.lineWidth = 1;
  esRedimensionar = false;  //Se acaba la redimension
  //canvas.onmouseup = Dejar;  //Cuando soltemos el boton del mouse se manda a la funcion Dejar
}

/*Funcion que verifica que donde se hace clic esta dentro de un objeto, si lo es pasamos a Mover el objeto*/
function obtenerCoordenadas(event){
  var mx = event.clientX; //Obtenemos la coordenada X del mouse dentro del canvas
  var my = event.clientY; //Obtenemos la coordenada Y del mouse dentro del canvas
  var l = figs.length; //Obtenemos la cantidad de objetos que tenemos en el canvas
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
  }
}

/*Funcion que mueve a un elemento dentro del canvas*/
function Mover(event){
  //Si existio un elemento seleccionado
  if(esArrastrado){
    var mx = event.clientX; //Obtenemos la coordenada X del mouse dentro del canvas
    var my = event.clientY; //Obtenemos la coordenada Y del mouse dentro del canvas
    contexto.clearRect(0, 0, canvas.width, canvas.height);  //Limpiamos el canvas
    l = figs.length; //Obtenemos la cantidad de objetos que hay en el canvas
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
}

/*Funcion que redibuja o acaba la accion del objeto que estabamos usando*/
function Dejar(){
  esArrastrado = false;
  contexto.strokeStyle = "#000000";
  contexto.lineWidth = 1;
  contexto.clearRect(0, 0, canvas.width, canvas.height);  //Limpiamos el canvas
  var l = figs.length; //Obtenemos la cantidad de objetos que hay en el canvas
  //Verificamos en la cola cual es el que estamos moviendo
  /*for(var aux = l-1; aux >= 0; aux--){
    contexto.strokeRect(figurasX[aux],figurasY[aux],figurasW[aux],figurasH[aux]);
  }*/
  //triag();
  /*if(!esSeleccionado&&!esSeleccionado2){
    canvas.ondblclick=dibujarConexiones();
  }*/
  esNuevo = false;
  Dibujar("iniciar");
  Dibujar("final");
  Dibujar("EntDatos");
  Dibujar("SalDatos");
  Dibujar("Condicional");
  Dibujar("Variable");
  Dibujar("Asignacion");
  esNuevo = true;
}

function triag(){
  contexto.beginPath();
  contexto.moveTo(figurasX[2],figurasY[2]);
  contexto.lineTo(figurasX[2],figurasY[2]+figurasH[2]);
  contexto.lineTo(figurasX[2]+figurasW[2],figurasY[2]);
  contexto.closePath();
  contexto.fill();
}

/*Funcion que redibuja las lineas entre los nodos cuando se 
mueven o se borra el canvas*/
function dibujarConexiones(){
  var nod = 0;
  var l = figs.length; //Obtenemos la cantidad de objetos que hay en el canvas
  var aux = l-1;
  //Verificamos en la cola cuales tienen conexion
  for(aux = l-1; aux >= 0; aux--){
    if(figs[aux].arriba != -1){
      mySel = aux;
      mySel2 = mySel;
      CoodenadasRedimSelect;
      if(figs[aux].arribaRef != -1){
        coorCuadritoAntesX = cuadrosSelectX[1];
        coorCuadritoAntesY = cuadrosSelectY[1];
        mySel = figs[aux].arriba;
        CoodenadasRedimSelect;
        var coordslol = "mySel1 "+mySel+" mySel2 "+mySel2+" en conexiones cuadX1 "
        +coorCuadritoAntesX+" cuadY1 "+coorCuadritoAntesY;
        document.getElementById("demo2").innerHTML = coordslol;
        switch(figs[aux].arribaRef){
          case 1:
            dibujarFlecha("abajo");
            break;
          case 3:
            dibujarFlecha("izquierda");
            break;
          case 4:
            dibujarFlecha("derecha");
            break;
          case 6:
            dibujarFlecha("arriba");
            break;
          default:
            break;
        }
      }
      if(figs[aux].derRef != -1){
        
      }
      if(figs[aux].abajoRef != -1){
        
      }
      if(figs[aux].izqaRef != -1){
        
      }

    }
    if(figs[aux].der != -1){
      if(figs[aux].arribaRef != -1){

      }
      if(figs[aux].derRef != -1){
        
      }
      if(figs[aux].abajoRef != -1){
        
      }
      if(figs[aux].izqaRef != -1){
        
      }
      
    }
    if(figs[aux].abajo != -1){
      if(figs[aux].arribaRef != -1){

      }
      if(figs[aux].derRef != -1){
        
      }
      if(figs[aux].abajoRef != -1){
        
      }
      if(figs[aux].izqaRef != -1){
        
      }
      
    }
    if(figs[aux].izq != -1){
      if(figs[aux].arribaRef != -1){

      }
      if(figs[aux].derRef != -1){
        
      }
      if(figs[aux].abajoRef != -1){
        
      }
      if(figs[aux].izqaRef != -1){
        
      }
      
    }
  }
}

/*var coordsxD = "nom: " + figs[l-1].nombre + " izq, " 
        + figs[l-1].izq+ " der, " 
        + figs[l-1].der+ " arr, " 
        + figs[l-1].arriba+ " aba, " + figs[l-1].abajo
        + " x " + figurasX[l-1]
        + " y " + figurasY[l-1]
        + " w " + figurasW[l-1]
        + " h " + figurasH[l-1]
        + " cuadrito1 "+ mySelCuadro
        + " cuadrito2 "+ mySelCuadro2;
        document.getElementById("demo2").innerHTML = coordsxD;*/

/*Funcion para redibujar el canvas y pueda mover el objeto a donde queremos, 
solo lo hace si la variable que permite el refrescado del canvas esta activa */
function Dibujar(tipo){
  var l = figs.length;
  contexto.lineWidth = 2;
  contexto.font = ""+tamañoFuente+"px Arial";
  switch(tipo){
    case "iniciar":
      if(esNuevo){
        figs.push(new figurasCanvas("inicio",-1,-1,-1,-1,-1,-1,-1,-1, "Inicio"));
        figurasX.push(0);
        figurasY.push(0);
        figurasW.push(100);
        figurasH.push(50);
        contexto.beginPath();
        contexto.ellipse(50, 25, 50, 25, 0, 0, 2 * Math.PI);
        contexto.fillStyle = "#ffffff";
        contexto.fill();
        contexto.strokeStyle = "#000000";
        contexto.stroke();
        contexto.fillStyle = "#000000";
        l = figs.length;
        PonerTexto(tipo, l-1);
      }
      else{
        for(var aux=l-1; aux>=0; aux--){
          if(figs[aux].nombre == "inicio"){
            contexto.beginPath();
            contexto.ellipse(figurasX[aux]+(figurasW[aux]/2), figurasY[aux]+(figurasH[aux]/2), figurasW[aux]/2, figurasH[aux]/2, 0, 0, 2 * Math.PI);
            contexto.fillStyle = figs[aux].figRelleno;
            contexto.fill();
            contexto.strokeStyle = figs[aux].figColor;
            contexto.stroke();
            contexto.fillStyle = "#000000";
            PonerTexto(tipo, aux);
          }
        }
      }
      
      break;
    case "final":
      if(esNuevo){
        figs.push(new figurasCanvas("final",-1,-1,-1,-1,-1,-1,-1,-1, "Fin"));
        figurasX.push(0);
        figurasY.push(0);
        figurasW.push(100);
        figurasH.push(50);
        contexto.beginPath();
        contexto.ellipse(50, 25, 50, 25, 0, 0, 2 * Math.PI);
        contexto.fillStyle = "#ffffff";
        contexto.fill();
        contexto.strokeStyle = "#000000";
        contexto.stroke();
        contexto.fillStyle = "#000000";
        l = figs.length;
        PonerTexto(tipo, l-1);
      }
      else{
        for(var aux=l-1; aux>=0; aux--){
          if(figs[aux].nombre == "final"){
            contexto.beginPath();
            contexto.ellipse(figurasX[aux]+(figurasW[aux]/2), figurasY[aux]+(figurasH[aux]/2), figurasW[aux]/2, figurasH[aux]/2, 0, 0, 2 * Math.PI);
            contexto.fillStyle = figs[aux].figRelleno;
            contexto.fill();
            contexto.strokeStyle = figs[aux].figColor;
            contexto.stroke();
            contexto.fillStyle = "#000000";
            PonerTexto(tipo, aux);
          }
        }
      }

      break;
    case "EntDatos":
      if(esNuevo){
        var Datos = prompt("Introduce el texto", "Entrada de datos");
        figs.push(new figurasCanvas("EntDatos",-1,-1,-1,-1,-1,-1,-1,-1, ""+Datos));
        figurasX.push(0);
        figurasY.push(0);
        figurasW.push(100);
        figurasH.push(75);
        contexto.beginPath();
        contexto.moveTo(0, 0);
        contexto.lineTo(0,60)
        contexto.bezierCurveTo(5, 75, 35, 75, 50, 60);
        contexto.moveTo(50, 60);
        contexto.bezierCurveTo(70, 45, 85, 45, 100, 60);
        contexto.moveTo(100,60);
        contexto.lineTo(100,0);
        contexto.lineTo(0,0);
        contexto.fillStyle = "#ffffff";
        contexto.fill();
        contexto.strokeStyle = "#000000";
        contexto.stroke();
        contexto.fillStyle = "#000000";
        l = figs.length;
        PonerTexto(tipo, l-1);
      }
      else{
        for(var aux=l-1; aux>=0; aux--){
          if(figs[aux].nombre == "EntDatos"){
            contexto.beginPath();
            contexto.moveTo(figurasX[aux], figurasY[aux]);
            contexto.lineTo(figurasX[aux], figurasY[aux]+figurasH[aux]*0.8);
            contexto.bezierCurveTo(figurasX[aux]+figurasW[aux]*0.05, figurasY[aux]+figurasH[aux], 
                                  figurasX[aux]+figurasW[aux]*0.35, figurasY[aux]+figurasH[aux], 
                                  figurasX[aux]+figurasW[aux]/2, figurasY[aux]+figurasH[aux]*0.8);
            contexto.moveTo(figurasX[aux]+figurasW[aux]/2, figurasY[aux]+figurasH[aux]*0.8);
            contexto.bezierCurveTo(figurasX[aux]+figurasW[aux]*0.7, figurasY[aux]+figurasH[aux]*0.6, 
                                  figurasX[aux]+figurasW[aux]*0.85, figurasY[aux]+figurasH[aux]*0.6, 
                                  figurasX[aux]+figurasW[aux], figurasY[aux]+figurasH[aux]*0.8);
            contexto.moveTo(figurasX[aux]+figurasW[aux],figurasY[aux]+figurasH[aux]*0.8);
            contexto.lineTo(figurasX[aux]+figurasW[aux],figurasY[aux]);
            contexto.lineTo(figurasX[aux],figurasY[aux]);
            contexto.fillStyle = figs[aux].figRelleno;
            contexto.fill();
            contexto.strokeStyle = figs[aux].figColor;
            contexto.stroke();
            contexto.fillStyle = "#000000";
            PonerTexto(tipo, aux);
          }
        }
      }

      break;
    case "SalDatos":
      if(esNuevo){
        var Datos = prompt("Introduce el texto", "Salida de datos");
        figs.push(new figurasCanvas("SalDatos",-1,-1,-1,-1,-1,-1,-1,-1, ""+Datos));
        figurasX.push(0);
        figurasY.push(0);
        figurasW.push(100);
        figurasH.push(75);
        contexto.beginPath();
        contexto.moveTo(30,0);
        contexto.lineTo(100,0);
        contexto.lineTo(100,75);
        contexto.lineTo(0,75);
        contexto.lineTo(0,30);
        contexto.lineTo(30,0);
        contexto.fillStyle = "#ffffff";
        contexto.fill();
        contexto.strokeStyle = "#000000";
        contexto.stroke();
        contexto.fillStyle = "#000000";
        l = figs.length;
        PonerTexto(tipo, l-1);
      }
      else{
        for(var aux=l-1; aux>=0; aux--){
          if(figs[aux].nombre == "SalDatos"){
            contexto.beginPath();
            contexto.moveTo(figurasX[aux]+figurasW[aux]*0.3,figurasY[aux]);
            contexto.lineTo(figurasX[aux]+figurasW[aux],figurasY[aux]);
            contexto.lineTo(figurasX[aux]+figurasW[aux],figurasY[aux]+figurasH[aux]);
            contexto.lineTo(figurasX[aux],figurasY[aux]+figurasH[aux]);
            contexto.lineTo(figurasX[aux],figurasY[aux]+figurasH[aux]*0.4);
            contexto.lineTo(figurasX[aux]+figurasW[aux]*0.3,figurasY[aux]);
            contexto.fillStyle = figs[aux].figRelleno;
            contexto.fill();
            contexto.strokeStyle = figs[aux].figColor;
            contexto.stroke();
            contexto.fillStyle = "#000000";
            PonerTexto(tipo, aux);
          }
        }
      }

      break;
    case "Condicional":
      if(esNuevo){
        var Datos = prompt("Introduce el texto", "Condicional");
        figs.push(new figurasCanvas("Condicional",-1,-1,-1,-1,-1,-1,-1,-1,""+Datos));
        figurasX.push(0);
        figurasY.push(0);
        figurasW.push(80);
        figurasH.push(80);
        contexto.beginPath();
        contexto.moveTo(40,0);
        contexto.lineTo(80,40);
        contexto.lineTo(40,80);
        contexto.lineTo(0,40);
        contexto.lineTo(40,0);
        contexto.fillStyle = "#ffffff";
        contexto.fill();
        contexto.strokeStyle = "#000000";
        contexto.stroke();
        contexto.fillStyle = "#000000";
        l = figs.length;
        PonerTexto(tipo, l-1);
      }
      else{
        for(var aux=l-1; aux>=0; aux--){
          if(figs[aux].nombre == "Condicional"){
            contexto.beginPath();
            contexto.moveTo(figurasX[aux]+figurasW[aux]*0.5,figurasY[aux]);
            contexto.lineTo(figurasX[aux]+figurasW[aux],figurasY[aux]+figurasH[aux]*0.5);
            contexto.lineTo(figurasX[aux]+figurasW[aux]*0.5,figurasY[aux]+figurasH[aux]);
            contexto.lineTo(figurasX[aux],figurasY[aux]+figurasH[aux]*0.5);
            contexto.lineTo(figurasX[aux]+figurasW[aux]*0.5,figurasY[aux]);
            contexto.fillStyle = figs[aux].figRelleno;
            contexto.fill();
            contexto.strokeStyle = figs[aux].figColor;
            contexto.stroke();
            contexto.fillStyle = "#000000";
            PonerTexto(tipo, aux);
          }
        }
      }

      break;
    case "Variable":
      if(esNuevo){
        var Datos = prompt("Introduce el texto", "Variable");
        figs.push(new figurasCanvas("Variable",-1,-1,-1,-1,-1,-1,-1,-1, ""+Datos));
        figurasX.push(0);
        figurasY.push(0);
        figurasW.push(100);
        figurasH.push(50);
        contexto.beginPath();
        contexto.fillStyle = "#ffffff";
        contexto.strokeStyle = "#000000";
        contexto.fillRect(0,0,100,10);
        contexto.fillRect(0,10,100,30);
        contexto.fillRect(0,40,100,10);
        contexto.strokeRect(0,0,100,10);
        contexto.strokeRect(0,10,100,30);
        contexto.strokeRect(0,40,100,10);
        contexto.fillStyle = "#000000";
        l = figs.length;
        PonerTexto(tipo, l-1);
      }
      else{
        for(var aux=l-1; aux>=0; aux--){
          if(figs[aux].nombre == "Variable"){
            contexto.beginPath();
            contexto.fillStyle = figs[aux].figRelleno;
            contexto.strokeStyle = figs[aux].figColor;
            contexto.fillRect(figurasX[aux],figurasY[aux],figurasW[aux],figurasH[aux]*0.2);
            contexto.fillRect(figurasX[aux],figurasY[aux]+figurasH[aux]*0.2,figurasW[aux],figurasH[aux]*0.6);
            contexto.fillRect(figurasX[aux],figurasY[aux]+figurasH[aux]*0.8,figurasW[aux],figurasH[aux]*0.2);
            contexto.strokeRect(figurasX[aux],figurasY[aux],figurasW[aux],figurasH[aux]*0.2);
            contexto.strokeRect(figurasX[aux],figurasY[aux]+figurasH[aux]*0.2,figurasW[aux],figurasH[aux]*0.6);
            contexto.strokeRect(figurasX[aux],figurasY[aux]+figurasH[aux]*0.8,figurasW[aux],figurasH[aux]*0.2);
            contexto.fillStyle = "#000000";
            PonerTexto(tipo, aux);
          }
        }
      }
      break;
    case "Asignacion":
      if(esNuevo){
        var Datos = prompt("Introduce el texto", "Asignacion");
        figs.push(new figurasCanvas("Asignacion",-1,-1,-1,-1,-1,-1,-1,-1, ""+Datos));
        figurasX.push(0);
        figurasY.push(0);
        figurasW.push(100);
        figurasH.push(50);
        contexto.beginPath();
        contexto.fillStyle = "#ffffff";
        contexto.strokeStyle = "#000000";
        contexto.fillRect(0,0,100,50);
        contexto.strokeRect(0,0,100,50);
        contexto.fillStyle = "#000000";
        l = figs.length;
        PonerTexto(tipo, l-1);
      }
      else{
        for(var aux=l-1; aux>=0; aux--){
          if(figs[aux].nombre == "Asignacion"){
            contexto.beginPath();
            contexto.fillStyle = figs[aux].figRelleno;
            contexto.strokeStyle = figs[aux].figColor;
            contexto.fillRect(figurasX[aux],figurasY[aux],figurasW[aux],figurasH[aux]);
            contexto.strokeRect(figurasX[aux],figurasY[aux],figurasW[aux],figurasH[aux]);
            contexto.fillStyle = "#000000";
            PonerTexto(tipo, aux);
          }
        }
      }
      break;
    default:
      break;
  }
}

function PonerTexto(tipo,aux){
  var largo;
  switch(tipo){
    case "iniciar":
      contexto.fillText(""+figs[aux].texto, figurasX[aux]+figurasW[aux]*0.30,figurasY[aux]+figurasH[aux]*0.30+tamañoFuente);
      break;
    case "final":
      contexto.fillText(""+figs[aux].texto, figurasX[aux]+figurasW[aux]*0.37,figurasY[aux]+figurasH[aux]*0.30+tamañoFuente);
      break;
    case "EntDatos":
      contexto.textAlign = "left";
      largo = contexto.measureText(figs[aux].texto).width;
      if(largo<figurasW[aux]){
        contexto.fillText(""+figs[aux].texto,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.07+tamañoFuente);
      }
      else{
        var seguro = false;
        var cadena = figs[aux].texto.split(" ");
        var cadPart = "";
        var cadAnt = "";
        var cont = 0;
        var enter = 0;
        while(!seguro){
          cadPart = cadAnt+cadena[cont]+" ";
          if(contexto.measureText(cadPart).width<figurasW[aux]){
            cadAnt = cadPart;
            cont++;
            if(cont>=cadena.length){
              contexto.fillText(cadAnt,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.07+tamañoFuente+enter);
              seguro = true;
            }
          }
          else{
            contexto.fillText(cadAnt,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.07+tamañoFuente+enter);
            cadPart = "";
            cadAnt = "";
            enter += tamañoFuente;
          }
        }
      }
      break;
    case "SalDatos":
      contexto.textAlign = "right";
      largo = contexto.measureText(figs[aux].texto).width;
      if(largo<figurasW[aux]*0.85){
        contexto.fillText(""+figs[aux].texto,figurasX[aux]+figurasW[aux],figurasY[aux]+figurasH[aux]*0.07+tamañoFuente);
      }
      else{
        var seguro = false;
        var cadena = figs[aux].texto.split(" ");
        var cadPart = "";
        var cadAnt = "";
        var cont = 0;
        var enter = 0;
        while(!seguro){
          cadPart = cadAnt+cadena[cont]+" ";
          if(contexto.measureText(cadPart).width<figurasW[aux]*0.85){
            cadAnt = cadPart;
            cont++;
            if(cont>=cadena.length){
              contexto.fillText(cadAnt,figurasX[aux]+figurasW[aux],figurasY[aux]+figurasH[aux]*0.07+tamañoFuente+enter);
              seguro = true;
            }
          }
          else{
            contexto.fillText(cadAnt,figurasX[aux]+figurasW[aux],figurasY[aux]+figurasH[aux]*0.07+tamañoFuente+enter);
            cadPart = "";
            cadAnt = "";
            enter += tamañoFuente;
          }
        }
      }
      break;
    case "Variable":
      contexto.textAlign = "left";
      largo = contexto.measureText(figs[aux].texto).width;
      if(largo<figurasW[aux]){
        contexto.fillText(""+figs[aux].texto,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.22+tamañoFuente);
      }
      else{
        var seguro = false;
        var cadena = figs[aux].texto.split(" ");
        var cadPart = "";
        var cadAnt = "";
        var cont = 0;
        var enter = 0;
        while(!seguro){
          cadPart = cadAnt+cadena[cont]+" ";
          if(contexto.measureText(cadPart).width<figurasW[aux]){
            cadAnt = cadPart;
            cont++;
            if(cont>=cadena.length){
              contexto.fillText(cadAnt,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.22+tamañoFuente+enter);
              seguro = true;
            }
          }
          else{
            contexto.fillText(cadAnt,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.22+tamañoFuente+enter);
            cadPart = "";
            cadAnt = "";
            enter += tamañoFuente;
          }
        }
      }
      break;
    case "Asignacion":
      contexto.textAlign = "left";
      largo = contexto.measureText(figs[aux].texto).width;
      if(largo<figurasW[aux]){
        contexto.fillText(""+figs[aux].texto,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.07+tamañoFuente);
      }
      else{
        var seguro = false;
        var cadena = figs[aux].texto.split(" ");
        var cadPart = "";
        var cadAnt = "";
        var cont = 0;
        var enter = 0;
        while(!seguro){
          cadPart = cadAnt+cadena[cont]+" ";
          if(contexto.measureText(cadPart).width<figurasW[aux]){
            cadAnt = cadPart;
            cont++;
            if(cont>=cadena.length){
              contexto.fillText(cadAnt,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.07+tamañoFuente+enter);
              seguro = true;
            }
          }
          else{
            contexto.fillText(cadAnt,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.07+tamañoFuente+enter);
            cadPart = "";
            cadAnt = "";
            enter += tamañoFuente;
          }
        }
      }
      break;
    case "Condicional":
      contexto.textAlign = "left";
      largo = contexto.measureText(figs[aux].texto).width;
      if(largo<figurasW[aux]){
        contexto.fillText(""+figs[aux].texto,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.35+tamañoFuente);
      }
      else{
        var seguro = false;
        var cadena = figs[aux].texto.split(" ");
        var cadPart = "";
        var cadAnt = "";
        var cont = 0;
        var enter = 0;
        if(cadena.length>1){
          while(!seguro){
            cadPart = cadAnt+cadena[cont]+" ";
            if(contexto.measureText(cadPart).width<figurasW[aux]){
              cadAnt = cadPart;
              cont++;
              if(cont>=cadena.length){
                contexto.fillText(cadAnt,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.35+tamañoFuente+enter);
                seguro = true;
              }
            }
            else{
              contexto.fillText(cadAnt,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.35+tamañoFuente+enter);
              cadPart = "";
              cadAnt = "";
              enter += tamañoFuente;
            }
          }
        }
      }
      break;
    default:
      break;
  }
}

function CambiarColor(){
  if(esSeleccionado){
    var figColor = document.getElementById("cambioColor").value;
    figs[mySel].figColor = figColor;
  }
}

function CambiarRelleno(){
  if(esSeleccionado){
    var figColor = document.getElementById("cambioColor").value;
    figs[mySel].figRelleno = figColor;
  }
}

function BorrarFigura(){
  if(esSeleccionado){
    figs[mySel].nombre = "Borrado";
    figurasX[mySel] = -1;
    figurasY[mySel] = -1;
    figurasH[mySel] = 0;
    figurasW[mySel] = 0;
  }
}

function CambiarTexto(){
  if(esSeleccionado){
    var Datos = prompt("Cambia el texto", "Texto nuevo");
    figs[mySel].texto = ""+Datos;
  }
}

function CambiarFuenteTam(){
  var Datos = prompt("Cambia el tamaño de la fuente", "0");
  tamañoFuente = parseInt(Datos);
}

