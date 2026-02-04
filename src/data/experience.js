const experience = [
    {
        id: 1,
        role: "Founder, Game Developer - Rolling Pixels",
        period: "Jan 2025 - Present",
        description: `
-	Designed and implemented core gameplay systems in Unreal Engine 5 using C++ and Blueprints.
-	Built reusable plugins and tools (replay system, UI manager).
-	Designed multiplayer game logic including replicated player state, turn systems, and replay playback.
-	Developed a custom Blender to Unreal content pipeline with a Python add-on and UE5 importer/validation plugin.
-	Managed project planning, direction, and prototype iteration for a commercial-ready game.
        `,
        skills: ["Unreal Engine 5", "C++", "Blueprints", "Multiplayer/Replication"],
    },
    {
        id: 2,
        role: "UI Engineer (Unreal Engine, Qt) - Canoo",
        period: "Apr 2022 - Jan 2025",
        description: `
-	Designed and developed Qt/QML and Unreal Engine interfaces for embedded software environments, with focus on usability, clarity, and maintainability.
-	Translated functional requirements and Figma mockups into fully implemented UI components aligned with product and UX goals.
-	Implemented reusable UI components and layouts to support scalable interface architecture across products.
-	Worked closely with cross-functional engineering, hardware, and UI design teams to refine requirements and ensure accuracy.
        `,
        skills: [
            "Unreal Engine 4",
            "Visual Studio",
            "Qt/Qml",
            "C++",
            "Blueprints",
            "JavaScript",
            "Git",
            "Perforce",
            "Bitbucket",
        ],
    },
    {
        id: 3,
        role: "Programmer, Designer - Into the Knight (PC | Independent)",
        period: "Mar 2021 - May 2021",
        description: `
-   Designed and developed all game functionality, including gameplay, UI, and visual effects.
-   Improved game experience by gathering feedback from 6 testers.
-   Consulted with 2 external artists to create assets that followed the project’s existing art style.
-   Created a modular interface system that allowed menus to be quickly created and customized.
        `,
        skills: ["Godot", "GDScript", "Git", "GitHub"],
    },
]

const skills = {
    gameDev: [
        "Unreal Engine 4/5 (C++, Blueprints)",
        "Gameplay Systems (Inventory, Quest, Replay)",
        "Multiplayer Networking and Replication",
        "Physics-based mechanics",
        "UI Engineering (UMG, Common UI, Custom Widgets)",
    ],
    uiDev: [
        "Qt (QML, Custom Components)",
        "React.js (Hooks, State Management)",
        "UI/UX Engineering (Responsive Design, Accessibility)",
        "HTML, CSS (SCSS, Flexbox, Grid)",
    ],
}

export { experience, skills }
