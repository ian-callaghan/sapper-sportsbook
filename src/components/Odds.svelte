<script>
    export let value = "0.00"
    export let selected = false
    export let disabled = false

    const handleClick = () => {
        selected = !selected
        if (disabled) {
            selected = false
        }
    }
</script>

<style>
    div {
        height: 100%;
        width: 100%;
        background: #122d49;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #f1cb01;
        font-size: 13px;
        font-weight: 500;
    }
    .selected {
        color: #ebebeb;
        background: #0b58a0;
    }
    .disabled {
        background: #162d46;
        color: #909090;
    }
</style>

<div class:selected class:disabled on:click={handleClick}>
    <span>{value}</span>
</div>
