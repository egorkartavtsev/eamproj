using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EAMlvl1System.Models;


namespace EAMlvl1System.Controllers
{
    [Route("api/yearTable")]
    public class YearTableController : Controller
    {
        [HttpGet]
        public IActionResult GetYearRows(string query, Dictionary<string, string> cond) {
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> tmpRow = new Dictionary<string, object>();
            DBHandler db = new DBHandler();
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest();
            }
            //string queryText = db.GetDataByQueryId(query, cond);
            rows = db.GetDataFromDB(query, cond);

            foreach (var curDec in rows) {
                if (!tmpRow.ContainsKey(curDec["INSTANCE_NUMBER"].ToString()))
                {
                    tmpRow.Add(
                       curDec["INSTANCE_NUMBER"].ToString(), new Dictionary<string, object> {
                            { "organization_name", curDec["ORGANIZATION_NAME"].ToString() },
                            { "INSTANCE_NUMBER", curDec["INSTANCE_NUMBER"].ToString() },
                            { "instance_description", curDec["INSTANCE_DESCRIPTION"].ToString() },
                            { "decadas", new Dictionary<string, Dictionary<string, string>> {
                                    {
                                        curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString(), new Dictionary<string, string> {
                                            { "tarD", curDec["DECADA"].ToString() },
                                            { "tarM", curDec["MY"].ToString() },
                                            { "val", curDec["RES"].ToString() },
                                            { "class", (curDec["RES"].ToString()=="")?"":"info-cell" }
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
                    Dictionary<string, Dictionary<string, string>> tmp = (Dictionary<string, Dictionary<string, string>>)sup["decadas"];
                    if (tmp.TryAdd(curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString(), new Dictionary<string, string> {
                                            { "tarD", curDec["DECADA"].ToString() },
                                            { "tarM", curDec["MY"].ToString() },
                                            { "val", curDec["RES"].ToString() },
                                            { "class", (curDec["RES"].ToString()=="")?"":"info-cell" }
                                        }))
                    {
                        sup["decadas"] = tmp;
                        tmpRow[curDec["INSTANCE_NUMBER"].ToString()] = sup;
                    }
                    else {
                        if (string.IsNullOrEmpty(tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"]))
                        {
                            tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"] = curDec["RES"].ToString();
                            tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["class"] = (curDec["RES"].ToString() == "") ? "" : "info-cell";
                        }
                        else
                        {
                            string currDec = (curDec["RES"].ToString() == "") ? "0" : curDec["RES"].ToString();
                            tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"] = (Convert.ToInt32(tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"]) + Convert.ToInt32(currDec)).ToString();
                            switch (curDec["DECADA"].ToString())
                            {
                                case "03":
                                    if (Convert.ToInt32(tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"]) > 264)
                                    {
                                        tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"] = "264";
                                    }
                                    break;
                                default:
                                    if (Convert.ToInt32(tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"]) > 240)
                                    {
                                        tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"] = "240";
                                    }
                                    break;
                            }
                            sup["decadas"] = tmp;
                            tmpRow[curDec["INSTANCE_NUMBER"].ToString()] = sup;
                        }
                    };
                }
            }
            return Ok(tmpRow);
        }

    }
}
