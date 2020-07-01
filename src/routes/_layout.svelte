<script>
    import Header from "../components/Header.svelte"
    import SideMenu from "../components/SideMenu.svelte"

    let menuOpen = false
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
