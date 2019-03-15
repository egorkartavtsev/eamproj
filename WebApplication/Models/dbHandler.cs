using System;
using System.Collections.Generic;
using System.Data;
using System.Xml;
using Oracle.ManagedDataAccess.Client;
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
        private readonly string token = "6e580e17-a2e6-4594-af3c-fb6e8623f026";
        /*  servera 
        *   1 - dev
        *   2 - psi
        */
        private readonly string conString = "Data Source=(DESCRIPTION= (ADDRESS=(PROTOCOL=tcp)(HOST=cis-dev.eco.mmk.chel.su)(PORT=1521)) (CONNECT_DATA= (SERVICE_NAME=DEV) (INSTANCE_NAME=DEV)));User Id=APPS;Password=qw1234;";
        //private readonly string conString = "Data Source=(DESCRIPTION= (ADDRESS=(PROTOCOL=tcp)(HOST=cis-psi-db.eco.mmk.chel.su)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=PSI)(INSTANCE_NAME=PSI)));User Id=APPS;Password=Bcgsnfybz380;";

        //=========================================PUBLIC FUNCTIONAL=====================================================
        public List<Dictionary<string, object>> GetDataFromDB(string query, Dictionary<string, string> cond) {
            return this.Make_valid_struct((DataSet)this.GetData(this.GetQueryById(query, cond)));
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
                            //OracleParameter pmsg_code = new OracleParameter();
                            //pmsg_code.ParameterName = "msg_code";
                            //set_parameter(pmsg_code, "Varchar2", "30", "Output");
                            //cm.Parameters.Add(pmsg_code);

                            cm.ExecuteNonQuery();

                            //message = pmsg_code.Value.ToString();

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


        //-----------------------------------------------------------------------------------------------------



    }
}
