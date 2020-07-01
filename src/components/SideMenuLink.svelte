<script>

</script>

<style>
    .link {
        width: 100%;
        padding: 0 16px;
        height: 35px;
        display: flex;
        box-sizing: border-box;
    }
    .link-inner {
        border-bottom: solid 1px #001c37;
        width: 100%;
        height: 100%;
        color: #bbbbbb;
        display: flex;
        align-items: center;
        font-size: 13px;
    }
</style>

<div class="link">
    <div class="link-inner">
        <span>
            <slot />
        </span>
    </div>
</div>
