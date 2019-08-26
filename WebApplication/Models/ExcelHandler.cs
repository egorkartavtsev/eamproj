using System;
using System.Collections.Generic;
using System.Data;
using System.Xml;
using Excel = Microsoft.Office.Interop.Excel;

namespace EAMlvl1System.Models
{
    public class ExcelHandler
    {
        public void Main()
        {
            // Create a list of accounts.
            var bankAccounts = new List<Account> 
            {
                new Account { 
                              ID = 345678,
                              Balance = 541.27
                            },
                new Account {
                              ID = 1230221,
                              Balance = -127.44
                            }
            };

            // Display the list in an Excel spreadsheet.
            DisplayInExcel(bankAccounts);

            // Create a Word document that contains an icon that links to
            // the spreadsheet.
            //CreateIconInWordDoc();
        }

        static void DisplayInExcel(IEnumerable<Account> accounts)
        {
            Excel.Application excelApp = new Excel.Application();
            // Make the object visible.
            excelApp.Visible = true;

            // Create a new, empty workbook and add it to the collection returned 
            // by property Workbooks. The new workbook becomes the active workbook.
            // Add has an optional parameter for specifying a praticular template. 
            // Because no argument is sent in this example, Add creates a new workbook. 
            excelApp.Workbooks.Add();

            // This example uses a single workSheet. 
            Excel._Worksheet workSheet = (Excel._Worksheet)excelApp.ActiveSheet;

            // Earlier versions of C# require explicit casting.
            //Excel._Worksheet workSheet = (Excel.Worksheet)excelApp.ActiveSheet;

            // Establish column headings in cells A1 and B1.
            workSheet.Cells[1, "A"] = "ID Number";
            workSheet.Cells[1, "B"] = "Current Balance";

            var row = 1;
            foreach (var acct in accounts)
            {
                row++;
                workSheet.Cells[row, "A"] = acct.ID;
                workSheet.Cells[row, "B"] = acct.Balance;
            }

            //workSheet.Columns[1].AutoFit();
            //workSheet.Columns[2].AutoFit();

            // Call to AutoFormat in Visual C#. This statement replaces the 
            // two calls to AutoFit.
            workSheet.Range["A1", "B3"].AutoFormat(
                Excel.XlRangeAutoFormat.xlRangeAutoFormatClassic2);

            // Put the spreadsheet contents on the clipboard. The Copy method has one
            // optional parameter for specifying a destination. Because no argument  
            // is sent, the destination is the Clipboard.
            workSheet.Range["A1:B3"].Copy();
        }
    

        public void DownloadXLS() {
            //Объявляем приложение
            Excel.Application ex = new Microsoft.Office.Interop.Excel.Application();

            //Отобразить Excel
            ex.Visible = true;
            //Количество листов в рабочей книге
            ex.SheetsInNewWorkbook = 2;
            //Добавить рабочую книгу
            Excel.Workbook workBook = ex.Workbooks.Add(Type.Missing);
            //Отключить отображение окон с сообщениями
            ex.DisplayAlerts = false;
            //Получаем первый лист документа (счет начинается с 1)
            Excel.Worksheet sheet = (Excel.Worksheet)ex.Worksheets.get_Item(1);
            //Название листа (вкладки снизу)
            sheet.Name = "Отчет за 13.12.2017";
            //Пример заполнения ячеек
            //for (int i = 1; i <= 9; i++)
            //{
            //    for (int j = 1; j < 9; j++)
            //        //sheet.Cells[i, j] = i.ToString() + "-" + j.ToString();
            //        sheet.Cells[i, 'А'] = "Работает!!!";
            //}
            sheet.Cells[1, 1] = "Работает!!!";
            //Захватываем диапазон ячеек
            /**Excel.Range range1 = sheet.get_Range(sheet.Cells[1, 1], sheet.Cells[9, 9]);
            //Шрифт для диапазона
            range1.Cells.Font.Name = "Tahoma";
            //Размер шрифта для диапазона
            range1.Cells.Font.Size = 10;
            //Захватываем другой диапазон ячеек
            Excel.Range range2 = sheet.get_Range(sheet.Cells[1, 1], sheet.Cells[9, 2]);
            range2.Cells.Font.Name = "Times New Roman";*/
            ex.Application.ActiveWorkbook.SaveAs("docфывфцвфв.xlsx", Type.Missing,
                                                Type.Missing, Type.Missing, Type.Missing, Type.Missing, Excel.XlSaveAsAccessMode.xlNoChange,
                                                Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing);

        }
    }
    public class Account
    {
        public int ID { get; set; }
        public double Balance { get; set; }
    }
}