<script lang="ts">
    import DeltaruneBtn from "$lib/deltarune-btn.svelte";
    import { onMount } from "svelte";

    let emailInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;
    let turnstileToken: string;

    onMount(() => {
        // @ts-ignore
        window.onTurnstileSuccess = onTurnstileSuccess;
    })

    async function onClick() {
        const email = emailInput.value;
        const password = passwordInput.value;

        let response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
                token: turnstileToken
            }),
        });

        if (!response.ok) {
            let data = await response.json();
            error(data.message);
        }
        else document.location.href = "/";
    }

    function onTurnstileSuccess(token: string){
        console.log("TOKEN: " + token)
        turnstileToken = token;
    }

    function error(message: string){
        let errorElement = document.getElementById("error");
        if(errorElement) errorElement.innerText = message;
    }
</script>

<div class="center-vertical">
    <p id="error"></p>
    <div class="center-horizontal">
        <form method="POST" class="center-horizontal">
            <div class="form-grid">
                <label for="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    bind:this={emailInput}
                />
                <label for="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    bind:this={passwordInput}
                />
            </div>
        </form>

        <br/>
        <div class="cf-turnstile" data-sitekey="0x4AAAAAAECZvoqG5KN7fEpB" data-size="normal" data-callback="onTurnstileSuccess"></div>
        <br />

        <DeltaruneBtn text="Login" onClick={onClick}></DeltaruneBtn>
    </div>
</div>

<style>
    input {
        color: black;
    }

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

    .form-grid {
        display: grid;
        grid-template-columns: repeat(2, min-content);
        justify-content: center;
        column-gap: 20px;
    }

    #error {
        text-align: center;
        color: red;
    }

    label {
        text-align: left;
    }
</style>
