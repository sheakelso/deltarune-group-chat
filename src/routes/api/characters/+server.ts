import { error, json } from "@sveltejs/kit";
import type { RequestEvent } from "../$types";
import { orm } from "../../../lib/db";
import { DeltaCharacter, DeltaCharacterSchema } from "$lib/entities/deltaCharacter.entity";
import fs from "fs";

export async function GET(event: RequestEvent){
    if(!event.locals.user) return error(401, "Unauthorized.");
    
    let em = orm.em.fork();
    let deltaCharacters = await em.findAll(DeltaCharacter);
    return json(deltaCharacters);
}

function getCharacterImages(character: string){
    return fs.readdirSync("./static/images/characters/" + character);
}