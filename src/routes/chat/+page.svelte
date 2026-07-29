<script lang="ts">
    import DeltaruneBtn from "$lib/deltarune-btn.svelte";
    import DeltaruneSelect from "$lib/deltarune-select.svelte";
    import DeltaruneFaceBtn from "$lib/deltarune-face-btn.svelte";
    import DeltaruneTextBox from "$lib/deltarune-text-box.svelte";
    import { io, Socket } from "socket.io-client";
    import { mount, onMount } from "svelte";
    import type { PageProps } from "./$types";
    import { Message } from "$lib/entities/message.entity";
    import DeltaruneChatMessage from "$lib/deltarune-chat-message.svelte";
    import type { DeltaCharacter } from "$lib/entities/deltaCharacter.entity";
    import type { FaceSprite } from "$lib/entities/faceSprite.entity";
    import type { ClientMessage } from "$lib/types";

    let {data}: PageProps = $props();

    let fakeMessage: ClientMessage = {
        id: 0,
        body: "Fake message",
        created: new Date(Date.now()),
        faceSprite: {
            id: 1,
            image: "",
            characterName: "ralsei",
            altText: ""
        },
        user: {
            username: "BoopetyDoopety",
            publicId: "dfsdfsdf"
        }
    }

    let chatContainer: HTMLDivElement;
    let characterOptions = $state();
    let textBox: DeltaruneTextBox;
    let sendBtnSrc = $state("/images/send.png");
    let faceSpriteList: HTMLDivElement;

    let currentFaceSprite = $state();

    let storedMessages: ClientMessage[] = [];

    onMount(() => {
        createMessageBox(fakeMessage, true);
        console.log(data);
        if(!data.loggedIn) document.location.href = "/login";
        createChatSocket();
        createCharacterOptions();
    })

    let socket: Socket;

    function createChatSocket(){
        socket = io("http://localhost:3000");
        let cookie = cookieStore.get("SID");

        socket.on("connect", () => {
            socket.emit("auth", cookie, (success: boolean) => {
                console.log(success);
                if(success) onSocketAuth();
                else document.location.href = "/";
            });
        });

        socket.connect();
    }

    function onSocketAuth(){
        socketGetMessages(true, 10, 0);

        socket.on("newMessage", (message)=>{
            createMessageBox(message, true);
        })
    }

    function socketGetMessages(recent: boolean, count: number, lastId: number | undefined){
        socket.emit("getMessages", {recent: true, count: 10}, (messages: ClientMessage[])=>{
            for(let i = messages.length - 1; i >= 0; i--){
                let lastMessage = storedMessages.length > 0 ? storedMessages[storedMessages.length - 1] : undefined;
                let includeInfo = lastMessage?.user.publicId != messages[i].user.publicId;
                storedMessages.push(messages[i]);
                createMessageBox(messages[i], includeInfo);
            }
        });
    }

    function socketSendMessage(messageData: object){
        socket.emit("sendMessage", messageData, (success: boolean) => {
            console.log(success)
        })
    }

    function createMessageBox(message: ClientMessage, includeInfo: boolean){
        mount(DeltaruneChatMessage, {
            target: chatContainer,
            props: {
                message: message,
                includeInfo: includeInfo
            }
        })
    }

    function createCharacterOptions(){
        characterOptions = "";
        for(let i = 0; i < data.characters.length; i++){
            characterOptions += "<option value=\"" + data.characters[i].internalName + "\">" + data.characters[i].displayName + "</option><br>";
        }
    }
    
    function onCharacterSelect(value: string){
        faceSpriteList.innerHTML = "";
        let faceSprites = data.faceSprites[value];

        for(let i = 0; i < faceSprites.length; i++){
            mount(DeltaruneFaceBtn, {
                target: faceSpriteList,
                props: {
                    faceSprite: faceSprites[i],
                    onSelect: onFaceSelect
                }
            })
        }
    }

    function onFaceSelect(faceSprite: FaceSprite){
        currentFaceSprite = faceSprite;
    }

    function onSendButtonHover(){
        sendBtnSrc = "/images/send_hover.png";
    }

    function onSendButtonLeave(){
        sendBtnSrc = "/images/send.png";
    }

    function onSendButtonDown(){
        sendBtnSrc = "/images/send_pressed.png";
    }

    function onSendButtonUp(){
        sendBtnSrc = "/images/send_hover.png";
        socketSendMessage(textBox.getMessageData());

    }
</script>

<div class="chat-page">

    <div class="chat-window">
        <div class="chat-container" bind:this={chatContainer}>
        </div>
    </div>

    <div class="chat-editor">
        <div class="face-sprite-selector">
            <DeltaruneSelect onSelect={onCharacterSelect}>
                {@html characterOptions}
            </DeltaruneSelect>
            <div class="face-sprite-list" bind:this={faceSpriteList}>

            </div>
        </div>
        <DeltaruneTextBox faceSprite={currentFaceSprite} disabled={false} text={""} bind:this={textBox}/>
        <div class="face-sprite-selector">
            <div class="send-btn-container">
                <button class="send-btn" onmouseover={onSendButtonHover} onmouseleave={onSendButtonLeave} onmousedown={onSendButtonDown} onmouseup={onSendButtonUp}>
                    <img src={sendBtnSrc}>
                </button>
            </div>
        </div>
    </div>

</div>



<style>
    .chat-page {
        display: grid;
        grid-template-rows: auto min-content;
        height: 100vh;
        width: 100%;
    }

    .chat-window{
        display: flex;
        flex-direction: column-reverse;
        height: 100%;
        background-color: black;
        min-height: 0px;
    }

    .chat-container{
        padding: 25px;
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
    }

    .chat-editor {
        display: grid;
        grid-template-columns: 1fr min-content 1fr;
        border-top: 6px solid #ffffff;
        height: 225px;
        width: 100%;
    }

    .face-sprite-selector {
        padding: 10px 50px;
        min-width: 0px;
    }

    .face-sprite-list{
        display: flex;
        flex-direction: row;
        height: 137px;
        overflow-y: hidden;
        overflow-x: scroll;
        border: white solid 6px;
    }

    .send-btn-container{
        display: flex;
        align-items: center;
        height: 100%;
    }

    .send-btn{
        display: flex;
        background: none;
        border: none;
        height: 70px;
        width: 70px;
        image-rendering: pixelated;
    }
</style>