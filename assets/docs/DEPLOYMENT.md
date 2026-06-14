# Deployment Notes

## Fast upload path

1. Unzip the site package.
2. Upload all files inside `black-meridian-v3/` to the root of your hosting repo or static host.
3. Make sure these files are at the top level:
   - `index.html`
   - `style.css`
   - `app.js`
   - `story.js`
   - `assets/`
4. Visit the deployed URL.

## Custom domain checklist

- Buy the domain.
- Point DNS to your static host.
- Enable HTTPS.
- Set the custom domain in your host dashboard.
- Update `index.html` metadata after the final name/domain is chosen.

## GitHub Pages checklist

- Repository visibility can be public or private depending on your account plan.
- Source branch: `main`.
- Folder: `/root`.
- Do not upload the containing ZIP into the repo as the site root. Upload the extracted files.

## Common gotchas

- Audio may not play until the user presses `BEGIN PLAYBACK`. This is normal browser behavior.
- Opening `index.html` directly works, but a local server is cleaner for testing audio and relative paths.
- Browser narration voice depends on the user's device. Real voiceover can be added later by replacing/augmenting the audio files.


## V3.1 navigation note

V3.1 is meant to run entirely from the root URL. Visitors should only need:

```txt
https://yourdomain.com/
```

Do not promote internal asset paths or subfolders. The unlock flow, progress, and archive navigation are handled by `app.js` in the browser.
