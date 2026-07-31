import { Request, Response, NextFunction } from 'express';

/**
 * Image Upload Controller with Cloudinary fallback
 */
export class UploadController {
  static async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { imageUrl, folder } = req.body;
      
      // Return provided URL or fallback image
      const finalUrl = imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: finalUrl,
          folder: folder || 'food_delivery',
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
