'use strict';

import DSComponent from "../../base/component/component";

export class MobileTable extends DSComponent {
    private element: HTMLTableElement;
    private window: Window;

    constructor(element: HTMLTableElement, _window: Window = window) {
        super(element);
        this.element = element;
        this.window = _window;
    }

    init() {
        if (this.element.dataset.smallscreen === 'scrolling') {
            this.checkScrollingTable();
            this.window.addEventListener('resize', () => { this.checkScrollingTable(); });
            this.isInitialised = true;
        } else if (this.element.dataset.smallscreen === 'boxes') {
            this.setupBoxesTable();
            this.isInitialised = true;
        }
    }

    private checkScrollingTable() {
        if (this.element.querySelector('tbody')?.offsetWidth > this.element.parentElement?.offsetWidth) {
            this.element.classList.add('js-is-scrolling');
        } else {
            this.element.classList.remove('js-is-scrolling');
        }
    }

    private setupBoxesTable() {
        const trs = this.element.querySelectorAll('tr');
        let headerRow: HTMLTableRowElement;

        if ([].slice.call(trs[0].cells).filter((cell: HTMLTableCellElement) => cell.tagName === 'TH').length === trs[0].cells.length) {
            headerRow = trs[0];
        }

        if (headerRow) {
            for (let j = 1, jl = trs.length; j < jl; j++) {
                [].slice.call(trs[j].cells).forEach((td: HTMLTableCellElement, index: number) => {
                    td.setAttribute('data-heading', headerRow.cells[index].textContent);
                });
            }
        }
    }
}

class MobileTables {
    private window: Window;
    private mobileTables: NodeListOf<Element>;

    constructor(_window = window) {
        this.window = _window;
    }

    init() {
        this.mobileTables = document.querySelectorAll('table[data-smallscreen]');
        this.mobileTables.forEach(table =>  new MobileTable(table as HTMLTableElement, this.window).init())
    }
}

export default MobileTables;
