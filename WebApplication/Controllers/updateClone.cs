using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EAMlvl1System.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EAMlvl1System.Controllers
{
    [Route("api/updateClone")]
    public class updateClone : Controller
    {
        // GET: /<controller>/
        public IActionResult UpdateDate(Dictionary<string, string> cond)
        {
            DBHandler db = new DBHandler { };
            string result = db.UpdateClone(cond);
            return Ok(result);
        }
    }
}
