export function extractOrigin(fullUrl: string) {
    const urlObject = new URL(fullUrl);

    return urlObject.origin;
}
