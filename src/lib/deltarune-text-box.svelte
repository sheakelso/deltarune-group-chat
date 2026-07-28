<div class="text-box">
    <div class="text-box-container">
        <div class="face-sprite-container">
            <img src="/images/characters/{faceSprite?.characterName}/{faceSprite?.image}" alt="Face sprite" class="face-sprite"/>
        </div>
        <p bind:this={asterisks} class="asterisks" id="editor-asterisks">*</p>
        <div class="text-container">
            <textarea bind:this={textArea} disabled={disabled} spellcheck="false" placeholder="Type your message..." class="text-input" cols="24" rows="3" wrap="hard" maxlength="72" oninput={onChange}>{text}</textarea>
        </div>
    </div>
</div>

<style>
    .text-box {
        margin: auto;
        outline: white solid 6px;
        width: 650px;
        height: 160px;
    }

    .text-box-container {
        display: grid;
        grid-template-columns: 150px 40px 445px;
        height: auto;
        width: 100%;
        margin: 10px;
    }

    .face-sprite {
        image-rendering: pixelated;
        height: 100%;
    }

    .face-sprite-container{
        margin-right: 20px;
        max-height: 140px;
        max-width: 140px;
        height: 140px;
        width: 140px;
    }

    .text-input{
        width: 100%;
        background: none;
        border: none;
        font-family: 'dtm';
        color: white;
        font-size: 30px;
        resize: none;
        overflow: hidden;
        line-height: 1.4;
    }

    .asterisks {
        color: white;
        font-size: 30px;
        font-family: 'dtm';
        width: 30px;
        margin: 0%;
        line-height: 1.4;
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";

    let {faceSprite, disabled, text} = $props();

    let textArea: HTMLTextAreaElement;
    let asterisks: HTMLParagraphElement;

    onMount(updateAsterisks);

    export function getMessageData(){
        return {
            body: textArea.value,
            faceSprite: faceSprite.id
        }
    }

    function updateAsterisks(){
        let asteriskStr: string = "* <br>";

        let lines = 1;
        let text = "";
        let lineChars = 0;
        
        for(let i = 0; i < textArea.value.length; i++) {
            if (textArea.value[i] === '\n') {
                if(lines < 3) {
                    lines++;
                    lineChars = 0;
                    asteriskStr += '*<br>';
                }
                else break;
            }
            else if(lineChars == 25) {
                if(lines < 3) {
                    lines++;
                    lineChars = 0;
                    asteriskStr += '<br>';
                }
                else break;
            }
            lineChars++;
            text += textArea.value[i];
        }

        console.log(lines)
        textArea.value = text;

        asterisks.innerHTML = asteriskStr;
    }

    function onChange(event: Event) {
        updateAsterisks();
    }

    function getDisabledValue(){
        if(disabled) return "disabled";
        else return null;
    }

</script>