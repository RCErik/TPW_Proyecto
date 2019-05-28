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
var SelectBoxSize = 8;
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
var cuadrosX1 = [];
var cuadrosY1 = [];
var cuadrosX2 = [];
var cuadrosY2 = [];
var esSegundo = false;

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
  canvas.addEventListener("mouseup", Dejar);
  canvas.addEventListener("click", Selecionar);
  canvas.addEventListener("mousedown", obtenerCoordenadas); //Añadimos un listener para cuando seleccionemos algo para mover
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

/*Funcion que toma las coordenadas del objeto seleccionado y pone nuevas
coordenadas a los cuadros de seleccion*/
function CoodenadasRedimSelectConexiones(){
    // 0  1  2
    // 3     4
    // 5  6  7
    if(!esSegundo){
      cuadrosX1[0] = figurasX[mySel];
      cuadrosY1[0] = figurasY[mySel];
      
      cuadrosX1[1] = figurasX[mySel]+figurasW[mySel]/2-mitad;
      cuadrosY1[1] = figurasY[mySel];
      
      cuadrosX1[2] = figurasX[mySel]+figurasW[mySel]-SelectBoxSize;
      cuadrosY1[2] = figurasY[mySel];
      
      cuadrosX1[3] = figurasX[mySel];
      cuadrosY1[3] = figurasY[mySel]+figurasH[mySel]/2-mitad;
      
      cuadrosX1[4] = figurasX[mySel]+figurasW[mySel]-SelectBoxSize;
      cuadrosY1[4] = figurasY[mySel]+figurasH[mySel]/2-mitad;
      
      cuadrosX1[5] = figurasX[mySel];
      cuadrosY1[5] = figurasY[mySel]+figurasH[mySel]-SelectBoxSize;

      cuadrosX1[6] = figurasX[mySel]+figurasW[mySel]/2-mitad;
      cuadrosY1[6] = figurasY[mySel]+figurasH[mySel]-SelectBoxSize;
      
      cuadrosX1[7] = figurasX[mySel]+figurasW[mySel]-SelectBoxSize;
      cuadrosY1[7] = figurasY[mySel]+figurasH[mySel]-SelectBoxSize;
    }
    else{
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
      esSegundo = false;
    }
    
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
    }
    else{
      //Si no selecciono ningun nodo lo indicamos
      esRedimensionar = false;
      esConectar = false;
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
  }
  else if(esSeleccionado2){
    //Si es la segunda seleccion ponemos las caracteristicas de la linea
    contexto.strokeStyle = "#000000";
    contexto.lineWidth = SelectWidth;
    contexto.lineJoin = "round";

    //Ahora guardamos la referencia entre las conexiones, primero del segundo objeto seleccionado
    //solo si es un condicional
    if(figs[mySel].nombre == "Condicional"){
      switch (mySelCuadro) {
        case 1:
        //Si es el nodo de arriba
          figs[mySel].arriba = mySel2;  //A la figura ponemos a que objeto se conecta
          figs[mySel].arribaRef = mySelCuadro2; //Y que nodo es
          break;
        case 3:
        //Si es el nodo de la izquierda
          figs[mySel].izq = mySel2; //A la figura ponemos a que objeto se conecta
          figs[mySel].izqRef = mySelCuadro2;  //Y que nodo es
          break;
        default:
          break;
      }
    }
    //Ahora del primero
    switch (mySelCuadro2) {
      case 1:
      //Si es el nodo de arriba
        figs[mySel2].arriba = mySel;  //A la figura ponemos a que objeto se conecta
        figs[mySel2].arribaRef = mySelCuadro; //Y que nodo es
        dibujarFlecha("abajo");
        break;
      case 4:
      //Si es el nodo de la derecha
        figs[mySel2].der = mySel; //A la figura ponemos a que objeto se conecta
        figs[mySel2].derRef = mySelCuadro;  //Y que nodo es
        dibujarFlecha("izquierda");
        break;
      case 6:
      //Si es el nodo de abajo
        figs[mySel2].abajo = mySel; //A la figura ponemos a que objeto se conecta
        figs[mySel2].abajoRef = mySelCuadro;  //Y que nodo es
        dibujarFlecha("arriba");
        break;
      case 3:
      //Si es el nodo de la izquierda
        figs[mySel2].izq = mySel; //A la figura ponemos a que objeto se conecta
        figs[mySel2].izqRef = mySelCuadro;  //Y que nodo es
        dibujarFlecha("derecha");
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
        switch (mySelCuadro2){
          case 1:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY);
            //Vemos si nuestro dibujo a conectar esta arriba o abajo 
            if(coorCuadritoAntesY-SelectBoxSize>cuadrosSelectY[mySelCuadro]+SelectBoxSize){
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize
                          ,coorCuadritoAntesY-8);
              //Si esta arriba da igual si esta a la derecha o la izquierda, solo nos dirigimos
              //a la coordenada en X y subimos al nodo
              contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                              coorCuadritoAntesY-8);
              contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                              cuadrosSelectY[mySelCuadro]+SelectBoxSize);
            }
            else{
              //Si esta abajo, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY-8);
              contexto.lineTo(figurasX[mySel2]-8,
                              coorCuadritoAntesY-8);
              if(figurasX[mySel2]-8>figurasX[mySel]+figurasW[mySel]){
                contexto.lineTo(figurasX[mySel2]-8,
                                cuadrosSelectY[mySelCuadro]+15);
              }
              else{
                contexto.lineTo(figurasX[mySel2]-8,
                              figurasY[mySel2]+figurasH[mySel2]+8);
                //Por si la figura se atraviesa con la otra seleccion
                contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                figurasY[mySel2]+figurasH[mySel2]+8);
                contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                cuadrosSelectY[mySelCuadro]+15);
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                cuadrosSelectY[mySelCuadro]+15);
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                              cuadrosSelectY[mySelCuadro]+SelectBoxSize);
            }
            break;
          case 3:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX,coorCuadritoAntesY);
            //Vemos si nuestro dibujo a conectar a la izquierda o derecha
            if(coorCuadritoAntesX+(figurasW[mySel2]+8)/2>figurasX[mySel]){
              //Si esta a la izquierda es conexion directa
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX-8,
                              coorCuadritoAntesY);
              //Si esta arriba da igual si esta a la derecha o la izquierda, solo nos dirigimos
              //a la coordenada en X y subimos al nodo
              if(coorCuadritoAntesX-8>figurasX[mySel]+figurasW[mySel]+8){
                contexto.lineTo(coorCuadritoAntesX-8, 
                              cuadrosSelectY[mySelCuadro]+15);
              }
              else{
                if(coorCuadritoAntesY<figurasY[mySel]+figurasH[mySel]){
                  contexto.lineTo(coorCuadritoAntesX-8,
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                  cuadrosSelectY[mySelCuadro]+15);
                } 
                else{
                  if(coorCuadritoAntesX-8<figurasX[mySel]+figurasW[mySel]/2){
                    contexto.lineTo(coorCuadritoAntesX-8,
                                    figurasY[mySel2]-8);
                    contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                    figurasY[mySel2]-8); 
                  }
                  else{
                    contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                    coorCuadritoAntesY);
                  }
                }   
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                              cuadrosSelectY[mySelCuadro]+15);
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                              cuadrosSelectY[mySelCuadro]+SelectBoxSize);
            }
            else{
              //Si esta a la izquierda, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX-8,
                              coorCuadritoAntesY);
              if(figurasY[mySel2]+figurasH[mySel2]>figurasY[mySel]+figurasH[mySel]){
                contexto.lineTo(figurasX[mySel2]-8,
                                figurasY[mySel2]+figurasH[mySel2]+15);
                contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                figurasY[mySel2]+figurasH[mySel2]+15);
              }
              else{
                contexto.lineTo(coorCuadritoAntesX-8,
                                figurasY[mySel2]+figurasH[mySel2]+8);
                //Por si la figura se atraviesa con la otra seleccion
                contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                figurasY[mySel2]+figurasH[mySel2]+8);
                contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                cuadrosSelectY[mySelCuadro]+15);
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                cuadrosSelectY[mySelCuadro]+15);
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                              cuadrosSelectY[mySelCuadro]+SelectBoxSize);
            }
            break;
          case 4:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY);
            //Vemos si nuestro dibujo a conectar a la izquierda o derecha
            if(coorCuadritoAntesX+SelectBoxSize-figurasW[mySel2]/2<figurasX[mySel]){
              //Si esta a la izquierda es conexion directa
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                              coorCuadritoAntesY);
              //Si esta arriba da igual si esta a la derecha o la izquierda, solo nos dirigimos
              //a la coordenada en X y subimos al nodo
              if(coorCuadritoAntesX+SelectBoxSize+8<figurasX[mySel]){
                contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8, 
                              cuadrosSelectY[mySelCuadro]+15);
              }
              else{
                if(coorCuadritoAntesY>figurasY[mySel]+figurasH[mySel]){
                  if(coorCuadritoAntesX+SelectBoxSize+8>figurasX[mySel]&&
                     coorCuadritoAntesX+SelectBoxSize+8<figurasX[mySel]+figurasW[mySel2]/2){
                    contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                    figurasY[mySel2]+8);
                    contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                    figurasY[mySel2]+8); 
                  }
                  else{
                    contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                    figurasY[mySel2]+figurasH[mySel2]+8);
                    contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                    figurasY[mySel2]+figurasH[mySel2]+8);
                    contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                    cuadrosSelectY[mySelCuadro]+15);
                  }
                } 
                else{
                  if(coorCuadritoAntesX+SelectBoxSize+8>figurasX[mySel]-8){
                    contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                    figurasY[mySel2]+figurasH[mySel2]+8);
                    contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                    figurasY[mySel2]+figurasH[mySel2]+8);
                    contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                    cuadrosSelectY[mySelCuadro]+15);
                  }
                  else{
                    contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                    coorCuadritoAntesY);
                  }
                }   
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                              cuadrosSelectY[mySelCuadro]+15);
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                              cuadrosSelectY[mySelCuadro]+SelectBoxSize);
            }
            else{
              //Si esta a la izquierda, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                              coorCuadritoAntesY);
              if(figurasY[mySel2]+figurasH[mySel2]>figurasY[mySel]+figurasH[mySel]){
                contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                figurasY[mySel2]+figurasH[mySel2]+15);
                if(figurasX[mySel2]-8<cuadrosSelectX[mySelCuadro]){
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel2]+figurasH[mySel2]+15);
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel2]-8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                  figurasY[mySel2]-8);
                }
                else{
                  contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                  figurasY[mySel2]+figurasH[mySel2]+15);
                }
                
              }
              else{
                contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                figurasY[mySel2]+figurasH[mySel2]+8);
                //Por si la figura se atraviesa con la otra seleccion
                if(coorCuadritoAntesY<figurasY[mySel]+figurasH[mySel]/2+4&&
                   coorCuadritoAntesX>figurasX[mySel]+figurasW[mySel]+8){
                  contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                  cuadrosSelectY[mySelCuadro]+15);
                }
                else{
                  contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                  cuadrosSelectY[mySelCuadro]+15);
                }
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                cuadrosSelectY[mySelCuadro]+15);
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                              cuadrosSelectY[mySelCuadro]+SelectBoxSize);
            }
            break;
          case 6:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY+SelectBoxSize);
            //Vemos si nuestro dibujo a conectar esta arriba o abajo 
            if(coorCuadritoAntesY+SelectBoxSize>cuadrosSelectY[mySelCuadro]+SelectBoxSize){
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize
                          ,coorCuadritoAntesY+SelectBoxSize+8);
              if(figurasX[mySel2]+figurasW[mySel2]/2>figurasX[mySel]&&
                 figurasX[mySel2]+figurasW[mySel2]/2<figurasX[mySel]+figurasW[mySel]){
                  contexto.lineTo(figurasX[mySel2]-8,
                                  coorCuadritoAntesY+SelectBoxSize+8);
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel2]-8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                  figurasY[mySel2]-8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                                  cuadrosSelectY[mySelCuadro]+SelectBoxSize);
              }
              else{
                //Si esta arriba da igual si esta a la derecha o la izquierda, solo nos dirigimos
                //a la coordenada en X y subimos al nodo
                contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                                coorCuadritoAntesY+SelectBoxSize+8);
                contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                                cuadrosSelectY[mySelCuadro]+SelectBoxSize);
              }
            }
            else{
              //Si esta abajo, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY+SelectBoxSize+8);
              if(coorCuadritoAntesX+SelectBoxSize>figurasX[mySel]+figurasW[mySel]){
                contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                                cuadrosSelectY[mySelCuadro]+15);
              }
              else{
                //Por si la figura se atraviesa con la otra seleccion
                contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                figurasY[mySel2]+figurasH[mySel2]+8);
                contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+8),
                                cuadrosSelectY[mySelCuadro]+15);
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                cuadrosSelectY[mySelCuadro]+15);
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                              cuadrosSelectY[mySelCuadro]+SelectBoxSize);
            }
            break;
          default:
            break;
        }
        contexto.moveTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]+SelectBoxSize);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]+6, cuadrosSelectY[mySelCuadro]+SelectBoxSize+6);
        contexto.moveTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]+SelectBoxSize);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]-6, cuadrosSelectY[mySelCuadro]+SelectBoxSize+6);
        contexto.stroke();  //Dibujamos la linea
       
        break;
      case "derecha":
        contexto.beginPath(); //Empezamos el camino
        switch (mySelCuadro2){
          case 1:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY);
            //Vemos si nuestro dibujo a conectar esta arriba o abajo 
            if(coorCuadritoAntesY-SelectBoxSize>figurasY[mySel]+figurasH[mySel]){
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY-8);
              //Si esta arriba da igual si esta a la derecha o la izquierda, solo nos dirigimos
              //a la coordenada en X y subimos al nodo
              contexto.lineTo(cuadrosSelectX[mySelCuadro]-15, 
                              coorCuadritoAntesY-8);
              contexto.lineTo(cuadrosSelectX[mySelCuadro]-15, 
                              cuadrosSelectY[mySelCuadro]);
            }
            else{
              //Si esta abajo, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY-8);
              if(figurasX[mySel2]-8>figurasX[mySel]+figurasW[mySel]&&
                 figurasY[mySel2]>figurasY[mySel]+figurasH[mySel]+8){
                contexto.lineTo(figurasX[mySel2]-8,
                              coorCuadritoAntesY-8);
                contexto.lineTo(figurasX[mySel2]-8,
                                cuadrosSelectY[mySelCuadro]);
              }
              else{
                if(figurasY[mySel2]-8>figurasY[mySel]+figurasH[mySel]+8){
                  contexto.lineTo(figurasX[mySel2]-8,
                                  coorCuadritoAntesY-8);
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  //Por si la figura se atraviesa con la otra seleccion
                  contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+16),
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+16),
                                  cuadrosSelectY[mySelCuadro]);
                }
                else if(figurasY[mySel2]+figurasH[mySel2]>figurasY[mySel]-8&&figurasY[mySel]-8<figurasY[mySel]+figurasH[mySel]
                  &&figurasX[mySel2]+figurasW[mySel2]<figurasX[mySel]){
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  coorCuadritoAntesY-8);
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  cuadrosSelectY[mySelCuadro]);
                }
                else{
                  contexto.lineTo(figurasX[mySel2]-8,
                                  coorCuadritoAntesY-8);
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel]-8);
                  contexto.lineTo(figurasX[mySel]-15,
                                  figurasY[mySel]-8);
                  contexto.lineTo(figurasX[mySel]-15,
                                  cuadrosSelectY[mySelCuadro]);
                } 
              }
            }
            contexto.lineTo(cuadrosSelectX[mySelCuadro],
                            cuadrosSelectY[mySelCuadro]);
            break;
          case 3:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX,coorCuadritoAntesY);
            //Vemos si nuestro dibujo a conectar a la izquierda o derecha
            if(coorCuadritoAntesX+(figurasW[mySel2]+8)/2>figurasX[mySel]){
              //Si esta a la izquierda es conexion directa
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX-8,
                              coorCuadritoAntesY);
              //Si esta arriba da igual si esta a la derecha o la izquierda, solo nos dirigimos
              //a la coordenada en X y subimos al nodo
              if(coorCuadritoAntesX-8>figurasX[mySel]+figurasW[mySel]+8){
                if(figurasY[mySel2]<figurasY[mySel]+figurasH[mySel]/2){
                  contexto.lineTo(coorCuadritoAntesX-8, 
                                  figurasY[mySel]-15);
                  contexto.lineTo(figurasX[mySel]-15, 
                                  figurasY[mySel]-15);
                  contexto.lineTo(figurasX[mySel]-15, 
                                  cuadrosSelectY[mySelCuadro]);
                }
                else{
                  contexto.lineTo(coorCuadritoAntesX-8, 
                                  figurasY[mySel]+figurasH[mySel]+15);
                  contexto.lineTo(figurasX[mySel]-15, 
                                  figurasY[mySel]+figurasH[mySel]+15);
                  contexto.lineTo(figurasX[mySel]-15, 
                                  cuadrosSelectY[mySelCuadro]);
                }
                
              }
              else{
                if(coorCuadritoAntesY<figurasY[mySel]+figurasH[mySel]){
                  contexto.lineTo(coorCuadritoAntesX-8,
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+15),
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+15),
                                  cuadrosSelectY[mySelCuadro]);
                } 
                else{
                  if(coorCuadritoAntesX-8<figurasX[mySel]+figurasW[mySel]/2){
                    contexto.lineTo(coorCuadritoAntesX-8,
                                    figurasY[mySel2]-8);
                    contexto.lineTo(cuadrosSelectX[mySelCuadro]-15,
                                    figurasY[mySel2]-8); 
                  }
                  else{
                    contexto.lineTo(cuadrosSelectX[mySelCuadro]-15,
                                    coorCuadritoAntesY);
                  }
                }   
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro]-15, 
                              cuadrosSelectY[mySelCuadro]);
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                              cuadrosSelectY[mySelCuadro]);
            }
            else{
              //Si esta a la izquierda, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX-8,
                              coorCuadritoAntesY);
              if(figurasY[mySel2]+figurasH[mySel2]>figurasY[mySel]+figurasH[mySel]){
                if(figurasX[mySel2]+figurasW[mySel2]+8>figurasX[mySel2]){
                  contexto.lineTo(figurasX[mySel2]-8,
                                  cuadrosSelectY[mySelCuadro]);
                }
                else{
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel2]+figurasH[mySel2]+15);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro]-15,
                                  figurasY[mySel2]+figurasH[mySel2]+15);
                }
              }
              else{
                contexto.lineTo(coorCuadritoAntesX-8,
                                figurasY[mySel2]+figurasH[mySel2]+8);
                //Por si la figura se atraviesa con la otra seleccion
                contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+15),
                                figurasY[mySel2]+figurasH[mySel2]+8);
                contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+15),
                                cuadrosSelectY[mySelCuadro]);
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro]-15,
                              cuadrosSelectY[mySelCuadro]);
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                              cuadrosSelectY[mySelCuadro]);
            }
            break;
          case 4:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY);
            //Vemos si nuestro dibujo a conectar a la izquierda o derecha
            if(coorCuadritoAntesX+SelectBoxSize-figurasW[mySel2]/2<figurasX[mySel]){
              //Si esta a la izquierda es conexion directa
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                              coorCuadritoAntesY);
              //Si esta arriba da igual si esta a la derecha o la izquierda, solo nos dirigimos
              //a la coordenada en X y subimos al nodo
              if(coorCuadritoAntesX+SelectBoxSize+15<figurasX[mySel]){
                contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8, 
                              cuadrosSelectY[mySelCuadro]);
              }
              else{
                if(coorCuadritoAntesY>figurasY[mySel]+figurasH[mySel]){
                  if(coorCuadritoAntesX+SelectBoxSize+15>figurasX[mySel]&&
                     coorCuadritoAntesX+SelectBoxSize+15<figurasX[mySel]+figurasW[mySel2]/2){
                    contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                    figurasY[mySel2]-8);
                    contexto.lineTo(cuadrosSelectX[mySelCuadro]-15,
                                    figurasY[mySel2]-8); 
                  }
                  else{
                    contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                    figurasY[mySel2]-8);
                    contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+15),
                                    figurasY[mySel2]-8);
                    contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+15),
                                    cuadrosSelectY[mySelCuadro]);
                  }
                } 
                else{
                  if(coorCuadritoAntesX+SelectBoxSize+8>figurasX[mySel]-8){
                    contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                    figurasY[mySel2]+figurasH[mySel2]+8);
                    contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+15),
                                    figurasY[mySel2]+figurasH[mySel2]+8);
                    contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+15),
                                    cuadrosSelectY[mySelCuadro]);
                  }
                  else{
                    contexto.lineTo(cuadrosSelectX[mySelCuadro]-15,
                                    coorCuadritoAntesY);
                  }
                }   
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro]-15, 
                              cuadrosSelectY[mySelCuadro]);
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                              cuadrosSelectY[mySelCuadro]);
            }
            else{
              //Si esta a la izquierda, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                              coorCuadritoAntesY);
              if(figurasY[mySel2]+figurasH[mySel2]>figurasY[mySel]+figurasH[mySel]){
                contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                figurasY[mySel2]+figurasH[mySel2]+15);
                if(figurasX[mySel2]-8<cuadrosSelectX[mySelCuadro]){
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel2]+figurasH[mySel2]+15);
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel2]-8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro]-15,
                                  figurasY[mySel2]-8);
                }
                else{
                  contexto.lineTo(cuadrosSelectX[mySelCuadro]-15,
                                  figurasY[mySel2]+figurasH[mySel2]+15);
                }
              }
              else{
                //Por si la figura se atraviesa con la otra seleccion
                if(coorCuadritoAntesY<figurasY[mySel]+figurasH[mySel]/2+4&&
                   coorCuadritoAntesX>figurasX[mySel]+figurasW[mySel]+8){
                  if(figurasY[mySel2]+figurasH[mySel2]+8<figurasY[mySel]){
                    contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                    figurasY[mySel2]+figurasH[mySel2]+8);
                    contexto.lineTo(cuadrosSelectX[mySelCuadro]-15,
                                    figurasY[mySel2]+figurasH[mySel2]+8);
                  }
                  else{
                    contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                    figurasY[mySel2]-8);
                    contexto.lineTo(cuadrosSelectX[mySelCuadro]-15,
                                    figurasY[mySel2]-8);
                  }
                  
                }
                else{
                  contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+15),
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+15),
                                  cuadrosSelectY[mySelCuadro]);
                }
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro]-15,
                                cuadrosSelectY[mySelCuadro]);
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                              cuadrosSelectY[mySelCuadro]);
            }
            break;
          case 6:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY+SelectBoxSize);
            //Vemos si nuestro dibujo a conectar esta arriba o abajo 
            if(coorCuadritoAntesY+SelectBoxSize<figurasY[mySel]+figurasH[mySel]){
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY+SelectBoxSize+8);
              if(figurasY[mySel2]+figurasH[mySel2]>figurasY[mySel]-8&&figurasY[mySel]-8<figurasY[mySel]+figurasH[mySel]
                      &&figurasX[mySel2]>figurasX[mySel]+figurasW[mySel]){
                contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                                figurasY[mySel]+figurasH[mySel]+8);
                contexto.lineTo(cuadrosSelectX[mySelCuadro]-15,
                                figurasY[mySel]+figurasH[mySel]+8);
                contexto.lineTo(cuadrosSelectX[mySelCuadro]-15, 
                                cuadrosSelectY[mySelCuadro]);
              }
              else if(figurasY[mySel2]>figurasY[mySel]+figurasH[mySel]){
                contexto.lineTo(cuadrosSelectX[mySelCuadro]-15,
                                coorCuadritoAntesY+SelectBoxSize+8);
                contexto.lineTo(cuadrosSelectX[mySelCuadro]-15, 
                                cuadrosSelectY[mySelCuadro]);
              }
              else{
                //Si esta arriba da igual si esta a la derecha o la izquierda, solo nos dirigimos
                //a la coordenada en X y subimos al nodo
                contexto.lineTo(cuadrosSelectX[mySelCuadro]-15, 
                                coorCuadritoAntesY+SelectBoxSize+8);
                contexto.lineTo(cuadrosSelectX[mySelCuadro]-15, 
                                cuadrosSelectY[mySelCuadro]);
              }
            }
            else{
              //Si esta abajo, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY+SelectBoxSize+8);
              if(figurasX[mySel2]>figurasX[mySel]&&
                 figurasY[mySel2]>figurasY[mySel]+figurasH[mySel]+8){
                contexto.lineTo(cuadrosSelectX[mySelCuadro]-15, 
                                coorCuadritoAntesY+SelectBoxSize+8);
                contexto.lineTo(cuadrosSelectX[mySelCuadro]-15, 
                                cuadrosSelectY[mySelCuadro]);
              }
              else{
                if(figurasY[mySel2]-8>figurasY[mySel]+figurasH[mySel]&&figurasX[mySel2]+figurasW[mySel2]>figurasX[mySel]-8){
                  contexto.lineTo(figurasX[mySel2]-8,
                                  coorCuadritoAntesY+SelectBoxSize+8);
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel2]-8);
                  //Por si la figura se atraviesa con la otra seleccion
                  contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+15),
                                  figurasY[mySel2]-8);
                  contexto.lineTo(figurasX[mySel2]-(figurasX[mySel2]-figurasX[mySel]+15),
                                  cuadrosSelectY[mySelCuadro]);
                }
                else if(figurasY[mySel2]+figurasH[mySel2]>figurasY[mySel]-8&&figurasY[mySel]-8<figurasY[mySel]+figurasH[mySel]
                  &&figurasX[mySel2]+figurasW[mySel2]<figurasX[mySel]){
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  coorCuadritoAntesY+SelectBoxSize+8);
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  cuadrosSelectY[mySelCuadro]);
                }
                else{
                  contexto.lineTo(figurasX[mySel2]-8,
                                  coorCuadritoAntesY+SelectBoxSize+8);
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel]+SelectBoxSize+8);
                  contexto.lineTo(figurasX[mySel]-15,
                                  figurasY[mySel]+SelectBoxSize+8);
                  contexto.lineTo(figurasX[mySel]-15,
                                  cuadrosSelectY[mySelCuadro]);
                } 
              }
            }
            contexto.lineTo(cuadrosSelectX[mySelCuadro],
                            cuadrosSelectY[mySelCuadro]);
            break;
          default:
            break;
        }
      //Si apunta a la derecha
        contexto.moveTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]-6, cuadrosSelectY[mySelCuadro]-6);
        contexto.moveTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]-6, cuadrosSelectY[mySelCuadro]+6);
        contexto.stroke();  //Dibujamos la linea
        break;
      case "abajo":
      //Si apunta abajo
        contexto.beginPath(); //Empezamos el camino
        switch (mySelCuadro2){
          case 1:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY);
            //Vemos si nuestro dibujo a conectar esta arriba o abajo 
            if(coorCuadritoAntesY-SelectBoxSize>figurasY[mySel]){
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY-8);
              if(figurasX[mySel2]+figurasW[mySel2]>figurasX[mySel]&&figurasX[mySel2]<figurasX[mySel]+figurasW[mySel]){
                contexto.lineTo(figurasX[mySel]+figurasW[mySel]+8, 
                                coorCuadritoAntesY-8);
                contexto.lineTo(figurasX[mySel]+figurasW[mySel]+8, 
                                figurasY[mySel]-15);
                contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                                figurasY[mySel]-15);
              }
              else{
                contexto.lineTo(coorCuadritoAntesX+SelectBoxSize, 
                                figurasY[mySel]-15);
                contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                                figurasY[mySel]-15);
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                              cuadrosSelectY[mySelCuadro]);
            }
            else{
              //Si esta abajo, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY-8);
              if(figurasX[mySel2]+figurasW[mySel2]>figurasX[mySel]&&figurasX[mySel2]<figurasX[mySel]+figurasW[mySel]){
                contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8, 
                                coorCuadritoAntesY-8);
                contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8, 
                                figurasY[mySel2]+figurasH[mySel2]+15);
                contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                                figurasY[mySel2]+figurasH[mySel2]+15);
              }
              else{
                contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                                coorCuadritoAntesY-8);
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                              cuadrosSelectY[mySelCuadro]);
            }
            contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize,
                            cuadrosSelectY[mySelCuadro]);
            break;
          case 3:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX,coorCuadritoAntesY);
            //Vemos si nuestro dibujo a conectar a la izquierda o derecha
            if(coorCuadritoAntesX>figurasX[mySel]){
              //Si esta a la izquierda es conexion directa
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX-8,
                              coorCuadritoAntesY);
              //Si esta arriba da igual si esta a la derecha o la izquierda, solo nos dirigimos
              //a la coordenada en X y subimos al nodo
              if(coorCuadritoAntesX-8>figurasX[mySel]+figurasW[mySel]/2+8&&coorCuadritoAntesY-8<figurasY[mySel]-10){
                contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                coorCuadritoAntesY);
              }
              else{
                if(coorCuadritoAntesY-9>figurasY[mySel]-10&&figurasX[mySel2]>figurasX[mySel]+figurasW[mySel]+10){
                  contexto.lineTo(coorCuadritoAntesX-8,
                                  figurasY[mySel]-10);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                  figurasY[mySel]-10);
                } 
                else{
                  contexto.lineTo(coorCuadritoAntesX-8,
                                  figurasY[mySel]+figurasH[mySel]+8);
                  contexto.lineTo(figurasX[mySel]+figurasW[mySel]+8,
                                  figurasY[mySel]+figurasH[mySel]+8);
                  contexto.lineTo(figurasX[mySel]+figurasW[mySel]+8,
                                  cuadrosSelectY[mySelCuadro]-15);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                  cuadrosSelectY[mySelCuadro]-15);
                }   
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                              cuadrosSelectY[mySelCuadro]);
            }
            else{
              //Si esta a la izquierda, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX-8,
                              coorCuadritoAntesY);
              if(figurasY[mySel2]>figurasY[mySel]){
                contexto.lineTo(coorCuadritoAntesX-8,
                                cuadrosSelectY[mySelCuadro]-15);
                contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                cuadrosSelectY[mySelCuadro]-15);
              }
              else{
                contexto.lineTo(coorCuadritoAntesX-8,
                                figurasY[mySel2]+figurasH[mySel2]+8);
                contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                figurasY[mySel2]+figurasH[mySel2]+8);
                contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                figurasY[mySel]-10);
                contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                figurasY[mySel]-10);
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                cuadrosSelectY[mySelCuadro]);
            }
            break;
          case 4:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY);
            //Vemos si nuestro dibujo a conectar a la izquierda o derecha
            if(coorCuadritoAntesX+SelectBoxSize<figurasX[mySel]+figurasW[mySel]/2){
              //Si esta a la izquierda es conexion directa
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                              coorCuadritoAntesY);
              //Si esta arriba da igual si esta a la derecha o la izquierda, solo nos dirigimos
              //a la coordenada en X y subimos al nodo
              if(coorCuadritoAntesX+SelectBoxSize+8<figurasX[mySel]+figurasW[mySel]/2+8&&coorCuadritoAntesY-8<figurasY[mySel]-10){
                contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                coorCuadritoAntesY);
              }
              else{
                if(figurasX[mySel2]+figurasW[mySel2]<figurasX[mySel]-10){
                  contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                  figurasY[mySel]-10);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                  figurasY[mySel]-10);
                } 
                else{
                  contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                  figurasY[mySel2]-8);
                  contexto.lineTo(figurasX[mySel]-8,
                                  figurasY[mySel2]-8);
                  contexto.lineTo(figurasX[mySel]-8,
                                  cuadrosSelectY[mySelCuadro]-15);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                  cuadrosSelectY[mySelCuadro]-15);
                }   
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                              cuadrosSelectY[mySelCuadro]);
            }
            else{
              //Si esta a la izquierda, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                              coorCuadritoAntesY);
              if(figurasY[mySel2]>figurasY[mySel]+figurasH[mySel]+9){
                contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                figurasY[mySel]+figurasH[mySel]+8);
                contexto.lineTo(figurasX[mySel]+figurasW[mySel]+8,
                                figurasY[mySel]+figurasH[mySel]+8);
                contexto.lineTo(figurasX[mySel]+figurasW[mySel]+8,
                                cuadrosSelectY[mySelCuadro]-10);
                contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                cuadrosSelectY[mySelCuadro]-10);
              }
              else{
                if(figurasY[mySel2]+figurasH[mySel2]+10<figurasY[mySel]){
                  contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  figurasY[mySel]-10);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                  figurasY[mySel]-10);
                }
                else{
                  contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                  figurasY[mySel2]-8);
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel2]-8);
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel]-10);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                  figurasY[mySel]-10);
                }
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                                cuadrosSelectY[mySelCuadro]);
            }
            break;
          case 6:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY+SelectBoxSize);
            //Vemos si nuestro dibujo a conectar esta arriba o abajo 
            if(coorCuadritoAntesY-SelectBoxSize>figurasY[mySel]){
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY+SelectBoxSize+8);
              if(figurasX[mySel2]+figurasW[mySel2]<figurasX[mySel]+figurasW[mySel]){
                contexto.lineTo(figurasX[mySel2]-8, 
                                coorCuadritoAntesY+SelectBoxSize+8);
                contexto.lineTo(figurasX[mySel2]-8, 
                                figurasY[mySel]-15);
                contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                                figurasY[mySel]-15);
              }
              else{
                contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8, 
                                coorCuadritoAntesY+SelectBoxSize+8);
                contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8, 
                                figurasY[mySel]-15);
                contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                                figurasY[mySel]-15);
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro], 
                              cuadrosSelectY[mySelCuadro]);
            }
            else{
              //Si esta abajo, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY+SelectBoxSize+8);
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                              coorCuadritoAntesY+SelectBoxSize+8);
              contexto.lineTo(cuadrosSelectX[mySelCuadro],
                              cuadrosSelectY[mySelCuadro]);
            }
            break;
          default:
            break;
        }
        contexto.moveTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]-6, cuadrosSelectY[mySelCuadro]-6);
        contexto.moveTo(cuadrosSelectX[mySelCuadro], cuadrosSelectY[mySelCuadro]);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]+6, cuadrosSelectY[mySelCuadro]-6);
        contexto.stroke();  //Dibujamos la linea
        break;
      case "izquierda":
      //Si apunta a la izquierda
        contexto.beginPath(); //Empezamos el camino
        switch (mySelCuadro2){
          case 1:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY);
            //Vemos si nuestro dibujo a conectar esta arriba o abajo 
            if(coorCuadritoAntesY-SelectBoxSize>figurasY[mySel]+figurasH[mySel]){
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY-8);
              //Si esta arriba da igual si esta a la derecha o la izquierda, solo nos dirigimos
              //a la coordenada en X y subimos al nodo
              contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize+15, 
                              coorCuadritoAntesY-8);
              contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize+15, 
                              cuadrosSelectY[mySelCuadro]);
            }
            else{
              //Si esta abajo, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY-8);
              if(figurasX[mySel2]+8>figurasX[mySel]+figurasW[mySel]){
                contexto.lineTo(figurasX[mySel2]-8,
                              coorCuadritoAntesY-8);
                contexto.lineTo(figurasX[mySel2]-8,
                                cuadrosSelectY[mySelCuadro]);
              }
              else{
                if(figurasX[mySel]+figurasW[mySel]>figurasX[mySel2]-8&&figurasX[mySel]<figurasX[mySel2]+figurasW[mySel2]){
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  coorCuadritoAntesY-8);
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  //Por si la figura se atraviesa con la otra seleccion
                  contexto.lineTo(figurasX[mySel2]+(figurasW[mySel]+figurasX[mySel]-figurasX[mySel2]+15),
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]+(figurasW[mySel]+figurasX[mySel]-figurasX[mySel2]+15),
                                  cuadrosSelectY[mySelCuadro]);
                }
                else{
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  coorCuadritoAntesY-8);
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  figurasY[mySel]-8);
                  contexto.lineTo(figurasX[mySel]+figurasW[mySel]+15,
                                  figurasY[mySel]-8);
                  contexto.lineTo(figurasX[mySel]+figurasW[mySel]+15,
                                  cuadrosSelectY[mySelCuadro]);
                } 
              }
            }
            contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize,
                            cuadrosSelectY[mySelCuadro]);
            break;
          case 3:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX,coorCuadritoAntesY);
            //Vemos si nuestro dibujo a conectar a la izquierda o derecha
            if(coorCuadritoAntesX+(figurasW[mySel2]+8)/2>figurasX[mySel]){
              //Si esta a la izquierda es conexion directa
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX-8,
                              coorCuadritoAntesY);
              //Si esta arriba da igual si esta a la derecha o la izquierda, solo nos dirigimos
              //a la coordenada en X y subimos al nodo
              if(coorCuadritoAntesX-8>figurasX[mySel]+figurasW[mySel]+15){
                contexto.lineTo(coorCuadritoAntesX-8, 
                                cuadrosSelectY[mySelCuadro]);
                contexto.lineTo(cuadrosSelectX[mySelCuadro]+15, 
                                cuadrosSelectY[mySelCuadro]);
              }
              else{
                if(coorCuadritoAntesY<figurasY[mySel]+figurasH[mySel]){
                  contexto.lineTo(coorCuadritoAntesX-8,
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]+(figurasW[mySel]+figurasX[mySel]-figurasX[mySel2]+15),
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]+(figurasW[mySel]+figurasX[mySel]-figurasX[mySel2]+15),
                                  cuadrosSelectY[mySelCuadro]);
                } 
                else{
                  if(coorCuadritoAntesX-8<figurasX[mySel]+figurasW[mySel]){
                    contexto.lineTo(coorCuadritoAntesX-8,
                                    figurasY[mySel2]-8);
                    contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                    figurasY[mySel2]-8);
                    contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                    cuadrosSelectY[mySelCuadro]);  
                  }
                  else{
                    contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                    coorCuadritoAntesY);
                    contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                    cuadrosSelectY[mySelCuadro]);
                  }
                }   
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize, 
                              cuadrosSelectY[mySelCuadro]);
            }
            else{
              //Si esta a la izquierda, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX-8,
                              coorCuadritoAntesY);
              if(figurasY[mySel2]+figurasH[mySel2]>figurasY[mySel]+figurasH[mySel]){
                if(figurasX[mySel2]+figurasW[mySel2]+8>figurasX[mySel]){
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel2]-8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                  figurasY[mySel2]-8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                  cuadrosSelectY[mySelCuadro]);
                }
                else{
                  contexto.lineTo(figurasX[mySel2]-8,
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                  cuadrosSelectY[mySelCuadro]);
                }
              }
              else{
                contexto.lineTo(coorCuadritoAntesX-8,
                                figurasY[mySel2]-8);
                //Por si la figura se atraviesa con la otra seleccion
                contexto.lineTo(figurasX[mySel2]+(figurasW[mySel]+figurasX[mySel]-figurasX[mySel2]+15),
                                 figurasY[mySel2]-8);
                contexto.lineTo(figurasX[mySel2]+(figurasW[mySel]+figurasX[mySel]-figurasX[mySel2]+15),
                                cuadrosSelectY[mySelCuadro]);
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize,
                              cuadrosSelectY[mySelCuadro]);
            }
            break;
          case 4:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY);
            //Vemos si nuestro dibujo a conectar a la izquierda o derecha
            if(coorCuadritoAntesX+SelectBoxSize-figurasW[mySel2]/2<figurasX[mySel]){
              //Si esta a la izquierda es conexion directa
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                              coorCuadritoAntesY);
              //Si esta arriba da igual si esta a la derecha o la izquierda, solo nos dirigimos
              //a la coordenada en X y subimos al nodo
              if(coorCuadritoAntesX+SelectBoxSize+15-figurasW[mySel2]<figurasX[mySel]){
                if(coorCuadritoAntesY>figurasY[mySel]){
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  coorCuadritoAntesY);
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  figurasY[mySel]+figurasH[mySel]+8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro]+15, 
                                  figurasY[mySel]+figurasH[mySel]+8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro]+15, 
                                  cuadrosSelectY[mySelCuadro]);
                }
                else{
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  coorCuadritoAntesY);
                  contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                  figurasY[mySel]-8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro]+15, 
                                  figurasY[mySel]-8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro]+15, 
                                  cuadrosSelectY[mySelCuadro]);
                }

              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize, 
                              cuadrosSelectY[mySelCuadro]);
            }
            else{
              //Si esta a la izquierda, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                              coorCuadritoAntesY);
              if(figurasY[mySel2]>figurasY[mySel]+figurasH[mySel]){
                contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                figurasY[mySel2]-8);
                contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                figurasY[mySel2]-8);
                contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                cuadrosSelectY[mySelCuadro]);
              }
              else{
                //Por si la figura se atraviesa con la otra seleccion
                if(coorCuadritoAntesX>figurasX[mySel]+figurasW[mySel]+8){
                  contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                  cuadrosSelectY[mySelCuadro]);
                }
                else{
                  contexto.lineTo(coorCuadritoAntesX+SelectBoxSize+8,
                                figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]+(figurasW[mySel]+figurasX[mySel]-figurasX[mySel2]+15),
                                  figurasY[mySel2]+figurasH[mySel2]+8);
                  contexto.lineTo(figurasX[mySel2]+(figurasW[mySel]+figurasX[mySel]-figurasX[mySel2]+15),
                                  cuadrosSelectY[mySelCuadro]);
                }
              }
              contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize,
                                cuadrosSelectY[mySelCuadro]);
            }
            break;
          case 6:
            //Nos movemos al nodo inicial
            contexto.moveTo(coorCuadritoAntesX+SelectBoxSize,coorCuadritoAntesY+SelectBoxSize);
            //Vemos si nuestro dibujo a conectar esta arriba o abajo 
            if(coorCuadritoAntesY+SelectBoxSize-8<figurasY[mySel]+figurasH[mySel]){
              //Nos despegamos del cuadro un poco
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY+SelectBoxSize+8);
              if(figurasX[mySel2]>figurasX[mySel]+figurasW[mySel]){
                contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                                cuadrosSelectY[mySelCuadro]);
                contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                cuadrosSelectY[mySelCuadro]);
              }
              else if(figurasX[mySel2]+figurasW[mySel2]<figurasX[mySel]){
                contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                coorCuadritoAntesY+SelectBoxSize+8);
                contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                figurasY[mySel]-8);
                contexto.lineTo(figurasX[mySel]+figurasW[mySel]+15,
                                figurasY[mySel]-8);
                contexto.lineTo(figurasX[mySel]+figurasW[mySel]+15,
                                cuadrosSelectY[mySelCuadro]);
              }
              else{
                contexto.lineTo(figurasX[mySel]+figurasW[mySel]+15,
                                coorCuadritoAntesY+SelectBoxSize+8);
                contexto.lineTo(figurasX[mySel]+figurasW[mySel]+15,
                                cuadrosSelectY[mySelCuadro]);
              }
            }
            else{
              //Si esta abajo, primero nos movemos a un punto en comun
              contexto.lineTo(coorCuadritoAntesX+SelectBoxSize,
                              coorCuadritoAntesY+SelectBoxSize+8);
              if(figurasX[mySel2]<figurasX[mySel]+figurasW[mySel]+15){
                contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                coorCuadritoAntesY+SelectBoxSize+8);
                contexto.lineTo(figurasX[mySel2]+figurasW[mySel2]+8,
                                figurasY[mySel]+figurasH[mySel]+8);
                contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                figurasY[mySel]+figurasH[mySel]+8);
                contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                cuadrosSelectY[mySelCuadro]);
              }
              else{
                contexto.lineTo(figurasX[mySel2]-15,
                                coorCuadritoAntesY+SelectBoxSize+8);
                contexto.lineTo(figurasX[mySel2]-15,
                                cuadrosSelectY[mySelCuadro]);
                contexto.lineTo(cuadrosSelectX[mySelCuadro]+15,
                                cuadrosSelectY[mySelCuadro]);
              }
            }
            contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize,
                            cuadrosSelectY[mySelCuadro]);
            break;
          default:
            break;
        }
        contexto.moveTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize, cuadrosSelectY[mySelCuadro]);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize+6, cuadrosSelectY[mySelCuadro]+6);
        contexto.moveTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize, cuadrosSelectY[mySelCuadro]);
        contexto.lineTo(cuadrosSelectX[mySelCuadro]+SelectBoxSize+6, cuadrosSelectY[mySelCuadro]-6);
        contexto.stroke();  //Dibujamos la linea
        break;
      default:
        break;
    }
}

/*Funcion que redibuja las lineas entre los nodos cuando se 
mueven o se borra el canvas*/
function dibujarConexiones(){
  var nod = 0;
  var l = figs.length; //Obtenemos la cantidad de objetos que hay en el canvas
  var aux = l-1;
  //Verificamos en la cola cuales tienen conexion
  for(aux = l-1; aux >= 0; aux--){
    if(figs[aux].arriba != -1&&figs[aux].nombre != "Condicional"){
      //Si tiene conexion arriba hacia alguna figura
      mySel = aux;  //Asignamos la seleccion
      CoodenadasRedimSelectConexiones();  //Sacamos sus cuadros auxiliares
      mySel2 = mySel; //Lo pasamos al segundo objeto
      //Ponemos las coordenadas de los cuadros auxiliares del primera seleccion
      coorCuadritoAntesX = cuadrosX1[1];
      coorCuadritoAntesY = cuadrosY1[1];
      mySelCuadro = figs[aux].arribaRef;  //Obtenemos al nodo que esta referenciado
      mySel = figs[aux].arriba; //Obtenemos la figura
      mySelCuadro2 = 1; //Sabemos que el nodo es el de arriba del primer seleccionado
      esSegundo = true; //Habilitamos la bandera para poder obtener los cuadros auxiliares del segundo objeto
      CoodenadasRedimSelectConexiones();  //Obtenemos las coordenadas
      //Dibujamos la flecha dependiendo del nodo 2
      switch(figs[aux].arribaRef){
        case 1:
          dibujarFlecha("abajo");
          break;
        case 4:
          dibujarFlecha("izquierda");
          break;
        case 3:
          dibujarFlecha("derecha");
          break;
        case 6:
          dibujarFlecha("arriba");
          break;
        default:
          break;
      }
    }
    if(figs[aux].der != -1){
      //Si tiene conexion hacia la derecha alguna figura
      mySel = aux;  //Asignamos la seleccion
      CoodenadasRedimSelectConexiones();  //Sacamos sus cuadros auxiliares
      mySel2 = mySel; //Lo pasamos al segundo objeto
      //Ponemos las coordenadas de los cuadros auxiliares del primera seleccion
      coorCuadritoAntesX = cuadrosX1[4];
      coorCuadritoAntesY = cuadrosY1[4];
      mySelCuadro = figs[aux].derRef;  //Obtenemos al nodo que esta referenciado
      mySel = figs[aux].der; //Obtenemos la figura
      mySelCuadro2 = 4; //Sabemos que el nodo es el de la derecha del primer seleccionado
      esSegundo = true; //Habilitamos la bandera para poder obtener los cuadros auxiliares del segundo objeto
      CoodenadasRedimSelectConexiones();  //Obtenemos las coordenadas
      //Dibujamos la flecha dependiendo del nodo 2
      switch(figs[aux].derRef){
        case 1:
          dibujarFlecha("abajo");
          break;
        case 4:
          dibujarFlecha("izquierda");
          break;
        case 3:
          dibujarFlecha("derecha");
          break;
        case 6:
          dibujarFlecha("arriba");
          break;
        default:
          break;
      }
    }
    if(figs[aux].abajo != -1){
      //Si tiene conexion hacia abajo alguna figura
      mySel = aux;  //Asignamos la seleccion
      CoodenadasRedimSelectConexiones();  //Sacamos sus cuadros auxiliares
      mySel2 = mySel; //Lo pasamos al segundo objeto
      //Ponemos las coordenadas de los cuadros auxiliares del primera seleccion
      coorCuadritoAntesX = cuadrosX1[6];
      coorCuadritoAntesY = cuadrosY1[6];
      mySelCuadro = figs[aux].abajoRef;  //Obtenemos al nodo que esta referenciado
      mySel = figs[aux].abajo; //Obtenemos la figura
      mySelCuadro2 = 6; //Sabemos que el nodo es el de abajo del primer seleccionado
      esSegundo = true; //Habilitamos la bandera para poder obtener los cuadros auxiliares del segundo objeto
      CoodenadasRedimSelectConexiones();  //Obtenemos las coordenadas
      //Dibujamos la flecha dependiendo del nodo 2
      switch(figs[aux].abajoRef){
        case 1:
          dibujarFlecha("abajo");
          break;
        case 4:
          dibujarFlecha("izquierda");
          break;
        case 3:
          dibujarFlecha("derecha");
          break;
        case 6:
          dibujarFlecha("arriba");
          break;
        default:
          break;
      }
    }
    if(figs[aux].izq != -1&&figs[aux].nombre != "Condicional"){
      //Si tiene conexion hacia la izquierda alguna figura
      mySel = aux;  //Asignamos la seleccion
      CoodenadasRedimSelectConexiones();  //Sacamos sus cuadros auxiliares
      mySel2 = mySel; //Lo pasamos al segundo objeto
      //Ponemos las coordenadas de los cuadros auxiliares del primera seleccion
      coorCuadritoAntesX = cuadrosX1[3];
      coorCuadritoAntesY = cuadrosY1[3];
      mySelCuadro = figs[aux].izqRef;  //Obtenemos al nodo que esta referenciado
      mySel = figs[aux].izq; //Obtenemos la figura
      mySelCuadro2 = 3; //Sabemos que el nodo es el de abajo del primer seleccionado
      esSegundo = true; //Habilitamos la bandera para poder obtener los cuadros auxiliares del segundo objeto
      CoodenadasRedimSelectConexiones();  //Obtenemos las coordenadas
      //Dibujamos la flecha dependiendo del nodo 2
      switch(figs[aux].izqRef){
        case 1:
          dibujarFlecha("abajo");
          break;
        case 4:
          dibujarFlecha("izquierda");
          break;
        case 3:
          dibujarFlecha("derecha");
          break;
        case 6:
          dibujarFlecha("arriba");
          break;
        default:
          break;
      }
    }
  }
  esSeleccionado2 = false;
  esSeleccionado = false;
  mySel = -1;
  mySel2 = -1;
  mySelCuadro = -1;
  mySelCuadro2 = -1;
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

/*Funcion para redibujar el canvas y pueda mover el objeto a donde queremos, 
solo lo hace si la variable que permite el refrescado del canvas esta activa */
function Dibujar(tipo){
  var l = figs.length;
  contexto.lineWidth = 2;
  contexto.font = ""+tamañoFuente+"px Arial";
  switch(tipo){
    case "iniciar":
    //Parte para la figura de inicio
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
    //Parte para la figura de fin
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
    //Parte para la figura de entrada de datos
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
    //Parte para la figura de salida de datos
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
    //Parte para la figura de condicion
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
    //Parte para la figura de variables
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
    //Parte para la figura de asignacion
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

/*Funcion que pone el texto dentro de la figura que manda a llamar
esta funcion, tambien ajusta el texto dentro de los limites de la 
figura.*/
function PonerTexto(tipo,aux){
  var largo;  //Variable para saber el largo del texto en px
  switch(tipo){
    case "iniciar":
      contexto.textAlign = "left";
    //Para la figura iniciar no es necesario verificacion y se pone el texto
      contexto.fillText(""+figs[aux].texto, figurasX[aux]+figurasW[aux]*0.30,figurasY[aux]+figurasH[aux]*0.30+tamañoFuente);
      break;
    case "final":
      contexto.textAlign = "left";
    //Para la figura fin no es necesario verificacion y se pone el texto
      contexto.fillText(""+figs[aux].texto, figurasX[aux]+figurasW[aux]*0.37,figurasY[aux]+figurasH[aux]*0.30+tamañoFuente);
      break;
    case "EntDatos":
      contexto.textAlign = "left";  //Ponemos el texto a la izquieda
      largo = contexto.measureText(figs[aux].texto).width;  //Obtenemos el largo del texto
      if(largo<figurasW[aux]){
        //Si el largo cabe en la figura lo ponemos
        contexto.fillText(""+figs[aux].texto,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.07+tamañoFuente);
      }
      else{
        //En caso de que no, vamos a recortarlo para meterlo
        var seguro = false; //Variable para verificar el ciclo
        var cadena = figs[aux].texto.split(" ");  //Dividimos el texto por espacios
        var cadPart = ""; //Variable para formar la cadena nueva
        var cadAnt = "";  //Variable para respaldar la cadena valida
        var cont = 0; //Contador para movernos en las palabras
        var enter = 0;  //Variable para simular el espacio en Y del Enter
        //Mientras no lleguemos a la ultima palabra
        while(!seguro){
          cadPart = cadAnt+cadena[cont]+" ";  //Ponemos una palabra en la cadena
          //La medimos y la comparamos con el largo de la figura
          if(contexto.measureText(cadPart).width<figurasW[aux]){
            //Si es valida respaldamos la cadena
            cadAnt = cadPart;
            cont++; //Pasamos a la siguiente palabra
            //Si llegamos a la ultima y es valida
            if(cont>=cadena.length){
              //Ponemos la cadena en la figura
              contexto.fillText(cadAnt,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.07+tamañoFuente+enter);
              seguro = true;  //Salimos del ciclo
            }
          }
          else{
            //Si no es valida porque rebasamos, ponemos la cadena de respaldo en la figura 
            contexto.fillText(cadAnt,figurasX[aux]+figurasW[aux]*0.07,figurasY[aux]+figurasH[aux]*0.07+tamañoFuente+enter);
            cadPart = ""; //Limpiamos la cadena
            cadAnt = "";  //Limpiamos el respaldo
            enter += tamañoFuente;  //Bajamos en Y con el tamaño de la fuente
          }
        }
        //Se repite este algoritmo pero con coordenadas diferentes por la figura
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
      contexto.fillText("Si",figurasX[aux]+figurasW[aux]/2-tamañoFuente-10,figurasY[aux]+figurasH[aux]+tamañoFuente+2);
      contexto.fillText("No",figurasX[aux]+figurasW[aux],figurasY[aux]+figurasH[aux]/2-tamañoFuente);
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

/*Funcion que cambia el color del contorno de la figura seleccionada*/
function CambiarColor(){
  if(esSeleccionado){
    var figColor = document.getElementById("cambioColor").value;
    figs[mySel].figColor = figColor;
  }
}

/*Funcion que cambia el color del relleno de la figura seleccionada*/
function CambiarRelleno(){
  if(esSeleccionado){
    var figColor = document.getElementById("cambioColor").value;
    figs[mySel].figRelleno = figColor;
  }
}

/*Funcion que borra la figura seleccionada*/
function BorrarFigura(){
  if(esSeleccionado){
    figs[mySel].nombre = "Borrado";
    figurasX[mySel] = -1;
    figurasY[mySel] = -1;
    figurasH[mySel] = 0;
    figurasW[mySel] = 0;
  }
}

/*Funcion que cambia el texto de la figura seleccionada*/
function CambiarTexto(){
  if(esSeleccionado){
    var Datos = prompt("Cambia el texto", "Texto nuevo");
    figs[mySel].texto = ""+Datos;
  }
}

/*Funcion que cambia el tamaño de la fuente del canvas*/
function CambiarFuenteTam(){
  var Datos = prompt("Cambia el tamaño de la fuente", "0");
  tamañoFuente = parseInt(Datos);
}

function desconectarFigura(){
  if(esSeleccionado){
    figs[mySel].arriba = -1;
    figs[mySel].abajo = -1;
    figs[mySel].der = -1;
    figs[mySel].izq = -1;
    figs[mySel].arribaRef = -1;
    figs[mySel].abajoRef = -1;
    figs[mySel].derRef = -1;
    figs[mySel].izqRef = -1;
  }
}


var ultimoVisitado; //Variable global para controlar cual es el último nodo visitado

//Funcion que retorna el codigo correspondiente a una instruccion de EntDatos
function obtenerCodigoEntrada(texto){
  var codigo;
  codigo = "    printf(''" + texto + "'');";
  return codigo;
}

//Funcion que retorna el codigo correspondiente a una instruccion de SalDatos
function obtenerCodigoSalida(texto){
  var codigo;
  codigo = "    scanf(''" + texto + "'');";
  return codigo;
}

//Funcion que retorna el codigo correspondiente a una instruccion de EntDatos
function obtenerCodigoVariable(texto){
  var codigo;
  codigo = "    " + texto + ";";
  return codigo;
}

//Funcion que retorna el codigo correspondiente a una instruccion de EntDatos
function obtenerCodigoAsignacion(texto){
  var codigo;
  codigo = "    " + texto + ";";
  return codigo;
}

function obtenerInstruccionAux(figuraActual) {
  var instruccion;
  if (figuraActual.nombre == "EntDatos") {
    instruccion = obtenerCodigoEntrada(figuraActual.texto);
  } else if (figuraActual.nombre == "SalDatos") {
    instruccion = obtenerCodigoSalida(figuraActual.texto);
  } else if (figuraActual.nombre == "Variable") {
    instruccion = obtenerCodigoVariable(figuraActual.texto);
  } else if (figuraActual.nombre == "Asignacion") {
    instruccion = obtenerCodigoAsignacion(figuraActual.texto);
  }
  return instruccion;
}

// Esta funcion determina si un bloque condicional pertenece a una sentencia if-else o a un ciclo
function esIfCiclo(figura) {
  var codigo;
  //Revisamos primero las conexiones que deberia tener un if-else (abajo-derecha)
  // Si no es un if entonces revisamos si se trata de la estructura de ciclo comprobando que todas las aristas estan conectadas
  if (figura.abajo != -1 && figura.derecha != -1 && figura.izquierda == -1){
    codigo = obtenerCodigoCondicional(figura);
  } else if (figura.abajo != -1 && figura.derecha != -1 && figura.izquierda != -1) {
    codigo = obtenerCodigoCiclo(figura);
  } else {
    alert("Hay un error con la estructura condicional");
  }
  return codigo;
}

// Funcion que retorna el codigo correspondiente a una estructura ciclica
function obtenerCodigoCiclo(figura){
  //Esta variable almacena la posición en figs dela condicional del ciclo para controlar cuando se vuelve a ella
  var posicionCondicional = figs[figura.arriba].abajo ;
  //Tomamos la parte de inicialización del ciclo
  var inicializacion = figs[figura.arriba].texto;
  //Tomamos la variable de incremento
  var variable;
  var codigo = new Aray();
  //Tomamos la parte de la condicion
  var instruccion;
  var condicion = figura.texto;
  var instruccionInicio = "    for(" + inicializacion + ";" + condicion + ";" + variable +"++){";
  codigo.push(instruccionInicio);
  //Comenzamos a revisar los alcances del ciclo
  figura = figs[figura.abajo];
  while (figura.izquierda != posicionCondicional) {
    instruccion = obtenerInstruccionAux(figura);
    codigo.push(instruccion);
    figura = figs[figura.abajo];
    ultimoVisitado = figura.abajo;
  } if (figura.izquierda == posicionCondicional){
    instruccion = "    }";
    codigo.push(instruccion);
  }
  return codigo;
}

//Funcion que retorna el codigo correspondiente a una instruccion de Condicional
function obtenerCodigoCondicional(figura){
  var codigo = new Array();
  var instruccion;
  var alcances;
  var referencia; //Esta variable nos indica la figura en donde se encuentra la condicional
  var refIf, refElse; //Estas variables nos indican a donde apuntan los "brazos" de la condicional
  var fig1, fig2;
  //Revisamos si las conexiones de if/else (abajo/derecha) estan conectadas a algo
  if (figura.abajo != -1 && figura.derecha != -1 && figura.izquierda == -1){
    //En este caso sabemos que la figura se trata de una condicional de tipo if-else
    instruccion = "    if(" + figura.texto + "){";
    codigo.push(instruccion);
    //Ahora vamos a revisar cuantas instrucciones se albergan dentro del if-else
    //Revisamos primero en la direccion del if
    alcances = obtenerFinRamas(figura);
    //Generamos el código dentro del if
    while(figura.abajo != alcances[0]){
      fig1 = figs[figura.abajo];
      instruccion = "    " + obtenerInstruccionAux(fig1);
      codigo.push(instruccion);
      figura = fig1;
      ultimoVisitado = figura;
    } if (figura.abajo == alcances[0]) {
      fig1 = figs[figura.abajo];
      instruccion = obtenerInstruccionAux(fig1);
      codigo.push(instruccion);
      figura = fig1;
    }
    instruccion = "    }";
    codigo.push(instruccion);
    //Ahora revisamos dentro del else
    instruccion = "    else {";
    codigo.push(instruccion);
    figura = figura.derecha;
    while(figura.abajo != alcances[1]){
      fig1 = figs[figura.abajo];
      instruccion = "    " + obtenerInstruccionAux(fig1);
      codigo.push(instruccion);
      figura = fig1;
    } if (figura.abajo == alcances[1]) {
      fig1 = figs[figura.abajo];
      instruccion = obtenerInstruccionAux(fig1);
      codigo.push(instruccion);
      figura = fig1;
    }
    instruccion = "    }";
    codigo.push(instruccion);
  }
  return codigo;
}

// La siguiente funcion obtiene hasta qué punto llegan las ramas if-else
function obtenerFinRamas(figura){
  var ramaIf, ramaElse;
  var i = 0;
  var apuntadores = new Array(); // Aquí almacenamos dónde apuntan los elementos de las ramas
  var alcances = new Array(); // Aquí retornamos hasta qué elemento se llega como límite por rama
  // alcances[0] = finIf , alcance[1] = finElse
  alcances.push(-1);
  alcances.push(-1);
  //Primero iniciamos el análisis de las ramas
  ramaIf = figura.abajo;
  ramaElse = figura.derecha;
  // LLenamos los apuntadores
  //Primero con los if
  apuntadores.push(ramaIf.abajo);
  ramaIf = figs[ramaIf.abajo];
  apuntadores.push(ramaIf.abajo);
  //Ahora con los else
  apuntadores.push(ramaElse.abajo);
  ramaElse = figs[ramaElse.abajo];
  apuntadores.push(ramaElse.abajo);
  //Ahora comparamos los apuntadores para determinar el alcance de las ramas
  //apuntadores[0,1] => if
  //apuntadores[2,3] => else
  if (apuntadores[i] == apuntadores[i+2]){
    alcances[0] = apuntadores[i];
    alcances[1] = apuntadores[i+2];
  } else if (apuntadores[i] == apuntadores[i+3]) {
    alcances[0] = apuntadores[i];
    alcances[1] = apuntadores[i+3];
  } else if (apuntadores[i+1] == apuntadores[i+2]) {
    alcances[0] = apuntadores[i+1];
    alcances[1] = apuntadores[i+2];
  } else if (apuntadores[i+1] == apuntadores[i+3]) {
    alcances[0] = apuntadores[i+1];
    alcances[1] = apuntadores[i+3];
  }
  return alcances;
}

//Esta funcion obtiene los alcances del if-else de la condicional
function obtenerInstruccionesIfElse(figura) {
  var instrucciones;
  var i = 0, cont = 0;
  var figuraIf, figuraElse;
  while (i < 2){
    cont = 0;
    figuraIf = figs[figura.abajo];
    while (cont < 2) {
      figuraElse = figs[figura.derecha];
      if (figuraElse.abajo == figuraIf.abajo)
        break;
      cont++;
      figura = figuraElse;
    }
    figura = figuraIf;
    i++;
  }
  return instrucciones;
}

//Funcion para traducir el diagrama a codigo
function traducirCodigo() {
  var i, cont = 0;
  var figuraActual;
  var indice;
  var instruccion;
  var instruccionesCondicionales = new Array();
  var codigo = new Array();
  //Revisamos el flujo del diagrama comenzando por el primer elemento del diagrama
  //Buscamos el elemento que tengo nombre de inicio
  for (i = 0; i < figs.length ; i++)
    if (figs[i].nombre == "inicio")
      figuraActual = figs[i];
  //Para la traduccion de codigo lo repetimos hasta que lleguemos al elemento final del diagrama
  while (figuraActual.nombre != "final") {
    //Obtenemos la linea de codigo correspondiente al elemento
    if (figuraActual.nombre == "EntDatos") {
      instruccion = obtenerCodigoEntrada(figuraActual.texto);
      codigo.push(instruccion);
    } else if (figuraActual.nombre == "SalDatos") {
      instruccion = obtenerCodigoSalida(figuraActual.texto);
      codigo.push(instruccion);
    } else if (figuraActual.nombre == "Condicional") {
      instruccionesCondicionales = obtenerCodigoCondicional(figuraActual);
      for (cont = 0 ; cont < instruccionesCondicionales.length ; cont++){
        codigo.push(instruccionesCondicionales[cont]);
      }
      figuraActual = figs[ultimoVisitado];
    } else if (figuraActual.nombre == "Variable") {
      var figuraSiguiente = figs[figuraActual.abajo];
      if (figuraSiguiente.nombre == "Condicional"){
        instruccionesCondicionales = obtenerCodigoCiclo(figuraSiguiente);
        for (cont = 0 ; cont < instruccionesCondicionales.length ; cont++){
          codigo.push(instruccionesCondicionales[cont]);
        }
        figuraActual = figs[ultimoVisitado];
      } else {
        instruccion = obtenerCodigoVariable(figuraActual.texto);
        codigo.push(instruccion);
      }
    } else if (figuraActual.nombre == "Asignacion") {
      instruccion = obtenerCodigoAsignacion(figuraActual.texto);
      codigo.push(instruccion);
    }
    //Leemos la referencia a la que se encuentra conectado el elemento de inicio
    indice = figuraActual.abajo;
    //Avanzamos dentro de la coleccion de figuras al elemento en el indice indicado
    figuraActual = figs[indice];
  }
  textArea = document.getElementById("codCanvas");
  textArea.value = codigo.join("\n");
  //return codigo;
}
