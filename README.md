# Personal Portfolio Website

This is my personal developer portfolio built with **React**, designed to highlight my projects, skills, and experience.
It features a responsive design, dark/light theme support, and a clean UI.

Check out the live website here: [dillonbellefeuille.com](https://dillonbellefeuille.com)

## Features

- **Responsive design:** works seamlessly on desktop and mobile.
- **Dark/Light themes:** checks the user's system preference on initial load.
- **Project showcase:** modal view with detailed markdown descriptions.
- **Resume and Experience:** quick access to background and skills with the option to view or download a pdf version.
- **Contact section:** direct links to Email and profiles on LinkedIn, GitHub, and itch.io.

## Tech Stack

- **Front End:** [React](https://react.dev/), [ReactIcons](https://github.com/react-icons/react-icons)
- **Styling:** SCSS, CSS Variables for theming
- **Tooling:** [Vite](https://vite.dev/) build tool

## Getting Started

Clone the repo and run locally:

```bash
# Clone the repository
git clone https://github.com/dtb1996/portfolio-website.git

# Navigate to the project folder
cd portfolio-website

# Install dependencies
npm install

# Run development server
npm run dev
```

## Project Structure

```bash
src/
├── assets/          # Static images (avatar, project thumbnails)
├── components/      # Reusable UI components (Navbar, ProjectModal, etc.)
├── data/            # Individual Experience and Project data (title, details, markdown, etc.)
├── sections/        # Page sections (About, Contact, Projects, Experience)
├── styles/          # Global styles
└── App.jsx/         # Main app layout
```

## Theming

- Uses **CSS variables** for colors and theming.
- Default mode is **dark**, but checks system preference (`prefers-color-scheme`) on first load.
- Users can toggle between themes manually (saved to local storage).
