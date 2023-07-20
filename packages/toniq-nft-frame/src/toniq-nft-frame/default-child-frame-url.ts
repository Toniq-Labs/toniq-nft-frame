const devHosts = [
    '127.0.0.1',
    'localhost',
];

function isDev(): boolean {
    return devHosts.includes(globalThis.location.hostname);
}

const prodFrameUrl = 'https://idk-yet.example.com';
const devFrameUrl = 'http://localhost:5284';

export const defaultChildFrameUrl = isDev() ? devFrameUrl : prodFrameUrl;
