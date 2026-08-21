const searchParams = new URLSearchParams(window.location.search);

export const imagePath = searchParams.get("imagePath") ?? null;




// Check if the string value is literally "true"
const toolsUnlockedParam = searchParams.get("toolsUnlocked");
export const toolsUnlocked = toolsUnlockedParam ? toolsUnlockedParam === 'true' : true;

const gameSoundParam = searchParams.get("gameSound");
export const gameSound = gameSoundParam ? gameSoundParam === 'true' : false;

const gameMusicParam = searchParams.get("gameMusic");
export const gameMusic = gameMusicParam ? gameMusicParam === 'true' : false;

const parentalParam = searchParams.get("parental");
export const parental = parentalParam ? parentalParam === 'true' : false;

const languageParam = searchParams.get("language");
// parseInt(value, 10) ensures base-10 parsing. 
// If the result is NaN (Not a Number), we fallback to 0.
export const language = languageParam ? (parseInt(languageParam, 10) || 0) : 0;

const adsFreeParam = searchParams.get("adsFree");
export const adsFree = adsFreeParam ? adsFreeParam === 'true' : false;

const gameplayInterstitialIntervalParam = searchParams.get("gameplayInterstitialInterval");
export const gameplayInterstitialInterval = gameplayInterstitialIntervalParam ? (parseInt(gameplayInterstitialIntervalParam, 10) || 120) : 120;