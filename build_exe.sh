#!/bin/bash

# Ensure pip requirements are installed
pip install -r requirements.txt
pip install pyinstaller

# Clean previous builds
rm -rf build dist

# Run PyInstaller with our specification file
pyinstaller exchange3.spec

echo "Build complete. Executable is in the 'dist' folder."
