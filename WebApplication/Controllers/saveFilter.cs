using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EAMlvl1System.Models;
using Newtonsoft.Json;

namespace EAMlvl1System.Controllers
{
    [Route("api/saveFilter")]
    public class SaveFilter: Controller
    {
        // GET: /<controller>/
        public IActionResult SaveCustomeFilter([FromBody]Dictionary<string, string> cond) {

            string puppy = "puppy 1";

            Dictionary<string, object> trueCondition = new Dictionary<string, object>
            {
                ["user"] = cond["user"],
                ["name"] = cond["name"],
                ["attrs"] = JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, object>>>(cond["attrs"])

            };

            puppy = "puppy 2";

            DBHandler db = new DBHandler();


            return Ok(db.CreateNewFilter(trueCondition));
        }
    }
}
