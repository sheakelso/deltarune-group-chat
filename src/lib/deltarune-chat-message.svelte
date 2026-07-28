<script lang="ts">
    import DeltaruneTextBox from "./deltarune-text-box.svelte";
    import type { Message } from "./entities/message.entity";
    import type { ClientMessage } from "./types";

    let { message }: { message: ClientMessage } = $props();
</script>

<div class="chat-message">
    <div class="message-info"></div>
    <div class="text-box-container">
        <div class="info-box">
            {message.user.username}
        </div>
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
        font-size: 25px;
        padding: 5px;
    }

    .text-box-container{
        display: flex;
        flex-direction: column;
    }
</style>
