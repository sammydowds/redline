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
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPost = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var react_1 = require("react");
var server_1 = require("react-dom/server");
var Post_1 = require("../src/components/Public/Post");
function renderPost(data, options) {
  if (options === void 0) {
    options = {};
  }
  return __awaiter(this, void 0, void 0, function () {
    var _a,
      outputPath,
      componentHtml,
      templateHtml,
      finalHtml,
      outputDir,
      error_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          (_a = options.outputPath),
            (outputPath = _a === void 0 ? "dist/output.html" : _a);
          _b.label = 1;
        case 1:
          _b.trys.push([1, 4, 5, 6]);
          componentHtml = server_1.default.renderToString(
            react_1.default.createElement(Post_1.Post, { data: data }),
          );
          templateHtml =
            '\n      <!DOCTYPE html>\n      <html lang="en">\n      <head>\n        <meta charset="UTF-8">\n        <meta name="viewport" content="width=device-width, initial-scale=1.0">\n        <title>Rendered Post</title>\n      </head>\n      <body>\n        <div id="root"></div>\n      </body>\n      </html>\n    ';
          finalHtml = templateHtml.replace(
            '<div id="root"></div>',
            '<div id="root">'.concat(componentHtml, "</div>"),
          );
          outputDir = path_1.default.dirname(outputPath);
          return [
            4 /*yield*/,
            fs_1.default.promises.mkdir(outputDir, { recursive: true }),
          ];
        case 2:
          _b.sent();
          return [
            4 /*yield*/,
            fs_1.default.promises.writeFile(outputPath, finalHtml),
          ];
        case 3:
          _b.sent();
          console.log("Post rendered to ".concat(outputPath));
          return [3 /*break*/, 6];
        case 4:
          error_1 = _b.sent();
          console.error("Error rendering post:", error_1);
          throw error_1;
        case 5:
          console.log("Pre-render Complete.");
          return [7 /*endfinally*/];
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
exports.renderPost = renderPost;
if (require.main === module) {
  var response = await fetch("".concat(import.meta.env.BACKEND_URL, "/posts"));
  var posts = await response.json();
  for (var _i = 0, _a = posts.posts; _i < _a.length; _i++) {
    var post = _a[_i];
    renderPost(post, {
      outputPath: "dist/".concat(post.bodyBegin, ".html"),
    }).catch(console.error);
  }
}
