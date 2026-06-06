import { getOrganizationDetails, getOrganizationProjects } from '../models/organizations.js';

const showOrganizationDetailsPage = async (req, res) => {
    try {
        const { id } = req.params;
        const organization = await getOrganizationDetails(id);

        if (!organization) {
            res.status(404).send('Organization not found');
            return;
        }

        const projects = await getOrganizationProjects(id);

        res.render('organization', {
            title: organization.name,
            organization,
            projects
        });
    } catch (error) {
        console.error('Error handling /organization/:id route:', error);
        res.status(500).send('Internal Server Error');
    }
};

export { showOrganizationDetailsPage };
