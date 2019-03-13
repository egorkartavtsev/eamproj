export class FilterModel{
    public org_filter: string;
    public agr_filter: string;
    public wt_filter: string;
    public planner_filter: string;

    constructor(){
        this.org_filter = '';
        this.agr_filter = '';
        this.wt_filter = '';
        this.planner_filter = '';
    }
}