# Customize This Portfolio

This portfolio is designed so someone can make their own version by editing one file:

```text
data.js
```

## What To Change

Open `data.js` and replace the example information with your own:

- `owner`: name, title, intro, photo, and bio
- `contact`: email, LinkedIn, GitHub, resume file, and form endpoint
- `featuredProject`: the main case study recruiters should read first
- `skills`: languages, web/app skills, CS foundations, tools, and interests
- `projects`: project cards
- `achievements`: glowing stars in the constellation
- `goals`: future checklist items
- `hobbies`: hobby tiles and descriptions
- `research`: research or writing cards
- `hackathons`: hackathon cards

## Images

Put your images in the same folder as `index.html`.

Examples:

```text
profile.jpg
dance.jpg
project-photo.jpg
```

Then use that same filename in `data.js`.

## Achievement Stars

Each achievement has a position:

```js
x: "32%",
y: "17%"
```

Change those numbers to move the star around the constellation page.

## Start Simple

To make your own version quickly:

1. Change the name and bio in `owner`.
2. Replace the contact links.
3. Replace the projects.
4. Replace the achievements.
5. Add your own photos.

The HTML, CSS, and JavaScript can stay the same.

## Make Messages Arrive In Gmail

Static websites cannot send email by themselves. To make the letter form arrive in your Gmail, use a form service such as Formspree.

1. Go to `https://formspree.io/`.
2. Create a free form using your Gmail address.
3. Copy the form endpoint. It will look like this:

```text
https://formspree.io/f/yourformid
```

4. Open `data.js`.
5. Paste it into `formEndpoint`:

```js
formEndpoint: "https://formspree.io/f/yourformid"
```

After that, letters from the contact card will be sent to your email.

## Resume

Put your resume PDF in the same folder as `index.html`, then update `contact.resume` in `data.js`. The current expected filename is:

```text
Pronita-Ghimire-Resume.pdf
```

## Portfolio Guide Chat

The AI-style chatbox is a safe portfolio guide. It answers questions using the information in `data.js`, so it does not need an API key.

If you later want a real AI chatbot, use a backend server so your API key is not exposed in the browser.
