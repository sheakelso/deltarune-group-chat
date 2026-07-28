<img src="/images/spr_heart_centered_0.png" alt="Heart Icon" class="heart-icon"/>
<select class="deltarune-select" onmouseover={onHover} onmouseleave={onLeave} onchange={onChange}>
    {#if children}{@render children()}{/if}
</select>

<style>
    .deltarune-select {
        font-size: 30px;
        font-family: 'dtm';
        background: none;
        border: none;
        color: white;
    }

    .deltarune-select:hover {
        color: yellow;
    }

    .heart-icon {
        visibility: hidden;
        position: absolute;
        transform: translate(-35px, 10px);
        width: 25px;
        height: 25px;
        image-rendering: pixelated;
    }
</style>

<script lang="ts">
	let { children, onSelect } : {children? : any, onSelect : any} = $props();

    function onChange(event: Event){
        const select = event.target as HTMLSelectElement;
        onSelect(select.value);
    }

    function onHover(){
        const heartIcon = document.querySelector('.heart-icon') as HTMLImageElement;
        heartIcon.style.visibility = 'visible';
    }

    function onLeave(){
        const heartIcon = document.querySelector('.heart-icon') as HTMLImageElement;
        heartIcon.style.visibility = 'hidden';
    }
</script>