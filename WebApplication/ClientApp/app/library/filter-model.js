var FilterModel = /** @class */ (function () {
    function FilterModel() {
        var date = new Date();
        var mon = ((date.getMonth() + 1).toString().length > 1) ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString();
        var day = (date.getDate().toString().length > 1) ? date.getDate().toString() : '0' + date.getDate().toString();
        this.org = '%';
        this.agr = '%';
        this.wtype = '%';
        this.planner = 40;
        this.form = 'week';
        this.status = '%';
        this.conut = 0;
        this.period = {
            year: date.getFullYear().toString(),
            month: mon,
            day: day
        };
        this.ready = false;
        this.filterType = 'custom';
        this.filterLoaded = {};
    }
    return FilterModel;
}());
export { FilterModel };
//# sourceMappingURL=filter-model.js.map