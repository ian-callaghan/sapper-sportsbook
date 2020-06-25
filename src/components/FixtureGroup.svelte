<script>
    import { isOperaMini } from "./stores.js"
    import Odds from "./Odds.svelte"
    import OddsGroup from "./OddsGroup.svelte"

    export let fixture
    $: mainMarket = fixture.markets[0] || []
</script>

<style>
    .name-mini {
        max-width: 10px;
    }
    span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }
    .container {
        background: #001c37;
        color: #ebebeb;
        padding: 7px 12px;
        display: flex;
        justify-content: space-between;
        border-bottom: solid 1px #001427;
        width: 100%;
        box-sizing: border-box;
    }
    .details {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        font-size: 11px;
        color: #ebebeb;
        max-width: 42%;
    }
    .score {
        color: #f1cb01;
        width: 15px;
        min-width: 15px;
        text-align: left;
    }
    .team {
        display: flex;
        max-width: 100%;
    }
    .team-b {
        margin-top: 3px;
    }
    .info {
        margin-top: 3px;
        color: #909090;
    }
    .odds {
        padding: 0 5px;
        width: 100%;
        height: 100%;
        display: flex;
    }
</style>

<div class="container">
    <div class="details">
        <div class="team">
            <span class="score">1</span>
            <span class:name-mini={isOperaMini}>
                {fixture.name.split(' v ')[0]}
            </span>
        </div>
        <div class="team team-b">
            <span class="score">0</span>
            <span class:name-mini={isOperaMini}>
                {fixture.name.split(' v ')[1]}
            </span>
        </div>
        <span class="info">11' {fixture.markets.length}</span>
    </div>
    <OddsGroup filled>
        {#each mainMarket.outcomes as outcome}
            <div class="odds">
                <Odds
                    disabled={!outcome}
                    value={outcome ? outcome.odds.toFixed(2) : '0.00'} />
            </div>
        {/each}
    </OddsGroup>
</div>
