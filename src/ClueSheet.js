import React from 'react';
import {TextField} from '@react-md/form';

export default class ClueSheet extends React.Component {
    constructor(props) {
        super(props);
        let guesses = [];
        for (let i = 0; i < 10; i++) {
            guesses.push('');
        }
        this.state = {guesses};
    }

    get entries() {
        const {props: {G}, state: {guesses}} = this;
        let clues = G.clues.filter((clue) => clue.playerId != localStorage.getItem('id'));
        let entries = [];
        for (let i = 0; i < 10; i++) {
            entries.push({
                clue: clues[i],
                guess: guesses[i],
            });
        }
        return entries;
    }

    handleGuessChange = (index) => (e) => {
        let guesses = [...this.state.guesses];
        guesses[index] = e.target.value;
        this.setState({guesses});
    }

    render() {
        return <div>
            {
                this.entries.map((entry, index) => <Row entry={entry} onGuessChange={this.handleGuessChange(index)} />)
            }
        </div>;
    }
}

class Row extends React.Component {
    get word() {
        const {clue} = this.props.entry;
        let word = '';
        if (clue && clue.clue) {
            word = clue.clue.map((card) => card.owner == localStorage.getItem('id') ? '?' : card.letter).join('');
        }
        return word;
    }

    render() {
        return <div>
            <TextField inline value={this.word} />
            <TextField inline onChange={this.props.onGuessChange} value={this.props.entry.guess} />
        </div>
    }
}