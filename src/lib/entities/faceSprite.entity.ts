import { defineEntity, type InferEntity, p } from '@mikro-orm/core';
import { User } from './user.entity';
import { DeltaCharacter } from './deltaCharacter.entity';

export const FaceSpriteSchema = defineEntity({
  name: 'FaceSprite',
  properties: {
    id: p.integer().primary(),
    image: p.string().length(100),
    altText: p.string().length(100),
    characterName: p.string().length(100)
  }
});

export class FaceSprite extends FaceSpriteSchema.class {}
FaceSpriteSchema.setClass(FaceSprite);