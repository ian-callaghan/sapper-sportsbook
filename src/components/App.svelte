<script>
    import Header from "./Header.svelte"
    import SectionHeader from "./SectionHeader.svelte"
    import SectionSubHeader from "./SectionSubHeader.svelte"
    import FlatButton from "./FlatButton.svelte"
    import FixtureGroup from "./FixtureGroup.svelte"
    import HomeAwayHeader from "./HomeAwayHeader.svelte"
    import Advert from "./Advert.svelte"
    import SideMenu from "./SideMenu.svelte"
    import Fixtures from "./Fixtures.svelte"

    import { isOperaMini } from "./stores.js"

    let menuOpen = false
</script>

<style>
    main {
        top: 45px;
        position: absolute;
        width: 100%;
        max-width: 100%;
    }
    .button-row {
        display: flex;
    }
    .menu-open-opera-mini {
        display: none;
    }
</style>

{#if menuOpen}
    <SideMenu
        on:close-click={_ => {
            menuOpen = false
        }} />
{/if}

<div class:menu-open-opera-mini={isOperaMini && menuOpen}>
    <Header
        on:menu-click={_ => {
            menuOpen = true
        }} />
    <main>
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
        <Fixtures />
    </main>
</div>
