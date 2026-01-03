import http from "node:http";
import { URL } from "node:url";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET in your environment (.env)."
  );
  process.exit(1);
}

const PORT = 8081;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const SCOPES = ["user-read-currently-playing", "user-read-playback-state"].join(" ");

function base64BasicAuth(id, secret) {
  return Buffer.from(`${id}:${secret}`).toString("base64");
}

async function exchangeCodeForTokens(code) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${base64BasicAuth(CLIENT_ID, CLIENT_SECRET)}`,
    },
    body,
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      `Token exchange failed (${res.status}): ${JSON.stringify(json)}`
    );
  }
  return json;
}

const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.searchParams.set("response_type", "code");
authorizeUrl.searchParams.set("client_id", CLIENT_ID);
authorizeUrl.searchParams.set("scope", SCOPES);
authorizeUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authorizeUrl.searchParams.set("show_dialog", "true");

console.log("\n1) Add this Redirect URI in Spotify Dashboard:");
console.log(`   ${REDIRECT_URI}\n`);
console.log("2) Open this URL in your browser and approve:");
console.log(`   ${authorizeUrl.toString()}\n`);
console.log(
  "3) After approval, you'll be redirected to /callback and this script will print SPOTIFY_REFRESH_TOKEN.\n"
);

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url ?? "/", `http://localhost:${PORT}`);

    if (reqUrl.pathname !== "/callback") {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }

    const error = reqUrl.searchParams.get("error");
    if (error) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Spotify auth error: ${error}`);
      return;
    }

    const code = reqUrl.searchParams.get("code");
    if (!code) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Missing ?code=");
      return;
    }

    const tokens = await exchangeCodeForTokens(code);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "<h2>Spotify token captured.</h2><p>You can close this tab and go back to the terminal.</p>"
    );

    console.log("\n✅ Success. Add this to your .env (DO NOT COMMIT .env):\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${tokens.refresh_token}\n`);

    if (!tokens.refresh_token) {
      console.log(
        "Note: Spotify did not return a refresh_token. If you previously authorized this app, remove it from your Spotify Account > Apps, then run again."
      );
    }

    server.close();
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal error");
    console.error(e);
    server.close();
  }
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT} ...`);
});
