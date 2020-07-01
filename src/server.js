import sirv from "sirv"
import polka from "polka"
import compression from "compression"
import * as sapper from "@sapper/server"
import bodyParser from "body-parser"
import session from "express-session"
import sessionFileStore from "session-file-store"

const FileStore = sessionFileStore(session)

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === "development"

polka() // You can also use Express
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    /** Persists session data server side */
    .use(
        session({
            secret: "conduit",
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 31536000,
            },
            store: new FileStore({
                path: process.env.NOW ? `/tmp/sessions` : `.sessions`,
            }),
        }),
    )
    .use(
        compression({ threshold: 0 }),
        sirv("static", { dev }),
        sapper.middleware({
            session: (req, res) => ({
                referer: req.headers.referer,
                count: req.session.count || 1,
                betslip: req.session.betslip || [],
            }),
        }),
    )
    .listen(PORT, (err) => {
        if (err) console.log("error", err)
    })
