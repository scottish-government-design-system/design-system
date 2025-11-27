import { beforeEach, describe, expect, it } from 'vitest';
import highlight from './highlight';

let element;

describe('"highlight" helper', () => {
    beforeEach(() => {
        element = document.createElement('div');
    });

    it('should highlight matched text', () => {
        element.innerHTML = 'foobar';
        highlight(element, 'oba');
        expect(element.innerHTML).toBe('fo<mark>oba</mark>r');
    });

    it('should apply a supplied class to the returned element', () => {
        element.innerHTML = 'foobar';
        highlight(element, 'oba', { className: 'my-highlight' });
        expect(element.innerHTML).toBe('fo<mark class="my-highlight">oba</mark>r');
    });

    it('should apply a supplied tagName to the returned element', () => {
        element.innerHTML = 'foobar';
        highlight(element, 'oba', { tagName: 'strong' });
        expect(element.innerHTML).toBe('fo<strong>oba</strong>r');
    });

    it('should highlight text in nested HTML', () => {
        element.innerHTML = '<div>Foo<span>bar<i>foobar</i></span></div>';
        highlight(element, 'oba');
        expect(element.innerHTML).toBe('<div>Foo<span>bar<i>fo<mark>oba</mark>r</i></span></div>');
    });

    it('should do nothing if no pattern to mark', () => {
        element.innerHTML = 'foobar';
        highlight(element, '');
        expect(element.innerHTML).toBe('foobar');
    });
});
