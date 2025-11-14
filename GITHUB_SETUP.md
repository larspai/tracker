# Uploading Tracker to GitHub

## Step-by-Step Instructions

### 1. Remove duplicate README (optional but recommended)
GitHub prefers `README.md` (uppercase). You can delete `readme.md`:
```bash
rm readme.md
```

### 2. Initialize Git Repository

Open terminal in the Tracker directory and run:

```bash
cd Tracker
git init
```

### 3. Add All Files

```bash
git add .
```

This will add all files except those in `.gitignore` (like `node_modules/`).

### 4. Make Your First Commit

```bash
git commit -m "Initial commit: GPS Tracker application"
```

### 5. Connect to Your GitHub Repository

**If you haven't created the repository on GitHub yet:**
1. Go to https://github.com/new
2. Name it (e.g., "tracker" or "gps-tracker")
3. **Don't** initialize with README, .gitignore, or license (you already have these)
4. Click "Create repository"

**Then connect your local repo:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

**Example:**
```bash
git remote add origin https://github.com/johndoe/tracker.git
```

### 6. Push to GitHub

```bash
git branch -M main
git push -u origin main
```

If prompted, enter your GitHub username and password (or use a Personal Access Token).

## Files That Will Be Uploaded

✅ **Will be uploaded:**
- `package.json` & `package-lock.json`
- `server.js`
- `public/` folder (all HTML, CSS, JS files)
- `README.md`
- `SERVING.md`
- `.gitignore`

❌ **Will NOT be uploaded** (thanks to .gitignore):
- `node_modules/` (too large, users can run `npm install`)
- `*.log` files
- `.DS_Store` (Mac system files)
- `.env` files (if any)

## Enable GitHub Pages (Optional)

If you want to host the app on GitHub Pages:

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch and `/public` folder
4. Click **Save**
5. Your app will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

**Note:** Since the app uses Web Workers, GitHub Pages (HTTPS) is perfect!

## Troubleshooting

### If you get "remote origin already exists":
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### If you need to update files later:
```bash
git add .
git commit -m "Your commit message"
git push
```

### If you want to see what will be uploaded:
```bash
git status
```

## Quick Command Summary

```bash
# Navigate to project
cd Tracker

# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: GPS Tracker application"

# Connect to GitHub (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

