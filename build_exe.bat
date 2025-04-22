@echo off
REM Ensure pip requirements are installed
pip install -r requirements.txt
pip install pyinstaller

REM Clean previous builds
rmdir /s /q build
rmdir /s /q dist

REM Run PyInstaller with our specification file
pyinstaller exchange3.spec

echo Build complete. Executable is in the 'dist' folder.
