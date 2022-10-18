class Game {
    constructor(p1, p2, height = 6, width = 7) {
      this.height = height;
      this.width = width;
      this.players = [p1, p2];
      this.currPlayer = p1;
      this.board = [];

      this.handleClick = this.handleClick.bind(this);

      this.makeBoard();
      this.makeHtmlBoard();

    }
  
    makeBoard() {
      for (let y = 0; y < this.height; y++) {
        this.board.push(Array.from({ length: this.width }));
      }
    }
  
    makeHtmlBoard() {
      const htmlboard = document.getElementById('board');
    
      // make column tops (clickable area for adding a piece to that column)
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');
      top.addEventListener('click', this.handleClick);
  
      for (let x = 0; x < this.width; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }
  
      htmlboard.append(top);
    
      // make main part of board
      for (let y = 0; y < this.height; y++) {
        const row = document.createElement('tr');
        for (let x = 0; x < this.width; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }
        htmlboard.append(row);
      }
    }
  
    findSpotForCol(x) {
      for (let y = this.height - 1; y >= 0; y--) {
        if (!this.board[y][x]) {
          return y;
        }
      }
      return null;
    }
  
    placeInTable(y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.backgroundColor = this.currPlayer.color;
      piece.style.top = -50 * (y + 2);
    
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
      spot.style.borderRadius = "50%"
    }
  
    endGame(msg) {
      alert(msg);
      const head = document.getElementById("column-top");
      head.removeEventListener("click", this.handleClick)
    }
  
    handleClick(evt) {
      // get x from ID of clicked cell
      const x = +evt.target.id;
    
      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
    
      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);
      
      // check for win
      if (this.checkForWin()) {
        return this.endGame(`${this.currPlayer.color} Player Won!`);
      }
      
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Game Tied!');
      }
        
      // switch players
      this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
      
    }
  
    checkForWin() {
      const _win = (cells) => {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer
    
        return cells.every(
          ([y, x]) =>
            (y >= 0) &&
            (y < this.height) &&
            (x >= 0) &&
            (x < this.width) &&
            this.board[y][x] === this.currPlayer
        );
      }
    
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          // get "check list" of 4 cells (starting here) for each of the different
          // ways to win
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

          // find winner (only checking each win-possibility as needed)
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            return true;
          }
        }
      }
    }
  }

  class Player {
    constructor(color) {
      this.color = color;
    }
  }
  
  
  const start = document.getElementById("start");
  start.addEventListener("click", () => {
    const p1 = new Player(document.querySelector("#p1").value);
    const p2 = new Player(document.querySelector("#p2").value);
    const board = document.getElementById("board");
    board.innerHTML = "";
    new Game(p1, p2);
    start.innerText = "Restart";
  })