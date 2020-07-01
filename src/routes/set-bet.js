export async function post(req, res, next) {
    console.log(req.body.upvote)
    res.redirect(307, "/test")
}
