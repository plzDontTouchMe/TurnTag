import {State, countBlock, ways} from "./state.js"
import { dfs, getInfoDfs } from "./dfs.js"
import {bfs, getInfoBfs} from "./bfs.js"
import {A} from "./A.js"

var startState = new State();
var endState = new State();
var sizeField = 600;
var width = ((sizeField - (2 * countBlock * 10)) / countBlock);
var height = ((sizeField - (2 * countBlock * 10)) / countBlock);
var indexWay = 0;
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
function createGameField(){
    var gf = document.getElementById("gameField");
    gf.style = `width: ${ sizeField }px; height: ${ sizeField }px;`;
    var tempArray = []
    for(let i = 0; i < countBlock*countBlock; i++){
        tempArray.push(i);
    }
    shuffle(tempArray)
    //tempArray = [ 8,4,5,1,3,0,7,6,2 ] //bfs (8;1084) dfp (10;471000)
    //tempArray = [ 5,7,2,3,4,8,1,0,6 ] //bfs (7;516) dfp (13;1055020)
    //tempArray = [ 3,4,1,6,8,0,5,2,7 ]
    tempArray = [ 4,1,0,3,9,5,2,7,8,6,14,11,12,10,13,15 ];
    //tempArray = [ 0,1,2,3,4,5,6,7,8,9,15,14,12,13,11,10 ];
    //tempArray = [5,4,0,3,1,7,8,6,2]
    //tempArray = [3,4,5,6,2,1,0,7,8]
    for(let i = 0; i < countBlock; i++){
        for(let j = 0; j < countBlock; j++){
            startState.gameField[i][j] = tempArray[i * countBlock + j];
            endState.gameField[i][j] = i * countBlock + j;
            gf.innerHTML += `<div class="item" style="width: ${width}px; height: ${height}px; left: ${0 + j * width + j * 20}px; top: ${0 + i * height + i * 20}px;">${startState.gameField[i][j]}</div>`
        }
    }
}
function changeStatus(status, statusText){
    let statusWindowEl = document.getElementById("statusWindow");
    statusWindowEl.classList.add("show")
    document.getElementById("status").innerHTML = `${status}`;
    document.getElementById("statusText").innerHTML = `Количество итераций: ${statusText.countIter}\nКоличество максимального размера О: ${statusText.countIterArrayOMax}\nКоличество текущего размера О: ${statusText.countIterArrayOCur}\nМаксимальное количество узлов: ${statusText.countIterArrayOMax+statusText.countIterArrayCMax}\n`;
    setTimeout(() => statusWindowEl.classList.remove("show"), 20000)
}
function start(){
    let r1 = document.getElementById('ARadio')
    if(r1.checked){
        A();
    }
}
function next(){
    if(ways.length != 0){
        if(indexWay < ways.length - 1){
            indexWay++;
            //console.log(indexWay)
            console.log(ways)
            //console.log(ways[indexWay])
            startState.gameField = ways[indexWay]
            drawGameField(startState)
        }
    }
}
function prev(){
    if(ways.length != 0){
        if(indexWay > 0){
            indexWay--;
            //console.log(indexWay)
            console.log(ways)
            //console.log(ways[indexWay])
            startState.gameField = ways[indexWay]
            drawGameField(startState)
        }
    }
}
export function drawGameField(state){
    var gf = document.getElementById("gameField");
    gf.innerHTML = "";
    for(let i = 0; i < countBlock; i++){
        for(let j = 0; j < countBlock; j++){
            gf.innerHTML += `<div class="item" style="width: ${width}px; height: ${height}px; left: ${0 + j * width + j * 20}px; top: ${0 + i * height + i * 20}px;">${startState.gameField[i][j]}</div>`
        }
    }
}

createGameField()

document.getElementById('buttonStart').onclick = start
document.getElementById('next').onclick = next
document.getElementById('prev').onclick = prev

export { startState, endState }