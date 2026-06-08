import { getProjectDetails, getUpcomingProjects, createProject, updateProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('organizationId')
        .isInt({ min: 1 })
        .withMessage('Organization is required.'),
    body('title')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters.'),
    body('description')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Description is required and cannot exceed 1000 characters.'),
    body('location')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Location is required and cannot exceed 200 characters.'),
    body('date')
        .isISO8601()
        .toDate()
        .withMessage('Valid date is required.')
];

const showProjectsPage = async (req, res, next) => {
    try {
        const title = 'Upcoming Service Projects';
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

        res.render('projects', { title, projects });
    } catch (error) {
        next(error);
    }
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const project = await getProjectDetails(id);

        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            next(err);
            return;
        }

        const categories = await getCategoriesByProjectId(id);

        res.render('project', {
            title: project.title,
            project,
            categories
        });
    } catch (error) {
        next(error);
    }
};



const showNewProjectForm = async (req, res, next) => {
    try {
        const title = 'New Service Project';
        const organizations = await getAllOrganizations();
        res.render('new-project', {
            title,
            organizations,
            errors: req.flash('errors'),
            formData: req.flash('formData')[0] || {}
        });
    } catch (error) {
        next(error);
    }
};

const processNewProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            req.flash('formData', req.body);
            return res.redirect('/new-project');
        }

        const { organizationId, title, description, location, date } = req.body;

        await createProject(title, description, location, date, organizationId);
        req.flash('success', 'New service project added successfully!');
        res.redirect('/projects');
    } catch (error) {
        next(error);
    }
};

const showEditProjectForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const project = await getProjectDetails(id);

        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            next(err);
            return;
        }

        const organizations = await getAllOrganizations();

        res.render('edit-project', {
            title: 'Edit Service Project',
            project,
            organizations,
            errors: req.flash('errors'),
            formData: req.flash('formData')[0] || {}
        });
    } catch (error) {
        next(error);
    }
};

const processEditProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const { id } = req.params;
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            req.flash('formData', req.body);
            return res.redirect(`/edit-project/${id}`);
        }

        const { organizationId, title, description, location, date } = req.body;

        await updateProject(id, title, description, location, date, organizationId);

        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${id}`);
    } catch (error) {
        next(error);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};
