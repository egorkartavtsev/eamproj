using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EAMlvl1System.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EAMlvl1System.Controllers
{
    [Route("api/monthTable")]
    public class MonthTableController : Controller
    {
        public IActionResult Get(string query, Dictionary<string, string> cond)
        {
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> tmpRow = new Dictionary<string, object>();
            DBHandler db = new DBHandler();
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest();
            }
            rows = db.GetDataFromDB(query, cond);

            foreach (var curDec in rows)
            {
                if (!tmpRow.ContainsKey(curDec["INSTANCE_NUMBER"].ToString()))
                {
                    tmpRow.Add(
                      curDec["INSTANCE_NUMBER"].ToString(), new Dictionary<string, object> {
                            { "organization_name", curDec["ORGANIZATION_NAME"].ToString() },
                            { "gen_object_id", curDec["GEN_OBJECT_ID"].ToString() },
                            { "instance_number", curDec["INSTANCE_NUMBER"].ToString() },
                            { "instance_description", curDec["INSTANCE_DESCRIPTION"].ToString() },
                            { "days", new Dictionary<string, Dictionary<string, string>> {
                                    {
                                        cond["month"].ToString() + "_" + curDec["MONTH_DD"].ToString(), new Dictionary<string, string> {
                                            {   "res", curDec["RES"].ToString() },
                                            {   "weekDD", curDec["WEEK_DD"].ToString() },
                                            {   "class", (curDec["RES"].ToString()=="")?"":"info-cell" },
                                            {   "monDD", curDec["MONTH_DD"].ToString() }
                                        }
                                    }
                                }
                            }
                      }
                  );
                }
                else
                {
                    Dictionary<string, object> sup = (Dictionary<string, object>)tmpRow[curDec["INSTANCE_NUMBER"].ToString()];
                    Dictionary<string, Dictionary<string, string>> tmp = (Dictionary<string, Dictionary<string, string>>)sup["days"];
                    if (tmp.TryAdd(cond["month"].ToString() + "_" + curDec["MONTH_DD"].ToString(), new Dictionary<string, string> {
                                    {   "res", curDec["RES"].ToString() },
                                    {   "weekDD", curDec["WEEK_DD"].ToString() },
                                    {   "class", (curDec["RES"].ToString()=="")?"":"info-cell" },
                                    {   "monDD", curDec["MONTH_DD"].ToString() }
                                }))
                    {
                        sup["days"] = tmp;
                        tmpRow[curDec["INSTANCE_NUMBER"].ToString()] = sup;
                    }
                    else {
                        if (string.IsNullOrEmpty(tmp[cond["month"].ToString() + "_" + curDec["MONTH_DD"].ToString()]["res"]))
                        {
                            tmp[cond["month"].ToString() + "_" + curDec["MONTH_DD"].ToString()]["res"] = curDec["RES"].ToString();
                            tmp[cond["month"].ToString() + "_" + curDec["MONTH_DD"].ToString()]["class"] = (curDec["RES"].ToString() == "") ? "" : "info-cell";
                        }
                        else {
                            string currDay = (curDec["RES"].ToString() == "") ? "0" : curDec["RES"].ToString();
                            tmp[cond["month"].ToString() + "_" + curDec["MONTH_DD"].ToString()]["res"] = (Convert.ToInt32(tmp[cond["month"].ToString() + "_" + curDec["MONTH_DD"].ToString()]["res"]) + Convert.ToInt32(currDay)).ToString();
                            if (Convert.ToInt32(tmp[cond["month"].ToString() + "_" + curDec["MONTH_DD"].ToString()]["res"]) > 24) {
                                tmp[cond["month"].ToString() + "_" + curDec["MONTH_DD"].ToString()]["res"] = "24";
                            }
                        }
                    }
                }
            }

            //return Ok(rows);
            return Ok(tmpRow);
        }
    }
}
