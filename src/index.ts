import Papa from "papaparse";

import "./app.scss";

const NAME_INDEX: number = 1;
const MIDDLE_INDEX: number = 2;
const LINK_INDEX: number = 3;
const WING_INDEX: number = 4;

const TABLE_DIV_ID: string = "table-div";
const POSITIONS_DIV_ID: string = "positions-div";

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.name = "file-input";
fileInput.accept = ".csv";

const pre = document.createElement("pre");
pre.id = "output-pre";

document.body.appendChild(fileInput);
document.body.appendChild(pre);

const tableDiv = document.createElement("div");
tableDiv.id = TABLE_DIV_ID;

document.body.appendChild(tableDiv);

const positionsDiv = document.createElement("div");
positionsDiv.id = POSITIONS_DIV_ID;

document.body.appendChild(positionsDiv);

fileInput.focus();

fileInput.onchange = async function () {
  if (fileInput.files?.length) {
    const file = fileInput.files[0];
    const fileText = await file.text();
    const parsedFile = Papa.parse<Array<string>>(fileText);
    const playerData = parsedFile.data.map((row) => Player.fromRow(row));
    playerData.shift();
    showPlayerTable(playerData, `#${TABLE_DIV_ID}`);
    showPlayerPositionPreferences(playerData, `#${POSITIONS_DIV_ID}`);
  }
};

enum Position {
  WING = "Wing",
  LINK = "Link",
  MIDDLE = "Middle",
}

function getAllPositions(): Array<Position> {
  const _ret = Object.values(Position);
  return _ret;
}

class Player {
  name: string;
  middle: number;
  link: number;
  wing: number;
  available: boolean;

  constructor(name: string, middle: number, link: number, wing: number) {
    this.name = name.trim();
    if (isNaN(middle)) {
      middle = 2048;
    }
    if (isNaN(link)) {
      link = 2048;
    }
    if (isNaN(wing)) {
      wing = 2048;
    }
    if (middle === link && link === wing) {
      this.middle = 1;
      this.link = 1;
      this.wing = 1;
    } else {
      this.middle = middle;
      this.link = link;
      this.wing = wing;
    }

    this.available = true;
  }

  getPreference(position: Position): number {
    switch (position) {
      case Position.WING:
        return this.wing;
      case Position.LINK:
        return this.link;
      case Position.MIDDLE:
        return this.middle;
    }
  }

  static fromRow(row: Array<string>): Player {
    return new Player(
      row[NAME_INDEX],
      parseInt(row[MIDDLE_INDEX]),
      parseInt(row[LINK_INDEX]),
      parseInt(row[WING_INDEX]),
    );
  }
}

function showPlayerTable(
  players: Array<Player>,
  containingQuerySelector: string,
): void {
  const documentItem = document.querySelector(containingQuerySelector);
  if (documentItem === null) {
    return;
  }

  documentItem.innerHTML = "";

  const table = document.createElement("table");

  const tableHeader = document.createElement("thead");
  const tableHeaderRow = document.createElement("tr");

  const availableHeaderCol = document.createElement("th");
  tableHeaderRow.appendChild(availableHeaderCol);

  const nameHeaderCol = document.createElement("th");
  nameHeaderCol.textContent = "Name";
  nameHeaderCol.setAttribute("width", "50%");

  tableHeaderRow.appendChild(nameHeaderCol);

  getAllPositions().forEach(function (position: Position) {
    const positionHeaderCol = document.createElement("th");
    positionHeaderCol.textContent = position.toString();
    tableHeaderRow.appendChild(positionHeaderCol);
  });

  tableHeader.appendChild(tableHeaderRow);
  table.appendChild(tableHeader);

  players.forEach(function (player, index) {
    const tableRow = document.createElement("tr");
    tableRow.setAttribute("data-player-index", index.toString());

    const checkboxColumn = document.createElement("td");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = player.available;
    checkbox.onchange = function (event) {
      player.available = (<HTMLInputElement>event.currentTarget).checked;
      console.table(players);
    };

    checkboxColumn.appendChild(checkbox);

    tableRow.appendChild(checkboxColumn);

    const nameColumn = document.createElement("td");
    nameColumn.innerText = player.name;

    tableRow.appendChild(nameColumn);

    getAllPositions().forEach(function (position: Position) {
      const positionColumn = document.createElement("td");
      positionColumn.innerText = player.getPreference(position).toString();
      tableRow.appendChild(positionColumn);
    });

    table.appendChild(tableRow);
  });

  documentItem.appendChild(table);
}

function showPlayerPositionPreferences(
  players: Array<Player>,
  containingQuerySelector: string,
): void {
  const documentItem = document.querySelector(containingQuerySelector);
  if (documentItem === null) {
    console.error(
      `No element found that matches selector ${containingQuerySelector}`,
    );
    return;
  }
  documentItem.innerHTML = "";

  getAllPositions().forEach(function (position: Position) {
    documentItem.appendChild(getPlayerPositionPreference(players, position));
  });
}

function getPlayerPositionPreference(
  players: Array<Player>,
  position: Position,
): HTMLElement {
  const positionDiv = document.createElement("div");
  const positionHeader = document.createElement("h3");
  positionHeader.innerText = position;

  positionDiv.appendChild(positionHeader);

  const positionTable = document.createElement("table");
  players
    .sort((a, b) => a.getPreference(position) - b.getPreference(position))
    .forEach(function (player) {
      const playerRow = document.createElement("tr");
      const playerNameCol = document.createElement("td");
      playerNameCol.innerText = player.name;
      playerRow.appendChild(playerNameCol);
      const playerPositionCol = document.createElement("td");
      playerPositionCol.innerText = player.getPreference(position).toString();
      playerRow.appendChild(playerPositionCol);
      positionTable.appendChild(playerRow);
    });
  positionDiv.appendChild(positionTable);
  return positionDiv;
}
