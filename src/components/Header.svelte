<script>
    import { createEventDispatcher } from "svelte"
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
    }

    .burger-icon {
        margin-right: 5px;
    }

    .yellow {
        color: #f1cb01;
        font-weight: 500;
    }
</style>

<header>
    <div class="menu-flex" on:click={_ => dispatch('menu-click')}>
        <img class="burger-icon" src="/burger.svg" alt="A-Z menu" />
        <span>A-Z</span>
    </div>
    <span>Live</span>
    <img src="/logo.svg" alt="Rivalo brand logo" />
    <span>Log In</span>
    <span class="yellow">Join</span>
</header>
