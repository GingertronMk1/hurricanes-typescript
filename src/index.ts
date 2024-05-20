import Papa from "papaparse";

import "./app.scss";

/**
 * WING - LINK - MIDDLE
 */

const NAME_INDEX: number = 1;
const WING_INDEX: number = 2;
const LINK_INDEX: number = 3;
const MIDDLE_INDEX: number = 4;

const TABLE_DIV_ID: string = "table-div";
const POSITIONS_DIV_ID: string = "positions-div";

const tableDiv = document.createElement("div");
tableDiv.id = TABLE_DIV_ID;

document.body.appendChild(tableDiv);

const positionsDiv = document.createElement("div");
positionsDiv.id = POSITIONS_DIV_ID;

document.body.appendChild(positionsDiv);

fetch("/positions.csv")
  .then((response) => response.text())
  .then(function (fileText) {
    const parsedFile = Papa.parse<Array<string>>(fileText);
    const playerData = parsedFile.data.map((row) => Player.fromRow(row));
    playerData.shift();
    showPlayerTable(playerData, `#${TABLE_DIV_ID}`);
    showPlayerPositionPreferences(playerData, `#${POSITIONS_DIV_ID}`);
  })
  .catch((error: unknown) => {
    console.error(error);
  });

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
  DOES_NOT_WANT = 2048;

  name: string;
  wing: number;
  link: number;
  middle: number;
  available: boolean;

  constructor(name: string, wing: number, link: number, middle: number) {
    this.name = name.trim();
    if (isNaN(middle)) {
      middle = this.DOES_NOT_WANT;
    }
    if (isNaN(link)) {
      link = this.DOES_NOT_WANT;
    }
    if (isNaN(wing)) {
      wing = this.DOES_NOT_WANT;
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

  wantsToPlayPosition(position: Position): boolean {
    return this.getPreference(position) < this.DOES_NOT_WANT;
  }

  static fromRow(row: Array<string>): Player {
    return new Player(
      row[NAME_INDEX],
      parseInt(row[WING_INDEX]),
      parseInt(row[LINK_INDEX]),
      parseInt(row[MIDDLE_INDEX]),
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
  table.classList.add("player-table");

  players.forEach(function (player, index) {
    const tableRow = document.createElement("tr");
    tableRow.setAttribute("data-player-index", index.toString());
    tableRow.classList.add("player-table__row");

    const checkboxColumn = document.createElement("td");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = player.available;
    checkboxColumn.appendChild(checkbox);

    tableRow.appendChild(checkboxColumn);

    tableRow.onclick = function () {
      player.available = !player.available;
      showPlayerPositionPreferences(players, `#${POSITIONS_DIV_ID}`);
      checkbox.checked = player.available;
    };

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
    documentItem.appendChild(
      getPlayerPositionPreference(
        players.filter(
          (player) => player.available && player.wantsToPlayPosition(position),
        ),
        position,
      ),
    );
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
    .sort(function (a, b) {
      const aPreference = a.getPreference(position);
      const bPreference = b.getPreference(position);
      if (aPreference !== bPreference) {
        return aPreference - bPreference;
      }
      return a.name.localeCompare(b.name);
    })
    .forEach(function (player) {
      const playerRow = document.createElement("tr");
      const playerNameCol = document.createElement("td");
      playerNameCol.setAttribute("width", "50%");
      playerNameCol.innerText = player.name;
      playerRow.appendChild(playerNameCol);
      const playerPositionCol = document.createElement("td");
      playerPositionCol.setAttribute("width", "50%");
      playerPositionCol.innerText = player.getPreference(position).toString();
      playerRow.appendChild(playerPositionCol);
      positionTable.appendChild(playerRow);
    });
  positionDiv.appendChild(positionTable);
  return positionDiv;
}
