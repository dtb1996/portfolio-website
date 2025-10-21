import thumb1 from "../assets/projects/super-mini-golf.png"
import thumb2 from "../assets/projects/ue5-item-inspector-plugin-icon.png"
import thumb3 from "../assets/projects/canoo-infotainment-icon.png"
import thumb4 from "../assets/projects/ue5-inventory-plugin-icon.png"
import thumb5 from "../assets/projects/lumi-snake-icon.png"
import thumb6 from "../assets/projects/into-the-knight-icon.png"
import thumb7 from "../assets/projects/dodgeball-x-icon.png"
import thumb8 from "../assets/projects/web-personal-dashboard.png"
import thumb12 from "../assets/projects/web-portfolio-website.png"

const projects = [
    {
        id: 1,
        title: "Super Mini Golf",
        thumbnail: thumb1,
        category: "games",
        link: "",
        video: "https://www.youtube.com/watch?v=LzQzw4D6lqI",
        description: `
Super Mini Golf is a mashup of Mini Golf and Super Monkey Ball made in Unreal Engine 5. Instead of striking the ball, the stage is tilted to guide it through dynamic, physics-driven courses. The game supports turn-based multiplayer, synchronized instant replays, and streamed stage transitions.

### Features

-   **Turn-based multiplayer system:** Designed and implemented custom turn flow logic in UE5, including retries, countdowns, and end-of-turn transitions, replicated for multiplayer consistency.
-   **Replay system:** Built a modular replay recorder component that tracks gameplay events, replicates frames to all clients, and supports synchronized instant replays.
-   **Dynamic stage loading:** Implemented Level Streaming logic for stage transitions, supporting dynamic actors like moving platforms while preserving game state.
-   **Scoring and stats framework:** Designed per-stage and cumulative scoring structures (coins, score, time, out-of-bounds, retries) with live updates and end-of-stage summaries.
-   **Network and Replication:** Debugged and optimized multiplayer flows (stage readiness, replay sync, stat updates) to ensure reliable behavior across server and clients.
-   **Gameplay systems:** Implemented interactive goals, collectible tracking, and contextual input mapping to manage active/inactive players fairly.

### Roles

Programmer, Designer

### Attribution

UI Designs by Umar Ali  
Timer icons created by  [fjstudio - Flaticon](https://www.flaticon.com/free-icons/timer)  
"Golf Ball" by  [Safina Irani](https://skfb.ly/oAVrx)  is licensed under Creative Commons Attribution  
"Lowpoly gold coin" by  [BlobFortress](https://skfb.ly/69CRK)  is licensed under Creative Commons Attribution
        `,
    },
    {
        id: 2,
        title: "UE5 Item Inspector",
        thumbnail: thumb2,
        category: "games",
        link: "",
        description: `
The UE5 Item Inspector is an extendable system for inspecting in-game objects. Originally created as a shop item viewer for an independent client.

### Features

-   Data Table for storing specific item details, such as display name and 3D mesh
-   Interactable item viewer UI that pulls info from interactable item
-   Separate light box for item viewer, allowing full control over item lighting

### Roles

Programmer, Designer

### Attribution

"Carpenter's Workshop" environment and models by  [Leartes Studios](https://cosmos.leartesstudios.com/environments?service=leartes)
        `,
    },
    {
        id: 3,
        title: "Canoo Infotainment",
        thumbnail: thumb3,
        category: "games",
        link: "",
        description: `
Worked as part of the HMI team responsible for implementing new features and maintaining the existing front end codebase of the infotainment touchscreen display for multiple vehicle models.

### Key Responsibilities

-   Maintain the infotainment front end software for both Qt and UE4 versions
-   Work closely with QA team to ensure software was production-ready, quickly implementing fixes for any bugs discovered during the testing process
-   Work with UI/UX team to ensure the design vision was maintained and the display provided the customer with the best possible experience
-   Acted as the key contributor for numerous front end features, such as Bluetooth media/calling and alert notifications

### Role

UI Engineer
        `,
    },
    {
        id: 4,
        title: "UE5 Inventory Manager Plugin",
        thumbnail: thumb4,
        category: "games",
        link: "",
        description: `
The UE5-Inventory-Manager Plugin is a flexible system designed to be the base for a fully-fledged inventory system.

Source code available on  [GitHub](https://github.com/dtb1996/UE5-Inventory-Manager).

### Features

-   Customizable item lists and categories
-   Data Table for storing specific item details, such as icon images and 3D meshes
-   Global item info lookup function
-   Example player controller blueprint and map, demonstrating possible implementation ideas

### Roles

Programmer, Designer
        `,
    },
    {
        id: 5,
        title: "Lumi-Snake",
        thumbnail: thumb5,
        category: "games",
        link: "",
        video: "https://www.youtube.com/watch?v=n_vH8Ej7u0s",
        description: `
A variation on the classic Snake game created for the Gamedev.js Jam 2024.

Windows build available on  [itch.io](https://dillionaire.itch.io/lumi-snake). Source code available on  [GitHub](https://github.com/dtb1996/lumi-snake/tree/main).

### How it was made

**Tech Used**: HTML, CSS, JavaScript

The goal of this project was to use basic web tools to make a simple game. Normally I use an engine like Unreal Engine or Godot for game development, so this was an opportunity to step out of my comfort zone and learn how to build a web page that doubles as a simple game. This game also includes a demo mode with simple logic to control the snake while in the menu.

### Optimizations

**Base64 audio conversion**: One of the optional jam challenges was to fit the entire game into a 13 kb zip file. To include sound effects I decided to use an online Base64 audio conversion tool to reduce their storage footprint.

**Reused code**: To reduce the complexity and size of the project, the demo snake controller uses the same snake object and game logic as the in-game snake. The major difference between the two modes in how the movement velocity is calculated since the demo snake needs to move without player input.

### Reflection

**Define game states early**: Although I ran out of time to fully implement it, I quickly discovered that without keeping track of the current game state in a central location (ie: finite state machine), it can be difficult maintain code/logic organization. If I were to build this game again or refactor the existing code, I would define transition functions for each of the states to keep changes to the game variables, display, etc. well-organized and easier to follow.

### Roles

Programmer, Designer
        `,
    },
    {
        id: 6,
        title: "Into the Knight",
        thumbnail: thumb6,
        category: "games",
        link: "",
        video: "https://www.youtube.com/watch?v=liI8RBLi_yE",
        description: `
View game on  [Steam](https://store.steampowered.com/app/1591410/Into_the_Knight/).

### Roles

Programmer, Designer, Music
        `,
    },
    {
        id: 7,
        title: "Dodgeball X",
        thumbnail: thumb7,
        category: "games",
        link: "",
        video: "https://www.youtube.com/watch?v=9LUUY3vkqDM",
        description: `
Inspired by Pong and created within 48 hours for the GMTK Game Jam 2020.

Windows build available on  [itch.io](https://dillionaire.itch.io/dodgeball-x).

### Roles

Programmer, Designer, Music
        `,
    },
    {
        id: 8,
        title: "React Personal Dashboard",
        thumbnail: thumb8,
        category: "web",
        link: "",
        video: "",
        description: `
A customizable and responsive React-based dashboard that brings together useful everyday widgets — including weather, news, jokes, todos, and a calculator — into a cohesive, modern interface. Designed for both usability and aesthetics, it demonstrates clean component architecture, SCSS module styling, API integration, and responsive UI patterns.

### Live Demo

[https://dillon-personal-dashboard.netlify.app/](https://dillon-personal-dashboard.netlify.app/)

### Link to Repo

[dtb1996/personal-dashboard](https://github.com/dtb1996/personal-dashboard)

### Features

-   **Reusable Card System:** all dashboard widgets use a shared <Card /> component for styling.
-   **Weather Card:** fetches live weather data using [OpenWeather API](https://openweathermap.org/api).
-   **Todo Card:** add, remove, and mark tasks as complete — automatically saved in LocalStorage.
-   **Calculator Card:** simple math calculator.
-   **Joke Card:** fetches random jokes from [JokeAPI](https://jokeapi.dev/).
-   **Stock Tracker Card:** displays live stock data from [Financial Modeling Prep](https://site.financialmodelingprep.com/).
-   **News Feed:** fetches top headlines via [NewsAPI](https://newsapi.org/).
-   **Theme Toggle:** allows switching between multiple visual themes.
-   **Responsive Layout:** adaptive sidebar, sticky header/footer, and grid/flexbox handling.
-   **CI/CD:** GitHub Actions pipeline for linting, testing, building, and deploying to Netlify.
-   **Automated Screenshots:** Playwright test captures dashboard images for documentation.

### Tech Stack

-   **Front End:** [React](https://react.dev/), [ReactIcons](https://github.com/react-icons/react-icons), [Vite](https://vite.dev/)
-   **Styling:** [SCSS Modules](https://sass-lang.com/), CSS Variables
-   **Documentation:** [Playwright](https://playwright.dev/) for automated UI screenshots
-   **CI/CD:** GitHub Actions, [Netlify](https://www.netlify.com/)
-   **Serverless Backend:** Netlify Functions
-   **Code Quality:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
-   **APIs:** [OpenWeather API](https://openweathermap.org/api), [NewsAPI](https://newsapi.org/), [JokeAPI](https://jokeapi.dev/), [Financial Modeling Prep](https://site.financialmodelingprep.com/)
-   **API Integration:** Serverless functions on Netlify handle requests to third-party APIs securely:
    - **Weather:** OpenWeather API via netlify/functions/weather.js
    - **Stocks:** Financial Modeling Prep API via netlify/functions/stocks.js
    - **News:** NewsAPI via netlify/functions/news.js

### Highlights

-   Demonstrates **modular React architecture** and component reuse
-   Uses **environment variables and API keys securely** through Netlify.
-   Implements **error handling and loading states** for all API calls.
-   Provides a solid base for expanding into a personalized productivity dashboard.
        `,
    },
    {
        id: 12,
        title: "React Portfolio Website",
        thumbnail: thumb12,
        category: "web",
        link: "https://dillonbellefeuille.com/",
        video: "",
        description: `
This is my personal developer portfolio built with **React** and designed to highlight my projects, skills, experience, and blog posts. It features a responsive design, dark/light theme support, a clean UI, and a Markdown-based Blog section.

### Link to Repo

[dtb1996/portfolio-website](https://github.com/dtb1996/portfolio-website)

## Features

- **Responsive design:** works seamlessly on desktop and mobile.
- **Dark/Light themes:** checks the user's system preference on initial load.
- **Project showcase:** modal view with detailed markdown descriptions.
- **Resume and Experience:** quick access to background and skills with the option to view or download a pdf version.
- **Contact section:** direct links to Email and profiles on LinkedIn, GitHub, and itch.io.
- **Blog section:** markdown-based posts with support for code block syntax highlighting using **rehype-highlight**.

## Tech Stack

- **Front End:** [React](https://react.dev/), [React Router](https://reactrouter.com/), [ReactIcons](https://github.com/react-icons/react-icons)
- **Styling:** [SCSS](https://sass-lang.com/), CSS Variables for theming
- **Markdown & Syntax Highlight:** [react-markdown](https://github.com/remarkjs/react-markdown), [rehype-highlight](https://github.com/rehypejs/rehype-highlight)
- **Tooling:** [Vite](https://vite.dev/) build tool
- **Linting & Formatting:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **CI/CD:** GitHub Actions
        `,
    },
]

export default projects
