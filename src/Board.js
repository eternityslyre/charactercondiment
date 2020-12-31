import React from 'react';
import LjCard from './LjCard';
import { Button } from '@react-md/button';
import Chat from './Chat';
import Deck from './deck';

export class TicTacToeBoard extends React.Component {
    onClick = (id) => () => {
        this.props.moves.clickCell(id);
    }

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
            .filter((key) => `${key}` !== localStorage.getItem('id'))
            .map((key) => G.players[key].letters[G.players[key].activeLetterIndex]);

        return [Deck.WILD, ...common, ...otherPlayers];
    }

    // handleCardClick = () => {

    // }

    handleSelectCard = (card) => () => {
        console.log(card);
        this.props.moves.selectCard(card);
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
        const {ctx, G, playerID} = this.props;
        return G.players[playerID].letters.map((letter, index) => (
            <LjCard isActive={index === G.players[playerID].activeLetterIndex}>{letter}</LjCard>
        ));
    }

    render() {
        const {ctx, G} = this.props;

        return <div style={{display: 'flex'}}>
            <div style={{flex: '3 1 0'}}>
                <div>
                    <div>Visible cards</div>
                    {this.visibleCards.map((card) => <LjCard onClick={this.handleSelectCard(card)}>{card.letter}</LjCard>)}
                </div>
                        <div>
                            <div>Clue</div>
                            {
                                G.clue.map((card) => (
                                    card.owner == localStorage.getItem('id')
                                        ? <LjCard>?</LjCard>
                                        : <LjCard>{card.letter}</LjCard>
                                ))
                            }
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
            </div>
            <Chat {...this.props} />
        </div>;
    }
}
