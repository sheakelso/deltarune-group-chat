import { orm } from "./src/lib/db"
import fs from "fs";
import { FaceSprite } from "./src/lib/entities/faceSprite.entity";
import { DeltaCharacter } from "./src/lib/entities/deltaCharacter.entity";

let em = orm.em.fork();
let characters = await em.findAll(DeltaCharacter);

for (let c = 0; c < characters.length; c++) {
    const character = characters[c].internalName;
    const files = fs.readdirSync("static/images/characters/" + character);

    for (let i = 0; i < files.length; i++) {
        tryAdd(character, files[i]);
    }
}

async function tryAdd(character: string, file: string) {
    let existing = await em.findOne(FaceSprite, {image: file});
    if(existing == undefined){
        let sprite = await em.create(FaceSprite, {
            image: file,
            altText: character,
            characterName: character
        });
        if(sprite == undefined) throw new Error();
        await em.flush();
        console.log("Added \'" + file + "\'");
    }
    else{
        console.log("Skipping \'" + file + "\'");
    }

}
