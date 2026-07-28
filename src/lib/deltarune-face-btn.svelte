<button class="face-btn" onclick={onClick}>
    <img src="/images/characters/{faceSprite?.characterName}/{faceSprite?.image}" class="face-sprite" />
</button>

<style>
    .face-btn {
        flex: 1;
        height: 100%;
        width: min-content;
        max-width: fit-content;
        background: none;
        border: 6px solid black;
    }

    .face-btn:hover {
        flex: 1;
        height: 100%;
        width: min-content;
        max-width: fit-content;
        border: 6px solid yellow;
    }

    .face-sprite{
        height: 100%;
        image-rendering: pixelated;
    }
</style>

<script lang="ts">
    let {faceSprite, onSelect} = $props();

    function onClick(){
        onSelect(faceSprite);
    }
</script>