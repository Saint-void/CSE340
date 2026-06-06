import { getProjectDetails, getUpcomingProjects } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    try {
        const title = 'Upcoming Service Projects';
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error handling /projects route:', error);
        res.status(500).send('Internal Server Error');
    }
};

const showProjectDetailsPage = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await getProjectDetails(id);

        if (!project) {
            res.status(404).send('Project not found');
            return;
        }

        res.render('project', {
            title: project.title,
            project
        });
    } catch (error) {
        console.error('Error handling /project/:id route:', error);
        res.status(500).send('Internal Server Error');
    }
};

export { showProjectsPage, showProjectDetailsPage };
