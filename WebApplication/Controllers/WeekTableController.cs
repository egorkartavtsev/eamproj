using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EAMlvl1System.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EAMlvl1System.Controllers
{
    [Route("api/weekTable")]
    public class WeekTableController : Controller
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
            var usCulture = new System.Globalization.CultureInfo("ru-RU");

            foreach (var curDec in rows)
            {
                DateTime userDate = DateTime.Parse(curDec["SCHEDULED_START_DATE"].ToString(), usCulture.DateTimeFormat);
                string start = userDate.ToString("dd.MM");
                userDate = DateTime.Parse(curDec["SCHEDULED_COMPLETION_DATE"].ToString(), usCulture.DateTimeFormat);
                string complete = userDate.ToString("dd.MM");

                if (!tmpRow.ContainsKey(curDec["MMDD"].ToString()))
                {
                    tmpRow.Add(
                      curDec["MMDD"].ToString(), new Dictionary<string, object> {
                          { "dname", curDec["DDMONDAY"].ToString() },
                          { "porders", new Dictionary<string, object> {
                              { curDec["INSTANCE_NUMBER"].ToString(), new Dictionary<string, object> {
                                    { "organization_name", curDec["ORGANIZATION_NAME"].ToString() },
                                    { "note", curDec["NOTE"].ToString() },
                                    { "instance_number", curDec["INSTANCE_NUMBER"].ToString() },
                                    { "instance_description", curDec["INSTANCE_DESCRIPTION"].ToString() },
                                    { "start", start },
                                    { "complete", complete },
                                    { "hours", curDec["DIFF_HOURS"].ToString() },
                                    { "targetdate", curDec["TARGETDATE"].ToString() }
                                 }
                              }
                            }
                          }
                      }
                  );
                }
                else
                {
                    Dictionary<string, object> sup = (Dictionary<string, object>)tmpRow[curDec["MMDD"].ToString()];
                    Dictionary<string, object> tmp = (Dictionary<string, object>)sup["porders"];
                    if (tmp.TryAdd(curDec["INSTANCE_NUMBER"].ToString(), new Dictionary<string, object> {
                                    { "organization_name", curDec["ORGANIZATION_NAME"].ToString() },
                                    { "gen_object_id", curDec["GEN_OBJECT_ID"].ToString() },
                                    { "note", curDec["NOTE"].ToString() },
                                    { "instance_number", curDec["INSTANCE_NUMBER"].ToString() },
                                    { "instance_description", curDec["INSTANCE_DESCRIPTION"].ToString() },
                                    { "start", start },
                                    { "complete", complete },
                                    { "hours", curDec["DIFF_HOURS"].ToString() },
                                    { "targetdate", curDec["TARGETDATE"].ToString() }
                                 }))
                    {
                        sup["porders"] = tmp;
                        tmpRow[curDec["MMDD"].ToString()] = sup;
                    };
                }
            }

            //return Ok(rows);
            return Ok(tmpRow);
        }
    }
}
