const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const farcasterConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: ""
  },
  miniapp: {
    version: "1",
    name: "Base Clicker",
    subtitle: "Tap to earn coins",
    description: "A clicker idle game on Base. Tap the button, buy upgrades, earn coins forever.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#0a0a0a",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["game", "clicker", "idle", "base"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`,
    tagline: "Tap. Upgrade. Repeat.",
    ogTitle: "Base Clicker",
    ogDescription: "A clicker idle game on Base.",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;

