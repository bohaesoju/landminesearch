const tbody = document.querySelector('#table tbody');
let dataset = [];
let stopFlag = false;
let openedCell = 0;
let result = document.querySelector('#result');
const hor = parseInt(document.querySelector('#hor').value);
const ver = parseInt(document.querySelector('#ver').value);
const mine = parseInt(document.querySelector('#mine').value);
const dataList = {
    openCell : -1,
    questionMark : -2,
    flag : -3,
    flagMine : -4,
    questionMine : -5,
    mine : 1,
    normalCell : 0
}

document.querySelector('#exec').addEventListener('click', function(){
    //내부 초기화 함수
    init();
    
    //지뢰 위치 뽑기
    const candidate = Array(hor * ver).fill().map(function(e, i){
        return i;
    }); 
    const shupple = [];
    while(candidate.length > hor * ver - mine){
        let movementValue = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shupple.push(movementValue)
    }   

    //지뢰 테이블 만들기
    for (let i = 0; i < ver; i+= 1){
        const arr = [];
        dataset.push(arr)
        const tr = document.createElement('tr');
        for(let j = 0; j < hor; j += 1){
            arr.push(dataList.normalCell)
            const td = document.createElement('td');
            td.addEventListener('contextmenu', (e) => {
                e.preventDefault();

                if(stopFlag){
                    return;
                }

                let parentTr = e.currentTarget.parentNode;
                let parentTbody = e.currentTarget.parentNode.parentNode;
                let cell = Array.prototype.indexOf.call(parentTr.children, e.currentTarget);
                let line = Array.prototype.indexOf.call(parentTbody.children, parentTr);
                if(e.currentTarget.textContent === '' || e.currentTarget.textContent === 'X'){
                    e.currentTarget.textContent = '!';
                    e.currentTarget.classList.add('flag');
                    if(dataset[line][cell] === dataList.mine){
                        dataset[line][cell] = dataList.flagMine;
                    } else {
                        dataset[line][cell] = dataList.flag;
                    }
                } else if (e.currentTarget.textContent === '!'){
                    e.currentTarget.textContent = '?';
                    e.currentTarget.textContent = '?';
                    e.currentTarget.classList.remove('flag');
                    e.currentTarget.classList.add('question');
                    if(dataset[line][cell] === dataList.flagMine){
                        dataset[line][cell] = dataList.questionMine;
                    } else {
                        dataset[line][cell] = dataList.questionMark;
                    }
                } else if(e.currentTarget.textContent === '?'){
                    e.currentTarget.classList.remove('question');
                    if(dataset[line][cell] === dataList.questionMine){
                        e.currentTarget.textContent = 'X';
                        dataset[line][cell] = dataList.mine;
                    } else {
                        e.currentTarget.textContent = '';
                        dataset[line][cell] = dataList.normalCell;
                    }
                }
            });
            td.addEventListener('click', (e) => {
                if(stopFlag){
                    return;
                }
                let parentTr = e.currentTarget.parentNode;
                let parentTbody = e.currentTarget.parentNode.parentNode;
                let cell = Array.prototype.indexOf.call(parentTr.children, e.currentTarget);
                let line = Array.prototype.indexOf.call(parentTbody.children, parentTr);
                if([dataList.openCell, dataList.flag, dataList.flagMine, dataList.questionMine, dataList.questionMark].includes(dataset[line][cell])){
                    return;
                }
                //클릭했을때
                e.currentTarget.classList.add('opened');
                openedCell += 1;
                if(dataset[line][cell] === dataList.mine){ //지뢰클릭
                    e.currentTarget.textContent = '펑';
                    result.textContent = '실패 ㅜㅜ';
                    stopFlag = true;
                } else { //지뢰가 아닌 경우 주변 지뢰 개수
                    let side = [
                        dataset[line][cell-1], dataset[line][cell + 1]
                    ];
                    if(dataset[line - 1]) {
                        side = side.concat([dataset[line - 1][cell - 1], dataset[line-1][cell], dataset[line-1][cell+1]])
                    }
                    if(dataset[line + 1]){
                        side = side.concat(dataset[line+1][cell-1], dataset[line+1][cell], dataset[line+1][cell+1])
                    }
                    let sideCount = side.filter((v) => {
                        return v === dataList.mine 
                    }).length;

                    e.currentTarget .textContent = sideCount || '';
                    dataset[line][cell] = dataList.openCell;
                    if(sideCount === 0){
                        let sideCell = [];
                        if(tbody.children[line - 1]){
                            sideCell = sideCell.concat([
                                tbody.children[line - 1].children[cell - 1],
                                tbody.children[line - 1].children[cell],
                                tbody.children[line - 1].children[cell + 1]
                            ]);
                        }
                        sideCell = sideCell.concat([
                            tbody.children[line].children[cell - 1],
                            tbody.children[line].children[cell + 1]
                        ]);

                        if(tbody.children[line + 1]){
                            sideCell = sideCell.concat([
                                tbody.children[line + 1].children[cell - 1],
                                tbody.children[line + 1].children[cell],
                                tbody.children[line + 1].children[cell + 1]
                            ]);
                        }
                        sideCell.filter(function(v){
                            return !!v;
                        }).forEach(function(nextCell){
                            const parentTr = nextCell.parentNode;
                            const parentTbody = nextCell.parentNode.parentNode;
                            const nextCellCell = Array.prototype.indexOf.call(parentTr.children, nextCell);
                            const nextCellLine = Array.prototype.indexOf.call(parentTbody.children, parentTr);
                            if(dataset[nextCellLine][nextCellCell] !== dataList.openCell){
                                nextCell.click();
                            }
                        })
                    }
                    if(openedCell === hor * ver - mine){
                        stopFlag = true;
                        result.textContent = '승리 ^^'
                    }
                }
            });
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    //지뢰 심기
    for(let k = 0; k < shupple.length; k += 1){
        let vertical = Math.floor(shupple[k] / ver);
        let horizontal = shupple[k] % ver;
        tbody.children[vertical].children[horizontal].textContent = 'X';
        dataset[vertical][horizontal] = dataList.mine;
    }
});

//초기화 함수
const init = () => {
    tbody.innerHTML = '';
    dataset = [];
    result.textContent = '';
    stopFlag = false;
    openedCell = 0
}