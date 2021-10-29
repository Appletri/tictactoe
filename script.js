const gameboardObj = (() => {
    const _board = document.querySelector(".gameboard");
    const _gameboard = [];
    
    const _squares = (() => {
        for (i=0; i<9; i++){
            _gameboard.push('')
            let square = document.createElement('div');
            square.className = 'square';
            square.id = i;
            _board.appendChild(square);
            square.addEventListener('click', _play);
        }
    })();


    function _play(e) {
        let currentTurn = gameplay.getTurn();
        gameplay.turn();
        _gameboard[e.target.id] = currentTurn.mark;
        console.log(_gameboard);
        _render();
    };

    function _render() {
        for(i=0; i<9; i++){
            const square = document.getElementById(`${i}`);
            square.textContent = _gameboard[i]; 
        }
    }

})();



const displayController = (p1, p2) => {
    let _playerTurn = p2;
    const getTurn = () => _playerTurn;

    const turn = () => {
        
        if (_playerTurn == p1) {
            console.log (`${p1.name} turn`);
            _playerTurn = p2;
        }
        else {
            console.log (`${p2.name} turn`);
            _playerTurn = p1;
        }
    };

    return {getTurn, turn};

};



const player = (name, mark) => {

    return {name, mark};

};

const player1 = player('player 1','X');
const player2 = player('player 2','O');
const gameplay = displayController(player1,player2);
