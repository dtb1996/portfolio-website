const experience = [
    {
        id: 1,
        role: "Programmer, Designer - Super Mini Golf (PC | Independent)",
        period: "Jan 2025 - Present",
        description: `
-   Implemented a turn-based multiplayer system in Unreal Engine 5 with replicated player state and scoring.
-   Built a synchronized replay system replicating gameplay frames across clients.
-   Developed a dynamic level streaming system for seamless stage transitions.
-   Created a custom scoring framework with per-stage and cumulative course stats.
-   Optimized network replication flows for multiplayer readiness, replays, and score updates.
        `,
        skills: ["Unreal Engine 5", "C++", "Blueprints", "Multiplayer/Replication"]
    },
    {
        id: 2,
        role: "Unreal Engine UI Engineer - Canoo",
        period: "Apr 2022 - Jan 2025",
        description: `
-   Used Unreal Engine to create HMI software that would be delivered for production vehicles.
-   Worked with team to develop a comprehensive set of HMI components.
-   Worked closely with UI/UX team to ensure designs were completed to spec within in Unreal Engine.
-   Collaborated with the scrum master to break down tasks and maintain the embedded software backlog.
        `,
        skills: ["Unreal Engine", "Visual Studio", "Qt/Qml", "C++", "Blueprints", "JavaScript", "Git", "Perforce", "Bitbucket"]
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
        skills: ["Godot", "GDScript", "Git", "GitHub"]
    },
]

const skills = {
    gameDev: [
        "Unreal Engine 4/5 (C++, Blueprints)",
        "Gameplay Systems (Inventory, Quest, Replay)",
        "Multiplayer Networking and Replication",
        "Physics-based mechanics",
        "UI Engineering (UMG, Common UI, CustomWidgets)"
    ],
    webDev: [
        "React.js (Hooks, State Management)",
        "UI/UX Engineering (Responsive Design, Accessibility)",
        "Modern CSS (SCSS, Flexbox, Grid)",
        "Qt (QML, Custom Components)"
    ]
}

export { experience, skills }