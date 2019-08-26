using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EAMlvl1System.Models;

namespace EAMlvl1System.Controllers
{
    [Route("api/exportXLS")]
    public class ExportExcel : Controller
    {
        // GET: /<controller>/
        public IActionResult SaveCustomeFilter(Dictionary<string, string> cond)
        {
            ExcelHandler xlsHandler = new ExcelHandler();
            xlsHandler.DownloadXLS();
            return Ok("Ну я отработал...");
        }
    }
}
