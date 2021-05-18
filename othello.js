var grid = []
var unit = Math.floor(window.innerWidth * .4 / 8)
var offset = 3
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
            grid.push({
                x: i,
                y: j,
                piece: null
            })
        }
    }

    grid[27].piece = new Piece("black")
    grid[28].piece = new Piece("white")
    grid[35].piece = new Piece("white")
    grid[36].piece = new Piece("black")

    $turn.innerHTML = `It is the ${turn} player's turn`
}

function draw() {
    background(0, 255, 255)
    translate(offset, offset)
    textAlign(CENTER)

    grid.forEach(tile => {
        fill(40, 100, 40)
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

function Piece(color) {
    this.color = color
}

function drawPiece(tile) {
    if (tile.piece.color == "black") fill(25)
    else fill(230)
    circle((tile.x + .5) * unit, (tile.y + .5) * unit, unit * .95)
}

function mouseReleased(e) {
    if (win) return
    let exit = false
    grid.forEach(tile => {
        if (exit) return
        if (mouseX >= width || mouseY >= height) return
        if (mouseX <= ((tile.x + 1) * unit) + offset && mouseY <= ((tile.y + 1) * unit) + offset) {
            if (tile.piece) return
            let connections = getConnections(tile)
            if (connections) {
                tile.piece = new Piece(turn)
                connections.forEach(connection => {
                    console.log(connection.tile.piece)
                    connection.tile.piece = new Piece(turn)
                })
                if (turn == "black") turn = "white"
                else turn = "black"
            }
            exit = true
        }
    })
}

function getConnections(newTile) {
    let connections = []
    grid.forEach(tile => {
        let slope = (tile.y - newTile.y) / (tile.x - newTile.x)
        if (tile.piece && !isNaN(slope)) {
            if (tile.piece.color != turn) return
            if (!(Math.abs(slope) == Infinity || slope == 0 || Math.abs(slope) == 1)) return
            if (Math.abs(tile.x - newTile.x) <= 1 && Math.abs(tile.y - newTile.y) <= 1) return
            switch(slope) {
                case Infinity:
                    for (let offset = 1; offset < tile.y - newTile.y; offset++) {
                        let checkTile = grid[newTile.x + ((newTile.y + offset) * 8)]
                        if (checkTile.piece && checkTile.piece.color != turn) {
                            connections.push({
                                //idex: newTile.x + ((newTile.y + offset) * 8),
                                tile: checkTile
                            })
                        }
                        else offset += 8
                    }
                break;
                case -Infinity:
                    for (let offset = -1; offset > tile.y - newTile.y; offset--) {
                        let checkTile = grid[newTile.x + ((newTile.y + offset) * 8)]
                        if (checkTile.piece && checkTile.piece.color != turn) {
                            connections.push({
                                //idex: newTile.x + ((newTile.y + offset) * 8),
                                tile: checkTile
                            })
                        }
                        else offset -= 8
                    }
                break;
                case 0:
                    if (newTile.x < tile.x) {
                        for (let offset = 1; offset < tile.x - newTile.x; offset++) {
                            let checkTile = grid[newTile.x + offset + (newTile.y * 8)]
                            if (checkTile.piece && checkTile.piece.color != turn) {
                                connections.push({
                                    //idex: newTile.x + offset + (newTile.y * 8),
                                    tile: checkTile
                                })
                            }
                            else offset += 8
                        }
                    }
                    else {
                        for (let offset = -1; offset > tile.x - newTile.x; offset--) {
                            let checkTile = grid[newTile.x + offset + (newTile.y * 8)]
                            if (checkTile.piece && checkTile.piece.color != turn) {
                                connections.push({
                                    //idex: newTile.x + offset + (newTile.y * 8),
                                    tile: checkTile
                                })
                            }
                            else offset -= 8
                        }
                    }
                break;
                case 1:
                    console.log("1")
                    for (let offset = 1; offset < newTile.x - tile.x; offset++) {
                        let checkTile = grid[newTile.x + offset + (newTile.y + offset * 8)]
                        console.log(checkTile)
                        if (checkTile.piece && checkTile.piece.color != turn) {
                            connections.push({
                                //idex: newTile.x + offset + (newTile.y + offset * 8),
                                tile: checkTile
                            })
                        }
                        else offset += 8
                    }
                break;
                case -1:
                for (let offset = -1; offset > tile.x - newTile.x; offset--) {
                    let checkTile = grid[newTile.x + offset + (newTile.y + offset * 8)]
                    if (checkTile.piece && checkTile.piece.color != turn) {
                        connections.push({
                            //idex: newTile.x + offset + (newTile.y + offset * 8),
                            tile: checkTile
                        })
                    }
                    else offset -= 8
                }
                break;
                default:
                    console.log("ERROR - Slope: " + slope)
                break;
            }
        }
    })
    console.log("connections")
    console.log(connections)
    if (connections.length == 0) return null
    else return connections
}