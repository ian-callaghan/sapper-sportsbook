<script context="module">

</script>

<script>
    import * as sapper from "@sapper/app"
    const { session } = sapper.stores()
    console.log($session)
</script>

<form action="/set-bet" method="post">
    <input type="submit" name="upvote" value="Upvote" />
</form>
<div>{$session.test}</div>
<a rel="external" href="/main-menu" ref>banana</a>
