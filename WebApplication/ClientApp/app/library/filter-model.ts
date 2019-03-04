export class FilterModel{
    public areaFilter: string;
    public machinesFilter: string;
    public dateFilter: Date;

    constructor(){
        this.areaFilter = '';
        this.machinesFilter = '';
        //this.dateFilter = new Date();
    }
}