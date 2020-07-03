<script>
    import FixtureGroup from "./FixtureGroup.svelte"

    // const getFixtures = async (cursor = "") => {
    //     const res = await fetch(
    //         `https://quiet-bastion-27219.herokuapp.com/fixtures?first=20&after=${cursor}`,
    //     )
    //     const json = await res.json()
    //     fixtures = (fixtures || []).concat(json.fixtures.fixtures)
    //     return json.fixtures
    // }
    // let fixturesPromise // = getFixtures()
    export let data
</script>

<style>
    .loading {
        text-align: center;
        color: #bbbbbb;
    }
    section {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    button {
        background: none;
        border: solid 1px #213242;
        font-size: 11px;
        color: #ebebeb;
        border-radius: 20px;
        height: 30px;
        width: 164px;
        padding: 0;
        margin: 8px 0;
    }
    button:disabled {
        opacity: 0.75;
    }
</style>

<section>
    {#if data.fixtures}
        {#each data.fixtures as fixture}
            <FixtureGroup {fixture} />
        {/each}
    {:else}
        <p class="loading">loading fixtures...</p>
    {/if}
    <!-- {#await fixturesPromise}
        {#if fixtures}
            <button disabled>Loading...</button>
        {/if}
    {:then res}
        {#if res.cursor}
            <button
                on:click={_ => {
                    fixturesPromise = getFixtures(res.cursor)
                }}>
                Load More
            </button>
        {/if}
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await} -->
</section>
