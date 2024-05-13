import Papa from "papaparse";

const NAME_INDEX: number = 1;
const MIDDLE_INDEX: number = 2;
const LINK_INDEX: number = 3;
const WING_INDEX: number = 4;

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.name = "file-input";
fileInput.accept = ".csv";

const pre = document.createElement("pre");
pre.id = "output-pre";

document.body.appendChild(fileInput);
document.body.appendChild(pre);

fileInput.onchange = async function(e) {
    if (fileInput.files.length) {
        const file = fileInput.files[0];
        const fileText = await file.text();
        const parsedFile = Papa.parse<Array<string>>(fileText);
        const playerData = parsedFile.data.map(rowToPlayer);
        console.table(playerData);
        pre.innerHTML = JSON.stringify(playerData, null, 2);
    }
}

class Player {
    name: string;
    middle?: number;
    link?: number;
    wing?: number;

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
    }
}

function rowToPlayer(row: Array<string>): Player {
    return new Player(
        row[NAME_INDEX],
        parseInt(row[MIDDLE_INDEX]),
        parseInt(row[LINK_INDEX]),
        parseInt(row[WING_INDEX]),
    );
}