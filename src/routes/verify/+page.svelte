<script lang="ts">
    import DeltaruneBtn from "$lib/deltarune-btn.svelte";
    import { onMount } from "svelte";

    function onLoginClick(){
        document.location.href = "/login";
    }
</script>

<div class="center-vertical">
    <div class="center-horizontal">
        <p>Your email has been verified</p>
        <p>You can now login</p>

        <br>

        <DeltaruneBtn text="Login" onClick={onLoginClick}></DeltaruneBtn>
    </div>
</div>

<style>
    .center-horizontal {
        justify-content: center;
        text-align: center;
    }

    .center-vertical {
        display: flex;
        justify-content: center;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
    }
</style>
