import { vi } from 'vitest';
import loadHtml from '../../../loadHtml';
import MobileTables from './table';

const testObj = {};

describe('mobile tables', () => {
    beforeEach(async () => {
        await loadHtml('src/components/table/table.html');
        testObj.mobileTables = new MobileTables();
    });

    describe('scrolling tables', () => {
        it('should check whether to change the table display on init', () => {
            vi.spyOn(testObj.mobileTables, 'checkScrollingTables').mockImplementation();

            testObj.mobileTables.init();

            expect(testObj.mobileTables.checkScrollingTables).toHaveBeenCalled();
        });

        it('should check whether to change the table display on resize', () => {
            testObj.mobileTables.init();

            vi.spyOn(testObj.mobileTables, 'checkScrollingTables').mockImplementation();

            let event = new Event('resize');
            testObj.mobileTables.window.dispatchEvent(event);

            expect(testObj.mobileTables.checkScrollingTables).toHaveBeenCalled();
        });

        it('should change the table display if the table is wider than its container', () => {
            const table = document.getElementById('scrolling');
            table.parentElement.style.width = '400px';

            testObj.mobileTables.init();

            expect(table.classList.contains('js-is-scrolling')).toBe(true);
        });

        it('should use the normal table display if the table is narrower than its container', () => {
            const table = document.getElementById('scrolling');
            table.parentElement.style.width = '800px';

            testObj.mobileTables.init();

            expect(table.classList.contains('js-is-scrolling')).toBe(false);
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
            const tableHeadings = [].slice.call(table.querySelectorAll('th')).map(cell => cell.textContent);

            testObj.mobileTables.init();

            const row = table.querySelector('tbody > tr');
            const cells = row.querySelectorAll('td');

            for (let i = 0, il = cells.length; i < il; i++) {
                expect(cells[i].getAttribute('data-heading')).toEqual(tableHeadings[i]);
            }
        });
    });
});
