export default function cleanMessage(message: string) {
  return message
    .replace(/\s*"link"/g, '')
    .replace(/&#x20;/g, ' ')
    .trim();
}