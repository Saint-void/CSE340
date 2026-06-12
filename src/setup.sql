-- Organizations
CREATE TABLE IF NOT EXISTS public.organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255)
);

INSERT INTO public.organization (name, description, contact_email, logo_filename)
SELECT seed_orgs.name, seed_orgs.description, seed_orgs.contact_email, seed_orgs.logo_filename
FROM (
    VALUES
    (
        'BrightFuture Builders',
        'BrightFuture Builders supports neighborhood improvement, mentoring, and practical help for families.',
        'info@brightfuture.org',
        'brightfuture-logo.png'
    ),
    (
        'UnityServe Volunteers',
        'UnityServe Volunteers coordinates hands-on service opportunities for shelters, families, and local nonprofits.',
        'hello@unityserve.org',
        'unityserve-logo.png'
    ),
    (
        'GreenHarvest Growers',
        'GreenHarvest Growers leads environmental care projects, community gardening, and sustainability events.',
        'contact@greenharvest.org',
        'greenharvest-logo.png'
    )
) AS seed_orgs(name, description, contact_email, logo_filename)
WHERE NOT EXISTS (
    SELECT 1
    FROM public.organization
    WHERE public.organization.name = seed_orgs.name
);

-- Service projects
CREATE TABLE IF NOT EXISTS public.project (
    id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY(organization_id)
        REFERENCES public.organization(organization_id)
        ON DELETE CASCADE
);

INSERT INTO public.project (organization_id, title, description, location, date)
SELECT org.organization_id, seed_projects.title, seed_projects.description, seed_projects.location, seed_projects.date
FROM (
    VALUES
    ('BrightFuture Builders', 'Community Food Drive', 'Sorting and packing non-perishable goods.', 'Main St. Food Bank', '2026-06-15'::date),
    ('BrightFuture Builders', 'Senior Center Games', 'Playing board games and chatting with residents.', 'Sunnyvale Senior Living', '2026-06-20'::date),
    ('BrightFuture Builders', 'Park Refurbishment', 'Painting benches and clearing walking trails.', 'Central Park', '2026-07-05'::date),
    ('BrightFuture Builders', 'Youth Mentoring Kickoff', 'Orientation for new youth mentors.', 'Community Center Room B', '2026-07-12'::date),
    ('BrightFuture Builders', 'Thrift Store Sorting', 'Organizing incoming clothing donations.', 'Hope Thrift Shop', '2026-07-19'::date),
    ('GreenHarvest Growers', 'River Cleanup Day', 'Removing plastic trash from the riverbanks.', 'Waterfront Marina', '2026-06-18'::date),
    ('GreenHarvest Growers', 'Tree Planting Initiative', 'Planting native saplings across the nature reserve.', 'Greenwood Forest', '2026-06-27'::date),
    ('GreenHarvest Growers', 'Community Garden Weeding', 'Prepping veggie beds for the summer harvest.', 'Oak Street Garden', '2026-07-02'::date),
    ('GreenHarvest Growers', 'Recycling Drive', 'Collecting and sorting electronics and cardboard.', 'City Recycling Depot', '2026-07-15'::date),
    ('GreenHarvest Growers', 'Wildlife Habitat Building', 'Constructing birdhouses and bat boxes.', 'Nature Center Classroom', '2026-07-22'::date),
    ('UnityServe Volunteers', 'Soup Kitchen Dinner Service', 'Preparing and serving hot evening meals.', 'Downtown Rescue Mission', '2026-06-14'::date),
    ('UnityServe Volunteers', 'Backpack Stuffing Event', 'Filling school bags with educational supplies.', 'Grace Church Hall', '2026-06-25'::date),
    ('UnityServe Volunteers', 'Homeless Shelter Painting', 'Refreshing the interior walls of the main lounge.', 'Shelter North Wing', '2026-07-08'::date),
    ('UnityServe Volunteers', 'Blanket Making Workshop', 'Fleece tie-blankets for winter distribution.', 'Civic Center Hall A', '2026-07-17'::date),
    ('UnityServe Volunteers', 'Hygiene Kit Assembly', 'Packing essential toiletries for families in need.', 'Distribution Warehouse', '2026-07-29'::date)
) AS seed_projects(organization_name, title, description, location, date)
INNER JOIN public.organization AS org
    ON org.name = seed_projects.organization_name
WHERE NOT EXISTS (
    SELECT 1
    FROM public.project
    WHERE public.project.title = seed_projects.title
);

-- Service project categories
CREATE TABLE IF NOT EXISTS public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO public.category (name)
SELECT seed_categories.name
FROM (
    VALUES
    ('Food Support'),
    ('Environmental Care'),
    ('Community Outreach'),
    ('Youth & Education')
) AS seed_categories(name)
WHERE NOT EXISTS (
    SELECT 1
    FROM public.category
    WHERE public.category.name = seed_categories.name
);

-- Many-to-many relationship between projects and categories
CREATE TABLE IF NOT EXISTS public.project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project_category_project
        FOREIGN KEY(project_id)
        REFERENCES public.project(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_category_category
        FOREIGN KEY(category_id)
        REFERENCES public.category(category_id)
        ON DELETE CASCADE
);

INSERT INTO public.project_category (project_id, category_id)
SELECT project.id, category.category_id
FROM (
    VALUES
    ('Community Food Drive', 'Food Support'),
    ('Community Food Drive', 'Community Outreach'),
    ('Senior Center Games', 'Community Outreach'),
    ('Park Refurbishment', 'Environmental Care'),
    ('Youth Mentoring Kickoff', 'Youth & Education'),
    ('Thrift Store Sorting', 'Community Outreach'),
    ('River Cleanup Day', 'Environmental Care'),
    ('Tree Planting Initiative', 'Environmental Care'),
    ('Community Garden Weeding', 'Environmental Care'),
    ('Community Garden Weeding', 'Food Support'),
    ('Recycling Drive', 'Environmental Care'),
    ('Wildlife Habitat Building', 'Environmental Care'),
    ('Soup Kitchen Dinner Service', 'Food Support'),
    ('Backpack Stuffing Event', 'Youth & Education'),
    ('Backpack Stuffing Event', 'Community Outreach'),
    ('Homeless Shelter Painting', 'Community Outreach'),
    ('Blanket Making Workshop', 'Community Outreach'),
    ('Hygiene Kit Assembly', 'Community Outreach')
) AS seed_project_categories(project_title, category_name)
INNER JOIN public.project
    ON public.project.title = seed_project_categories.project_title
INNER JOIN public.category
    ON public.category.name = seed_project_categories.category_name
WHERE NOT EXISTS (
    SELECT 1
    FROM public.project_category
    WHERE public.project_category.project_id = public.project.id
      AND public.project_category.category_id = public.category.category_id
);

-- Verification queries
SELECT * FROM public.organization;
SELECT * FROM public.project;
SELECT * FROM public.category;
SELECT * FROM public.project_category;

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);