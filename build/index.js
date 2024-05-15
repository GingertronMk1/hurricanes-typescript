"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const papaparse_1 = __importDefault(require("papaparse"));
if (document !== undefined) {
  const app = document.querySelector("body");
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "csv-input";
  fileInput.accept = ".csv";
  const pre = document.createElement("pre");
  pre.id = "output-pre";
  app === null || app === void 0 ? void 0 : app.appendChild(fileInput);
  app === null || app === void 0 ? void 0 : app.appendChild(pre);
  fileInput.onchange = function (event) {
    return __awaiter(this, void 0, void 0, function* () {
      if (fileInput.files) {
        const reader = new FileReader();
        const [file] = fileInput.files;
        const text = yield file.text();
        const parsedText = papaparse_1.default.parse(text);
        const pre =
          document === null || document === void 0
            ? void 0
            : document.getElementById("output-pre");
        if (pre) {
          pre.innerHTML = JSON.stringify(parsedText);
        }
      }
    });
  };
} else {
  console.log("No document");
}
