<script lang="ts">
    import DeltaruneBtn from "$lib/deltarune-btn.svelte";

    let emailInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;

    async function onClick() {
        const email = emailInput.value;
        const password = passwordInput.value;

        let response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (!response.ok) return;
        else document.location.href = "/";
    }
</script>

<div class="center-vertical">
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

        <br />

        <DeltaruneBtn text="Login" {onClick}></DeltaruneBtn>
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

    label {
        text-align: left;
    }
</style>
