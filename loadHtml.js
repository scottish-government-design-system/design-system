import { commands } from 'vitest/browser';
export default async function (file, stub = './') {
    const HTML = await commands.readFile(`${stub}${file}`);
    document.body.innerHTML = HTML;
}
