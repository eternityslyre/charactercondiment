// Checks the stage that all players are in.
// If everyone is in the "ready" stage, advance to the next round.
const startNextRoundIfReady = (ctx) => {
    let playerStages = ctx.activePlayers;
    Object.values(playerStages).forEach((stage) => {
        if (stage !== 'ready') {
            return;
        }
    });
    ctx.events.endTurn();
}

const MOVES = {
    // Active player clicks on a card that was selected for the clue.
    deselectCard: {
        move: (G, ctx, card) => {
            let lastClue = G.clue[G.clue.length - 1];
            if (lastClue.id === card.id) {
                G.clue.pop();   
            }
        },
        noLimit: true,
    },
    // Called when a player wants to advance to the next letter.
    nextLetter: {
        move: (G, ctx, playerID) => {
            G.players[playerID].activeLetterIndex++;
            ctx.events.setStage('ready');
            startNextRoundIfReady(ctx);
        },
    },
    // Called when a player gives up on guessing for the round.
    pass: {
        move: (G, ctx) => {
            ctx.setStage('ready');
            startNextRoundIfReady(ctx);
        },
        noLimit: true,
    },
    // Active player clicks on a visible card to add to the clue.
    selectCard: {
        move: (G, ctx, card) => {
            G.clue.push(card);
        },
        noLimit: true,
    },
    // Chat messaging.
    sendMessage: {
        move: (G, ctx, playerName, message) => {
            G.chat.push({
                id: playerName,
                msg: message
            })
        },
        noLimit: true,
    },
    // Active player clicks the "submit clue" button to share it with the other players.
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
            ctx.events.setStage('ready');
            startNextRoundIfReady(ctx);
        },
    }
}

export default MOVES;