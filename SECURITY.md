Security Policy

Supported Versions

Security updates are provided for actively maintained versions of "@viertechjs/baileys".

Version| Supported
Latest release| ✅
Latest development branch| ✅
Older releases| ⚠️ Best effort
Unsupported / abandoned versions| ❌

Users are encouraged to keep "@viertechjs/baileys" updated to the latest available version.

---

Reporting a Vulnerability

If you discover a security vulnerability in "@viertechjs/baileys", please do not publish the vulnerability publicly before it has been reviewed.

Report security issues directly to:

Harta Javier / VierTech Solutions

📧 Email: "aajavie834@gmail.com" (mailto:aajavie834@gmail.com)

🌐 GitHub: https://github.com/aa-javier

📦 Repository: https://github.com/aa-javier/viertech-baileys

When submitting a vulnerability report, please include as much information as possible, such as:

- affected version;
- affected file or function;
- description of the vulnerability;
- steps to reproduce;
- proof of concept, if available;
- possible impact;
- suggested fix, if known;
- environment information such as Node.js version and operating system.

---

Responsible Disclosure

Please allow reasonable time for the vulnerability to be investigated and fixed before publicly disclosing technical details.

Security reports will generally follow this process:

1. The report is received and reviewed.
2. The vulnerability is reproduced and evaluated.
3. A fix is developed if necessary.
4. A patched version is prepared.
5. The reporter may be contacted for additional information.
6. The fix is released.
7. Public disclosure may occur after users have had reasonable time to update.

Critical vulnerabilities may receive priority handling.

---

What Should Be Reported

Security reports are especially useful for issues involving:

- authentication bypass;
- session or credential exposure;
- unintended access to WhatsApp authentication data;
- encryption or decryption issues;
- malicious message handling;
- arbitrary code execution;
- path traversal;
- insecure temporary file handling;
- sensitive information disclosure;
- unauthorized access to stored credentials;
- vulnerabilities introduced by VierTech-specific modifications;
- Sticker Pack processing vulnerabilities;
- polling/decryption helper vulnerabilities;
- dependency-related security issues that directly affect this project.

---

What Is Not Considered a Security Vulnerability

The following are generally not treated as vulnerabilities in this project:

- WhatsApp account bans or restrictions;
- WhatsApp rate limits;
- unofficial API limitations;
- bugs caused by incorrect bot implementation;
- exposed credentials committed by the application developer;
- security issues caused by sharing session files publicly;
- errors caused by unsupported Node.js versions;
- upstream WhatsApp behavior outside the control of this library;
- spam or abuse performed by applications using this library.

---

Authentication Files

WhatsApp authentication credentials and session files are highly sensitive.

Developers should never:

- upload session folders to public repositories;
- commit credential files to Git;
- share authentication states publicly;
- include credentials in bug reports;
- expose API keys, access tokens, cookies, or session secrets.

It is strongly recommended to add session and credential directories to ".gitignore".

Example:

session/
sessions/
auth/
credentials/
*.session
.env

---

Access Tokens and API Keys

If your application uses GitHub tokens, VierTech REST API keys, or other credentials, store them through environment variables.

Example:

VIER_API_KEY=your_api_key

Do not hardcode secrets directly into source code.

Avoid:

const apiKey = 'my-secret-api-key'

Prefer:

const apiKey = process.env.VIER_API_KEY

---

Dependency Security

"@viertechjs/baileys" depends on third-party packages and upstream components.

Users should periodically check dependencies for known vulnerabilities and keep dependencies updated.

For example:

npm audit

or:

npm audit fix

Review automated fixes before deploying them to production.

---

Upstream Security Issues

"@viertechjs/baileys" is based on the Baileys project maintained by WhiskeySockets.

If a security issue originates exclusively from upstream Baileys and is not caused by a VierTech modification, the issue may also need to be reported to the upstream project:

https://github.com/WhiskeySockets/Baileys

Issues specifically related to VierTech modifications should be reported directly to this repository.

---

Disclaimer

"@viertechjs/baileys" is an unofficial WhatsApp Web library.

This project is not affiliated with, endorsed by, sponsored by, or officially connected to WhatsApp or Meta.

Users are responsible for securing their own applications, credentials, infrastructure, and deployment environments.

---

Security Contact

Maintainer: Harta Javier
Project: "@viertechjs/baileys"
Organization: VierTech Solutions
Email: "aajavie834@gmail.com" (mailto:aajavie834@gmail.com)
Repository: https://github.com/aa-javier/viertech-baileys
REST API: https://api.viertechsolutions.com

---

Last updated: August 2026
