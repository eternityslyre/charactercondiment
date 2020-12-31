import React from "react";
import "./Lobby.scss";

// Lobby is the parent component. Home and Room are the children components.
const Lobby = (props) => {
    return (
        <div className="lobby-container">
        <div className="game-title">Character Condiment</div>
            {props.children}
        </div>
    );
};

export default Lobby;