using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EAMlvl1System.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EAMlvl1System.Controllers
{
    [Route("api/porderLists")]
    public class POrdersListController : Controller
    {
        // GET: /<controller>/
        public IActionResult Get(string query, Dictionary<string, string> cond)
        {
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> tmpRow = new Dictionary<string, object>();
            Dictionary<string, object> tmpRow1 = new Dictionary<string, object>();
            DBHandler db = new DBHandler { };
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest();
            }
            rows = db.GetDataFromDB(query, cond);

            foreach (var row in rows) {
                if (cond["instance"] != "LIKE '%'") {
                    if (cond["instance"].ToString() == "= '"+row["INSTANCE_NUMBER"].ToString()+"'") {
                        tmpRow.TryAdd(row["WIP_ENTITY_ID"].ToString(), new Dictionary<string, string> {
                            { "entity_id", row["WIP_ENTITY_ID"].ToString() },
                            { "entity_name", row["WIP_ENTITY_NAME"].ToString() },
                            { "work_order_type", row["WORK_ORDER_STATUS"].ToString() },
                            { "status_type", row["STATUS_TYPE"].ToString() },
                            { "org_id", row["ORGANIZATION_ID"].ToString() },
                            { "org_name", row["ORGANIZATION_NAME"].ToString() },
                            { "instance_number", row["INSTANCE_NUMBER"].ToString() },
                            { "typology", row["TYP"].ToString() },
                            { "inst_desc", row["INSTANCE_DESCRIPTION"].ToString() },
                            { "start", row["SCHEDULED_START_DATE"].ToString() },
                            { "complete", row["SCHEDULED_COMPLETION_DATE"].ToString() },
                            { "idle_cat", row["IDLE_CAT"].ToString() },
                            { "idle_type", row["IDLE_TYPE"].ToString() },
                            { "idle_code", row["IDLE_CODE"].ToString() },
                            { "hours", row["DIFF_HOURS"].ToString() }
                        });
                    }
                } else {
                    tmpRow.TryAdd(row["WIP_ENTITY_ID"].ToString(), new Dictionary<string, string> {
                        { "entity_id", row["WIP_ENTITY_ID"].ToString() },
                        { "entity_name", row["WIP_ENTITY_NAME"].ToString() },
                        { "work_order_type", row["WORK_ORDER_STATUS"].ToString() },
                        { "typology", row["TYP"].ToString() },
                        { "status_type", row["STATUS_TYPE"].ToString() },
                        { "org_id", row["ORGANIZATION_ID"].ToString() },
                        { "org_name", row["ORGANIZATION_NAME"].ToString() },
                        { "instance_number", row["INSTANCE_NUMBER"].ToString() },
                        { "inst_desc", row["INSTANCE_DESCRIPTION"].ToString() },
                        { "start", row["SCHEDULED_START_DATE"].ToString() },
                        { "complete", row["SCHEDULED_COMPLETION_DATE"].ToString() },
                        { "idle_cat", row["IDLE_CAT"].ToString() },
                        { "idle_type", row["IDLE_TYPE"].ToString() },
                        { "idle_code", row["IDLE_CODE"].ToString() },
                        { "hours", row["DIFF_HOURS"].ToString() }
                    });
                }
            }
            
            tmpRow1 = tmpRow;

            return Ok(tmpRow);
        }
    }
}
