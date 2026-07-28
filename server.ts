import { verifyJwtToken } from "./src/lib/tokens.ts";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { orm } from "./src/lib/db.ts";
import { UserSchema } from "./src/lib/entities/user.entity.ts";
import { Message, MessageSchema } from "./src/lib/entities/message.entity.ts";
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

server.listen(3000);


function initChatServer() {
    io.on("connection", (socket) => {
        onSocketConnected(socket);
    });
}

function onSocketConnected(socket: Socket){
    socket.on("auth", async (value, callback) => {
        socket.data = await getSessionUser(value);
        if(socket.data != undefined){
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
            messages = await em.find(Message, {id: {$lte: value.lastId}}, {orderBy: {id: "DESC"}, limit: value.count, populate: ['faceSprite', 'user']});
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

            await em.populate(message, ["faceSprite"]);

            io.in("chat").emit("newMessage", message);
            callback(true);
        }
        else callback(false);
    });
}