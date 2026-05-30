-- 1. Create the project table with proper constraints
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

-- 2. Insert 5 sample service projects for each organization.
-- This only inserts seed data when the project table is empty.
INSERT INTO public.project (organization_id, title, description, location, date)
SELECT org.organization_id, seed_projects.title, seed_projects.description, seed_projects.location, seed_projects.date
FROM (
    VALUES
    -- Projects for BrightFuture Builders
    ('BrightFuture Builders', 'Community Food Drive', 'Sorting and packing non-perishable goods.', 'Main St. Food Bank', '2026-06-15'::date),
    ('BrightFuture Builders', 'Senior Center Games', 'Playing board games and chatting with residents.', 'Sunnyvale Senior Living', '2026-06-20'::date),
    ('BrightFuture Builders', 'Park Refurbishment', 'Painting benches and clearing walking trails.', 'Central Park', '2026-07-05'::date),
    ('BrightFuture Builders', 'Youth Mentoring Kickoff', 'Orientation for new youth mentors.', 'Community Center Room B', '2026-07-12'::date),
    ('BrightFuture Builders', 'Thrift Store Sorting', 'Organizing incoming clothing donations.', 'Hope Thrift Shop', '2026-07-19'::date),

    -- Projects for GreenHarvest Growers
    ('GreenHarvest Growers', 'River Cleanup Day', 'Removing plastic trash from the riverbanks.', 'Waterfront Marina', '2026-06-18'::date),
    ('GreenHarvest Growers', 'Tree Planting Initiative', 'Planting native saplings across the nature reserve.', 'Greenwood Forest', '2026-06-27'::date),
    ('GreenHarvest Growers', 'Community Garden Weeding', 'Prepping veggie beds for the summer harvest.', 'Oak Street Garden', '2026-07-02'::date),
    ('GreenHarvest Growers', 'Recycling Drive', 'Collecting and sorting electronics and cardboard.', 'City Recycling Depot', '2026-07-15'::date),
    ('GreenHarvest Growers', 'Wildlife Habitat Building', 'Constructing birdhouses and bat boxes.', 'Nature Center Classroom', '2026-07-22'::date),

    -- Projects for UnityServe Volunteers
    ('UnityServe Volunteers', 'Soup Kitchen Dinner Service', 'Preparing and serving hot evening meals.', 'Downtown Rescue Mission', '2026-06-14'::date),
    ('UnityServe Volunteers', 'Backpack Stuffing Event', 'Filling school bags with educational supplies.', 'Grace Church Hall', '2026-06-25'::date),
    ('UnityServe Volunteers', 'Homeless Shelter Painting', 'Refreshing the interior walls of the main lounge.', 'Shelter North Wing', '2026-07-08'::date),
    ('UnityServe Volunteers', 'Blanket Making Workshop', 'Fleece tie-blankets for winter distribution.', 'Civic Center Hall A', '2026-07-17'::date),
    ('UnityServe Volunteers', 'Hygiene Kit Assembly', 'Packing essential toiletries for families in need.', 'Distribution Warehouse', '2026-07-29'::date)
) AS seed_projects(organization_name, title, description, location, date)
INNER JOIN public.organization AS org
    ON org.name = seed_projects.organization_name
WHERE NOT EXISTS (
    SELECT 1 FROM public.project
);

-- 3. Verify data insertion script
SELECT * FROM public.project;
