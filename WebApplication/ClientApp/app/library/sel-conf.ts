export class SelConf {

    public displayKey: string;
    public search: boolean;
    public height: string;
    public placeholder: string;
    public customComparator: any;
    public limitTo: number;
    public moreText: string;
    public noResultsFound: string;
    public searchPlaceholder: string;
    public searchOnKey: string;


    constructor(private key: string) {
        this.displayKey = key;
        this.search = true;
        this.height = '400px';
        this.placeholder = 'Все...';
        this.customComparator = () => { };
        this.limitTo = 10000;
        this.moreText = 'more';
        this.noResultsFound = 'No results found!';
        this.searchPlaceholder = 'Search';
        this.searchOnKey = key;
    }
}