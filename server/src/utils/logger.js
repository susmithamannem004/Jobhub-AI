function redact(msg) {
  // simple redaction for common secrets
  return String(msg).replace(/(Bearer\s+)?[A-Za-z0-9-_]{20,}/g, '[REDACTED]');
}

export function info(...args) {
  console.log(`[INFO] ${new Date().toISOString()} `, ...args.map(redact));
}

export function warn(...args) {
  console.warn(`[WARN] ${new Date().toISOString()} `, ...args.map(redact));
}

export function error(...args) {
  // Avoid printing full objects that might contain secrets
  console.error(`[ERROR] ${new Date().toISOString()} `, ...args.map(redact));
}

export default { info, warn, error };