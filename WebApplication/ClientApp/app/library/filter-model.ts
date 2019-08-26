export class FilterModel{
    public org: any;
    public agr: any;
    public wtype: any;
    public planner: any;
    public status: any;
    public form: string;
    public period: any;
    public ready: boolean;
    public conut: number;
    public filterType: string;
    public filterLoaded: any;


    constructor() {
        let date = new Date();
        let mon = ((date.getMonth() + 1).toString().length > 1) ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString();
        let day = (date.getDate().toString().length > 1) ? date.getDate().toString() : '0' + date.getDate().toString();
        
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
}