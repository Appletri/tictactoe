const gameboardObj = (() => {
    const _board = document.querySelector(".gameboard");
    let _gameboard = [];
    const _winningCom = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let computerState = false;
    let computer = 1;

    function toggleComputer() {
        const compR = document.querySelector('.computer-right');
        const humanR = document.querySelector('.human-right');
        
        compR.addEventListener('click', addComputerR);
        humanR.addEventListener('click', addComputerR);
        
        function addComputerR(e){
            compR.classList.remove('selected');
            humanR.classList.remove('selected');
            e.target.classList.add('selected');
            if (compR.className === 'computer-right selected'){
                computer = 1;
                gameplay.computer = 1;
            }
            else {
                computer = 0;
                gameplay.computer = 0;
            }
        }
    }
    toggleComputer();

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
        

        if (_gameboard[e.target.id] === '' && computerState === false){
            computerState = true;
            _gameboard[e.target.id] = mark;
            e.target.classList.remove('indicator');
            gameplay.turn();
            e.target.removeEventListener('click', _play);
            _render();
            
            
            if (computer === 0){
                computerState = false;
                check4win(mark);
            }
            else {
                gameplay.turn();
                check4win(player1.mark);
                computerTurn('right');
                
            }
        }
        
        function computerTurn() {
            let openSpots = _gameboard.filter(spot => spot == '');
            let computerPlay = _gameboard.indexOf('', getRandomInt(openSpots.length));
            const computerTarget = document.getElementById(`${computerPlay}`);



            if (openSpots.length === 0){
                return;
            }
            else if(openSpots.length <= 6){
                minMax();            

            }
            else if (_gameboard[4] === '') {
                _gameboard[4] = player2.mark;
                computerREL(document.getElementById('4'));
            }
            else if (_gameboard[0] === ''){
                _gameboard[0] = player2.mark;
                computerREL(document.getElementById('0'));
                
            }
            else {
                _gameboard[computerPlay] = player2.mark;
                computerREL(computerTarget);
                
            }
            
            
            
            if (check4win(player1.mark) === undefined) {
                setTimeout (() => {
                    _render();
                    check4win(player2.mark)
                    computerState = false;
                }, 500);
                
                
            }



            function minMax () {
               
                let winCom = [];
                let i = 0;
                let bestScore = 0;
                //determine offensive vs defensive
                function determineWinCom(mark, val) {
                    for (i=0; i<_gameboard.length; i++) {
                        if (_gameboard[i] !== '') {
                            continue;
                        }
                        else {
                            const child = [..._gameboard];
                            child[i] = mark;
                            
                            const indexes =  getAllIndexes(child, mark);
                                
                            for (y=0;y<_winningCom.length;y++){
                                if (_winningCom[y].every(elem => indexes.includes(elem)) == true){    
                                    
                                    winCom = _winningCom[y]; 
                                    bestScore += val;
                                }
                            }

                        }    
                    }
                }
                determineWinCom(player1.mark, -1);
                determineWinCom(player2.mark, 1);
                if (bestScore > 0){                    
                    //attack since there is nothing to defend

                    for (x=0; x<winCom.length; x++){
                        if (_gameboard[winCom[x]] === ''){
                            _gameboard[winCom[x]] = player2.mark;
                            const computerTarget = document.getElementById(`${winCom[x]}`);
                            computerREL(computerTarget);
                        }
                        else{
                            console.log ('thinking');
                        }
                    }
                }
                else if (winCom.length === 3)  {
                    for (x=0; x<winCom.length; x++){
                        if (_gameboard[winCom[x]] === ''){
                            _gameboard[winCom[x]] = player2.mark;
                            const computerTarget = document.getElementById(`${winCom[x]}`);
                            computerREL(computerTarget);
                        }
                        else{
                            console.log ('thinking');
                        }
                    }

                }
                else if (_gameboard[4] === '') {
                    console.log('this one');
                    _gameboard[4] = player2.mark;
                    computerREL(document.getElementById('4'));
                }
                else {
                    _gameboard[computerPlay] = player2.mark;
                    computerREL(computerTarget);
                }

            }

            function computerREL(target){
                target.removeEventListener('click', _play);
                setTimeout (()=> {
                    target.classList.remove('indicator');
                }, 500);
            }

            function getRandomInt(max) {
            return Math.floor(Math.random() * (max+1))
            }
        }

        function check4win(mark) {
            const indexes =  getAllIndexes(_gameboard, mark);
            // console.log(indexes);
            if (indexes.length >= 3){               
                for (i=0;i<_winningCom.length;i++){
                    if (_winningCom[i].every(elem => indexes.includes(elem)) == true){
                        winner(_winningCom[i]);
                        return 'winner';
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
            gameplay.getWinner(winner, computer);
            
        };
        function restart (){
            const title = document.querySelector('#title');
            title.textContent = "Tic Tac Toe";
            title.className = '';
            title.removeEventListener('click', restart);
            _gameboard = [];
            _removeSquares();
            _squares(); 
            gameplay.restart(computer); 
            computerState = false;  
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
    const _leftIcon = document.querySelector('.human-left');
    const _rightIconH = document.querySelector('.human-right');
    const _rightIconC = document.querySelector('.computer-right');
    let computer = 1;

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

    const getWinner = (winner, computer) => {
        
        if (winner.name != 'player 1') {
            _p1name.className = 'p-name winner';
            _p2name.className = '';
            _leftIcon.className = ('icon-winner');
            _rightIconC.className = '';
            _rightIconH.className = '';
        }
        else {
            _p2name.className = 'p-name winner';
            _p1name.className = '';
            _leftIcon.className = ('');
            if (computer == 1) {
                _rightIconC.className = ('icon-winner');
            }
            else{
                _rightIconH.className = ('icon-winner');
            }
            
        }  
    }

    const restart = (computer) => {
        
        _p1name.className = 'p-name your-turn';
        _p2name.className = 'p-name';
        _leftIcon.className = ('human-left selected');
        _playerTurn = p1;
        _rightIconC.className = 'computer-right';
        _rightIconH.className = 'human-right';

        if (computer == 1) {
            _rightIconC.classList.add('selected');
        }
        else{
            _rightIconH.classList.add('selected');
        }
        
    }

    const tied = () => {
        _p1name.className = 'p-name';
        _p2name.className = 'p-name';
        _leftIcon.className = '';
        _rightIconC.className = '';
        _rightIconH.className = '';
    }

    return {getTurn, turn, getWinner, restart, tied, computer};
};
const player = (name, mark) => {
    return {name, mark};
};

const player1 = player('player 1','X');
const player2 = player('player 2','O');
const gameplay = displayController(player1,player2);



