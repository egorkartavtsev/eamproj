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
            Dictionary<string, object> rows = new Dictionary<string, object>();

            DBHandler db = new DBHandler();

            if (string.IsNullOrEmpty(query))
            {
                return BadRequest();
            }

            rows = db.MakeYearTable(query, cond);

            return Ok(rows);
        }

    }
}
