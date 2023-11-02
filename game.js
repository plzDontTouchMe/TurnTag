import {State, countBlock, ways} from "./state.js"
import {bfs, getInfoBfs} from "./bfs.js"
import {A, getInfoA} from "./A.js"
import {dbfs, getInfoDbfs} from "./dbfs.js";
//tempArray = [0,1,7,8,2,3,6,5,4]
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
    //tempArray = [ 0,1,2,3,5,8,6,4,7 ] //1
    //tempArray = [ 0,1,2,3,8,7,6,5,4 ] //2
    //tempArray = [ 3,4,1,6,8,0,5,2,7 ] //5
    //tempArray = [ 1,3,2,7,4,6,5,0,8 ] //6
    //tempArray = [ 5,7,2,3,4,8,1,0,6 ] //7
    //tempArray = [ 2,1,8,4,7,5,6,3,0 ] //8 dead
    //tempArray = [ 8,3,4,5,6,7,2,1,0 ] //8
    //tempArray = [ 0,6,8,7,5,3,2,1,4 ] //9
    //tempArray = [ 8,7,6,5,4,3,2,1,0 ] //10
    
    //tempArray = [ 0,1,2,3,4,5,6,7,8,9,15,14,12,13,11,10 ]; //2
    //tempArray = [ 4,1,0,3,9,5,2,7,8,6,14,11,12,10,13,15 ]; //4
    for(let i = 0; i < countBlock; i++){
        for(let j = 0; j < countBlock; j++){
            startState.gameField[i][j] = tempArray[i * countBlock + j];
            endState.gameField[i][j] = i * countBlock + j;
            gf.innerHTML += `<div class="item" style="width: ${width}px; height: ${height}px; left: ${0 + j * width + j * 20}px; top: ${0 + i * height + i * 20}px;">${startState.gameField[i][j]}</div>`
        }
    }
}
function changeStatus(status, statusText){
    let text = (
        `${status}
        Количество итераций: ${statusText.countIter}
        Количество максимального размера О: ${statusText.countIterArrayOMax}
        Количество текущего размера О: ${statusText.countIterArrayOCur}
        Максимальное количество узлов: ${statusText.countIterArrayOMax+statusText.countIterArrayCMax}
        Длина пути: ${statusText.lengthWay}`);
    if(statusText.maxState !== undefined){
        let array = "";
        for(let i = 0; i < countBlock; i++){
            for(let j = 0; j < countBlock; j++){
                array += statusText.maxState.gameField[i][j] + ' ';
            }
            if(i == countBlock - 1) break;
            array += '\n\t\t';
        }
        text += (`
        ${statusText.maxState.grade - statusText.maxState.iter}
        ${array}`);
    }
    else{
        
    }
    console.log(text)
}
function start(){
    let r1 = document.getElementById('bfsRadio')
    let r2 = document.getElementById('dbfsRadio')
    let r3 = document.getElementById('A1Radio')
    let r4 = document.getElementById('A2Radio')
    let r5 = document.getElementById('A3Radio')
    if(r1.checked){
        bfs();
        changeStatus('bfs: ', getInfoBfs());
    }
    if(r2.checked){
        dbfs();
        changeStatus('dbfs: ', getInfoDbfs());
    }
    if(r3.checked){
        A(1);
        changeStatus('Манхэттенское расстояние: ', getInfoA());
    }
    if(r4.checked){
        A(2);
        changeStatus('Мощность квадратиков: ', getInfoA());
    }
    if(r5.checked){
        A(3);
        changeStatus('Количество элементов стоящик не на своих позициях: ', getInfoA());
    }
}
function next(){
    if(ways.length != 0){
        if(indexWay < ways.length - 1){
            indexWay++;
            startState.gameField = ways[indexWay]
            drawGameField(startState)
        }
    }
}
function prev(){
    if(ways.length != 0){
        if(indexWay > 0){
            indexWay--;
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