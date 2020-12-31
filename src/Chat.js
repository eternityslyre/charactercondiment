import React from 'react';
import {TextField} from '@react-md/form';

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
        };
    }

    handleChange = (e) => {
        this.setState({message: e.target.value});
    }

    handleKeyUp = (e) => {
        if (e.keyCode === 13) {
            this.props.moves.sendMessage(localStorage.getItem('name'), this.state.message);
            this.setState({message: ''});
        }
    }

    render() {
        return <div>
            <div>
                {this.props.G.chat.map((msg) => <div>{msg}</div>)}
            </div>
            <TextField id="chat-entry" theme="outline" onChange={this.handleChange} onKeyUp={this.handleKeyUp} value={this.state.message} />
        </div>;
    }
}