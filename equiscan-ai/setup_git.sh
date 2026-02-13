#!/bin/bash

# 1. Initialize Git
echo "Initializing Git..."
git init

# 2. Add all files
echo "Adding files..."
git add .

# 3. Commit
echo "Committing files..."
git commit -m "Initial commit: Stock Analysis App"

# 4. Rename branch to main
echo "Renaming branch..."
git branch -M main

# 5. Add remote (removing existing if present to avoid errors)
echo "Adding remote origin..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/vishalthakkergit/stocks.git

# 6. Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Code is now on GitHub."