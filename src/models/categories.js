import db from './db.js';

const getAllCategories = async() => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryDetails = async(categoryId) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows.length > 0 ? result.rows[0] : null;
}

const getCategoriesByProjectId = async(projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.category c
        INNER JOIN public.project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows;
}

const getProjectsByCategoryId = async(categoryId) => {
    const query = `
        SELECT
            p.id AS project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.name AS organization_name
        FROM public.project p
        INNER JOIN public.project_category pc
            ON p.id = pc.project_id
        INNER JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.date;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
}

const createCategory = async (name) => {
    try {
        const query = `
            INSERT INTO public.category (name)
            VALUES ($1)
            RETURNING category_id;
        `;

        const result = await db.query(query, [name]);

        if (result.rows.length === 0) {
            throw new Error('Failed to create category');
        }

        return result.rows[0].category_id;
    } catch (error) {
        console.error('Error executing createCategory query:', error);
        throw error;
    }
};

const updateCategory = async (id, name) => {
    try {
        const query = `
            UPDATE public.category
            SET name = $1
            WHERE category_id = $2
            RETURNING category_id;
        `;

        const result = await db.query(query, [name, id]);

        if (result.rows.length === 0) {
            throw new Error('Failed to update category');
        }

        return result.rows[0].category_id;
    } catch (error) {
        console.error('Error executing updateCategory query:', error);
        throw error;
    }
};

/**
 * Assign a category to a project by inserting into the join table.
 * Not exported — used internally by updateCategoryAssignments.
 */
const assignCategoryToProject = async (projectId, categoryId) => {
    try {
        const query = `
            INSERT INTO public.project_category (project_id, category_id)
            VALUES ($1, $2);
        `;

        await db.query(query, [projectId, categoryId]);
    } catch (error) {
        console.error('Error executing assignCategoryToProject query:', error);
        throw error;
    }
};

/**
 * Update the category assignments for a project.
 * This removes existing assignments and then inserts the provided ones.
 */
const updateCategoryAssignments = async (projectId, categoryIds) => {
    try {
        // Delete existing assignments for the project
        const deleteQuery = `
            DELETE FROM public.project_category
            WHERE project_id = $1;
        `;

        await db.query(deleteQuery, [projectId]);

        // If no categories provided, we're done
        if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
            return;
        }

        // Insert new assignments
        for (const categoryId of categoryIds) {
            await assignCategoryToProject(projectId, categoryId);
        }
    } catch (error) {
        console.error('Error executing updateCategoryAssignments:', error);
        throw error;
    }
};

export {
    getAllCategories,
    getCategoryDetails,
    getCategoriesByProjectId,
    getProjectsByCategoryId
    ,
    createCategory,
    updateCategory,
    updateCategoryAssignments
};
