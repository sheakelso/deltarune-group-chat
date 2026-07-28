import {MikroORM} from '@mikro-orm/mariadb'
import { User, UserSchema } from '$lib/entities/user.entity';
import { DeltaCharacter, DeltaCharacterSchema } from '$lib/entities/deltaCharacter.entity';
import { Message, MessageSchema } from '$lib/entities/message.entity';
import { Session, SessionSchema } from './entities/session.entity';
import { FaceSprite } from './entities/faceSprite.entity';

export const orm = await MikroORM.init({
    dbName: "deltadb",
    user: "deltadb",
    port: 3306,
    password: "password",
    debug: true,
    entities: [User, Message, DeltaCharacter, Session, FaceSprite]
});