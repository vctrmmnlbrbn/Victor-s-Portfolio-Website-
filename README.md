## Victor's Portfolio Website 💼

Welcome to my personal portfolio website! This project is built with clean HTML and CSS, designed to be fast, responsive, and easy to navigate. It's where I showcase who I am, what I do, and the projects I've worked on.

## 🌟 Features

- Modern, clean UI/UX
- Responsive layout for all devices
- Smooth sticky navigation with scroll animation
- Project cards linking to live demos and GitHub repositories
- Lightweight and easy to deploy

## 🛠️ Tech Stack

- HTML5
- CSS3
- Git & GitHub for version control

## 📫 Contact

Feel free to reach out:
- Email: victoremmanuelburbano@gmail.com
	 victoremmanuelburbano@outlook.com
- Viber: +63 968 792 9419

- LinkedIn: https://www.linkedin.com/in/victor-emmanuel-burbano-984573371

## Contact Form

The contact cards in `src/index.html` open a popup form and send through a small SMTP relay.

To make it work:
- Deploy the `api/send-email.js` function on Vercel or another serverless host.
- Install dependencies with `npm install`.
- Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, and `ALLOWED_ORIGIN`.
- Update `contactApiUrl` in `src/index.html` to your deployed API URL.
- If your SMTP provider supports it, use an app password instead of your normal inbox password.

The recipient is chosen by the Gmail or Outlook card you click, so messages are routed to the matching inbox.
