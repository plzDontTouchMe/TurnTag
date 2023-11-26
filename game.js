import {State, countBlock, ways, turnClockwise, turnCounterclockwise, getKey} from "./state.js"
import {bfs, getInfoBfs} from "./bfs.js"
import {A, getInfoA} from "./A.js"
import {dbfs, getInfoDbfs} from "./dbfs.js";
import {iddfs, getInfoIddfs} from "./iddfs.js";
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
function generateStartState(n){
    let tempEndState = new State();
    for(let i = 0; i < countBlock; i++) {
        for (let j = 0; j < countBlock; j++) {
            tempEndState.gameField[i][j] = i * countBlock + j;
        }
    }
    for(let i = 0, indexI = 0, indexJ = 0; i < n;){
        let tempI = Math.floor(Math.random() * (countBlock - 1));
        let tempJ = Math.floor(Math.random() * (countBlock - 1));
        if(tempI !== indexI || tempJ !== indexJ){
            indexI = tempI;
            indexJ = tempJ;
            let chance = Math.floor(Math.random() * 2);
            if(chance === 0){
                tempEndState = turnClockwise(tempEndState, indexI, indexJ);
            }
            else{
                tempEndState = turnCounterclockwise(tempEndState, indexI, indexJ);
            }
            i++;
        }
    }
    let tempArray = []
    for(let i = 0; i < countBlock; i++){
        for(let j = 0; j < countBlock; j++) {
            tempArray.push(tempEndState.gameField[i][j])
        }
    }
    return tempArray;
}
function createGameField(d){
    var gf = document.getElementById("gameField");
    gf.style = `width: ${ sizeField }px; height: ${ sizeField }px;`;
    var tempArray = []
    for(let i = 0; i < countBlock*countBlock; i++){
        tempArray.push(i);
    }
    shuffle(tempArray)
    tempArray = generateStartState(d);
    //tempArray = [5,3,7,0,4,1,6,2,8]
    //tempArray = [ 041375682 ] //1
    //tempArray = [ 0,1,2,3,8,7,6,5,4 ] //2
    //tempArray = [ 3,4,1,6,8,0,5,2,7 ] //5
    //tempArray = [ 1,3,2,7,4,6,5,0,8 ] //6
    //tempArray = [ 5,7,2,3,4,8,1,0,6 ] //7 dead
    //tempArray = [ 2,1,8,4,7,5,6,3,0 ] //8 dead
    //tempArray = [ 8,3,4,5,6,7,2,1,0 ] //8
    //tempArray = [ 0,6,8,7,5,3,2,1,4 ] //9
    //tempArray = [ 8,7,6,5,4,3,2,1,0 ] //10
    //tempArray = [0,1,7,8,2,3,6,5,4]
    //tempArray = [ 0,1,2,3,4,5,6,7,8,9,15,14,12,13,11,10 ]; //2
    //tempArray = [ 4,1,0,3,9,5,2,7,8,6,14,11,12,10,13,15 ]; //4
    for(let i = 0; i < countBlock; i++){
        for(let j = 0; j < countBlock; j++){
            startState.gameField[i][j] = tempArray[i * countBlock + j];
            endState.gameField[i][j] = i * countBlock + j;
            gf.innerHTML += `<div class="item" style="width: ${width}px; height: ${height}px; left: ${0 + j * width + j * 20}px; top: ${0 + i * height + i * 20}px;">${startState.gameField[i][j]}</div>`
        }
    }
    startState.stringField = getKey(startState.gameField);
    endState.stringField = getKey(endState.gameField);
}
function changeStatus(status, statusText){
    let text = (
        `${status}
        Количество итераций: ${statusText.countIter}
        Максимальное количество узлов: ${statusText.N}
        Длина пути: ${statusText.lengthWay}`);
    if(statusText.maxState !== undefined){
        let array = "";
        for(let i = 0; i < countBlock; i++){
            for(let j = 0; j < countBlock; j++){
                array += statusText.maxState.gameField[i][j] + ' ';
            }
            if(i === countBlock - 1) break;
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
    let r3 = document.getElementById('iddfsRadio')
    let r4 = document.getElementById('A1Radio')
    let r5 = document.getElementById('A2Radio')
    let r6 = document.getElementById('A3Radio')
    if(r1.checked){
        bfs();
        changeStatus('bfs: ', getInfoBfs());
    }
    if(r2.checked){
        dbfs();
        changeStatus('dbfs: ', getInfoDbfs());
    }
    if(r3.checked){
        iddfs();
        changeStatus('iddfs: ', getInfoIddfs());
    }
    if(r4.checked){
        A(1);
        changeStatus('Манхэттенское расстояние: ', getInfoA());
    }
    if(r5.checked){
        A(2);
        changeStatus('Мощность квадратиков: ', getInfoA());
    }
    if(r6.checked){
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
let minDiff = 1

function calcNUseB(b,d){
    let sum = 0;
    for(let i=1;i<=d;i++){
        sum += b ** i;
    }
    return sum;
}

function getB(d,n){
    let b=1;
    let move =1;
    let nb = calcNUseB(b,d);
    let isAgain = false;
    while(Math.abs(n-nb) >= minDiff){
        if (n>nb){
            if (!isAgain){
               b += move; 
            } else{
                move /= 2;
                b += move;
            }
        } else {
            move /= 2;
            b -= move;
            isAgain = true;
        }
        nb = calcNUseB(b,d);
    }
    return b;
}
function Avg(){
    let count = 5;
    console.log('Начато')
    for (let d = 6; d<=6;d++){
        let avgBfs = 0, avgDbfs = 0, avgIddfs = 0, avgA1 = 0, avgA2 = 0, avgA3 = 0;
        let avgNBfs = 0, avgNDbfs = 0, avgNIddfs = 0, avgNA1 = 0, avgNA2 = 0, avgNA3 = 0;
        let avgBBfs = 0, avgBDbfs = 0, avgBIddfs = 0, avgBA1 = 0, avgBA2 = 0, avgBA3 = 0;
        for (let z = 0; z< count;z++){
            createGameField(d)
            A(1);
            let x = getInfoA();
            if (x.lengthWay != d){
                z--;
                continue;
            }
            avgA1 += x.countIter;
            avgNA1 += x.N;
            bfs();
            x = getInfoBfs();
            avgBfs += x.countIter;
            avgNBfs += x.N;
            dbfs();
            x = getInfoDbfs();
            avgDbfs += x.countIter;
            avgNDbfs += x.N;
            iddfs();
            x = getInfoIddfs();
            avgIddfs += x.countIter;
            avgNIddfs += x.N;
            A(2);
            x = getInfoA();
            avgA2 += x.countIter;
            avgNA2 += x.N;
            A(3);
            x = getInfoA();
            avgA3 += x.countIter;
            avgNA3 += x.N;
        }
        avgA1 /= count;
        avgBfs /= count;
        avgDbfs /= count;
        avgIddfs /= count;
        avgA2 /= count;
        avgA3 /= count;
        avgNA1 /= count;
        avgNBfs /= count;
        avgNDbfs /= count;
        avgNIddfs /= count;
        avgNA2 /= count;
        avgNA3 /= count;
        avgBBfs = getB(d,avgNBfs);
        avgBDbfs = getB(d,avgNDbfs);
        avgBIddfs = getB(d,avgNIddfs);
        avgBA1 = getB(d,avgNA1);
        avgBA2 = getB(d,avgNA2);
        avgBA3 = getB(d,avgNA3);
        console.log('уровень '+d)
        console.log('Bfs:')
        console.log('Среднее кол-во итераций: '+avgBfs);
        console.log('Среднее кол-во всех узлов: '+avgNBfs);
        console.log('Коэффициент ветвления: '+avgBBfs);
        console.log('Dbfs:')
        console.log('Среднее кол-во итераций: '+avgDbfs);
        console.log('Среднее кол-во всех узлов: '+avgNDbfs);
        console.log('Коэффициент ветвления: '+avgBDbfs);
        console.log('Iddfs:')
        console.log('Среднее кол-во итераций: '+avgIddfs);
        console.log('Среднее кол-во всех узлов: '+avgNIddfs);
        console.log('Коэффициент ветвления: '+avgBIddfs);
        console.log('A1:')
        console.log('Среднее кол-во итераций: '+avgA1);
        console.log('Среднее кол-во всех узлов: '+avgNA1);
        console.log('Коэффициент ветвления: '+avgBA1);
        console.log('A2:')
        console.log('Среднее кол-во итераций: '+avgA2);
        console.log('Среднее кол-во всех узлов: '+avgNA2);
        console.log('Коэффициент ветвления: '+avgBA2);
        console.log('A3:')
        console.log('Среднее кол-во итераций: '+avgA3);
        console.log('Среднее кол-во всех узлов: '+avgNA3);
        console.log('Коэффициент ветвления: '+avgBA3);
    }

}

createGameField()

document.getElementById('buttonStart').onclick = start
document.getElementById('buttonAvg').onclick = Avg
document.getElementById('next').onclick = next
document.getElementById('prev').onclick = prev

export { startState, endState }