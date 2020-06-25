<script>

</script>

<style>
    div {
        background: #001c37;
        height: 120px;
        width: 100%;
    }
    img {
        position: absolute;
        right: 0;
    }
    .content {
        width: 50%;
        height: 100%;
        background: #001c37;
        position: relative;
        z-index: 1;
        -webkit-clip-path: polygon(0 0, 75% 0, 100% 100%, 0% 100%);
        clip-path: polygon(0 0, 75% 0, 100% 100%, 0% 100%);
    }
    .inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80%;
    }
    p {
        font-size: 14px;
        font-weight: 700;
        color: #ebebeb;
        margin-top: 33px;
    }
    button {
        width: 90px;
        height: 26px;
        font-size: 12px;
        font-weight: 700;
        padding: 0;
        margin: 0;
        background: #f1cb01;
        border-radius: 3px;
        border: none;
    }
</style>

<div>

    <img src="/ad.jpg" alt="advert" />
    <div class="content">
        <div class="inner">
            <p>
                UP TO 50 GHc
                <br />
                DEPOSIT BONUS
            </p>
            <button>SIGN UP</button>
        </div>
    </div>
</div>
