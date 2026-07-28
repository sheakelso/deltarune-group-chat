import { orm } from "$lib/db";
import { DeltaCharacter } from "$lib/entities/deltaCharacter.entity";
import type { FaceSprite } from "$lib/entities/faceSprite.entity";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    let em = orm.em.fork();
    let characters = await em.findAll(DeltaCharacter);
    let faceSprites: Record<string, FaceSprite[]> = {};

    for(let i = 0; i < characters.length; i++){
        faceSprites[characters[i].internalName] = await characters[i].loadFaceSprites();
    }

    return JSON.parse(JSON.stringify({
        characters: characters,
        faceSprites: faceSprites
    }));
}