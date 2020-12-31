import React from 'react';
import LjCard from './LjCard';
import { Button } from '@react-md/button';
import Chat from './Chat';
import Deck from './deck';

export class TicTacToeBoard extends React.Component {
    get activePlayer() {
        return this.props.ctx.currentPlayer;
    }

    get playerId() {
        return localStorage.getItem('id');
    }

    get isActivePlayer() {
        return this.playerId == this.activePlayer;
    }

    get visibleCards() {
        const {ctx, G} = this.props;
        const common = G.drawPiles.map((pile) => pile.currentLetter);
        const otherPlayers = Object.keys(G.players)
            .filter((key) => `${key}` !== this.playerId)
            .map((key) => G.players[key].letters[G.players[key].activeLetterIndex]);

        return [Deck.WILD, ...common, ...otherPlayers];
    }

    handleDeselectCard = (card) => () => {
        const {G: clue, moves} = this.props;
        if (clue[clue.length-1].id === card.id) {
            moves.deselectCard(card);
        }
    }

    handleSelectCard = (card) => () => {
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
        const {
            isActivePlayer,
            isNextLetterDisabled,
            handleDeselectCard,
            handleNextLetter,
            handleSelectCard,
            playerId,
            visibleCards,
        } = this;

        return <div style={{display: 'flex'}}>
            <div style={{flex: '3 1 0'}}>
                <div>
                    <div>Visible cards</div>
                    {visibleCards.map((card) => <LjCard onClick={handleSelectCard(card)}>{card.letter}</LjCard>)}
                </div>
                <div>
                    <div>Clue</div>
                    {
                        isActivePlayer && (
                            G.clue.map((card) => <LjCard onClick={handleDeselectCard(card)}>{card.letter}</LjCard>)
                        )
                    }
                    {
                        !isActivePlayer && (
                            G.clue.map((card) => (
                                card.owner == playerId
                                    ? <LjCard>?</LjCard>
                                    : <LjCard>{card.letter}</LjCard>
                            ))
                        )
                    }
                </div>
                <div>
                    <Button
                        id="btn1"
                        theme="primary"
                        themeType="contained"
                        onClick={handleNextLetter}
                        disabled={isNextLetterDisabled}
                    >
                        Next Letter
                    </Button>
                </div>
            </div>
            <Chat {...this.props} />
        </div>;
    }
}
