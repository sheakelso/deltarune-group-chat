import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { User } from './user.entity';

export const EmailVerificationAttemptSchema = defineEntity({
  name: 'EmailVerificationAttempt',
  properties: {
    user: p.manyToOne(User).primary(),
    token: p.uuid()
  },
});

export class EmailVerificationAttempt extends EmailVerificationAttemptSchema.class {

}

EmailVerificationAttemptSchema.setClass(EmailVerificationAttempt);