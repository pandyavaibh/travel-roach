@echo off
REM Windows version. Run from the project root:  scripts\fix-route-folders.bat
cd /d "%~dp0..\src\app"
if exist "-state-\-city-\-section-\-slug-" ren "-state-\-city-\-section-\-slug-" "[slug]"
if exist "-state-\-city-\-section-" ren "-state-\-city-\-section-" "[section]"
if exist "-state-\-city-" ren "-state-\-city-" "[city]"
if exist "-state-" ren "-state-" "[state]"
echo Done. Now run: npm install ^&^& npm run db:setup
pause
