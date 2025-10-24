---
title: "Setting Up Git for Unreal Engine Projects"
date: "2025-05-21"
description: "Learn how to properly set up Git for Unreal Engine projects."
image:
    url: "https://unsplash.com/photos/a-close-up-of-a-text-description-on-a-computer-screen-842ofHC6MaI"
    alt: "Close-up of code on a computer screen representing Git"
tags: ["Unreal Engine", "Git", "Version Control", "GitHub"]
---

Originally posted on [Medium](https://medium.com/@bellefeuilledillon/setting-up-git-to-use-with-unreal-engine-21e171b71488)

## Intro

One of the most important tools in software development is version control. Version control has many benefits, including having backups in case you need to revert changes. When working in a team format, it is essential, as it helps handle file sync and any mismatches that may arise.

While there are other choices when it comes to setting up version control for Unreal Engine projects, such as Perforce, SVN, and Plastic SCM, in this tutorial I am going to provide an overview of the setup process for Git. For a more in-depth comparison of the two most popular choices, Perforce and Git, check out [this write-up](https://www.anchorpoint.app/blog/git-vs-perforce-for-game-development) by George Neguceanu on Anchorpoint which breaks down the features of each.

First, you’ll need to decide which cloud storage provider will be used to host the repo that you will be pushing to, a common choice is [GitHub](https://github.com/), but others like [Bitbucket](https://bitbucket.org/) and [Sourcetree](https://www.sourcetreeapp.com/) exist.

Next, you will need a Git client installed on your machine that will allow you to run commands like committing changes and pushing to the remote repo. git bash, which can be downloaded [here](https://git-scm.com/downloads), is a program that provides a terminal and allows you to run git commands. There are also GUI options if you prefer to have more of a visual approach, some of those can be found [here](https://git-scm.com/downloads/guis). I personally like to use a combination of [GitHub Desktop](https://github.com/apps/desktop) to give me a quick visual representation of code changes and git bash when I need to run more specialized commands, especially when things inevitably go wrong.

## Setting up the repo

**Note:** some people suggest creating the local repo in an empty folder, pulling from the external repo, then copying over the Unreal project to the local folder, but I have had no issues doing it the way I am about to show. If you’d prefer to play it safe, you can follow along in a new empty folder and I’ll let you know when to add the Unreal project files.

To setup the git repo, navigate to the Unreal project folder, open up the Git client you installed, and initialize the new repo. With git bash on Windows just right-click and select “**Open Git Bash here**” (on Windows 11 you may need to select “Show more options”):

![Open Git Base here" option in context menu](/posts/images/setting-up-git-for-unreal-engine/setting-up-git-for-unreal-engine-01.png)

This will open up a terminal that will allow you to run git commands. Enter **git init** to initialize the repo:

```bash
user@ComputerName MINGW64 /c/UnrealProjects/GitTutorial
$ git init
```

You will see a confirmation that the repo was setup successfully:

```bash
user@ComputerName MINGW64 /c/UnrealProjects/GitTutorial
$ git init
Initialized empty Git repository in C:/UnrealProjects/GitTutorial/.git/
```

Now you’ll want to create the external repo on your selected host. I am going to use GitHub and choose Create a new repository and fill out the information for my repo.

**Note:** it is important to setup a [.gitignore](https://git-scm.com/docs/gitignore) file to let git know what files to ignore (very useful with Unreal projects), which can be done during this step. I’ll choose the UnrealEngine template:

![Creating a new repository on GitHub](/posts/images/setting-up-git-for-unreal-engine/setting-up-git-for-unreal-engine-02.png)

With the new repo created on GitHub, we can now link our local project repo. Let’s grab the link from the repo page by selecting the green “Code” button and copying the link (I’m using the HTTPS link here but there are other options):

![Cloning a GitHub repo](/posts/images/setting-up-git-for-unreal-engine/setting-up-git-for-unreal-engine-03.png)

Now in the git terminal we can use **git remote add origin <remote_repo>**, replacing **<remote_repo>** with the link we just copied. (Note, you will need to Right-Click then select **Paste** to paste the link, as git bash does not support the **Ctrl+v** shortcut):

```bash
user@ComputerName MINGW64 /c/UnrealProjects/GitTutorial (main)
$ git remote add origin https://github.com/dtb1996/UnrealTutorials.git
```

If this succeeds you will not see a confirmation message, but you can confirm that the connection was successful by entering **git remote -v**. You will see URLs listed for **fetch** and **push** (which are likely pointing to the same location).

```bash
user@ComputerName MINGW64 /c/UnrealProjects/GitTutorial (main)
$ git remote -v
origin  https://github.com/dtb1996/GitTutorial.git (fetch)
origin  https://github.com/dtb1996/GitTutorial.git (push)
```

## Syncing files between the remote and local

With the connection established, we can now pull down the .gitignore we created earlier as well as any other files, such as a [README](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes), that have already been added to the GitHub repo. To do this enter **git pull origin <branch_name>** replacing **<branch_name>** with the branch name listed in GitHub (traditionally this has been **master**, but many developers have switched over to **main**, which is what I will be using). This can be found on the main page of the repository in GitHub:

![GitHub repo branch name dropdown box](/posts/images/setting-up-git-for-unreal-engine/setting-up-git-for-unreal-engine-04.png)

```bash
user@ComputerName MINGW64 /c/UnrealProjects/GitTutorial (main)
$ git pull origin main
remote: Enumerating objects: 4, done.
remote: Counting objects: 100% (4/4), done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 4 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
Unpacking objects: 100% (4/4), 1.34 KiB | 76.00 KiB/s, done.
From https://github.com/dtb1996/GitTutorial
 * branch            main       -> FETCH_HEAD
 * [new branch]      main       -> origin/main
```

Now we need to add the local files to a commit and push to the external repo. If you started with an empty folder to create the repo inside, you can copy over the Unreal project files at this point. To see what files have changed locally, use **git status**:

```bash
user@ComputerName MINGW64 /c/UnrealProjects/GitTutorial (main)
$ git status
On branch main
Untracked files:
(use "git add <file>..." to include in what will be committed)
.vsconfig
Config/
Content/
CppTutorial.uproject
Source/
nothing added to commit but untracked files present (use "git add" to track)
```

Initially you will notice that some of the local files will be marked as untracked (and others are not listed at all. This means that the .gitignore is working correctly and git is ignoring those files/directories that do not need to be added to the external repo), these will need to be tracked by entering **git add** **.**:

```bash
user@ComputerName MINGW64 /c/UnrealProjects/GitTutorial (main)
$ git add .
```

This stages all of the changes for the next commit. Now we can enter **git commit -m “<message>”** to make a commit with all of the staged files:

```bash
user@ComputerName MINGW64 /c/UnrealProjects/GitTutorial (main)
$ git commit -m "Adding local unreal files to repo"
[main 70b931f] Adding local unreal files to repo
179 files changed, 938 insertions(+)
...
```

Finally, we can use **git push** to send the commit to the GitHub repo:

```bash
user@ComputerName MINGW64 /c/UnrealProjects/GitTutorial (main)
$ git push
```

**Note:** if git says that the main branch has no upstream branch you can use **git push — set-upstream origin <branch>** to set the remote as upstream:

```bash
user@ComputerName MINGW64 /c/UnrealProjects/GitTutorial (main)
$ git push --set-upstream origin main
Enumerating objects: 310, done.
Counting objects: 100% (310/310), done.
Delta compression using up to 16 threads
Compressing objects: 100% (292/292), done.
Writing objects: 100% (309/309), 158.49 MiB | 4.78 MiB/s, done.
Total 309 (delta 54), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (54/54), done.
To https://github.com/dtb1996/GitTutorial.git
68fa763..70b931f main -> main
branch 'main' set up to track 'origin/main'.
```

Now the local and remote are synced up, and you should see the commit listed in the remote repo:

![Commits in GitHub repo](/posts/images/setting-up-git-for-unreal-engine/setting-up-git-for-unreal-engine-05.png)

The commits for a particular branch can also be viewed in the bash terminal by entering **git log**:

```bash
user@ComputerName MINGW64 /c/UnrealProjects/GitTutorial (main)
$ git log
commit 70b931fb02dbf71905a68209a101651f0f9335d2 (HEAD -> main, origin/main)
Author: Dillon Bellefeuille <user@email.com>
Date: Tue May 20 20:43:48 2025 -0400
Adding local unreal files to repo
commit 68fa7631607f27788883d69a49256b804d5f818c
Author: Dillon Bellefeuille <user@email.com>
Date: Tue May 20 20:36:26 2025 -0400
Initial commit
```

And with that the new repo is all setup and ready for you to create [feature branches](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) and commit changes. Refer to [this guide](https://www.atlassian.com/git/glossary#commands) for more information on git commands.
