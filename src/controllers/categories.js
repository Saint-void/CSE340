import {
    getAllCategories,
    getCategoryDetails,
    getCategoriesByProjectId,
    createCategory,
    updateCategory,
    updateCategoryAssignments
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryDetails(categoryId);

        if (!category) {
            const err = new Error('Category not found');
            err.status = 404;
            next(err);
            return;
        }

        const projects = await getProjectsByCategoryId(categoryId);

        res.render('category', {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        next(error);
    }
};

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId || req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const err = new Error('Project not found');
            err.status = 404;
            next(err);
            return;
        }

        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        res.render('assign-categories', {
            title: 'Assign Categories to Project',
            project,
            categories,
            assignedCategories
        });
    } catch (error) {
        next(error);
    }
};

const categoryValidation = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters.')
];

const showNewCategoryForm = async (req, res, next) => {
    try {
        const title = 'Add New Category';

        res.render('new-category', {
            title,
            errors: req.flash('errors'),
            formData: req.flash('formData')[0] || {}
        });
    } catch (error) {
        next(error);
    }
};

const processNewCategoryForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            req.flash('formData', req.body);
            return res.redirect('/new-category');
        }

        const { name } = req.body;
        await createCategory(name);

        req.flash('success', 'Category created successfully!');
        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
};

const showEditCategoryForm = async (req, res, next) => {
    try {
        const id = req.params.id;
        const categoryDetails = await getCategoryDetails(id);

        if (!categoryDetails) {
            const err = new Error('Category not found');
            err.status = 404;
            next(err);
            return;
        }

        res.render('edit-category', {
            title: 'Edit Category',
            categoryDetails,
            errors: req.flash('errors'),
            formData: req.flash('formData')[0] || {}
        });
    } catch (error) {
        next(error);
    }
};

const processEditCategoryForm = async (req, res, next) => {
    try {
        const id = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            req.flash('formData', req.body);
            return res.redirect(`/edit-category/${id}`);
        }

        const { name } = req.body;
        await updateCategory(id, name);

        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${id}`);
    } catch (error) {
        next(error);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId || req.params.id;

        let categoryIds = req.body.categoryIds || req.body.categories || [];
        if (!Array.isArray(categoryIds)) {
            // Single selection comes through as a string
            categoryIds = [categoryIds];
        }

        // Normalize to integers
        categoryIds = categoryIds.map(id => Number(id)).filter(id => !Number.isNaN(id));

        await updateCategoryAssignments(projectId, categoryIds);

        req.flash('success', 'Category assignments updated.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation };

