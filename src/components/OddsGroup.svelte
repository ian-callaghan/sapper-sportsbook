<script>
    export let filled = false
</script>

<style>
    div {
        padding: 5px 0;
        display: flex;
        width: 58%;
        z-index: 1;
    }
    .filled {
        background: #001c37;
    }
</style>

<div class:filled>
    <slot />
</div>
