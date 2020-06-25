<script>
    import SideMenuLink from "./SideMenuLink.svelte"
    import { createEventDispatcher } from "svelte"
    import { isOperaMini } from "./stores.js"

    const dispatch = createEventDispatcher()
</script>

<style>
    aside {
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 100;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.33);
        display: flex;
    }
    .menu {
        width: 75%;
        max-width: 325px;
        min-width: 200px;
        height: 100%;
        background: #00101f;
    }
    .menu-opera-mini {
        width: 100%;
        max-width: 100%;
        /* padding-top: 45px; */
    }
    button {
        height: 45px;
        width: 33px;
        background: #00101f;
        border-radius: 0 25px 25px 0;
        border: none;
    }
    .button-opera-mini {
        position: absolute;
        right: 0;
    }
    button:active {
        background: #00101f;
    }

    .search {
        height: 32px;
        width: 100%;
        padding: 8px 14px;
        color: #bbb;
        background: #0b1e31;
        border: 1px solid #2e3740;
        border-radius: 22px;
        font-size: 13px;
        box-sizing: border-box;
    }
    .search-container {
        margin: 12px 16px;
    }
    .search-container-opera-mini {
        margin-right: 45px;
    }
</style>

<aside>
    <div class="menu" class:menu-opera-mini={isOperaMini}>
        <div
            class="search-container"
            class:search-container-opera-mini={isOperaMini}>
            <div class="search">Search</div>
        </div>
        <SideMenuLink>Live</SideMenuLink>
        <SideMenuLink>Next 48 hours</SideMenuLink>
        <SideMenuLink>By date</SideMenuLink>
    </div>
    <button
        class:button-opera-mini={isOperaMini}
        on:click={_ => dispatch('close-click')}>
        <img src="/menu_close.svg" alt="close" />
    </button>
</aside>
