import { describe, expect, it } from 'vitest';
import DSComponent from './component';

describe('DS component', () => {
    it.only('should set the js-instantiated class on instantiation', () => {
        const element = document.createElement('div');
        new DSComponent(element);

        expect(element.classList.contains('js-instantiated')).toEqual(true);
    });

    it('should set or unset the js-initialised class if a component is set as isInitialised', () => {
        const element = document.createElement('div');
        const component = new DSComponent(element);

        component.isInitialised = true;
        expect(element.classList.contains('js-initialised')).toEqual(true);

        component.isInitialised = false;
        expect(element.classList.contains('js-initialised')).toEqual(false);
    });
});
