import { defineEntity, type InferEntity, p } from '@mikro-orm/core';

export const UserSchema = defineEntity({
  name: 'User',
  properties: {
    id: p.integer().primary().primary(),
    username: p.string().length(20),
    email: p.string().length(320),
    passwordHash: p.string().length(255),
    publicId: p.uuid(),
    emailVerificationStatus: p.enum(['Verified', 'Unverified']).default('Unverified')
  },
});

export class User extends UserSchema.class {
  info(){
    return {
      username: this.username,
      publicId: this.publicId
    }
  }
}

UserSchema.setClass(User);