/**
 * Script to upload missing src/ and supabase/ folders to GitHub
 * Usage: node upload-to-github.js <YOUR_GITHUB_TOKEN>
 *
 * Get a token at: https://github.com/settings/tokens/new
 * Required scope: repo (full control of private repositories)
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, posix } from 'path';
import { createInterface } from 'readline';

const OWNER = 'baryb9457';
const REPO = 'KAMAB';
const BRANCH = 'main';

const token = process.argv[2];
if (!token) {
  console.error('Usage: node upload-to-github.js <YOUR_GITHUB_TOKEN>');
  console.error('\nGet a token at: https://github.com/settings/tokens/new');
  console.error('Required scope: "repo" or "public_repo"');
  process.exit(1);
}

const HEADERS = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'Netlify-Fix-Script',
};

async function getFileSha(path) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: HEADERS });
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GET ${path} failed: ${res.status} ${body}`);
  }
  const data = await res.json();
  return data.sha;
}

async function uploadFile(localPath, remotePath) {
  const content = readFileSync(localPath);
  const base64 = content.toString('base64');
  const sha = await getFileSha(remotePath);

  const body = {
    message: sha ? `Update ${remotePath}` : `Add ${remotePath}`,
    content: base64,
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  };

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${remotePath}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed for ${remotePath}: ${res.status} ${err}`);
  }
  return sha ? 'updated' : 'created';
}

function getAllFiles(dir, baseDir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getAllFiles(fullPath, baseDir));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

const WORKSPACE = 'C:\\Users\\BARRY\\Desktop\\kam ws';

// Folders to upload (relative to workspace)
const FOLDERS_TO_UPLOAD = ['src', 'supabase'];

// Also upload the .env to delete it? No - we skip .env on purpose.
// Files to skip
const SKIP_FILES = ['.env', 'node_modules', '.git', 'dist', 'upload-to-github.js'];

async function main() {
  console.log(`\nUploading to github.com/${OWNER}/${REPO} (branch: ${BRANCH})\n`);

  // Verify token works
  const testRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, { headers: HEADERS });
  if (!testRes.ok) {
    console.error('Token verification failed. Make sure the token has "repo" scope.');
    process.exit(1);
  }
  console.log('Token verified. Starting upload...\n');

  let uploaded = 0, failed = 0;

  for (const folder of FOLDERS_TO_UPLOAD) {
    const localFolder = join(WORKSPACE, folder);
    let files;
    try {
      files = getAllFiles(localFolder, WORKSPACE);
    } catch {
      console.warn(`Folder not found: ${folder} — skipping.`);
      continue;
    }

    for (const localPath of files) {
      const relativePath = relative(WORKSPACE, localPath).replace(/\\/g, '/');

      // Skip unwanted files
      if (SKIP_FILES.some(s => relativePath.startsWith(s) || relativePath.includes(`/${s}/`))) {
        continue;
      }

      process.stdout.write(`  Uploading ${relativePath}... `);
      try {
        const action = await uploadFile(localPath, relativePath);
        console.log(action);
        uploaded++;
      } catch (err) {
        console.log('FAILED');
        console.error(`    → ${err.message}`);
        failed++;
      }
    }
  }

  console.log(`\n✓ Done. ${uploaded} file(s) uploaded, ${failed} failed.`);
  if (failed === 0) {
    console.log('\nNow go to Netlify and trigger a new deploy!');
  }
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
