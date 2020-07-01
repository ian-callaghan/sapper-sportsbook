<script>
    import Header from "../components/Header.svelte"
    import SideMenu from "../components/SideMenu.svelte"

    import { isOperaMini } from "../components/stores.js"

    let menuOpen = false
    import { stores } from "@sapper/app"
    const { preloading, page, session } = stores()
    session.subscribe(value => {
        console.log(value)
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
    </main>
</div>
