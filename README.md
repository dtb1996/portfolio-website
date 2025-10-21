# Personal Portfolio Website

This is my personal developer portfolio built with **React** and designed to highlight my projects, skills, experience, and blog posts. It features a responsive design, dark/light theme support, a clean UI, and a Markdown-based Blog section.

Check out the live website here: [dillonbellefeuille.com](https://dillonbellefeuille.com)

## Features

- **Responsive design:** works seamlessly on desktop and mobile.
- **Dark/Light themes:** checks the user's system preference on initial load.
- **Project showcase:** modal view with detailed markdown descriptions.
- **Resume and Experience:** quick access to background and skills with the option to view or download a PDF version.
- **Contact section:** direct links to Email and profiles on LinkedIn, GitHub, and itch.io.
- **Blog section:** markdown-based posts with support for code block syntax highlighting using **rehype-highlight**.

## Tech Stack

- **Front End:** [React](https://react.dev/), [React Router](https://reactrouter.com/), [ReactIcons](https://github.com/react-icons/react-icons)
- **Styling:** [SCSS](https://sass-lang.com/), CSS Variables for theming
- **Markdown & Syntax Highlight:** [react-markdown](https://github.com/remarkjs/react-markdown), [rehype-highlight](https://github.com/rehypejs/rehype-highlight)
- **Tooling:** [Vite](https://vite.dev/) build tool
- **Linting & Formatting:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **CI/CD:** GitHub Actions

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
├── pages/           # Main app pages (Home, Blog)
├── posts/           # Blog post markdown files
├── routes/          # AppRouter for handling page navigation
├── sections/        # Homepage sections (About, Contact, Projects, Experience)
├── styles/          # Global styles
└── App.jsx/         # Main app layout
```

## Blog Section Details

- **Markdown-based:** all posts are stored as .md files in src/posts/.
- **Front-matter:** .md files include post metadata (title, date, description, tags, optional image).
- **Screenshots:** stored in public/blog-screenshots/.
- **Code highlighting:** supports both inline code and multi-line code blocks with syntax highlighting.

## Theming

- Uses **CSS variables** for colors and theming.
- Default mode is **dark**, but checks system preference (`prefers-color-scheme`) on first load.
- Users can toggle between themes manually (saved to local storage).
