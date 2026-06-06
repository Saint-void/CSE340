import db from './db.js';

const PROJECT_SELECT = `
    SELECT
        p.id AS project_id,
        p.title,
        p.description,
        p.date,
        p.location,
        p.organization_id,
        o.name AS organization_name
    FROM public.project p
    INNER JOIN public.organization o ON p.organization_id = o.organization_id
`;

const getAllProjects = async () => {
    try {
        // Use an inner join to merge project rows with their sponsoring organization names
        const query = `
            ${PROJECT_SELECT}
            ORDER BY p.date ASC;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error executing getAllProjects query:', error);
        throw error;
    }
};

const getUpcomingProjects = async (number_of_projects) => {
    try {
        const query = `
            ${PROJECT_SELECT}
            WHERE p.date >= CURRENT_DATE
            ORDER BY p.date ASC
            LIMIT $1;
        `;
        const result = await db.query(query, [number_of_projects]);
        return result.rows;
    } catch (error) {
        console.error('Error executing getUpcomingProjects query:', error);
        throw error;
    }
};

const getProjectsByOrganizationId = async (organizationId) => {
    try {
        const query = `
            SELECT
                id AS project_id,
                organization_id,
                title,
                description,
                location,
                date
            FROM public.project
            WHERE organization_id = $1
            ORDER BY date;
        `;
        const result = await db.query(query, [organizationId]);
        return result.rows;
    } catch (error) {
        console.error('Error executing getProjectsByOrganizationId query:', error);
        throw error;
    }
};

const getProjectDetails = async (id) => {
    try {
        const query = `
            ${PROJECT_SELECT}
            WHERE p.id = $1;
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error executing getProjectDetails query:', error);
        throw error;
    }
};

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectsByOrganizationId,
    getProjectDetails
};
