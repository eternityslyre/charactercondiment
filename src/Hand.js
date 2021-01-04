import React from 'react';
import { ReactSortable } from "react-sortablejs";

class Hand extends React.Component {
    constructor(props) {
        super(props);
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
                {this.state.items.map((item) => <LjCard>{item.name}</LjCard>)}
            </ReactSortable>
        )
    }
}