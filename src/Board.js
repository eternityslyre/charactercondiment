import React, { Component } from 'react';
import LjCard from './LjCard';
import { Button } from '@react-md/button';
import ReactCardFlip from 'react-card-flip';
import Chat from './Chat';
import Deck from './deck';
import ClueSheet from './ClueSheet';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import _isFinite from 'lodash/isFinite';

const SortableItem = SortableElement(({value}) => (
    <li style={{display:"inline-block"}}><Card text={value}/></li>
    //<li style={{display:"inline"}} tabIndex={0}>{value}</li>
));

const SortableList = SortableContainer(({items}) => {
    return (
        <ul style={{display:"inline-block"}}>
            {items.map((value, index) => (
                <SortableItem key={`item-${value}`} index={index} value={value} />
            ))}
        </ul>
    );
});

class SortableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: ['A', 'B', 'C', 'D', 'E'],
        };
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };

    render() {
        return <SortableList axis="x" items={this.state.items} onSortEnd={this.onSortEnd} />;
    }
}

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

    get cardDisplays() {
        const {ctx, G} = this.props;

        const common = G.drawPiles.map((pile) => <CardDisplay
                card={pile.currentLetter}
                onClick={this.handleSelectCard(pile.currentLetter)}
                player={{name: 'Extra'}}
                playerInfo={{activeLetterIndex: -1, letters: []}}
            />
        );

        const otherPlayers = Object.keys(G.players)
            .filter((key) => `${key}` !== this.playerId)
            .map((key) => {
                let card = G.players[key].letters[G.players[key].activeLetterIndex];
                return <CardDisplay
                    card={card}
                    onClick={this.handleSelectCard(card)}
                    player={{name: key}}
                    playerInfo={this.getPlayerInfo(key)}
                />;
            });

        const wild = <CardDisplay
            card={Deck.WILD}
            onClick={this.handleSelectCard(Deck.WILD)}
            player={{name: 'Extra'}}
            playerInfo={{activeLetterIndex: -1, letters: []}}
        />;

        return [wild, ...common, ...otherPlayers];
    }

    handleDeselectCard = (card) => () => {
        const {G: {clue}, moves} = this.props;
        if (clue[clue.length-1].id === card.id) {
            moves.deselectCard(card);
        }
    }

    handlePass = () => this.props.moves.pass();

    handleSelectCard = (card) => () => this.props.moves.selectCard(card);

    handleNextLetter = () => this.props.moves.nextLetter(this.props.ctx.currentPlayer);

    submitClue = () => this.props.moves.submitClue(this.playerId);

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

    getPlayerInfo = (playerId) => {
        const {players} = this.props.G;

        return playerId >= players.length || !players[playerId]
            ? {
                activeLetterIndex: -1,
                letters: [],
            }
            : players[playerId];
    }

    render() {
        const {ctx, G} = this.props;
        const {
            isActivePlayer,
            isNextLetterDisabled,
            handleDeselectCard,
            handleNextLetter,
            handlePass,
            playerId,
            submitClue,
        } = this;

        return <div style={{display: 'flex'}}>
            <div style={{flex: '3 1 0'}}>
                <div>
                    <div>Visible cards</div>
                    <div style={{display: 'flex'}}>
                        {this.cardDisplays}
                    </div>
                </div>
                <div>
                    <div>Your cards</div>
                    <SortableComponent />
                </div>
                <div>
                    <div>Clue</div>
                    <div>{isActivePlayer && `You're up!`}</div>
                    <div>{!isActivePlayer && `Waiting for player ${this.activePlayer}`}</div>
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
                    <Button id="btn-clue-submit" theme="primary" themeType="contained" onClick={submitClue}>Submit Clue</Button>
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
                <div>
                    <Button
                        id="btn-pass"
                        theme="primary"
                        themeType="contained"
                        onClick={handlePass}
                    >
                        Pass
                    </Button>
                </div>
                <div>
                    <ClueSheet G={G} />
                </div>
            </div>
            <Chat {...this.props} />
        </div>;
    }
}

class CardDisplay extends React.Component {
    render() {
        const {card, onClick, player, playerInfo} = this.props;
        return <div style={{textAlign: 'center'}}>
            <div>{player.name}</div>
            <div>
                <LjCard onClick={onClick}>{card.letter}</LjCard>
            </div>
            <div>
                {playerInfo.activeLetterIndex + 1}/{playerInfo.letters.length}
            </div>
        </div>;
    }
}

class Card extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isFlipped: false,
            text: props.text,
        };
    }
   
    handleClick = (e) => {
        e.preventDefault();
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }

    render(){
        const {handleClick, state: {isFlipped, text}} = this;

        return (
            <ReactCardFlip
                containerStyle={{"max-width":"50px","margin":"2px","width":"50px"}}
                isFlipped={isFlipped}
                flipDirection="horizontal"
            >
                <div width="50px" onClick={handleClick} className="CardFront">
                    <LjCard>{text}</LjCard>
                </div>
                <div onClick={handleClick} className="CardBack">
                    <LjCard>?</LjCard>
                </div>
            </ReactCardFlip>
        )
    }
}