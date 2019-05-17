var coordenadaFinal = 0;
var hayInicio = false;

function dibujarRectangulo(ctx,x,y,color,altura){
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 150, altura);
}

function dibujarElipse(ctx,x,y,color){
  ctx.beginPath();
  ctx.ellipse(x, y, 50, 75, Math.PI / 2, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function dibujarRombo(){

}

function dibujarFlecha(ctx,x,y,x1,y1){
   ctx.moveTo(x,y);
   ctx.lineTo(x1,y1);
   ctx.stroke();
}

function dibujarInicio(){
  var canvas = document.getElementById("diaCanvas");
  var ctx = canvas.getContext("2d");
  hayInicio = true;
  dibujarElipse(ctx,800,80,"#FFFFFF");
  dibujarFlecha(ctx,800,130,800,180);
  coordenadaFinal = 180;
}

function dibujarVariable(){
  var canvas = document.getElementById("diaCanvas");
  var ctx = canvas.getContext("2d");
  dibujarRectangulo(ctx,720,coordenadaFinal,"#FF0000",75);
  dibujarRectangulo(ctx,720,coordenadaFinal+10,"#FFFFFF",55);
  dibujarFlecha(ctx,800,coordenadaFinal+75,800,coordenadaFinal+125);
  coordenadaFinal += 125;
}

function dibujarEntradaDatos(){
  var canvas = document.getElementById("diaCanvas");
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.fillStyle = "#FFFFFF";
  ctx.moveTo(720,coordenadaFinal+100);
  ctx.bezierCurveTo(800,coordenadaFinal+180,800,coordenadaFinal+20,870,coordenadaFinal+100);
  ctx.lineTo(870,coordenadaFinal);
  ctx.lineTo(720,coordenadaFinal);
  ctx.lineTo(720,coordenadaFinal+100);
  ctx.fill();
  dibujarFlecha(ctx,800,coordenadaFinal);
}

//Otro intento

function dibujarOvalo(cadena){
  var div = document.createElement("div");
  var div2 = document.createElement("div");
  var span = document.createElement("span");
  var texto = document.createTextNode(cadena);
  span.appendChild(texto);
  div2.setAttribute("class","texto")
  div2.appendChild(span);
  div.setAttribute("class","oval");
  div.setAttribute("id","inicio");
  div.appendChild(div2);
  document.getElementById("canvasDiagrama").appendChild(div);
}

function dibujarVar(cadena){
  var divRectangulo = document.createElement("div");
  var divRectangulo2 = document.createElement("div");
  var divTexto = document.createElement("div");
  var span = document.createElement("span");
  var texto = document.createTextNode(cadena);
  span.appendChild(texto);
  divTexto.setAttribute("class","texto")
  divTexto.appendChild(span);
  divRectangulo2.setAttribute("class","rectangle2");
  divRectangulo2.setAttribute("id","rect2");
  divRectangulo.setAttribute("class","rectangle");
  divRectangulo.setAttribute("id","rect");
  divRectangulo2.appendChild(divTexto);
  divRectangulo.appendChild(divRectangulo2);
  document.getElementById("canvasDiagrama").appendChild(divRectangulo);
}

function dibujarPoligono(cadena){
  var div = document.createElement("div");
  var div2 = document.createElement("div");
  var span = document.createElement("span");
  var texto = document.createTextNode(cadena);
  span.appendChild(texto);
  div2.setAttribute("class","texto")
  div2.appendChild(span);
  div.setAttribute("class","polygon");
  div.setAttribute("id","entrada");
  div.appendChild(div2);
  document.getElementById("canvasDiagrama").appendChild(div);
}

function dibujarCondicional(cadena){
  var div = document.createElement("div");
  var div2 = document.createElement("div");
  var span = document.createElement("span");
  var texto = document.createTextNode(cadena);
  span.appendChild(texto);
  div2.setAttribute("class","texto")
  div2.appendChild(span);
  div.setAttribute("class","diamante");
  div.setAttribute("id","entrada");
  div.appendChild(div2);
  document.getElementById("canvasDiagrama").appendChild(div);
}
