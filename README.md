# URL Scraper

A simple web app that extracts text from a webpage and uses Google Gemini AI to generate a short summary.

## Setup

### 1. Backend

Open a terminal and run:

```sh
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
GEMINI_API_KEY=your_api_key_here
```

Get your free API key from [Google AI Studio](https://aistudio.google.com/apikey).

Start the backend:

```sh
npm run dev
```

### 2. Frontend

Open a second terminal and run:

```sh
cd client
npm install
npm run dev
```

Open the local URL shown in your terminal, usually `http://localhost:5173`.

## Usage

1. Paste a webpage URL.
2. Click Summarize.
3. Wait for the AI-generated summary.

Note: Keep your API key private. Never commit your `.env` file to GitHub.
