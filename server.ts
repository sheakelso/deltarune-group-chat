import { verifyJwtToken } from "./src/lib/tokens.ts";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { orm } from "./src/lib/db.ts";
import { UserSchema } from "./src/lib/entities/user.entity.ts";
import { Message, MessageSchema } from "./src/lib/entities/message.entity.ts";
import { MessageReport } from "./src/lib/entities/messageReport.entity.ts";
import { handler } from "./build/handler.js"
import cors from "cors";
import { getSessionUser } from "./src/lib/sessions.ts"
import { ClientMessage, ClientUser, GetMessagesData } from "./src/lib/types.ts"
import { FaceSprite } from "./src/lib/entities/faceSprite.entity.ts";

export const app = express();
export const server = createServer(app);
export const io = new Server(server);

initChatServer();

app.use(cors());
app.use(handler);

server.listen(80);


function initChatServer() {
    io.on("connection", (socket) => {
        onSocketConnected(socket);
    });
}

function onSocketConnected(socket: Socket){
    socket.on("auth", async (value, callback) => {
        let user = await getSessionUser(value);
        socket.data = user;
        if(user != undefined){
            onSocketAuthorized(socket);
            callback(true);
        }
        else callback(false);
    });
}

function onSocketAuthorized(socket: Socket){
    socket.join("chat");

    socket.on("getMessages", async (value: GetMessagesData, callback) => {
        let em = orm.em.fork();
        let messages: ClientMessage[];
        if(value.recent){
            messages = await em.findAll(Message, {orderBy: {id: "DESC"}, limit: value.count, populate: ['faceSprite', 'user']});
        }
        else{
            messages = await em.find(Message, {id: {$lt: value.lastId}}, {orderBy: {id: "DESC"}, limit: value.count, populate: ['faceSprite', 'user']});
        }
        callback(messages);
    });

    socket.on("sendMessage", async (value, callback) => {
        let em = orm.em.fork();
        let body: string = value.body;
        let faceSpriteId: number = value.faceSprite;

        if(body != undefined && faceSpriteId != undefined){
            let message = await em.create(Message, {
                body: body,
                faceSprite: faceSpriteId,
                user: socket.data.id,
                created: new Date(Date.now())
            });
            await em.flush();

            await em.populate(message, ["faceSprite", "user"]);

            let clientMessage: ClientMessage = message;

            io.in("chat").emit("newMessage", clientMessage);
            callback(true);
        }
        else callback(false);
    });

    socket.on("reportMessage", async (value) => {
        let em = orm.em.fork();
        await em.create(MessageReport, {
            message: value,
            reportingUser: socket.data.id
        });
        await em.flush();
    });

    socket.on("deleteMessage", async (value) => {
        let em = orm.em.fork();
        let message = await em.findOne(Message, {id: value});
        if(message != undefined) {
            await em.remove(message);
            await em.flush();
        }
        io.in("chat").emit("deleteMessage", value);
    });
}