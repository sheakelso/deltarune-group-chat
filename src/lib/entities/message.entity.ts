import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { FaceSprite } from './faceSprite.entity';
import { User } from './user.entity';

export const MessageSchema = defineEntity({
  name: 'Message',
  properties: {
    id: p.integer().primary().primary(),
    body: p.string().length(255),
    faceSprite: p.manyToOne(FaceSprite),
    user: p.manyToOne(User),
    created: p.datetime()
  },
});

export class Message extends MessageSchema.class {}
MessageSchema.setClass(Message);