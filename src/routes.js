import express from 'express';
import { showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectDetailsPage, showProjectsPage } from './controllers/projects.js';

const router = express.Router();

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

export default router;
