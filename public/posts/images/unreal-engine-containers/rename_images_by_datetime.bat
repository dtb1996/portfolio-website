@echo off
setlocal enabledelayedexpansion

:: Prompt user for the prefix
set /p "prefix=Enter file prefix: "

:: Change this to your folder path (or leave as . for current folder)
set "folder=."

cd /d "%folder%"

:: Reset counter
set /a count=0

:: Create a temporary list of PNG files sorted by date (oldest first)
for /f "delims=" %%A in ('dir /b /a:-d /o:d *.png') do (
    set /a count+=1
    set "file[!count!]=%%A"
)

:: Check if any files were found
if !count! equ 0 (
    echo No PNG files found in %folder%.
    pause
    exit /b
)

:: Rename each file
for /l %%i in (1,1,!count!) do (
    set "num=0%%i"
    set "num=!num:~-2!"
    set "oldname=!file[%%i]!"
    ren "!oldname!" "%prefix%!num!.png"
)

echo Done!
echo Renamed !count! files with prefix "%prefix%".
pause
