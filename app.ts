import express = require("express");
import {Socket} from "socket.io";

let child_process = require("child_process").exec;

let app = express();

let server = app.listen(8989, function () {
    console.log("已经启动http服务端 http://*:8989");
});

export let io = require("socket.io")(server, {
    serveClient: false,
    path: "/check",
    transports: ["websocket"]
});

io.on("connection", function (client: Socket) {

    console.log("连上了...");
    client.on("work", async function (url) {
        console.log("收到新任务：" + url);
        while (client.connected) {
            let result = await exec(url);
            client.emit("result", result.result);
            await sleep(5 * 1000);
        }
    });

    client.on("disconnect", function () {
        console.log("断开了")
    });
});

export async function exec(cmd: string): Promise<{ errcode?, result? }> {
    return new Promise((resolve) => {
        child_process(cmd, function (err, stdout) {
            if (err) {
                resolve({errcode: 1, result: stdout + err});
            } else {
                resolve({errcode: 0, result: stdout});
            }
        });
    });
};

export async function sleep(time) {
    return await new Promise((resolve) => {
        setTimeout(function () {
            resolve();
        }, time);
    });
};