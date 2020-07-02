import { Request, Response, NextFunction } from "express"

export async function get(req: Request, res: Response, next: NextFunction) {
    req.headers.referer = req.headers.referer
    next()
}
