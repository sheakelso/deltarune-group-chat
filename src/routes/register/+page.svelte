<script lang="ts">
    import DeltaruneBtn from "$lib/deltarune-btn.svelte";

    let emailInput: HTMLInputElement;
    let usernameInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;

    async function onClick() {
        const email = emailInput.value;
        const username = usernameInput.value;
        const password = passwordInput.value;

        let response = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
            }),
        });

        if (!response.ok) return;
        console.log(response.body);
    }
</script>

<div></div>

<div class="center-vertical">
    <div class="center-horizontal">
        <form method="POST">
            <div class="form-grid">
                <label for="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    bind:this={emailInput}
                />
                <label for="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    bind:this={usernameInput}
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
        <br>
        <DeltaruneBtn text="Register" {onClick}></DeltaruneBtn>
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
