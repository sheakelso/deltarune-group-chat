import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { FaceSprite } from './faceSprite.entity';
import { User } from './user.entity';
import { Message } from './message.entity';

export const MessageReportSchema = defineEntity({
  name: 'MessageReport',
  properties: {
    id: p.integer().primary().primary(),
    message: p.manyToOne(Message),
    reportingUser: p.manyToOne(User)
  },
});

export class MessageReport extends MessageReportSchema.class {}
MessageReportSchema.setClass(MessageReport);