import { Response, Request, NextFunction } from "express";

export abstract class BaseController {
    protected sendSuccess(response: Response, data: any, statusCode: number = 200): void {
        response.status(statusCode).json({
            success: true,
            data: data
        });
    }

    protected sendError(response: Response, message: string, statusCode: number = 500): void {
        response.status(statusCode).json({
            success: false,
            error: message
        });
    }

    // added this pattern to avoid try catch blocks in every controller method
    protected wrapAsync(
        fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
    ) {
        return (req: Request, res: Response, next: NextFunction) => {
            fn(req, res, next).catch(next);
        };
    }
}
