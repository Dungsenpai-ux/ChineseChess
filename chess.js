"use strict";
var STARTUP_FEN = [
    "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w",
    "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKAB1R w",
    "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/R1BAKAB1R w",
    "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/9/1C5C1/9/RN2K2NR w",
];

function CHR(n) {
    return String.fromCharCode(n);
}

function ASC(c) {
    return c.charCodeAt(0);
}

function move2Iccs(mv) {
    var sqSrc = SRC(mv);
    var sqDst = DST(mv);
    return CHR(ASC("A") + FILE_X(sqSrc) - FILE_LEFT) +
        CHR(ASC("9") - RANK_Y(sqSrc) + RANK_TOP) + "-" +
        CHR(ASC("A") + FILE_X(sqDst) - FILE_LEFT) +
        CHR(ASC("9") - RANK_Y(sqDst) + RANK_TOP);
}

function createOption(text, value, ie8) {
    var opt = document.createElement("option");
    opt.selected = true;
    opt.value = value;
    if (ie8) {
        opt.text = text;
    } else {
        opt.innerHTML = text.replace(/ /g, "&nbsp;");
    }
    return opt;
}

var board = new Board(container, "images/", "sounds/");
board.setSearch(16);
board.millis = 10;
board.computer = 1;
board.onAddMove = function () {
    var counter = (board.pos.mvList.length >> 1);
    var space = (counter > 99 ? "    " : "   ");
    counter = (counter > 9 ? "" : " ") + counter + ".";
    var text = (board.pos.sdPlayer == 0 ? space : counter) + move2Iccs(board.mvLast);
    var value = "" + board.mvLast;
    try {
        selMoveList.add(createOption(text, value, false));
    } catch (e) {
        selMoveList.add(createOption(text, value, true));
    }
    selMoveList.scrollTop = selMoveList.scrollHeight;
};

function level_change() {
    board.millis = Math.pow(10, selLevel.selectedIndex + 1);
}

function restart_click() {
    selMoveList.options.length = 1;
    selMoveList.selectedIndex = 0;
    board.computer = 1 - selMoveMode.selectedIndex;
    board.restart(STARTUP_FEN[selHandicap.selectedIndex]);
}

function retract_click() {
    for (var i = board.pos.mvList.length; i < selMoveList.options.length; i++) {
        board.pos.makeMove(parseInt(selMoveList.options[i].value));
    }
    board.retract();
    selMoveList.options.length = board.pos.mvList.length;
    selMoveList.selectedIndex = selMoveList.options.length - 1;
}

function moveList_change() {
    if (board.result == RESULT_UNKNOWN) {
        selMoveList.selectedIndex = selMoveList.options.length - 1;
        return;
    }
    var from = board.pos.mvList.length;
    var to = selMoveList.selectedIndex;
    if (from == to + 1) {
        return;
    }
    if (from > to + 1) {
        for (var i = to + 1; i < from; i++) {
            board.pos.undoMakeMove();
        }
    } else {
        for (var i = from; i <= to; i++) {
            board.pos.makeMove(parseInt(selMoveList.options[i].value));
        }
    }
    board.flushBoard();
}