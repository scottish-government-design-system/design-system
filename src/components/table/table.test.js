import { vi, beforeEach, describe, expect, it } from 'vitest';
import loadHtml from '../../../loadHtml';
import MobileTables, { MobileTable } from './table';

const testObj = {};

describe('mobile tables', () => {
    beforeEach(async () => {
        await loadHtml('src/components/table/table.html');
    });

    describe('scrolling tables', () => {
        beforeEach(() => {
            testObj.tableElement = document.querySelector('#scrolling');
            testObj.tableModule = new MobileTable(testObj.tableElement);
        });

        it('should check whether to change the table display on init', () => {
            vi.spyOn(testObj.tableModule, 'checkScrollingTable').mockImplementation();

            testObj.tableModule.init();

            expect(testObj.tableModule.checkScrollingTable).toHaveBeenCalled();
        });

        it('should check whether to change the table display on resize', () => {
            testObj.tableModule.init();

            vi.spyOn(testObj.tableModule, 'checkScrollingTable').mockImplementation();

            let event = new Event('resize');
            testObj.tableModule.window.dispatchEvent(event);

            expect(testObj.tableModule.checkScrollingTable).toHaveBeenCalled();
        });

        it('should change the table display if the table is wider than its container', () => {
            const table = document.getElementById('scrolling');
            table.parentElement.style.width = '400px';

            testObj.tableModule.init();

            expect(table.classList.contains('js-is-scrolling')).toBe(true);
        });

        it('should use the normal table display if the table is narrower than its container', () => {
            const table = document.getElementById('scrolling');
            table.parentElement.style.width = '800px';

            testObj.tableModule.init();

            expect(table.classList.contains('js-is-scrolling')).toBe(false);
        });
    });

    describe('box tables', () => {
        it('should do nothing if the table has no heading row', () => {
            testObj.tableElement = document.querySelector('#boxes-no-header');
            testObj.tableModule = new MobileTable(testObj.tableElement);

            const origHtml = testObj.tableElement.innerHTML;

            testObj.tableModule.init();

            expect(testObj.tableElement.innerHTML).toEqual(origHtml);
        });

        it('should add a data attribute with the heading to each table cell', () => {
            testObj.tableElement = document.querySelector('#boxes');
            testObj.tableModule = new MobileTable(testObj.tableElement);
            const tableHeadings = [].slice.call(testObj.tableElement.querySelectorAll('th')).map(cell => cell.textContent);

            testObj.tableModule.init();

            const row = testObj.tableElement.querySelector('tbody > tr');
            const cells = row.querySelectorAll('td');

            for (let i = 0, il = cells.length; i < il; i++) {
                expect(cells[i].getAttribute('data-heading')).toEqual(tableHeadings[i]);
            }
        });
    });

    describe('unknown data-smallscreen', () => {
        it('should not do anything, should not set isInitialised', () => {
            testObj.tableElement = document.querySelector('#boxes');

            testObj.tableElement.dataset.smallscreen = 'foo';
            testObj.tableModule = new MobileTable(testObj.tableElement);

            testObj.tableModule.init();

            expect(testObj.tableModule.isInitialised).toBe(false);
        });
    });

    describe('legacy MobileTables implementation', () => {
        it('should set up any relevant tables found', () => {
            const mobileTables = new MobileTables();
            mobileTables.init();

            const tables = document.querySelectorAll('table[data-smallscreen="boxes"],table[data-smallscreen="scrolling"]');
            tables.forEach(table => expect(table.classList.contains('js-initialised')).toBe(true));
        });
    });
});
