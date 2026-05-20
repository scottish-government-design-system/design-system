import { commands } from 'vitest/browser';
export default async function (filePath: string, stub = './') {
    const HTML = await commands.readFile(`${stub}${filePath}`);
    document.body.innerHTML = HTML;
}
