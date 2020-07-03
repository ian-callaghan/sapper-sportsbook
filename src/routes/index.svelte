<script context="module">
    // This also runs when we update session client side
    // I do not know why, it should only on route changes afaik
    export async function preload(page) {
        const res = await this.fetch(
            `https://quiet-bastion-27219.herokuapp.com/fixtures?first=2`,
        )
        const json = await res.json()
        return { fixtures: json.fixtures }
    }
</script>

<script>
    import Header from "../components/Header.svelte"
    import SectionHeader from "../components/SectionHeader.svelte"
    import SectionSubHeader from "../components/SectionSubHeader.svelte"
    import FlatButton from "../components/FlatButton.svelte"
    import FixtureGroup from "../components/FixtureGroup.svelte"
    import HomeAwayHeader from "../components/HomeAwayHeader.svelte"
    import Advert from "../components/Advert.svelte"
    import SideMenu from "../components/SideMenu.svelte"
    import Fixtures from "../components/Fixtures.svelte"
    import { stores } from "@sapper/app"

    export let fixtures
    const { session } = stores()
</script>

<style>
    .button-row {
        display: flex;
    }
</style>

<!--using typescript here fixtures fails to populate - WTF-->
<svelte:head>
    <title>Sapper project template</title>
</svelte:head>

<Advert />
<SectionHeader name="Popular Leagues" />
<div class="button-row">
    <FlatButton amount="34">Premier League</FlatButton>
    <FlatButton amount="42">Bundesliga</FlatButton>
</div>
<div class="button-row">
    <FlatButton amount="14">La Liga</FlatButton>
    <FlatButton amount="7">France Ligue</FlatButton>
</div>
<SectionHeader name="All Matches" />
<SectionSubHeader>
    <HomeAwayHeader title="Bundesliga 1" />
</SectionSubHeader>

{#if fixtures}
    <Fixtures data={fixtures} />
{/if}

{#if $session.betslip.length}
    <div>My betslip contains:</div>
{/if}
{#each $session.betslip as name}
    <div>{name}</div>
{/each}
