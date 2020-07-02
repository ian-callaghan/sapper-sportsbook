import { Request, Response, NextFunction } from "express"

export async function post(req: Request, res: Response, next: NextFunction) {
    if (req.session) {
        req.session.betslip = req.session.betslip || []
    }
    req.session?.betslip.push(req.body.selection)
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(req.session?.betslip))
}
