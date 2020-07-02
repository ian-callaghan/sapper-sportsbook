<script>
    import Odds from "./Odds.svelte"
    import OddsGroup from "./OddsGroup.svelte"
    import { browserNoJS } from "./stores"
    import * as api from "../api"
    import { stores } from "@sapper/app"
    const { session } = stores()
    const { operaMini } = $session

    let noJS
    browserNoJS.subscribe(v => (noJS = v))

    export let fixture
    $: mainMarket = fixture.markets[0] || []

    const onOddsClick = async name => {
        const result = await api.updateBetSlip(name)
        session.update(v => {
            return {
                ...v,
                betslip: result,
            }
        })
    }
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
    button {
        padding: 0;
        margin: 0;
        background: none;
        border: none;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<div class="container">
    <div class="details">
        <div class="team">
            <span class="score">1</span>
            <span class:name-mini={operaMini}>
                {fixture.name.split(' v ')[0]}
            </span>
        </div>
        <div class="team team-b">
            <span class="score">0</span>
            <span class:name-mini={operaMini}>
                {fixture.name.split(' v ')[1]}
            </span>
        </div>
        <span class="info">11' {fixture.markets.length}</span>
    </div>
    <OddsGroup filled>
        {#each mainMarket.outcomes as outcome}
            <div class="odds">
                <button
                    form="bets"
                    name="selection"
                    value={fixture.name}
                    on:click={_ => onOddsClick(fixture.name)}>
                    <Odds value={outcome ? outcome.odds.toFixed(2) : '0.00'} />
                </button>
            </div>
        {/each}
    </OddsGroup>
</div>
{#if noJS}
    <form action="/" method="post" id="bets" />
{/if}
