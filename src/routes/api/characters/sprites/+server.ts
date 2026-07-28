import { orm } from "$lib/db";
import { DeltaCharacter } from "$lib/entities/deltaCharacter.entity";
import { FaceSprite } from "$lib/entities/faceSprite.entity";
import { json } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";


export async function POST(event: RequestEvent){
    let data = await event.request.json();
    let characterName: string = data.character;

    let em = orm.em.fork();
    let character = await em.findOne(DeltaCharacter, {internalName: characterName});
    return json(await character?.faceSprites());
}