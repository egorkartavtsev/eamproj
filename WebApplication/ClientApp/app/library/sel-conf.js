var SelConf = /** @class */ (function () {
    function SelConf(key) {
        this.key = key;
        this.displayKey = key;
        this.search = true;
        this.height = '200px';
        this.placeholder = '%';
        this.customComparator = function () { };
        this.limitTo = 10000;
        this.moreText = 'more';
        this.noResultsFound = 'No results found!';
        this.searchPlaceholder = 'Search';
        this.searchOnKey = key;
    }
    return SelConf;
}());
export { SelConf };
//# sourceMappingURL=sel-conf.js.map