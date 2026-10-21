CalclyWorld — local opening and deployment notes

This package is designed so local HTML pages can find their CSS, JavaScript,
images and internal pages using relative paths.

To preview:
1. Extract the ZIP.
2. Open age-calculator/index.html, then navigate to a calculator.
3. If your browser restricts a feature under file://, use a local development
   server instead; the website should also work from its hosted domain.

For deployment:
- Upload the website files from age-calculator/ to the site's public root.
- Do NOT upload the .git folder to the public web root.
- Keep .git in your development project and private backups.
- Keep the original ZIP as a separate backup.
- Google AdSense, Analytics, ads.txt, CNAME and the existing Git history are
  retained in this project. Do not replace the live website until you review
  the audit report and stage-test the changes.

See CalclyWorld-Audit-Report.md at the ZIP root for scope and limitations.
