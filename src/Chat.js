import React from 'react';
import {TextField} from '@react-md/form';
import {Chip} from '@react-md/chip';

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
        return <div style={{flex: '1 1 0'}}>
            <div>
                {this.props.G.chat.map((msg) => <ChatMessage senderId={msg.id} message={msg.msg} />)}
            </div>
            <TextField id="chat-entry" theme="outline" onChange={this.handleChange} onKeyUp={this.handleKeyUp} value={this.state.message} />
        </div>;
    }
}

const ChatMessage = (props) => {
    let style = props.senderId === localStorage.getItem('name')
        ? {width: '100%', textAlign: 'right'}
        : {width: '100%', textAlign: 'left'}
    
    return <div style={style}>
        <Chip>
            {props.senderId + ': ' + props.message}
        </Chip>
    </div>
}