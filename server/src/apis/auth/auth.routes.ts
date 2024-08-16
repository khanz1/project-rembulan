import express from 'express';
import * as Controller from './auth.controller';

const router = express.Router();

router.post('/login/google', Controller.handleLoginGoogle);

export default router;
