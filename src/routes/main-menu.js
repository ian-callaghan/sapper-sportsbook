export async function get(req, res, next) {
    req.headers.referer = req.headers.referer
    next()
}
