<script>
    import OddsGroup from "./OddsGroup.svelte"

    export let title = ""
</script>

<style>
    .odds {
        padding: 0 5px;
        width: 100%;
        text-align: center;
    }
    .header-details {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }
</style>

<div class="header-details">
    <span>{title}</span>
    <OddsGroup>
        <div class="odds">1</div>
        <div class="odds">X</div>
        <div class="odds">2</div>
    </OddsGroup>
</div>
