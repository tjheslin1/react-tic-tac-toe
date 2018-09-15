import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className={props.win ? "square-win" : "square"} onClick={props.onClick }>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i, winner) {
    return winner ?
    <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      win={winner[1].includes(i)}
    /> :
    <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      win={false}
    />
  }

  render() {
    const winner = this.props.winner
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, winner)}
          {this.renderSquare(1, winner)}
          {this.renderSquare(2, winner)}
        </div>
        <div className="board-row">
          {this.renderSquare(3, winner)}
          {this.renderSquare(4, winner)}
          {this.renderSquare(5, winner)}
        </div>
        <div className="board-row">
          {this.renderSquare(6, winner)}
          {this.renderSquare(7, winner)}
          {this.renderSquare(8, winner)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

      const moveDesc = (move === this.state.stepNumber) ?
        <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button> :
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
      return <li key={move}>{moveDesc}</li>
    })

    const status = winner ?
      'Winner: ' + winner[0] + ' with [' + winner[1] + ']' :
      'Next player: ' + (this.state.xIsNext ? 'X' : 'O')

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>

        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
