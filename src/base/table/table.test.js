const testObj = {};

jasmine.getFixtures().fixturesPath = 'base/src/';

import MobileTables from './table';

describe('mobile tables', () => {
    beforeEach(function () {
        loadFixtures('base/table/table.html');
        testObj.mobileTables = new MobileTables();
    });

    describe('scrolling tables', () => {
        it('should check whether to change the table display on init', () => {
            spyOn(testObj.mobileTables, 'checkScrollingTables');

            testObj.mobileTables.init();

            expect(testObj.mobileTables.checkScrollingTables).toHaveBeenCalled();
        });

        it('should check whether to change the table display on resize', () => {
            testObj.mobileTables.init();

            spyOn(testObj.mobileTables, 'checkScrollingTables');

            let event = new Event('resize');
            testObj.mobileTables.window.dispatchEvent(event);

            expect(testObj.mobileTables.checkScrollingTables).toHaveBeenCalled();
        });

        it('should change the table display if the table is wider than its container', () => {
            const table = document.getElementById('scrolling');
            table.parentNode.style.width = '400px';

            testObj.mobileTables.init();

            expect(table.classList.contains('js-is-scrolling')).toBeTrue();
        });

        it('should use the normaltable display if the table is narrower than its container', () => {
            const table = document.getElementById('scrolling');
            table.parentNode.style.width = '800px';

            testObj.mobileTables.init();

            expect(table.classList.contains('js-is-scrolling')).toBeFalse();
        });
    });

    describe('box tables', () => {
        it('should do nothing if the table has no heading row', () => {
            const table = document.getElementById('boxes-no-header');

            const origHtml = table.innerHTML;

            testObj.mobileTables.init();

            expect(table.innerHTML).toEqual(origHtml);
        });

        it('should add a data attribute with the heading to each table cell', () => {
            const table = document.getElementById('boxes');
            const tableHeadings = [].slice.call(table.querySelectorAll('th')).map(cell => cell.innerText);

            testObj.mobileTables.init();

            const row = table.querySelector('tbody > tr');
            const cells = row.querySelectorAll('td');

            for (let i = 0, il = cells.length; i < il; i++) {
                expect(cells[i].getAttribute('data-heading')).toEqual(tableHeadings[i]);
            }
        });
    });
});
