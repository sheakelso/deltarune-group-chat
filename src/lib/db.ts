import {MikroORM} from '@mikro-orm/mariadb'
import { User, UserSchema } from '$lib/entities/user.entity';
import { DeltaCharacter, DeltaCharacterSchema } from '$lib/entities/deltaCharacter.entity';
import { Message, MessageSchema } from '$lib/entities/message.entity';
import { Session, SessionSchema } from './entities/session.entity';
import { FaceSprite } from './entities/faceSprite.entity';
import { MessageReport } from './entities/messageReport.entity';
import nodemailer from "nodemailer";
import { EmailVerificationAttempt } from './entities/verification.entity';

export const orm = await MikroORM.init({
    dbName: "deltadb",
    user: "deltadb",
    port: 3306,
    password: "password",
    debug: true,
    entities: [User, Message, DeltaCharacter, Session, FaceSprite, MessageReport, EmailVerificationAttempt]
});

export const transporter = nodemailer.createTransport({
    host: "smtp.purelymail.com",
    port: 465,
    secure: true,
    auth: {
        user: "deltarunegroupchat@purelymail.com",
        pass: "!Hi-FiRush2026!"
    }
});