<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script
		src="https://challenges.cloudflare.com/turnstile/v0/api.js"
		async
		defer
	></script>
</svelte:head>

{@render children()}

<style>
	:global(html, body) {
		background-color: black;
		margin: 0;
		padding: 0;
		overflow: hidden;
	}

	:global(textarea:focus) {
		outline: none;
	}

	:global(*) {
		font-family: "dtm";
		color: white;
		font-size: 30px;
	}

	:global(select) {
		background: none;
		border: none;
		color: white;
		font-family: "dtm";
	}

	:global(h1) {
		font-size: 50px;
	}

	@font-face {
		font-family: "dtm";
		font-style: normal;
		font-display: swap;
		src: url("/dtm-mono.ttf") format("truetype");
	}
</style>
