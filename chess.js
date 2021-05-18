var grid = []
var unit = Math.floor(window.innerWidth * .4 / 8)
var offset = 3
var hand = null
var turn = "white"
var win = null
var $turn = document.getElementById("turn")

function setup() {
    createCanvas((8 * unit) + (offset * 2), (8 * unit) + (offset * 2)).parent("canvas")

    document.addEventListener("contextmenu",
      function(event) {
        if (event.target.nodeName === "CANVAS") {
          event.preventDefault()
        }
      }
    , false)

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let color
            if ((i + j) % 2 == 1) color = "black"
            else color = "white"
            grid.push({
                x: i,
                y: j,
                color: color,
                piece: null
            })
        }
    }

    grid.forEach(tile => {
        if (tile.y <= 1 || tile.y >= 6) tile.piece = new Piece(tile.x, tile.y)
    })

    $turn.innerHTML = `It is the ${turn} player's turn`
}

function draw() {
    background(0, 255, 255)
    translate(offset, offset)
    textAlign(CENTER)

    grid.forEach(tile => {
        if (tile.color == "black") fill(0)
        else fill(255)
        square(tile.x * unit, tile.y * unit, unit)
        if (tile.piece) drawPiece(tile)
    })

    $turn.innerHTML = `It is the ${turn} player's turn`

    if (win) {
        fill(0)
        rect(unit * 2, unit * 3.5, unit * 4, unit * 1)
        textSize(unit * .35)
        fill(255)
        text(`The ${win} player wins!`, unit * 4, unit * 4.125)

        $turn.innerHTML = `The ${win} player wins!`
    }
}

function Piece(x, y) {
    this.firstMove = true
    if (y <= 1) this.player = "black"
    else if (y >= 6) this.player = "white"
    else return
    if (y == 1 || y == 6) this.type = "p"
    else if (x == 0 || x == 7) this.type = "r"
    else if (x == 1 || x == 6) this.type = "n"
    else if (x == 2 || x == 5) this.type = "b"
    else if (x == 3) this.type = "q"
    else if (x == 4) this.type = "k"
}

function drawPiece(tile) {
    if (tile.piece.player == "black") {
        if (hand && hand == tile) fill(100)
        else fill(50)
    }
    else {
        if (hand && hand == tile) fill(155)
        else fill(205)
    }
    circle((tile.x + .5) * unit, (tile.y + .5) * unit, unit * .95)
    textAlign(CENTER)
    if (tile.piece.player == "black") fill(255)
    else fill(0)
    var name
    switch(tile.piece.type) {
        case "p":
            name = "Pawn"
        break;
        case "r":
            name = "Rook"
        break;
        case "n":
            name = "Knight"
        break;
        case "b":
            name = "Bishop"
        break;
        case "q":
            name = "Queen"
        break;
        case "k":
            name = "King"
        break;
        default:
            console.log("ERROR")
        break;
    }
    textSize(unit * .25)
    text(name, (tile.x + .5) * unit, (tile.y + .58) * unit)
}

function mouseReleased(e) {
    if (win) return
    let exit = false
    grid.forEach(tile => {
        if (exit) return
        if (mouseX >= width || mouseY >= height) return
        if (mouseX <= ((tile.x + 1) * unit) + offset && mouseY <= ((tile.y + 1) * unit) + offset) {
            if (hand) {
                if (Math.abs(hand.x - tile.x) == 0 && Math.abs(hand.y - tile.y) == 0) hand = null
                else if (legalMove(tile)) {
                    hand.piece.firstMove = false
                    if (tile.piece && tile.piece.type == "k") win = hand.piece.player
                    tile.piece = hand.piece
                    grid.forEach(oldTile => {
                        if (oldTile.x == hand.x && oldTile.y == hand.y)
                        oldTile.piece = null
                    })
                    hand = null
                    if (turn == "white") turn = "black"
                    else turn = "white"
                }
            }
            else if (tile.piece && tile.piece.player == turn) hand = tile
            exit = true
        }
    })
}

function legalMove(newTile) {
    let legal = true
    if (Math.abs(hand.x - newTile.x) == 0 && Math.abs(hand.y - newTile.y) == 0) legal = false
    switch(hand.piece.type) {
        case "p":
            if (hand.piece.player == "black" && (newTile.y - hand.y) <= 0) legal = false
            else if (hand.piece.player == "white" && (hand.y - newTile.y) <= 0) legal = false
            if (Math.abs(hand.y - newTile.y) > 2) legal = false
            else if (Math.abs(hand.y - newTile.y) == 2 && !hand.piece.firstMove) legal = false
            if (Math.abs(hand.x - newTile.x) > 1) legal = false
            else if (Math.abs(hand.x - newTile.x) == 1 && !(newTile.piece && newTile.piece.player != hand.piece.player && Math.abs(hand.y - newTile.y) == 1)) legal = false
        break;
        case "r":
            if (Math.abs(hand.x - newTile.x) > 0 && Math.abs(hand.y - newTile.y) > 0) legal = false
        break;
        case "n":
            if (Math.abs(hand.x - newTile.x) > 2 || Math.abs(hand.y - newTile.y) > 2) legal = false
            if (Math.abs(hand.y - newTile.y) / Math.abs(hand.x - newTile.x) != 2 && Math.abs(hand.y - newTile.y) / Math.abs(hand.x - newTile.x) != .5) legal = false
        break;
        case "b":
            if (Math.abs(hand.y - newTile.y) / Math.abs(hand.x - newTile.x) != 1) legal = false
        break;
        case "q":
            if (Math.abs(hand.x - newTile.x) > 0 && Math.abs(hand.y - newTile.y) > 0 && Math.abs(hand.y - newTile.y) / Math.abs(hand.x - newTile.x) != 1) legal = false
            
        break;
        case "k":
            if (Math.abs(hand.x - newTile.x) > 1 || Math.abs(hand.y - newTile.y) > 1) legal = false
        break;
        default:
            console.log("ERROR")
        break;
    }
    return legal
}