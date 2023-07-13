import elementIdModifier from './id-modifier';

describe('Element ID modifier', () => {
    it('should increment the ID modifier every time it is called', () => {
        let foo = elementIdModifier().substring(2);
        let bar = elementIdModifier().substring(2);

        expect(Number(bar)).toEqual(Number(foo) + 1);
    });
});
