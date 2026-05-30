import db from './db.js';

const getAllProjects = async () => {
    try {
        // Use an inner join to merge project rows with their sponsoring organization names
        const query = `
            SELECT p.id, p.title, p.description, p.location, p.date, o.name AS organization_name 
            FROM public.project p
            INNER JOIN public.organization o ON p.organization_id = o.organization_id
            ORDER BY p.date ASC;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error executing getAllProjects query:', error);
        throw error;
    }
};

export { getAllProjects };
