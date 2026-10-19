// Local assets live in /public/assets. BASE_URL is './' so paths stay relative on any host.
export const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`
