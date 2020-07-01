export async function get(req, res, next) {
    req.session.count++
    next()
}
