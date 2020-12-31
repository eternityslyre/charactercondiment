import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { DEFAULT_PORT, APP_PRODUCTION } from "./config";
import {TicTacToe} from './Game';
import {TicTacToeBoard as Board} from './Board';
import Lobby from "./Lobby";
import { LobbyAPI } from "./LobbyApi";
import {Button} from '@react-md/button';
import {TextField} from '@react-md/form';

import "./Room.scss";

const api = new LobbyAPI();

const { origin, protocol, hostname } = window.location;
const SERVER_URL = APP_PRODUCTION ? origin : `${protocol}//${hostname}:${DEFAULT_PORT}`;

const GameClient = Client({
  game: TicTacToe,
  board: Board,
  debug: false,
  multiplayer: SocketIO({ server: SERVER_URL }),
});

const Room = (props) => {
  const { history } = props;
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState([]);
  const [show, setShow] = useState(false);

  // check for newly joined players by comparing against the two players array (front-end and the api, and api is always slightly ahead)
  useEffect(() => {
    const interval = setInterval(() => {
      api.getPlayers(id).then(
        (players) => {
          setPlayers(players);
          const currPlayers = players.filter((player) => player.name); // only current players have a name field
          if (currPlayers.length === players.length) {
            setShow(true); // everyone has joined, show them the board
          }
        },
        () => {
          history.push("", { invalidRoom: true }); // failed to join because room doesn't exist -> return user to homepage
        }
      );
    }, 500);
    if (show) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [show, players.length, id, history]);

  // after user copies to clipboard
  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 3000);
    }

    return () => clearTimeout(timeout);
  }, [copied, id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
  };

  const leaveRoom = () => {
    api.leaveRoom(id, localStorage.getItem("id"), localStorage.getItem("credentials")).then(() => {
      history.push("/");
    });
  };

  if (show) {
      console.log(`playerID: ${localStorage.getItem('id')}`);
    // don't include lobby because game doesn't show game title, game credits... it's fullscreen.
    return (
      <GameClient
        matchID={id}
        numPlayers={players.length}
        playerID={localStorage.getItem("id")}
        credentials={localStorage.getItem("credentials")}
      />
    );
  } else {
    return (
      <Lobby>
        <span className="title room-title">Room</span>
        <div className="players-list">
          {players.map((player) => {
              return player.name
                ? player.name + `${player.name === localStorage.getItem("name") ? " (You)" : ""}\n`
                : "...\n";
          })}
        </div>
        <div className="room-info-area">
          <div className="roomID-area">
            room id:
            <TextField value={id} disabled />
            <Button onClick={copyToClipboard} disabled={copied} themeType="outline" theme="primary">
                {copied ? 'copied' : 'copy'}
            </Button>
          </div>
          <div className="room-info">
            Game will begin once all
            {players.length === 0 ? "" : ` ${players.length}`} players have joined.
          </div>
          <Button onClick={leaveRoom} themeType="outline">Leave</Button>
        </div>
      </Lobby>
    );
  }
};

export default Room;