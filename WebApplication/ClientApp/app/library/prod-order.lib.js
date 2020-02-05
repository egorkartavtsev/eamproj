var ProdOrder = /** @class */ (function () {
    function ProdOrder(po) {
        if (typeof (po) !== "undefined") {
            this.entity_id = po.entity_id;
            this.entity_name = po.entity_name;
            this.org_id = po.org_id;
            this.typology = po.typology;
            this.instance_number = po.instance_number;
            this.start = po.start;
            this.complete = po.complete;
            this.hours = po.hours;
            this.work_order_type = po.work_order_type;
            this.status_type = po.status_type;
            this.idle_cat = po.idle_cat;
            this.idle_type = po.idle_type;
            this.idle_code = po.idle_code;
        }
    }
    return ProdOrder;
}());
export { ProdOrder };
//# sourceMappingURL=prod-order.lib.js.map