using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EAMlvl1System.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EAMlvl1System.Controllers
{
    [Route("api/clonesMonthTable")]
    public class ClonesMonthTableController : Controller
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
            tmpRow = db.MakeMonthTableClones(query, cond);

            //foreach (var curDec in rows)
            //{
            //    string date = DateTime.ParseExact(curDec["TEMPDATE"].ToString(), "dd.MM.yyyy", CultureInfo.InvariantCulture).ToString("yyyy-MM-dd");
            //    if (!tmpRow.ContainsKey(curDec["INSTANCE_NUMBER"].ToString()))
            //    {
            //        tmpRow.Add(
            //          curDec["INSTANCE_NUMBER"].ToString(), new Dictionary<string, object> {
            //                { "organization_name", curDec["ORGANIZATION_NAME"].ToString() },
            //                { "organization_id", curDec["ORGANIZATION_ID"].ToString() },
            //                { "instance_number", curDec["INSTANCE_NUMBER"].ToString() },
            //                { "planner_maintenance", curDec["PLANNER_MAINTENANCE"].ToString() },
            //                { "instance_description", curDec["INSTANCE_DESCRIPTION"].ToString() },
            //                { "days", new Dictionary<string, Dictionary<string, string>> {
            //                        {
            //                            date, new Dictionary<string, string> {
            //                                {   "res", curDec["RES"].ToString() },
            //                                {   "weekDD", curDec["WEEK_DD"].ToString() },
            //                                {   "class", (curDec["RES"].ToString()=="")?"":"info-cell" },
            //                                {   "monDD", curDec["MONTH_DD"].ToString() }
            //                            }
            //                        }
            //                    }
            //                }
            //          }
            //      );
            //    }
            //    else
            //    {
            //        Dictionary<string, object> sup = (Dictionary<string, object>)tmpRow[curDec["INSTANCE_NUMBER"].ToString()];
            //        Dictionary<string, Dictionary<string, string>> tmp = (Dictionary<string, Dictionary<string, string>>)sup["days"];
            //        if (tmp.TryAdd(date, new Dictionary<string, string> {
            //                        {   "res", curDec["RES"].ToString() },
            //                        {   "weekDD", curDec["WEEK_DD"].ToString() },
            //                        {   "class", (curDec["RES"].ToString()=="")?"":"info-cell" },
            //                        {   "monDD", curDec["MONTH_DD"].ToString() }
            //                    }))
            //        {
            //            sup["days"] = tmp;
            //            tmpRow[curDec["INSTANCE_NUMBER"].ToString()] = sup;
            //        }
            //        else {
            //            if (string.IsNullOrEmpty(tmp[date]["res"]))
            //            {
            //                tmp[date]["res"] = curDec["RES"].ToString();
            //                tmp[date]["class"] = (curDec["RES"].ToString() == "") ? "" : "info-cell";
            //            }
            //            else {
            //                string currDay = (curDec["RES"].ToString() == "") ? "0" : curDec["RES"].ToString();
            //                tmp[date]["res"] = (Convert.ToInt32(tmp[date]["res"]) + Convert.ToInt32(currDay)).ToString();
            //                if (Convert.ToInt32(tmp[date]["res"]) > 24) {
            //                    tmp[date]["res"] = "24";
            //                }
            //            }
            //        }
            //        var sortedDict = new SortedDictionary<string, Dictionary<string, string>>(tmp);
            //        sup["days"] = new Dictionary<string, Dictionary<string, string>>(sortedDict);
            //        tmpRow[curDec["INSTANCE_NUMBER"].ToString()] = sup;
            //    }
            //}

            //return Ok(rows);
            return Ok(tmpRow);
        }
    }
}
