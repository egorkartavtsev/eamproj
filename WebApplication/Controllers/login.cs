using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EAMlvl1System.Models;




namespace EAMlvl1System.Controllers
{
    [Route("api/login")]
    public class Login : Controller
    {
        // GET: /<controller>/
        public IActionResult LoginUser(Dictionary<string, string> cond)
        {

            string username = "";
            string password = "";
            Dictionary<string, object> result;
            if (cond.ContainsKey("user") && cond["user"] != null) username = cond["user"].ToString();
            if (cond.ContainsKey("pass") && cond["pass"] != null) password = cond["pass"].ToString();

            DBHandler db = new DBHandler { };

            if (cond.ContainsKey("token") && !string.IsNullOrEmpty(cond["token"])){
                result = db.TrySession(cond["token"]);
            } else {
                result = db.SingInUser(username, password);
            }


            return Ok(result);
        }
    }
}