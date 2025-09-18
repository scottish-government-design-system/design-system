/* global document, window */

'use strict';

class MobileTables {
    constructor(_window = window) {
        this.window = _window;
    }

    init() {
        this.scrollingTables = document.querySelectorAll('table[data-smallscreen="scrolling"]');
        this.boxesTables = document.querySelectorAll('table[data-smallscreen="boxes"]');

        this.checkScrollingTables();
        this.window.addEventListener('resize', () => { this.checkScrollingTables(); });

        this.setupBoxesTables();
    }

    checkScrollingTables() {
        this.scrollingTables.forEach(table => {
            if (table.querySelector('tbody').offsetWidth > table.parentNode.offsetWidth) {
                table.classList.add('js-is-scrolling');
            } else {
                table.classList.remove('js-is-scrolling');
            }
        });
    }

    setupBoxesTables() {
        for (let i = 0, il = this.boxesTables.length; i < il; i++) {
            const trs = this.boxesTables[i].querySelectorAll('tr');
            let headerRow;

            if ([].slice.call(trs[0].cells).filter(cell => cell.tagName === 'TH').length === trs[0].cells.length) {
                headerRow = trs[0];
            }

            if (headerRow) {
                for (let j = 1, jl = trs.length; j < jl; j++) {
                    [].slice.call(trs[j].cells).forEach((td, index) => {
                        td.setAttribute('data-heading', headerRow.cells[index].textContent.trim());
                    });
                }
            }
        }
    }
}

export default MobileTables;
