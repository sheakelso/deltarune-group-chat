<script lang="ts">
    let { normal, hover, pressed, onClick } = $props();

    let sendBtnSrc = $state(normal);

    function onSendButtonHover() {
        sendBtnSrc = hover;
    }

    function onSendButtonLeave() {
        sendBtnSrc = normal;
    }

    function onSendButtonDown() {
        sendBtnSrc = pressed;
    }

    function onSendButtonUp() {
        sendBtnSrc = hover;
        onClick();
    }

</script>

<div class="send-btn-container">
    <button
        class="send-btn"
        onmouseover={onSendButtonHover}
        onmouseleave={onSendButtonLeave}
        onmousedown={onSendButtonDown}
        onmouseup={onSendButtonUp}
    >
        <img src={sendBtnSrc} />
    </button>
</div>

<style>
    .send-btn-container {
        display: flex;
        align-items: center;
        height: 100%;
    }

    .send-btn {
        display: flex;
        background: none;
        border: none;
        height: 70px;
        width: 70px;
        image-rendering: pixelated;
    }
</style>
