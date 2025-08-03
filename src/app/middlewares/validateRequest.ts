import { NextFunction, Request, Response } from "express"
import { AnyZodObject } from "zod"

export const validateRequest = (zodSchema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("🚀 ~ file: validateRequest.ts ~ line 6 ~ validateRequest ~ req.body", req.body)
        req.body = await zodSchema.parseAsync(req.body)

        console.log("🚀 ~ file: validateRequest.ts ~ line 9 ~ validateRequest ~ req.body", req.body)

        next()
    } catch (error) {
        next(error)
    }
}