import express from 'express';
import { showHomePage } from './controllers/index.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import {
    showOrganizationDetailsPage,
    showOrganizationsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';
import { showProjectDetailsPage, showProjectsPage } from './controllers/projects.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
router.get('/test-error', testErrorPage);

export default router;
