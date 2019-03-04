using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EAMlvl1System.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EAMlvl1System.Controllers
{
    [Route("api/updatesWO")]
    public class updatesWO : Controller
    {
        // GET: /<controller>/
        public IActionResult UpdateDate(string query, Dictionary<string, string> cond)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest();
            }
            DBHandler db = new DBHandler { };
            string result = db.RunProcedure(query, cond);
            return Ok(result);
        }
    }
}
