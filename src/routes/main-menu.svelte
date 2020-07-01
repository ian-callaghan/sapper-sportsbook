<script context="module">
    export async function preload(page, session) {
        return { referer: session.referer }
    }
</script>

<script>
    import SideMenu from "../components/SideMenu.svelte"
    export let referer
    console.log(referer)
</script>

<SideMenu ref={referer} />
