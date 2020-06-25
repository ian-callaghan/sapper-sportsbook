<script>
    export let amount = 0
</script>

<style>
    button {
        background: #001427;
        /* Baseline -2 */

        border: 1px solid #00203f;
        box-sizing: border-box;
        color: #ebebeb;
        height: 35px;
        font-size: 11px;
        border-radius: 0;
        width: 100%;
        margin: 0;
        padding: 0 9px 0 12px;
    }
    .container {
        display: flex;
        justify-content: space-between;
    }
    img {
        margin-left: 3px;
    }
</style>

<button class={$$props.class}>
    <div class="container">
        <slot />
        <div>
            <span>{amount}</span>
            <img src="/chevron-right.svg" alt="A-Z menu" />
        </div>
    </div>
</button>
