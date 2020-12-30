import React from 'react';
import LjCard from './LjCard';

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

  render() {
    const {ctx, G} = this.props;

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
        <LjCard>A</LjCard>
        <LjCard>B</LjCard>
        <LjCard>C</LjCard>
        <LjCard />
        <LjCard>1</LjCard>
        <LjCard>2</LjCard>
        <LjCard>3</LjCard>
        <LjCard>asdfasfjsal</LjCard>
      </div>
    </>;
  }
}
