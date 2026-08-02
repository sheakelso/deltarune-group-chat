<script lang="ts">
    import DeltaruneSelect from "$lib/deltarune-select.svelte";
    import DeltaruneFaceBtn from "$lib/deltarune-face-btn.svelte";
    import DeltaruneTextBox from "$lib/deltarune-text-box.svelte";
    import { io, Socket } from "socket.io-client";
    import { mount, onMount, unmount } from "svelte";
    import type { PageProps } from "./$types";
    import DeltaruneChatMessage from "$lib/deltarune-chat-message.svelte";
    import type { FaceSprite } from "$lib/entities/faceSprite.entity";
    import type { ClientMessage } from "$lib/types";
    import DeltaruneSendBtn from "$lib/deltarune-send-btn.svelte";

    let { data }: PageProps = $props();

    let fakeMessage: ClientMessage = {
        id: 0,
        body: "Fake message",
        created: new Date(Date.now()).toString(),
        faceSprite: {
            id: 1,
            image: "",
            characterName: "ralsei",
            altText: "",
        },
        user: {
            username: "BoopetyDoopety",
            publicId: "dfsdfsdf",
        },
    };

    let chatContainer: HTMLDivElement;
    let characterOptions = $state();
    let textBox: DeltaruneTextBox;
    let faceSpriteList: HTMLDivElement;

    let currentFaceSprite = $state();

    let storedMessages: {handle: any, message: ClientMessage}[] = [];

    onMount(async () => {
        createMessageBox(fakeMessage, true, false);
        createMessageBox(fakeMessage, true, false);
        createMessageBox(fakeMessage, true, false);
        if (!data.loggedIn) document.location.href = "/login";
        createCharacterOptions();
        //createChatSocket();
    });

    let socket: Socket;

    async function createChatSocket() {
        socket = io();

        socket.on("connect", () => {
            socket.emit("auth", data.sid, (success: boolean) => {
                if (success) onSocketAuth();
                else document.location.href = "/";
            });
        });

        socket.connect();
    }

    function onSocketAuth() {
        socketGetMessages(true, 10, 0);

        socket.on("newMessage", (message) => {
            createMessageBox(message, true, false);
        });

        socket.on("deleteMessage", (id) => {
            let storedMessage = storedMessages.find(x => x.message.id == id);
            if(storedMessage != undefined){
                unmount(storedMessage.handle);

                let index = storedMessages.indexOf(storedMessage);
                storedMessages.splice(index, 1);
            }
        });
    }

    let canGetMessages = true;
    function socketGetMessages(
        recent: boolean,
        count: number,
        lastId: number | undefined,
    ) {
        console.log(lastId);
        if (!canGetMessages) return;
        canGetMessages = false;
        socket.emit(
            "getMessages",
            { recent: recent, count: count, lastId: lastId },
            (messages: ClientMessage[]) => {
                if (recent) {
                    for (let i = messages.length - 1; i >= 0; i--) {
                        createMessageBox(messages[i], true, false);
                    }
                } else {
                    for (let i = 0; i < messages.length; i++) {
                        createMessageBox(messages[i], true, true);
                    }
                }

                canGetMessages = true;
            },
        );
    }

    function socketSendMessage(messageData: object) {
        socket.emit("sendMessage", messageData, (success: boolean) => {});
    }

    function createMessageBox(
        message: ClientMessage,
        includeInfo: boolean,
        start: boolean,
    ) {
        let handle = mount(DeltaruneChatMessage, {
            target: chatContainer,
            anchor:
                chatContainer.firstChild != null && start
                    ? chatContainer.firstChild
                    : undefined,
            props: {
                message: message,
                includeInfo: includeInfo,
                socket: socket
            },
        });

        if(!start) storedMessages.push({
            handle: handle,
            message: message
        });
        else storedMessages.unshift({
            handle: handle,
            message: message
        });

        if (!start) chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function createCharacterOptions() {
        characterOptions = "";
        for (let i = 0; i < data.characters.length; i++) {
            if (data.characters[i].internalName == "ralsei") {
                characterOptions +=
                    '<option value="' +
                    data.characters[i].internalName +
                    '" selected="selected"">' +
                    data.characters[i].displayName +
                    "</option><br>";
            } else {
                characterOptions +=
                    '<option value="' +
                    data.characters[i].internalName +
                    '">' +
                    data.characters[i].displayName +
                    "</option><br>";
            }
        }

        onCharacterSelect("ralsei");
        onFaceSelect(data.faceSprites["ralsei"][0]);
    }

    function onCharacterSelect(value: string) {
        faceSpriteList.innerHTML = "";
        let faceSprites = data.faceSprites[value];

        for (let i = 0; i < faceSprites.length; i++) {
            mount(DeltaruneFaceBtn, {
                target: faceSpriteList,
                props: {
                    faceSprite: faceSprites[i],
                    onSelect: onFaceSelect,
                },
            });
        }
    }

    function onSendButtonClick(){
        socketSendMessage(textBox.getMessageData());
    }

    function onFaceSelect(faceSprite: FaceSprite) {
        currentFaceSprite = faceSprite;
    }

    function onScroll() {
        if (chatContainer.scrollTop < 200) {
            socketGetMessages(false, 10, storedMessages[0].message.id);
        }
    }
</script>


<div class="chat-page">
    <div class="chat-window">
        <div
            class="chat-container"
            onscroll={onScroll}
            bind:this={chatContainer}
        ></div>
        <div class="typing-indicator">
            
        </div>
    </div>

    <div class="chat-editor">
        <div class="face-sprite-selector">
            <DeltaruneSelect onSelect={onCharacterSelect}>
                {@html characterOptions}
            </DeltaruneSelect>
            <div class="face-sprite-list" bind:this={faceSpriteList}></div>
        </div>
        <DeltaruneTextBox
            faceSprite={currentFaceSprite}
            disabled={false}
            text={""}
            bind:this={textBox}
        />
        <div class="face-sprite-selector">
            <DeltaruneSendBtn normal="/images/send.png" hover="/images/send_hover.png" pressed="/images/send_pressed.png" onClick={onSendButtonClick}>

            </DeltaruneSendBtn>
        </div>
    </div>
</div>

<style>
    .chat-page {
        display: grid;
        grid-template-rows: 1fr min-content;
        height: 100vh;
        width: 100%;
    }

    .chat-window {
        height: 100%;
        background-color: black;
    }

    .chat-container {
        padding: 25px;
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        gap: 25px;
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

    .face-sprite-list {
        display: flex;
        flex-direction: row;
        height: 137px;
        overflow-y: hidden;
        overflow-x: scroll;
        border: white solid 6px;
    }

    .typing-indicator {
        height: 50px;
        width: 100%;
        background-color: black;
        bottom: 0px;
        position: absolute;
    }

</style>
