import { orm } from '$lib/db';
import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { FaceSprite } from './faceSprite.entity';

export const DeltaCharacterSchema = defineEntity({
  name: 'DeltaCharacter',
  properties: {
    internalName: p.string().primary(),
    displayName: p.string()
  },
});

export class DeltaCharacter extends DeltaCharacterSchema.class {
  async loadFaceSprites(){
    let em = orm.em.fork();
    return await em.find(FaceSprite, {characterName: this.internalName});
  }
}
DeltaCharacterSchema.setClass(DeltaCharacter);