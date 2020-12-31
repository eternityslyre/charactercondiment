const MOVES = {
    deselectCard: {
        move: (G, ctx, card) => {
            let lastClue = G.clue[G.clue.length - 1];
            if (lastClue.id === card.id) {
                G.clue.pop();   
            }
        },
        noLimit: true,
    },
    nextLetter: {
        move: (G, ctx, playerID) => {
            G.players[playerID].activeLetterIndex++;
        },
        noLimit: true,
    },
    selectCard: {
        move: (G, ctx, card) => {
            G.clue.push(card);
        },
        noLimit: true,
    },
    sendMessage: {
        move: (G, ctx, playerName, message) => {
            G.chat.push({
                id: playerName,
                msg: message
            })
        },
        noLimit: true,
    },
    submitClue: {
        move: (G, ctx, playerId) => {
            let word = G.clue.map((card) => card.letter).join('');
            console.log(word);
            G.clues.push({
                clue: G.clue,
                playerId,
                word,
            });
            G.clue = [];
        },
        // TODO -- this should put the active player into a different state where they cannot
        // submit another clue, but the game should not move on to the next turn before
        // all other players have a chance to decide if they want to move on to their next letter
        noLimit: true,
    }
}

export default MOVES;