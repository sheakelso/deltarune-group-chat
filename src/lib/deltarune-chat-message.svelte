<script lang="ts">
    import type { Socket } from "socket.io-client";
    import DeltaruneSendBtn from "./deltarune-send-btn.svelte";
    import DeltaruneTextBox from "./deltarune-text-box.svelte";
    import type { Message } from "./entities/message.entity";
    import type { ClientMessage } from "./types";
    import { page } from "$app/state"

    let { message, includeInfo, socket }: { message: ClientMessage, includeInfo: boolean, socket: Socket } = $props();

    let btnContainer: HTMLDivElement;
    
    function onReportClick(){
        let confirmed: boolean = confirm("Are you sure you want to report this message?");
        if(confirmed) socket.emit("reportMessage", message.id);
    }

    function onDeleteClick(){
        let confirmed: boolean = confirm("Are you sure you want to delete this message?");
        if(confirmed) socket.emit("deleteMessage", message.id);
    }

    function onHover(){
        btnContainer.style.visibility = "visible";
    }

    function onLeave(){
        btnContainer.style.visibility = "hidden";
    }
</script>

<div class="chat-message" onmouseover={onHover} onmouseleave={onLeave} onfocus={onHover}>
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
        <div class="btn-container" bind:this={btnContainer}>
            {#if page?.data?.userInfo?.publicId != message?.user?.publicId}
            <DeltaruneSendBtn normal="/images/report.png" hover="/images/report_hover.png" pressed="/images/report_pressed.png" onClick={onReportClick}>
            </DeltaruneSendBtn>
            {:else}
            <DeltaruneSendBtn normal="/images/delete.png" hover="/images/delete_hover.png" pressed="/images/delete_pressed.png" onClick={onDeleteClick}>
            </DeltaruneSendBtn>
            {/if}
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

    .btn-container{
        margin-left: 50px;
        visibility: hidden;
    }

    p {
        padding: 0px;
        margin: 5px;
    }
</style>
