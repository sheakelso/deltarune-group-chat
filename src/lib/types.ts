import type { FaceSprite } from "./entities/faceSprite.entity"

export type GetMessagesData = {
    recent: boolean,
    lastId: number,
    count: number
}

export type ClientUser = {
    username: string,
    publicId: string
}

export type ClientMessage = {
    id: number,
    body: string,
    faceSprite: FaceSprite,
    created: Date,
    user: ClientUser
}