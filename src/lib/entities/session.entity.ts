import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { User } from './user.entity';

export const SessionSchema = defineEntity({
  name: 'Session',
  properties: {
    id: p.uuid().primary(),
    user: p.manyToOne(User).primary()
  },
});

export class Session extends SessionSchema.class {}
SessionSchema.setClass(Session);