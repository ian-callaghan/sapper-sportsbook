<script>
    import Header from "../components/Header.svelte"
    import SideMenu from "../components/SideMenu.svelte"
    import { onMount } from "svelte"

    let menuOpen = false
    import { stores } from "@sapper/app"
    import { browserNoJS } from "../components/stores"
    const { session } = stores()

    let noJS
    browserNoJS.subscribe(v => (noJS = v))
    onMount(async () => {
        browserNoJS.update(_ => $session.operaMini)
    })
</script>

<style>
    main {
        top: 45px;
        position: absolute;
        width: 100%;
        max-width: 100%;
    }
</style>

{#if menuOpen}
    <SideMenu
        on:close-click={_ => {
            menuOpen = false
        }} />
{/if}

<!-- <Header /> -->
<Header
    on:menu-click={_ => {
        menuOpen = true
    }} />

<div>
    <main>
        <slot />
        <div>JS Disabled: {noJS}</div>
    </main>
</div>
