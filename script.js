const gameboardObj = (() => {
    const _board = document.querySelector(".gameboard");
    let _gameboard = [];
    const _winningCom = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];


    const _squares = () => {
        for (i=0; i<9; i++){
            _gameboard.push('')
            let square = document.createElement('div');
            square.className = 'square indicator';
            square.id = i;
            _board.appendChild(square);
            square.addEventListener('click', _play);
            square.addEventListener('mouseenter', _applyIndicator);
            square.addEventListener('mouseout', _removeIndicator);
        }
    };

    _squares();
    const _removeSquares = () => {
        for (i=0; i<9; i++){
            const square = document.getElementById(`${i}`);
            _board.removeChild(square);
        }
    };

    function _applyIndicator (e){
        const currentTurn = gameplay.getTurn();
        const mark = currentTurn.mark;
        if (_gameboard[e.target.id] == ''){
            e.target.textContent = mark;
            
        }
        
    };

    function _removeIndicator (e){
        const currentTurn = gameplay.getTurn();
        const mark = currentTurn.mark;
        if (_gameboard[e.target.id] == ''){
            e.target.textContent = '';
            
        }
        
    };
    
    function _play(e) {
        const currentTurn = gameplay.getTurn();
        const mark = currentTurn.mark;
        if (_gameboard[e.target.id] == ''){
            _gameboard[e.target.id] = mark;
            e.target.classList.remove('indicator');
            gameplay.turn();
        }
        
        _render();
        check4win();
        function check4win() {
            const indexes =  getAllIndexes(_gameboard, mark);
            if (indexes.length >= 3){               
                for (i=0;i<_winningCom.length;i++){
                    if (_winningCom[i].every(elem => indexes.includes(elem)) == true){
                        winner(_winningCom[i]);
                        return;
                    }
                    else if (indexes.length == 5){
                        restartButton();
                        gameplay.tied();
                    } 
                } 
            } 
        };
        function getAllIndexes(arr, val) {
            let indexes = [];
            for (i=0; i<9; i++){
                if (val == arr[i]){
                    indexes.push(i)
                }
            };
            return indexes;
        };        
        function winner(arr) {
            restartButton();
            for (i=0;i<3;i++){
                const square = document.getElementById(`${arr[i]}`);
                square.style.color = 'cyan';
            };
            for (i=0;i<9;i++){
                const squares = document.getElementById(`${i}`);
                squares.removeEventListener('click', _play);
                squares.removeEventListener('mouseenter', _applyIndicator);
                squares.removeEventListener('mouseout', _removeIndicator);
            };
            const winner = gameplay.getTurn();
            gameplay.getWinner(winner);
            
        };
        function restart (){
            const title = document.querySelector('#title');
            title.textContent = "Tic Tac Toe";
            title.className = '';
            title.removeEventListener('click', restart);
            _gameboard = [];
            _removeSquares();
            _squares();
            gameplay.restart();   
        }
        function restartButton (){
            const title = document.querySelector('#title');
            title.textContent = "Rematch";
            title.className = 'rematch';
            title.addEventListener('click', restart); 
        } 
    };
    function _render() {
        for(i=0; i<9; i++){
            const square = document.getElementById(`${i}`);
            square.textContent = _gameboard[i]; 
        }
    };
    
})();

const displayController = (p1, p2) => {
    let _playerTurn = p1;
    const _p1name = document.querySelector('#player1');
    const _p2name = document.querySelector('#player2');
    _p1name.classList.add('your-turn');
    _p2name.classList.remove('your-turn');

  
    const getTurn = () => _playerTurn;

    const turn = () => {    
        if (_playerTurn == p1) {
            _playerTurn = p2;
            _p2name.classList.add('your-turn');
            _p1name.classList.remove('your-turn');
        }
        else {
            _playerTurn = p1;
            _p1name.classList.add('your-turn');
            _p2name.classList.remove('your-turn');
        }      

    };

    const getWinner = (winner) => {
        if (winner.name != 'player 1') {
            _p1name.className = 'p-name winner';
            _p2name.className = '';
        }
        else {
            _p2name.className = 'p-name winner';
            _p1name.className = '';
        }  
    }

    const restart = () => {
        _p1name.className = 'p-name your-turn';
        _p2name.className = 'p-name';
        _playerTurn = p1;
    }

    const tied = () => {
        _p1name.className = 'p-name';
        _p2name.className = 'p-name';
    }

    return {getTurn, turn, getWinner, restart, tied};
};
const player = (name, mark) => {
    return {name, mark};
};
const player1 = player('player 1','X');
const player2 = player('player 2','O');
const ai = player('ai','');
const gameplay = displayController(player1,player2);



