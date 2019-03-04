using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EAMlvl1System.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EAMlvl1System.Controllers
{
    [Route("api/getDatas")]
    public class getData : Controller
    {
        // GET: /<controller>/
        public IActionResult GetData(string query, Dictionary<string, string> cond)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest();
            }
            DBHandler db = new DBHandler { };
            return Ok(db.GetDataFromDB(query, cond));
        }
    }
}
