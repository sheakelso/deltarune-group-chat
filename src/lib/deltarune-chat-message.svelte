<script lang="ts">
    import DeltaruneTextBox from "./deltarune-text-box.svelte";
    import type { Message } from "./entities/message.entity";
    import type { ClientMessage } from "./types";

    let { message, includeInfo }: { message: ClientMessage, includeInfo: boolean } = $props();
</script>

<div class="chat-message">
    <div class="message-info"></div>
    <div class="text-box-container">
        
        {#if includeInfo}
        <div class="info-box">
            <p style="font-size: 23px; text-wrap: nowrap;">{message.user.username}</p>
            <p style="font-size: 18px; text-wrap: nowrap;">{" - " + new Date(message.created).toLocaleTimeString("en-us", {hour: "numeric", minute: "2-digit"})}</p>
        </div>
        {/if}
        
        <DeltaruneTextBox
            text={message?.body}
            faceSprite={message?.faceSprite}
            disabled="false"
        ></DeltaruneTextBox>
    </div>

    <div class="right-chat-div"></div>
</div>

<style>
    .chat-message {
        display: grid;
        grid-template-columns: 1fr min-content 1fr;
    }

    .message-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: end;
        font-size: 20px;
        margin: 20px;
    }

    .info-box{
        outline: white solid 6px;
        margin-bottom: 6px;
        width: min-content;
        height: 35px;
        font-size: 25px;
        display: flex;
        align-items: end;
    }

    .text-box-container{
        display: flex;
        flex-direction: column;
    }

    p {
        padding: 0px;
        margin: 5px;
    }
</style>
