// Third party imports
import { utilsConstants, utilsMessages } from "@mono/utils";
import type { Request, Response, NextFunction } from "express";

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
    let message: string = utilsMessages.DEFAULT_ERROR_MESSAGE;
    let statusCode: number = utilsConstants.HTTP_CODES.INTERNAL_SERVER_ERROR;


    
};
