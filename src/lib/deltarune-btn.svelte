
<button class="deltarune-btn" onmouseover={onHover} onmouseleave={onLeave} onclick={onClick}>
    <img src="/images/spr_heart_centered_0.png" alt="Heart Icon" class="heart-icon" bind:this={heartIcon}/>
    {text}
</button>


<style>
    .deltarune-btn {
        font-size: 35px;
        font-family: 'dtm';
        background: none;
        border: none;
        color: white;
    }

    .deltarune-btn:hover {
        color: yellow;
    }

    .heart-icon {
        visibility: hidden;
        position: relative;
        left: 0px;
        width: 25px;
        height: 25px;
        image-rendering: pixelated;
    }

    .button-container {
        width: fit-content;
        height: fit-content;
    }
</style>

<script lang="ts">
	let { text, onClick }: {text: string, onClick?: any} = $props();

    let heartIcon: HTMLImageElement;

    function onHover(){
        heartIcon.style.visibility = 'visible';
    }

    function onLeave(){
        heartIcon.style.visibility = 'hidden';
    }
</script>