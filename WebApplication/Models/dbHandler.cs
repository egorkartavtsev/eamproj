﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Xml;
using Oracle.ManagedDataAccess.Client;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using System.Web;
using Oracle.ManagedDataAccess.Types;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Text;


namespace EAMlvl1System.Models
{
    public class DBHandler
    {
        // zaglushka potom budet zamenena na obrabotchik sessii
        // private readonly string token = "6e580e17-a2e6-4594-af3c-fb6e8623f026";
        /*  servera 
        *   1 - dev
        *   2 - psi
        *   3 - CHECK
        *   4 - UAT
        *   5 - PROD
        *   6 - TEST 
        
        *   7 - UAT - WEBUSER
        *   8 - PROD - webuser
        *   9 - CHECK - WEBUSER
        */
        //private readonly string conString = "Data Source=(DESCRIPTION= (ADDRESS=(PROTOCOL=tcp)(HOST=cis-dev.eco.mmk.chel.su)(PORT=1521)) (CONNECT_DATA= (SERVICE_NAME=DEV) (INSTANCE_NAME=DEV)));User Id=APPS;Password=qw1234;";
        //private readonly string conString = "Data Source=(DESCRIPTION= (ADDRESS=(PROTOCOL=tcp)(HOST=cis-psi-db.eco.mmk.chel.su)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=PSI)(INSTANCE_NAME=PSI)));User Id=APPS;Password=Bcgsnfybz380;";
        //private readonly string conString = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=cis-check.eco.mmk.chel.su)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=CHECK)(INSTANCE_NAME=CHECK)));User Id=APPS;Password=qw1234;";
        //private readonly string conString = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=cis-uat-db.mmk.chel.su)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=UAT)(INSTANCE_NAME=UAT)));User Id=APPS;Password=Bcgsnfybz180;";
        //private readonly string conString = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=titan-db.eco.mmk.chel.su)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=PROD)(INSTANCE_NAME=PROD)));User Id=APPS;Password=Ctrhtn321;";
        //private readonly string conString = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=cis-test.eco.mmk.chel.su)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=TEST)(INSTANCE_NAME=TEST)));User Id=APPS;Password=qw1234;";

        //private readonly string conString = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=cis-uat-db.mmk.chel.su)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=UAT)(INSTANCE_NAME=UAT)));User Id=XXEAM_WEB_INTERFACE;Password=Bynthatqc2019$;";
        //private readonly string conString = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=titan-db.eco.mmk.chel.su)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=PROD)(INSTANCE_NAME=PROD)));User Id=XXEAM_WEB_INTERFACE;Password=Bynthatqc2019$;";
        private readonly string conString = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=cis-check.eco.mmk.chel.su)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=CHECK)(INSTANCE_NAME=CHECK)));User Id=XXEAM_WEB_INTERFACE;Password=Bynthatqc2019$;";

        //=========================================PUBLIC FUNCTIONAL=====================================================
        public List<Dictionary<string, object>> GetDataFromDB(string query, Dictionary<string, string> cond) {
            return this.Make_valid_struct((DataSet)this.GetData(this.GetQueryById(query, cond)));
        }

        public Dictionary<string, object> SingInUser(string username, string password) {

            string user_id = "";
            Dictionary<string, object> user = new Dictionary<string, object>();
            OracleConnection conn = new OracleConnection(this.conString);



            conn.Open();
            OracleCommand cm = new OracleCommand();
            cm.Connection = conn;
            cm.CommandText = "apps.xx_fnd_web_sec_wrap.validate_login";
            cm.CommandType = CommandType.StoredProcedure;

            cm.Parameters.Add("p_user", OracleDbType.Varchar2).Value = username;
            cm.Parameters.Add("p_pwd", OracleDbType.Varchar2).Value = password;

            OracleParameter x_result = new OracleParameter();
            x_result.ParameterName = "x_result";
            x_result.OracleDbType = OracleDbType.Varchar2;
            x_result.Direction = ParameterDirection.Output;
            x_result.Size = 1000;
            cm.Parameters.Add(x_result);

            OracleParameter x_message = new OracleParameter();
            x_message.ParameterName = "x_message";
            x_message.OracleDbType = OracleDbType.Varchar2;
            x_message.Direction = ParameterDirection.Output;
            x_message.Size = 1000;
            cm.Parameters.Add(x_message);

            OracleParameter x_password_date = new OracleParameter();
            x_password_date.ParameterName = "x_password_date";
            x_password_date.OracleDbType = OracleDbType.Date;
            x_password_date.Direction = ParameterDirection.Output;
            cm.Parameters.Add(x_password_date);

            cm.ExecuteNonQuery();
            string result = cm.Parameters["x_result"].Value.ToString();
            //string message = cm.Parameters["x_message"].Value.ToString();

            
            if (result == "Y")
            {

                OracleCommand cmu = new OracleCommand();
                cmu.Connection = conn;
                cmu.CommandText = "apps.eam_workwith_wo_pub.user_signin";
                cmu.CommandType = CommandType.StoredProcedure;

                cmu.Parameters.Add("l_usern", OracleDbType.Varchar2).Value = username;

                OracleParameter x_key = new OracleParameter();
                x_key.ParameterName = "x_key";
                x_key.OracleDbType = OracleDbType.Varchar2;
                x_key.Direction = ParameterDirection.Output;
                x_key.Size = 1000;
                cmu.Parameters.Add(x_key);

                cmu.ExecuteNonQuery();
                string token = cmu.Parameters["x_key"].Value.ToString();

                user = this.TrySession(token);
                user.Add("token", token);

            }
            else
            {
                user.Add("result", result);
            }


            cm.Dispose();
            conn.Close();
            conn.Dispose();

            return user;
        }

        public Dictionary<string, object> TrySession(string token)
        {
            Dictionary<string, object> user = new Dictionary<string, object>();
            List<string> resps = new List<string>();
            string result;

            OracleConnection conn = new OracleConnection(this.conString);
            conn.Open();
            OracleCommand cm = new OracleCommand();
            cm.Connection = conn;
            DataSet DS = new DataSet();
            OracleDataAdapter dataAdapter = new OracleDataAdapter();
            dataAdapter.SelectCommand = cm;

            cm.CommandText = "SELECT  a.user_id  FROM xxeam.xxeam_is_token a where sessionid = UTL_RAW.cast_to_varchar2('" + token + "') and sysdate < end_date";
            string tmp = cm.ExecuteScalar()?.ToString() ?? "";

            if (!string.IsNullOrEmpty(tmp)) {
                cm.CommandText = "SELECT e.responsibility_key resp "
                                    + "FROM apps.fnd_user_resp_groups_direct w, "
                                        + "apps.fnd_responsibility_vl e, "
                                        + "XXEAM.XXEAM_RESP_FOR_CLONES rfc "
                                    + "WHERE     1 = 1 "
                                        + "AND e.responsibility_id = w.responsibility_id "
                                        + "AND e.responsibility_key = rfc.responsibility_key "
                                        + "AND(w.end_date IS NULL OR w.end_date > SYSDATE) "
                                        + "AND w.user_id = "+tmp;
                dataAdapter.Fill(DS);

                foreach (DataRow curResp in DS.Tables[0].Rows) {
                    resps.Add(curResp["RESP"].ToString());
                }
                result = "Y";
            } else {
                result = "N";
            }

            user.Add("result", result);
            user.Add("resps", resps);
            user.Add("id", tmp);

            cm.Dispose();
            conn.Close();
            return user;
        }

        //==========================================TOOLS FOR WORK WITH DATABASE==========================================

        // возвращает правильный вид запроса из базы по его ID
        private string GetQueryById(string query, Dictionary<string, string> cond)
        {
            string sql = "SELECT a.sqltext FROM XXEAM.XXEAM_SQL_QUERY a where id=" + query;
            return this.Make_valid_sql((string)this.GetData(sql, true), cond); 
        }

// возвращает данные из базы по запросу
        private object GetData(string query, bool scalar = false)
        {
            string user_id = "0";
            using (OracleConnection conn = new OracleConnection(this.conString))
            {
                conn.Open();
                using (OracleCommand cm = new OracleCommand())
                {
                    cm.Connection = conn;
                    using (DataSet DS = new DataSet())
                    {
                        using (OracleDataAdapter dataAdapter = new OracleDataAdapter())
                        {
                            dataAdapter.SelectCommand = cm;

                            //cm.CommandText = "SELECT  a.user_id  FROM xxeam.xxeam_is_token a where token='" + this.token + "' and rownum=1";

                            //user_id = cm.ExecuteScalar().ToString();

                            //cm.CommandText = "BEGIN xxint.set_int_value ( 'TOKEN', '" + this.token + "' ); END;";
                            //cm.CommandText = "BEGIN xxint.set_int_value ( 'UserID', '" + user_id + "' ); END;";
                            //-----------------------------------------------------------------

                            cm.CommandText = query;
                            if (scalar) {
                                return cm.ExecuteScalar().ToString();
                            }
                            else {
                                dataAdapter.Fill(DS);
                                cm.Dispose();
                                conn.Close();
                                return DS;
                            }
                        }
                    }
                }
            }
        }

// Преобразовывает запрос из базы к тому виду, в котором он может быть направлен к базе
        private string Make_valid_sql(string text, Dictionary<string, string> param)
        {
            string res = text;

            foreach (var item in param)
            {
                if (item.Key != "query")
                {
                    res = res.Replace("@" + item.Key, item.Value);
                    if (item.Value != "YN")
                    {
                        res = res.Replace("<#start " + item.Key + ">", "");
                        res = res.Replace("<" + item.Key + " end#>", "");
                    }
                }
            }
            return res;
        }

// Преобразовывает DataSet в JSON-подобную структуру данных
        private List<Dictionary<string, object>> Make_valid_struct(DataSet DataStruct) {
            List<Dictionary<string, object>> result = new List<Dictionary<string, object>>();
            Dictionary<string, object> tmp;
            foreach (DataRow item in DataStruct.Tables[0].Rows) {
                tmp = new Dictionary<string, object>();
                foreach (DataColumn col in DataStruct.Tables[0].Columns) {
                    if (item[col].ToString().IndexOf("getdata(") < 0)
                    {
                        if (col.DataType.ToString() == "System.DateTime")
                        {
                            tmp.Add(col.ColumnName, item[col].ToString().Replace(" 0:00:00", ""));
                        }
                        else
                        {
                            tmp[col.ColumnName] = item[col].ToString();
                            //tmp.Add(col.ColumnName, item[col].ToString());
                        }
                    }
                    else
                    {
                        string subData = item[col].ToString();
                        subData = subData.Substring(subData.IndexOf("getdata("), (subData.Length - subData.IndexOf("getdata(")));
                        subData = subData.Substring(0, subData.IndexOf(")"));
                        subData = subData.Replace("getdata(", "");

                        tmp.Add(col.ColumnName, this.Make_valid_struct(this.getQueryFromSubData(subData)));
                    }
                } 
                result.Add(tmp);
            }

            return result;
        }

// Преобразовывает подзапрос getdata(...) в DataSet
        private DataSet getQueryFromSubData(string GDstring) {
            //string tmp = GDstring.Replace("getdata", "").Substring(1, GDstring.Length - 9);
            string[] tempGD = GDstring.Split(",".ToCharArray());
            string query = tempGD[0];
            Dictionary<string, string> cond = new Dictionary<string, string>();
            for (int i = 1; i < tempGD.Length; i++)
            {
                string[] key = tempGD[i].Split(":".ToCharArray());
                cond.Add(key[0], key[1]);
            }
            return (DataSet)this.GetData(this.GetQueryById(query, cond));

        }

// Запускает процедуру по ID
        public string RunProcedure(string query, Dictionary<string, string> cond) {
            string user_id = "0";
            string message = "";
            using (OracleConnection conn = new OracleConnection(this.conString))
            {
                conn.Open();
                using (OracleCommand cm = new OracleCommand())
                {
                    cm.Connection = conn;
                    using (DataSet DS = new DataSet())
                    {
                        using (OracleDataAdapter dataAdapter = new OracleDataAdapter())
                        {
                            dataAdapter.SelectCommand = cm;

                            //cm.CommandText = "SELECT  a.user_id  FROM xxeam.xxeam_is_token a where token='" + this.token + "' and rownum=1";

                            //user_id = cm.ExecuteScalar().ToString();

                            //cm.CommandText = "BEGIN xxint.set_int_value ( 'TOKEN', '" + this.token + "' ); END;";
                            //cm.CommandText = "BEGIN xxint.set_int_value ( 'UserID', '" + user_id + "' ); END;";
                            //-----------------------------------------------------------------

                            cm.CommandText = "SELECT a.procedure_name, a.parameters FROM XXEAM.XXEAM_PROCEDURE_STORE a where id=" + query;
                            dataAdapter.Fill(DS);

                            string procedure = DS.Tables[0].Rows[0]["procedure_name"].ToString();
                            string parameters = DS.Tables[0].Rows[0]["parameters"].ToString();

                            XmlDocument doc = new XmlDocument();
                            doc.LoadXml(DS.Tables[0].Rows[0]["parameters"].ToString());
                            XmlNodeList xmlNodes;
                            xmlNodes = doc.SelectNodes("/PARAMETRS/PARAMETR");

                            cm.CommandText = procedure;
                            cm.CommandType = CommandType.StoredProcedure;

                            foreach (XmlNode xn in xmlNodes){
                                string pName = xn["NAME"].InnerText;
                                string pType = xn["TYPE"].InnerText;
                                switch (pType.ToUpper()){
                                    case "NUMBER":
                                        cm.Parameters.Add(pName, OracleDbType.Int32).Value = Convert.ToInt32(cond[pName]);
                                        break;
                                    case "VARCHAR2":
                                        cm.Parameters.Add(pName, OracleDbType.Varchar2).Value = cond[pName].ToString();
                                        break;
                                    default:
                                        cm.Parameters.Add(pName, OracleDbType.Varchar2).Value = cond[pName].ToString();
                                        break;
                                }
                            }

                            //string msg_code = "";
                            OracleParameter pmsg_code = new OracleParameter();
                            pmsg_code.ParameterName = "msg_code";
                            set_parameter(pmsg_code, "Varchar2", "300", "Output");
                            cm.Parameters.Add(pmsg_code);

                            cm.ExecuteNonQuery();

                            message = pmsg_code.Value.ToString();

                            cm.Dispose();
                            conn.Close();
                        }
                    }
                }
            }

            return message;
        }

// Что-то делает с процедурой
        private void set_parameter(OracleParameter sParam, string sType, string sSize, string sDirection)
        {
            sParam.OracleDbType = OracleDbType.Varchar2;
            sParam.Size = 30;
            sParam.Direction = ParameterDirection.Output;
        }


        //================================================================================================================


        // TOOLS FOR TABLES-----------------------------------------------------------------------------------------------------

        public string UpdateClone(Dictionary<string, string> cond) {
            string result = "Y";

            OracleConnection conn = new OracleConnection(this.conString);
            conn.Open();
            OracleCommand cm = new OracleCommand();
            cm.Connection = conn;
            result = "UPDATE xxeam.xxeam_wo_clones wc " +
                                   "SET WC.SCHEDULED_START_DATE = to_date('" + cond["SCHEDULED_START_DATE"] + "', 'dd.mm.yyyy HH24:mi:ss'), " +
                                       "WC.SCHEDULED_COMPLETION_DATE = to_date('" + cond["SCHEDULED_COMPLETION_DATE"] + "', 'dd.mm.yyyy HH24:mi:ss'), " +
                                       "WC.DATE_UPDATE = sysdate, " +
                                       "WC.USER_COMMENT = '" + cond["USER_COMMENT"] + "' " +
                                 "WHERE WC.CLONE_ID = "+cond["CLONE_ID"];

            cm.CommandText = result;

            result = cm.ExecuteNonQuery().ToString();

            cm.Dispose();
            conn.Close();


            return result;
        }

        public Dictionary<string, object> MakeMonthTableClones(string query, Dictionary<string, string> cond) {
            Dictionary<string, object> result = new Dictionary<string, object>();
            DataSet rows = (DataSet)this.GetData(this.GetQueryById(query, cond));
            Dictionary<string, object> tmpRow = new Dictionary<string, object>();

            foreach (DataRow curDate in rows.Tables[0].Rows)
            {
                string date = Convert.ToDateTime(curDate["TEMPDATE"].ToString()).ToString("yyyy-MM-dd");
                if (!tmpRow.ContainsKey(curDate["RESPONSIBILITY_KEY"].ToString()))
                {
                    tmpRow.Add(
                        curDate["RESPONSIBILITY_KEY"].ToString(), new Dictionary<string, object> {
                            {"resp_name",  curDate["RESPONSIBILITY_NAME"].ToString()},
                            {"resp_key",  curDate["RESPONSIBILITY_KEY"].ToString()},
                            {"days", new Dictionary<string, Dictionary<string, string>> {
                                    {
                                        date, new Dictionary<string, string> {
                                            {   "res", curDate["RES"].ToString() },
                                            {   "class", (curDate["RES"].ToString()=="")?"":"info-cell-clone" },
                                            {   "date", date }
                                        }
                                    }
                                }
                            }
                        }
                    );
                }
                else {
                    Dictionary<string, object> sup = (Dictionary<string, object>)tmpRow[curDate["RESPONSIBILITY_KEY"].ToString()];
                    Dictionary<string, Dictionary<string, string>> tmp = (Dictionary<string, Dictionary<string, string>>)sup["days"];

                    if (!tmp.TryAdd(date, new Dictionary<string, string> {
                                    {   "res", curDate["RES"].ToString() },
                                    {   "class", (curDate["RES"].ToString()=="")?"":"info-cell-clone" },
                                    {   "date", date }
                                }))
                    {
                        if (string.IsNullOrEmpty(tmp[date]["res"]))
                        {
                            tmp[date]["res"] = curDate["RES"].ToString();
                            tmp[date]["class"] = (curDate["RES"].ToString() == "") ? "" : "info-cell-clone";
                        }
                        else
                        {
                            string currDay = (curDate["RES"].ToString() == "") ? "0" : curDate["RES"].ToString();
                            tmp[date]["res"] = (Convert.ToInt32(tmp[date]["res"]) + Convert.ToInt32(currDay)).ToString();
                            if (Convert.ToInt32(tmp[date]["res"]) > 24)
                            {
                                tmp[date]["res"] = "24";
                            }
                        }
                    }
                    var sortedDict = new SortedDictionary<string, Dictionary<string, string>>(tmp);
                    sup["days"] = new Dictionary<string, Dictionary<string, string>>(sortedDict);
                    tmpRow[curDate["RESPONSIBILITY_KEY"].ToString()] = sup;
                }
            }


            return tmpRow;
        }

        public Dictionary<string, object> MakeMonthTable(string query, Dictionary<string, string> cond) {
            Dictionary<string, object> result = new Dictionary<string, object>();
            DataSet rows = (DataSet)this.GetData(this.GetQueryById(query, cond));
            Dictionary<string, object> tmpRow = new Dictionary<string, object>();
            string cls = "";
            foreach (DataRow curDec in rows.Tables[0].Rows)
            {
                cls = "";

                if (curDec["RES"].ToString() != "")
                {
                    switch (curDec["STATUS_TYPE"].ToString())
                    {
                        case "1":
                            cls = "fill-cell unreleased-cell";
                            break;
                        case "3":
                            cls = "fill-cell released-cell";
                            break;
                        case "4":
                            cls = "fill-cell complete-cell";
                            break;
                        case "5":
                            cls = "fill-cell complete-cell";
                            break;
                        case "6":
                            cls = "fill-cell broken-cell";
                            break;
                        case "7":
                            cls = "fill-cell cancel-cell";
                            break;
                        case "12":
                            cls = "fill-cell closed-cell";
                            break;
                        case "14":
                            cls = "fill-cell delayed-cell";
                            break;
                        case "15":
                            cls = "fill-cell broken-cell";
                            break;
                        case "17":
                            cls = "fill-cell info-cell";
                            break;
                    }
                }

                string date = Convert.ToDateTime(curDec["TEMPDATE"].ToString()).ToString("yyyy-MM-dd");
                if (!tmpRow.ContainsKey(curDec["INSTANCE_NUMBER"].ToString()))
                {
                    tmpRow.Add(
                      curDec["INSTANCE_NUMBER"].ToString(), new Dictionary<string, object> {
                            { "organization_name", curDec["ORGANIZATION_NAME"].ToString() },
                            { "organization_id", curDec["ORGANIZATION_ID"].ToString() },
                            { "instance_number", curDec["INSTANCE_NUMBER"].ToString() },
                            { "planner_maintenance", curDec["PLANNER_MAINTENANCE"].ToString() },
                            { "instance_description", curDec["INSTANCE_DESCRIPTION"].ToString() },
                            { "days", new Dictionary<string, Dictionary<string, string>> {
                                    {
                                        date, new Dictionary<string, string> {
                                            {   "res", curDec["RES"].ToString() },
                                            {   "weekDD", curDec["WEEK_DD"].ToString() },
                                            {   "class", cls },
                                            {   "monDD", curDec["MONTH_DD"].ToString() }
                                        }
                                    }
                                }
                            }
                      }
                  );
                }
                else
                {
                    Dictionary<string, object> sup = (Dictionary<string, object>)tmpRow[curDec["INSTANCE_NUMBER"].ToString()];
                    Dictionary<string, Dictionary<string, string>> tmp = (Dictionary<string, Dictionary<string, string>>)sup["days"];
                    if (tmp.TryAdd(date, new Dictionary<string, string> {
                                    {   "res", curDec["RES"].ToString() },
                                    {   "weekDD", curDec["WEEK_DD"].ToString() },
                                    {   "class", cls},
                                    {   "monDD", curDec["MONTH_DD"].ToString() }
                                }))
                    {
                        sup["days"] = tmp;
                        tmpRow[curDec["INSTANCE_NUMBER"].ToString()] = sup;
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(tmp[date]["res"].ToString()))
                        {
                            tmp[date]["res"] = curDec["RES"].ToString();
                            tmp[date]["class"] = cls;
                        }
                        else
                        {
                            string currDay = (curDec["RES"].ToString() == "") ? "0" : curDec["RES"].ToString();
                            tmp[date]["res"] = ((Convert.ToInt32(tmp[date]["res"]) > Convert.ToInt32(currDay))? Convert.ToInt32(tmp[date]["res"]) : Convert.ToInt32(currDay)).ToString();
                            if (curDec["RES"].ToString() != "") { tmp[date]["class"] = "fill-cell error-cell"; }
                            if (Convert.ToInt32(tmp[date]["res"]) > 24)
                            {
                                tmp[date]["res"] = "24";
                            }
                        }
                    }
                    var sortedDict = new SortedDictionary<string, Dictionary<string, string>>(tmp);
                    sup["days"] = new Dictionary<string, Dictionary<string, string>>(sortedDict);
                    tmpRow[curDec["INSTANCE_NUMBER"].ToString()] = sup;
                }
            }


            return tmpRow;
        }


        public Dictionary<string, object> MakeYearTable(string query, Dictionary<string, string> cond) {
            DataSet rows = (DataSet)this.GetData(this.GetQueryById(query, cond));
            Dictionary<string, object> tmpRow = new Dictionary<string, object>();
            Dictionary<string, object> decadas = new Dictionary<string, object>();

            foreach (DataRow curDec in rows.Tables[0].Rows)
            {
                if (!string.IsNullOrEmpty(curDec["INSTANCE_NUMBER"].ToString()))
                {
                    if (!tmpRow.ContainsKey(curDec["INSTANCE_NUMBER"].ToString()))
                    {
                        tmpRow.Add(
                           curDec["INSTANCE_NUMBER"].ToString(), new Dictionary<string, object> {
                            { "organization_name", curDec["ORGANIZATION_NAME"].ToString() },
                            { "instance_number", curDec["INSTANCE_NUMBER"].ToString() },
                            { "instance_description", curDec["INSTANCE_DESCRIPTION"].ToString() },
                            { "decadas", new Dictionary<string, Dictionary<string, string>> {
                                    {
                                        curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString(), new Dictionary<string, string> {
                                            { "tarD", curDec["DECADA"].ToString() },
                                            { "tarM", curDec["MY"].ToString() },
                                            { "val", curDec["RES"].ToString() },
                                            { "class", (curDec["RES"].ToString()=="")?"":"info-cell" }
                                        }
                                    }
                                }
                            }
                           }
                       );
                    }
                    else
                    {
                        Dictionary<string, object> sup = (Dictionary<string, object>)tmpRow[curDec["INSTANCE_NUMBER"].ToString()];
                        Dictionary<string, Dictionary<string, string>> tmp = (Dictionary<string, Dictionary<string, string>>)sup["decadas"];
                        if (tmp.TryAdd(curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString(), new Dictionary<string, string> {
                                            { "tarD", curDec["DECADA"].ToString() },
                                            { "tarM", curDec["MY"].ToString() },
                                            { "val", curDec["RES"].ToString() },
                                            { "class", (curDec["RES"].ToString()=="")?"":"info-cell" }
                                        }))
                        {
                            sup["decadas"] = tmp;
                            tmpRow[curDec["INSTANCE_NUMBER"].ToString()] = sup;
                        }
                        else
                        {
                            if (string.IsNullOrEmpty(tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"]))
                            {
                                tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"] = curDec["RES"].ToString();
                                tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["class"] = (curDec["RES"].ToString() == "") ? "" : "info-cell";
                            }
                            else
                            {
                                string currDec = (curDec["RES"].ToString() == "") ? "0" : curDec["RES"].ToString();
                                tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"] = (Convert.ToInt32(tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"]) + Convert.ToInt32(currDec)).ToString();
                                switch (curDec["DECADA"].ToString())
                                {
                                    case "03":
                                        if (Convert.ToInt32(tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"]) > 264)
                                        {
                                            tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"] = "264";
                                        }
                                        break;
                                    default:
                                        if (Convert.ToInt32(tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"]) > 240)
                                        {
                                            tmp[curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString()]["val"] = "240";
                                        }
                                        break;
                                }
                                sup["decadas"] = tmp;
                                tmpRow[curDec["INSTANCE_NUMBER"].ToString()] = sup;
                            }
                        }
                    }
                } else {
                    decadas.Add(curDec["MY"].ToString() + "_" + curDec["DECADA"].ToString(), 
                                new Dictionary<string, string> {
                                    { "tarD", curDec["DECADA"].ToString() },
                                    { "tarM", curDec["MY"].ToString() },
                                    { "val", curDec["RES"].ToString() },
                                    { "class", (curDec["RES"].ToString()=="")?"":"info-cell" }
                                }
                    );
                }
            }

            Dictionary<string, object> tmpRow2 = new Dictionary<string, object>();

            foreach (KeyValuePair<string, object> inst in tmpRow) {
                Dictionary<string, object> sup = (Dictionary<string, object>)inst.Value;
                Dictionary<string, Dictionary<string, string>> tmp = (Dictionary<string, Dictionary<string, string>>)sup["decadas"];
                foreach (KeyValuePair<string, object> dec in decadas) {
                    if (!tmp.ContainsKey(dec.Key.ToString())) {
                        tmp.Add(dec.Key.ToString(), (Dictionary<string, string>)dec.Value);
                    }
                }
                var sortedDict = new SortedDictionary<string, Dictionary<string, string>>(tmp);
                sup["decadas"] = new Dictionary<string, Dictionary<string, string>>(sortedDict);
                tmpRow2.Add(inst.Key.ToString(), sup);
            }

            tmpRow = tmpRow2;


            return tmpRow;
        }

        public Dictionary<string, object> CreateNewFilter(Dictionary<string, object> cond) {
            Dictionary<string, object> res = new Dictionary<string, object>();
            using (OracleConnection conn = new OracleConnection(this.conString))
            {
                conn.Open();
                using (OracleCommand cm = new OracleCommand())
                {
                    cm.Connection = conn;
                    using (DataSet DS = new DataSet())
                    {
                        using (OracleDataAdapter dataAdapter = new OracleDataAdapter())
                        {
                            dataAdapter.SelectCommand = cm;

                            cm.CommandText = "INSERT INTO xxeam.xxeam_graph_cust_filt (OWNER,DESCRIPTION,DATE_CREATE) VALUES (" + cond["user"] + ", '" + cond["name"] + "', sysdate)";
                            int rown = cm.ExecuteNonQuery();
                            if (rown > 0)
                            {
                                cm.CommandText = "select max(filter_id) from xxeam.xxeam_graph_cust_filt";
                                string fid = cm.ExecuteScalar().ToString();
                                Dictionary<string, Dictionary<string, object>> attrs = (Dictionary<string, Dictionary<string, object>>)cond["attrs"];
                                int i = 0;
                                foreach(KeyValuePair<string, Dictionary<string, object>> att in attrs) {
                                    Dictionary<string, object> cur = (Dictionary<string, object>)att.Value;
                                    cm.CommandText = "insert into xxeam.xxeam_graph_cust_filt_flds (FILTER_ID, FIELD_NAME,FIELD_VAL,FIELD_VAL_DESCR,FIELD_NAME_TEXT) values "
                                                        + "(" + fid + ", q'[" + cur["field_name"] + "]', q'[" + cur["field_val"] + "]', q'[" + cur["field_val_desc"] + "]', q'[" + cur["field_name_desc"] + "]')";
                                    
                                    i+= cm.ExecuteNonQuery();
                                }
                                if (attrs.Count == i)
                                {
                                    res["response"] = "S";
                                }
                                else {
                                    res["response"] = "E";
                                }
                            }
                            else
                            {
                                res["response"] = "E";
                            }

                            cm.Dispose();
                            conn.Close();
                        }
                    }
                }
            }
            return res;
        }
    }
}
