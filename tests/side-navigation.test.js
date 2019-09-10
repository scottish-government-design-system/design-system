const fs = require('fs');
const path = require('path');

const sideNavigationScript = require('../src/scripts/side-navigation');
const html = fs.readFileSync(path.resolve(__dirname, 'html/side-navigation.html'), 'utf-8');

describe('side navigation', () => {
    describe('no side navigation', () => {
        it('should not have any errors', () => {
            sideNavigationScript.sideNavigationComponent.init();
        });
    });

    describe('with side navigation', () => {
        beforeEach(() => {
            document.documentElement.innerHTML = html.toString();
            sideNavigationScript.sideNavigationComponent.init();
        });

        it ('should set an initial ARIA value on the show/hide checkbox', () => {
            const sideNavigation = document.querySelector('.ds_side-navigation');
            const checkbox = sideNavigation.querySelector('#show-side-navigation');

            expect(checkbox.getAttribute('aria-expanded')).toEqual('false');
        });

        it ('should toggle display of the side navigation on click of the label', () => {
            const sideNavigation = document.querySelector('.ds_side-navigation');
            const label = sideNavigation.querySelector('.ds_side-navigation__expand');
            const list = sideNavigation.querySelector('.ds_side-navigation__list--root');

            // opening nav
            const event = new Event('click');
            label.dispatchEvent(event);
            expect(list.style.display).toEqual('block');

            // closing nav
            label.dispatchEvent(event);
            expect(parseInt(list.style.maxHeight, 10)).toEqual(0);

        });

        it ('should toggle a class on the navigation if the navigation button is sticky', function () {
            const sideNavigationExpand = document.querySelector('.ds_side-navigation__expand');

            const event = new Event('scroll');
            window.dispatchEvent(event);
            expect(sideNavigationExpand.classList.contains('ds_side-navigation__expand--shadow')).toEqual(false);

            // todo: some way of influencing top offset
            //window.dispatchEvent(event);
            //expect(sideNavigationExpand.classList.contains('ds_side-navigation__expand--shadow')).toEqual(true);
        });
    });
});
