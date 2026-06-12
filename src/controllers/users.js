import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            // Store user info in session
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    if (req.session) {
        // Regenerate session to clear existing session data and obtain a fresh session
        req.session.regenerate(err => {
            if (err) {
                console.error('Error regenerating session during logout:', err);
            }
            req.flash('success', 'Logout successful!');
            res.redirect('/login');
        });
        return;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }

    req.flash('error', 'Please log in to access that page.');
    res.redirect('/login');
};

const requireRole = (roleName) => {
    return (req, res, next) => {
        // If not logged in, ask user to login
        if (!req.session || !req.session.user) {
            req.flash('error', 'Please log in to access that page.');
            return res.redirect('/login');
        }

        // If logged in but does not have required role, redirect to dashboard
        if (req.session.user.role !== roleName) {
            req.flash('error', 'Access denied: insufficient privileges.');
            return res.redirect('/dashboard');
        }

        return next();
    };
};

const showDashboard = (req, res) => {
    const name = req.session?.user?.name || '';
    const email = req.session?.user?.email || '';

    res.render('dashboard', { title: 'Dashboard', name, email });
};

const showUsersPage = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.render('users', { title: 'Registered Users', users });
    } catch (error) {
        next(error);
    }
};

export { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, requireRole, showDashboard, showUsersPage };