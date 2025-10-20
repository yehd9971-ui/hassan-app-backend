import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';

export function validateObjectId(req: Request, res: Response, next: NextFunction): void {
  const { id } = req.params;
  
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ 
      success: false, 
      message: "معرّف غير صالح",
      error: "Invalid ObjectId format"
    });
    return;
  }
  
  next();
}
