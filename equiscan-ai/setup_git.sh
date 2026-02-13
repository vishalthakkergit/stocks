#!/bin/bash

# 1. Clean up old Vercel and Git artifacts to start fresh
echo "Cleaning up..."
rm -rf .vercel
rm -rf .git

# 2. Initialize Git
echo "Initializing Git..."
git init

# 3. Add all files
echo "Adding files..."
git add .

# 4. Commit
echo "Committing files..."
git commit -m "Fresh Start: Clean Vite + React Setup"

# 5. Rename branch to main
echo "Renaming branch..."
git branch -M main

# 6. Add remote
echo "Adding remote origin..."
# Note: Ensure this URL is correct for your repository
git remote add origin https://github.com/vishalthakkergit/stocks.git

# 7. Force Push to GitHub (Overwrites history for a clean slate)
echo "Pushing to GitHub..."
git push -u origin main --force

echo "Done! Code is reset. You can now connect this repo to Vercel as a new project."
