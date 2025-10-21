@echo off
setlocal enabledelayedexpansion

:: Change this to your folder path (or leave as . for current folder)
set "folder=."

cd /d "%folder%"

:: Create a temporary list of PNG files sorted by date (oldest first)
for /f "delims=" %%A in ('dir /b /a:-d /o:d *.png') do (
    set /a count+=1
    set "file[!count!]=%%A"
)

:: Rename each file
set "prefix=unreal-engine-interfaces-"
for /l %%i in (1,1,!count!) do (
    set "num=0%%i"
    set "num=!num:~-2!"
    set "oldname=!file[%%i]!"
    ren "!oldname!" "%prefix%!num!.png"
)

echo Done! Renamed !count! files.
pause
