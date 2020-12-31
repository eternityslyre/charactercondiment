import React from 'react';
import LjCard from './LjCard';
import { Button } from '@react-md/button';

export class TicTacToeBoard extends React.Component {
  onClick = (id) => () => {
    this.props.moves.clickCell(id);
  }

  cellStyle = {
    border: '1px solid #555',
    width: '50px',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center',
  };

  get gameOverText() {
    const {winner} = this.props.ctx.gameover;
    return winner !== undefined
      ? `Winner: ${winner}`
      : `Draw!`;
  }

  get visibleCards() {
    const {ctx, G} = this.props;
    const common = G.drawPiles.map((pile) => pile.currentLetter);
    const otherPlayers = Object.keys(G.players)
      .filter((key) => `${key}` !== ctx.currentPlayer)
      .map((key) => G.players[key].letters[G.players[key].activeLetterIndex]);

    return [...common, ...otherPlayers];
  }

  handleNextLetter = () => {
    this.props.moves.nextLetter(this.props.ctx.currentPlayer);
  }

  // TODO
  get isNextLetterDisabled() {
    const {ctx, G} = this.props;
    // G.players[ctx.currentPlayer].letters.length;
    return false;
  }

  get activePlayerCards() {
    const {G, playerID} = this.props;
    return G.players[playerID].letters.map((letter, index) => <LjCard isActive={index === G.players[playerID].activeLetterIndex}>{letter}</LjCard>);
  }

  render() {
    const {ctx, G, moves: {clickCard}, playerID} = this.props;

    // Show only the current player's board view
    if (playerID !== ctx.currentPlayer) {
      return <></>;
    }

    let tbody = [];
    for (let i = 0; i < 3; i++) {
      let cells = [];
      for (let j = 0; j < 3; j++) {
        const id = 3 * i + j;
        cells.push(
          <td style={this.cellStyle} key={id} onClick={this.onClick(id)}>
            {G.cells[id]}
          </td>
        );
      }
      tbody.push(<tr key={i}>{cells}</tr>);
    }

    return <>
      <div>
        <table id="board">
          <tbody>{tbody}</tbody>
        </table>
        {ctx.gameover && <div id="winner">{this.gameOverText}</div>}
      </div>
      <div>
        <div>Visible cards</div>
        {this.visibleCards.map((letter) => <LjCard>{letter}</LjCard>)}
      </div>
      <div>
        <Button
          id="btn1"
          theme="primary"
          themeType="contained"
          onClick={this.handleNextLetter}
          disabled={this.isNextLetterDisabled}
        >
          Next Letter
        </Button>
      </div>
    </>;
  }
}
