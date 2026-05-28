# Creating the downloadable session transcript file
transcript = """Week 01 Coaching Session Transcript
Student: Sogolo Donaldson
Coach: Learning Coach and Software Mentor
Date: May 25, 2026

==================================================

COACH: Welcome! Just to be clear from the start, this is a coaching session, not a test. It is perfectly okay—and even encouraged—to say 'I don't know' or 'I made a mistake.' That's the fastest way we'll learn today. Before we dive into your assignment, could you please tell me your name?

SOGOLO: My name is Sogolo Donaldson

COACH: It is great to meet you, Sogolo Donaldson! Let's start with our first topic, which is Express Routing. Could you please paste the relevant code snippet from your server.js file that shows how you set up your routes?

SOGOLO: 
app.set('views', path.join(__dirname, 'src/views'));

app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const title = 'Our Partner Organizations';
    res.render('organizations', { title });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
});

This is my Express routing for all those pages

COACH: Thanks for sharing that snippet, Sogolo! Looking at your code, what is the purpose of using path.join(__dirname, 'src/views') in that first line?

SOGOLO: It is a Node.js expression used to create an absolute filesystem path in a safe, cross-platform way.

COACH: Spot on, Sogolo! That keeps your code safe whether it runs on Windows, Mac, or Linux. Moving on to our second topic, JavaScript Language Principles. Could you please paste a JavaScript function snippet from your project that shows some of your logic?

SOGOLO: 
app.get('/projects', async (req, res) => {
    const title = 'Service Projects';

    const projects = [
        { name: 'Clean Water Initiative', status: 'Active' },
        { name: 'Community Health Outreach', status: 'Completed' },
        { name: 'Youth Education Support', status: 'Ongoing' }
    ];

    res.render('projects', {
        title,
        projects
    });
});

COACH: That is a great snippet to look at! You have an array of project objects right inside your route. In your function definition, you used the async keyword right before (req, res). Can you explain why you chose to make this route handler asynchronous?

SOGOLO: I used async so the route can handle asynchronous operations like database queries or API calls using await without blocking the server.

COACH: Exactly! It keeps your application responsive and ready for real data. Let's move to our third topic: EJS Partials and Pages. Could you please paste a snippet of your EJS code showing how you render these projects or use partials?

SOGOLO: 
<%- include('partials/header') %>
<main>
    <h1><%= title %></h1>
        <p>Our mission is to promote service across the world by connecting volunteers with service opportunities in their community.</p>
        <img class="main-logo" src="/images/cse340-service-network.png" alt="Service Network">
</main>
<%- include('partials/footer') %>

<%- include('partials/header') %>
<main>
    <h1><%= title %></h1>
        <li><img src="/images/brightfuture-logo.png" alt="Bright Future Logo"><strong>BrightFuture Builders</strong>: info@brightfuture.org</li>
        <li><img src="/images/unityserve-logo.png" alt="Unity Serve Logo"><strong>UnityServe Volunteers</strong>: hello@unityserve.org</li>
        <li><img src="/images/greenharvest-logo.png" alt="Green Harvest Logo"><strong>GreenHarvest Growers</strong>: contact@greenharvest.org</li>
</main>
<%- include('partials/footer') %>

<%- include('partials/header') %>
<main>
    <h1><%= title %></h1>
        <h2>Upcoming Service Projects</h2>
        <ul>
            <li>Park Cleanup - Join us to clean up local parks and make them beautiful!</li>
            <li>Food Drive - Help collect and distribute food to those in need.</li>
            <li>Community Tutoring - Volunteer to tutor students in various subjects.</li>
        </ul>
</main>
<%- include('partials/footer') %>

COACH: Beautifully organized structure, Sogolo! Using partials like this keeps your HTML incredibly clean and reusable across your pages. Looking at your code, what is the specific difference between using <%- for your includes and <%= for your title variable?

SOGOLO: <%= %> escapes HTML before rendering, while <%- %> renders raw HTML without escaping.

COACH: Perfect explanation, Sogolo! That is a very important security distinction to prevent code injection attacks. Let's move to our fourth and final topic: Frontend CSS. Could you please paste a snippet of the CSS you used to style these pages?

SOGOLO: 
html, body {
    background-color: lightblue;
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}

body {
    nav {
        ul {
            list-style-type: none;
            padding: 0;
        }

        li {
            display: inline;
            margin-right: 15px;
        }

        a {
            text-decoration: none;
            color: #333;
            font-weight: bold;

            &:hover {
                color: #0066cc;
            }
        }
    }
}

COACH: An excellent, clean stylesheet, Sogolo! I notice you used modern CSS nesting here, like placing ul and li inside nav, and using the & symbol for the hover state. Why did you choose to use CSS nesting instead of traditional, flat CSS selectors?

SOGOLO: I used CSS nesting because it keeps related styles grouped together, making the code cleaner, easier to read, and easier to maintain. The `&` symbol also makes pseudo-classes like `:hover` more concise and avoids repeating long selectors.

COACH: Spot on, Sogolo! Nesting mimics the actual structure of your HTML, which makes debugging and maintaining your code much more intuitive.
"""

with open("/sandbox/coaching_session_transcript.txt", "w") as f:
    f.write(transcript)
