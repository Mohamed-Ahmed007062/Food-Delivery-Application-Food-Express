import { Router } from 'express';
import { UploadController } from './upload.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /upload:
 *   post:
 *     summary: Upload image asset (Meal / Logo / Banner)
 *     tags: [Upload]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl: { type: string }
 *               folder: { type: string }
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post('/', protect, UploadController.uploadImage);

export default router;
