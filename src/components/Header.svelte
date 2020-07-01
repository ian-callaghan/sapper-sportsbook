<script>
    import { createEventDispatcher } from "svelte"
    import { isOperaMini } from "./stores.js"

    const dispatch = createEventDispatcher()
</script>

<style>
    header {
        display: flex;
        background: #003366;
        color: #ebebeb;
        padding: 0 12px;
        align-items: center;
        box-sizing: border-box;
        justify-content: space-between;
        height: 45px;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 90;
    }
    span {
        font-size: 13px;
    }

    .menu-flex {
        display: flex;
        color: #ebebeb;
        position: relative;
    }

    .burger-icon {
        margin-right: 5px;
    }

    .yellow {
        color: #f1cb01;
        font-weight: 500;
    }
    .no-script-zone {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .hidden-link {
        display: none;
    }
</style>

<header>
    <div class="menu-flex" on:click={_ => dispatch('menu-click')}>
        <img class="burger-icon" src="/burger.svg" alt="A-Z menu" />
        <span>A-Z</span>
        <a
            class:hidden-link={!isOperaMini}
            rel="external"
            href="/main-menu"
            class="no-script-zone">
            {' '}
        </a>
        <noscript>
            <a rel="external" href="/main-menu" class="no-script-zone">{' '}</a>
        </noscript>
    </div>
    <span>Live</span>
    <img src="/logo.svg" alt="Rivalo brand logo" />
    <span>Log In</span>
    <span class="yellow">Join</span>
</header>
