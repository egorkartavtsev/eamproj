using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EAMlvl1System.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApplication.Controllers
{
    [Route("api/getData")]
    public class getData : Controller
    {
        // GET: /<controller>/
        public IActionResult Get(string query, Dictionary<string, string> cond, string target)
        {
            DBHandler db = new DBHandler();
            object rows = new object();
        /******************************** try query ********************************/
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest();
            }
        /***************************************************************************/
            if (string.IsNullOrEmpty(target)) {
                //List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
                rows = db.GetDataFromDB(query, cond);
            } else {
                switch(target) {
                    case "month":
                        //Dictionary<string, object> rows = new Dictionary<string, object>();
                        rows = db.MakeMonthTable(query, cond);
                        rows = rows;
                        break;
                }
            }


            return Ok(rows);
        }
    }
}
