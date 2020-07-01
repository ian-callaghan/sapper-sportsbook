export async function post(req, res, next) {
    req.session.betslip = req.session.betslip || []
    req.session.betslip.push(req.body.selection)
    next()
}
