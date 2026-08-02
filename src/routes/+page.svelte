<div class="home-main">
    <img src="/images/logo.png" alt="Deltarune Group Chat logo" onmouseover={onLogoHover} onmouseleave={onLogoLeave} class="home-logo"/>
    <div class="home-buttons">
        {#if data.loggedIn}
        <DeltaruneBtn text={"Enter"} onClick={handleEnterClick}/>
        <DeltaruneBtn text={"Logout"} onClick={handleLogoutClick}/>
        {:else}
        <DeltaruneBtn text={"Login"} onClick={handleLoginClick}/>
        <DeltaruneBtn text={"Register"} onClick={handleRegisterClick}/>
        {/if}
    </div>
</div>

<style>
    .home-main {
		display: flex;
        flex-direction: column;
        gap: 20px;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.home-logo {
		width: 850px;
		height: auto;
	}

    .home-buttons{
        display: flex;
        flex-direction: column;
    }

</style>

<script lang="ts">
    import { resolve } from "$app/paths";
    import DeltaruneBtn from "$lib/deltarune-btn.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    function onLogoHover(){
        const logo = document.querySelector('.home-logo') as HTMLImageElement;
        logo.src = '/images/logo-hover.png';
    }
    
    function onLogoLeave(){
        const logo = document.querySelector('.home-logo') as HTMLImageElement;
        logo.src = '/images/logo.png';
    }

    function handleEnterClick() {
        document.location.href = '/chat';
    }

    function handleLoginClick() {
        document.location.href = '/login';
    }

    function handleRegisterClick() {
        document.location.href = '/register';
    }

    async function handleLogoutClick(){
        await fetch('/api/logout', {
            method: "POST"
        });
        document.location.reload();
    }
</script>