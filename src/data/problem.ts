export function problemFor(e: unknown) {
  if (
    e instanceof TypeError ||
    (e instanceof Error && (
      e.name === 'AbortError' ||
      /fetch failed|request.*cancel|aborted/i.test(e.message)
    ))
  ) {
    return 'No connection. Check your Wi-Fi and try again.';
  }
  if (e instanceof Error && e.message === 'request-timeout') {
    return 'The API request timed out. Check that the Next.js server is running.';
  }
  if (e instanceof Error && e.message === '401') {
    return 'Your session has expired. Please sign in again.';
  }
  if (e instanceof Error && /^\d+$/.test(e.message)) {
    return `Request failed (${e.message}). Check the API server.`;
  }
  if (e instanceof Error && e.message.startsWith('Set EXPO_PUBLIC_API_URL')) {
    return e.message;
  }
  if (e instanceof SyntaxError) {
    return 'The API returned an invalid response.';
  }
  if (e instanceof Error && e.message !== '') {
    return `API error: ${e.message}`;
  }
  return 'Something went wrong.';
}



export type Status = 'loading' | 'empty' | 'error' | 'content';