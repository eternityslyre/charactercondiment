import React, { Component } from 'react';
import LjCard from './LjCard';
import { Button } from '@react-md/button';
import ReactCardFlip from 'react-card-flip';
import { ReactSortable } from "react-sortablejs";
import Chat from './Chat';
import Deck from './deck';
import ClueSheet from './ClueSheet';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

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
state = {
  items: ['A', 'B', 'C', 'D', 'E'],
};
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

    get visibleCards() {
        const {ctx, G} = this.props;
        const common = G.drawPiles.map((pile) => pile.currentLetter);
        const otherPlayers = Object.keys(G.players)
            .filter((key) => `${key}` !== this.playerId)
            .map((key) => G.players[key].letters[G.players[key].activeLetterIndex]);

        return [Deck.WILD, ...common, ...otherPlayers];
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

    render() {
        const {ctx, G} = this.props;
        const {
            isActivePlayer,
            isNextLetterDisabled,
            handleDeselectCard,
            handleNextLetter,
            handlePass,
            handleSelectCard,
            playerId,
            submitClue,
            visibleCards,
        } = this;

        return <div style={{display: 'flex'}}>
            <div style={{flex: '3 1 0'}}>
                <div>
                    <div>Visible cards</div>
                    {visibleCards.map((card) => <LjCard onClick={handleSelectCard(card)}>{card.letter}</LjCard>)}
                </div>
                <div>
                    <div>Your cards</div>
                    <SortableComponent />
                </div>
                <div>
                    <div>Clue</div>
                    <div>{isActivePlayer && ("You're up!")}</div>
                    <div>{!isActivePlayer && ("Waiting for player "+this.activePlayer)}</div>
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
class Hand extends React.Component {
    constructor(props) {
      super();
        this.state = {
          items: [
            {id: 1, name: "a"},
            {id: 2, name: "b"},
            {id: 3, name: "c"},
            {id: 4, name: "d"},
            {id: 5, name: "e"},
            {id: 6, name: "f"},
          ]
        };
    }
  
    stringState (list) {
      let output = "[";
      for (const item in list) {
        output += list[item].name+",";
      }
      return output+"]";
    }
  
    updateList = (newList) => {
      this.setState({items:newList});
    }
   
    render(){
      return (
        <ReactSortable
          list={this.state.items}
          setList={this.updateList}
          className='row'
          direction='horizontal'
          >
          {this.state.items.map((item) => (
            <LjCard>{item.name}</LjCard>
            //<Card margin="2px" max-width="50px" key={item.id} text={item.name} />
          ))}
        </ReactSortable>
      )
    }
  }
  
  class Card extends React.Component{
    constructor(props) {
      super();
        this.state = {
        isFlipped: false,
        text: props.text
      };
      this.handleClick = this.handleClick.bind(this);
    }
   
    handleClick(e) {
      e.preventDefault();
      this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }
    render(){
      return (
        <ReactCardFlip containerStyle={{"max-width":"50px","margin":"2px","width":"50px"}} isFlipped={this.state.isFlipped} flipDirection="horizontal">
        <div width="50px" onClick={this.handleClick} className="CardFront">
            <LjCard>{this.state.text}</LjCard>
        </div>
  
        <div onClick={this.handleClick} className="CardBack">
            <LjCard>?</LjCard>
        </div>
        </ReactCardFlip>
      )
    }
  }