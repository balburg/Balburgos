using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Informa2CRS.Data
{
    public class ExcelManager
    {
        #region Singleton

        private static ExcelManager instance;
        public static ExcelManager Instance
        {
            get
            {
                if (instance == null) instance = new ExcelManager();
                return instance;
            }
        }

        #endregion 

        #region Data Access

        public DataTable GetTable(string fileName, string sheetName)
        {
            DataTable dt = new DataTable();

            try
            {
                using (OleDbConnection cn = new OleDbConnection())
                {
                    string query = string.Format("select * from {0}", sheetName);
                    using (OleDbDataAdapter da = new OleDbDataAdapter(query, cn))
                    {
                        da.Fill(dt);
                    }
                    if (cn.State == ConnectionState.Open) cn.Close();
                }
            }
            catch (Exception ex)
            {
                //Log.Instance.Write(string.Format("Error: {0}\r\n{1}", ex.Message, ex.StackTrace);
                dt = null;
            }

            return dt;
        }
        public List<T> GetTable<T>(string fileName) where T : new()
        {
            List<T> list = new List<T>();

            try
            {
                T item = new T();
                Type t = item.GetType();
                string sheetName = string.Format("[{0}$]", t.Name);
                PropertyInfo[] pis = t.GetProperties();

                string conStr = "";
                if (fileName.EndsWith(".xls"))
                {
                    conStr = string.Format("Provider=Microsoft.Jet.OLEDB.4.0;Data Source={0};Extended Properties='Excel 8.0;HDR=YES;'", fileName);
                }
                if (fileName.EndsWith(".xlsx"))
                {
                    conStr = string.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties='Excel 12.0 Xml;HDR=YES;'", fileName);
                }

                using (OleDbConnection cn = new OleDbConnection(conStr))
                {
                    string query = string.Format("select * from {0}", sheetName);
                    using (OleDbCommand cm = new OleDbCommand(query, cn))
                    {
                        cn.Open();
                        OleDbDataReader dr = cm.ExecuteReader();
                        while (dr.Read())
                        {
                            item = new T();
                            foreach (PropertyInfo pi in pis)
                            {
                                pi.SetValue(item, Convert.ChangeType(dr[pi.Name], pi.PropertyType));
                            }
                            list.Add(item);
                        }
                    }
                    if (cn.State == ConnectionState.Open) cn.Close();
                }
            }
            catch (Exception ex)
            {
                //Log.Instance.Write(string.Format("Error: {0}\r\n{1}", ex.Message, ex.StackTrace);
                list = null;
            }

            return list;
        }

        #endregion
    }
}
