import TokenList from './tokenlist';

describe('Token List', () => {
    it('should create a "token list" from an input string', () => {
        const tokenList = new TokenList('foo bar  baz');
        expect(tokenList.tokens).toEqual(['foo', 'bar', 'baz']);
    });

    it('should create an empty token list from a null input parameter', () => {
        const tokenList = new TokenList(null);
        expect(tokenList.tokens).toEqual([]);
    });

    it('should create an empty token list from an undefined input parameter', () => {
        const tokenList = new TokenList();
        expect(tokenList.tokens).toEqual([]);
    });

    it('should create an empty token list from an empty string input parameter', () => {
        const tokenList = new TokenList('');
        expect(tokenList.tokens).toEqual([]);
    });

    it('should allow the addition of items to the token list without duplication', () => {
        const tokenList = new TokenList('foo bar');
        tokenList.add('baz');
        expect(tokenList.tokens).toEqual(['foo', 'bar', 'baz']);

        tokenList.add('baz');
        expect(tokenList.tokens).toEqual(['foo', 'bar', 'baz']);
    });

    it('should allow the removal of items from the token list', () => {
        const tokenList = new TokenList('foo bar baz');
        tokenList.remove('bar');
        expect(tokenList.tokens).toEqual(['foo', 'baz']);

        tokenList.remove('ba');
        expect(tokenList.tokens).toEqual(['foo', 'baz']);
    });

    it('should allow checking for the presence of a value', () => {
        const tokenList = new TokenList('foo bar');
        expect(tokenList.contains('bar')).toBeTrue();
        expect(tokenList.contains('baz')).toBeFalse();
    });
});
