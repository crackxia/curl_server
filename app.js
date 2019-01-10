"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
let child_process = require("child_process").exec;
let app = express();
let server = app.listen(8989, function () {
    console.log("已经启动http服务端 http://*:8989");
});
exports.io = require("socket.io")(server, {
    serveClient: false,
    path: "/check",
    transports: ["websocket"]
});
exports.io.on("connection", function (client) {
    console.log("连上了...");
    client.on("work", function (url) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("收到新任务：" + url);
            while (client.connected) {
                let result = yield exec(url);
                client.emit("result", result.result);
                yield sleep(5 * 1000);
            }
        });
    });
    client.on("disconnect", function () {
        console.log("断开了");
    });
});
function exec(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            child_process(cmd, function (err, stdout) {
                if (err) {
                    resolve({ errcode: 1, result: stdout + err });
                }
                else {
                    resolve({ errcode: 0, result: stdout });
                }
            });
        });
    });
}
exports.exec = exec;
;
function sleep(time) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve) => {
            setTimeout(function () {
                resolve();
            }, time);
        });
    });
}
exports.sleep = sleep;
;
//# sourceMappingURL=app.js.map