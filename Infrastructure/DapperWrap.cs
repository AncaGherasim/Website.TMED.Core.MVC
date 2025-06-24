using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Dapper;
using System.Data.SqlClient;
using System.Collections;
using MySql.Data.MySqlClient;
using System.Data;
using System.Linq;
using Npgsql;
using Amazon.SimpleSystemsManagement;
using Amazon.SimpleSystemsManagement.Model;
using System.Text.Json.Nodes;
using Newtonsoft.Json;

namespace MVC_TMED.Infrastructure
{
    public class DapperWrap
    {
        private readonly AppSettings _appSettings;
        private readonly AWSParameterStoreService _awsParameterStoreService;
        private static IAmazonSimpleSystemsManagement _ssmClient;

        public DapperWrap(IOptions<AppSettings> appSettings, AWSParameterStoreService awsParameterStoreService, IAmazonSimpleSystemsManagement ssmClient)
        {
            _appSettings = appSettings.Value;
            _awsParameterStoreService = awsParameterStoreService;
            _ssmClient = ssmClient;
        }

        public async Task<IEnumerable<T>> GetRecords<T>(string sql, object parameters = null)
        {
            IEnumerable<T> records = default(IEnumerable<T>);
            string connectionString = _awsParameterStoreService.SqlConnectionString;
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                var response = GetAWSParameterStoreValues("/WEB/Tournet/SqlConn", 5);
                var parameterStore = JsonObject.Parse(response.Result);
                var host = parameterStore["Host"];
                var database = parameterStore["Database"];
                var user = parameterStore["Username"];
                var password = parameterStore["Password"];
                var maxPool = parameterStore["MaxPool"];
                _awsParameterStoreService.SqlConnectionString = $"SERVER={host};DATABASE={database};UID={user};PWD={password};Max Pool Size={maxPool};TrustServerCertificate=True";
                connectionString = _awsParameterStoreService.SqlConnectionString;
            }
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //connection.StatisticsEnabled = true; ---use Serilog 

                Int32 NoTimes = 1;
                Int32 ConnectionTested = 0;
                while (ConnectionTested == 0)
                {
                    try
                    {
                        await connection.OpenAsync(); //not mandatory, QueryAsync opens connection if it is closed
                    }
                    catch
                    {
                    }
                    finally
                    {
                        if (connection.State != System.Data.ConnectionState.Open)
                        {
                            if (NoTimes < 5)
                            {
                                NoTimes++;
                            }
                            else
                            {
                                ConnectionTested = 1;
                            }
                        }
                        else
                        {
                            ConnectionTested = 1;
                        }
                    }
                }


                Int32 CounterOfDeadLockTries = 0;
                bool TryToFill = true;
                Int32 NoOfLoops = 0;

                while (TryToFill)
                {
                    NoOfLoops++;
                    if (NoOfLoops > 5) //protect against endless loop
                    {
                        break;
                    }

                    try
                    {
                        records = await connection.QueryAsync<T>(sql, parameters);
                        TryToFill = false;
                    }
                    catch (SqlException sqlException)
                    {
                        if (sqlException.Number == 1205 || sqlException.Number == 1204 || sqlException.Number == 1222)
                        {
                            CounterOfDeadLockTries = CounterOfDeadLockTries + 1;
                            if (CounterOfDeadLockTries < 3)
                            {
                                TryToFill = true;
                            }
                            else
                            {
                                Console.WriteLine("TMED-Error-SqlLock-GetRecordsAsync01: " + typeof(T).Name + " SqlExceptionNo: " + sqlException.Number + " Message: " + sqlException.Message);
                                if (sqlException.InnerException != null)
                                {
                                    Console.WriteLine(sqlException.InnerException.Message);
                                }
                                TryToFill = false;
                                throw AddAdditionalInfoToException(sqlException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                            }
                        }
                        else
                        {
                            Console.WriteLine("TMED-Error-SqlLock-GetRecordsAsync02: " + typeof(T).Name + " Message: " + sqlException.Message);
                            if (sqlException.InnerException != null)
                            {
                                Console.WriteLine(sqlException.InnerException.Message);
                            }
                            TryToFill = false;
                            throw AddAdditionalInfoToException(sqlException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                        }
                    }
                    catch (Exception originalException)
                    {
                        Console.WriteLine("TMED-Error-Sql-Dapper01: " + originalException.Message);
                        if (originalException.InnerException != null)
                        {
                            Console.WriteLine(originalException.InnerException.Message);
                        }
                        TryToFill = false;
                        throw AddAdditionalInfoToException(originalException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                    }

                }

                //var stats = connection.RetrieveStatistics();
                //LogInfo("GetRecords: " + typeof(T).Name, stats, sql, parameters);
            }

            return records;
        }

        public async Task<IEnumerable<T>> MySqlGetRecordsAsync<T>(string sql, object parameters = null)
        {
            IEnumerable<T> records = default(IEnumerable<T>);
            //string sqlConns = _appSettings.ConnectionStrings.ProAurora;
            string connectionString = _awsParameterStoreService.MySqlConnectionString;
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                var response = GetAWSParameterStoreValues("/WEB/Tournet/AuroraConn", 5);
                var parameterStore = JsonObject.Parse(response.Result);
                var host = parameterStore["Host"];
                var database = parameterStore["Database"];
                var user = parameterStore["Username"];
                var password = parameterStore["Password"];
                var maxPool = parameterStore["MaxPool"];
                _awsParameterStoreService.MySqlConnectionString = $"SERVER={host};DATABASE={database};UID={user};PWD={password};Max Pool Size={maxPool};Allow User Variables=True";
                connectionString = _awsParameterStoreService.MySqlConnectionString;
            }

            using (MySqlConnection dbMySqlConn = new MySqlConnection(connectionString))
            {
                Int32 NoTimes = 1;
                Int32 ConnectionTested = 0;
                while (ConnectionTested == 0)
                {
                    try
                    {
                        await dbMySqlConn.OpenAsync();
                    }
                    catch
                    {
                    }
                    finally
                    {
                        if (dbMySqlConn.State != System.Data.ConnectionState.Open)
                        {
                            if (NoTimes < 5)
                            {
                                NoTimes++;
                            }
                            else
                            {
                                ConnectionTested = 1;
                            }
                        }
                        else
                        {
                            ConnectionTested = 1;
                        }
                    }
                }


                Int32 CounterOfDeadLockTries = 0;
                bool TryToFill = true;
                Int32 NoOfLoops = 0;
                while (TryToFill)
                {
                    NoOfLoops++;
                    if (NoOfLoops > 5) //protect against endless loop
                    {
                        break;
                    }
                    try
                    {
                        records = await dbMySqlConn.QueryAsync<T>(sql, parameters);
                        TryToFill = false;
                    }
                    catch (MySqlException sqlException)
                    {
                        if (sqlException.Number == 1205 || sqlException.Number == 1204 || sqlException.Number == 1222)
                        {
                            CounterOfDeadLockTries = CounterOfDeadLockTries + 1;
                            if (CounterOfDeadLockTries < 3)
                            {
                                TryToFill = true;
                            }
                            else
                            {
                                TryToFill = false;
                                Console.WriteLine("TMED-Error-MySqlLock-GetRecordsAsync01: " + typeof(T).Name + " MySqlExceptionNo: " + sqlException.Number + " Message: " + sqlException.Message);
                                if (sqlException.InnerException != null)
                                {
                                    Console.WriteLine(sqlException.InnerException.Message);
                                }
                                throw AddAdditionalInfoToException(sqlException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                            }
                        }
                        else
                        {
                            TryToFill = false;
                            Console.WriteLine("TMED-Error-MySqlLock-GetRecordsAsync02: " + typeof(T).Name + " Message: " + sqlException.Message);
                            if (sqlException.InnerException != null)
                            {
                                Console.WriteLine(sqlException.InnerException.Message);
                            }
                            throw AddAdditionalInfoToException(sqlException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                        }
                    }
                    catch (Exception originalException)
                    {
                        Console.WriteLine("TMED-Error-MySql-Dapper01: " + originalException.Message);
                        if (originalException.InnerException != null)
                        {
                            Console.WriteLine(originalException.InnerException.Message);
                        }
                        TryToFill = false;
                        throw AddAdditionalInfoToException(originalException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);

                    }
                }
            }

            return records;
        }

        public IEnumerable<T> MySqlGetRecords<T>(string sql, object parameters = null)
        {

            IEnumerable<T> records = default(IEnumerable<T>);
            List<T> objectList = new List<T>();
            //System.Reflection.PropertyInfo pis = GetType(T).GetProperties(System.Reflection.BindingFlags.Instance);
            string connectionString = _awsParameterStoreService.MySqlConnectionString;
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                var response = GetAWSParameterStoreValues("/WEB/Tournet/AuroraConn", 5);
                var parameterStore = JsonObject.Parse(response.Result);
                var host = parameterStore["Host"];
                var database = parameterStore["Database"];
                var user = parameterStore["Username"];
                var password = parameterStore["Password"];
                var maxPool = parameterStore["MaxPool"];
                _awsParameterStoreService.MySqlConnectionString = $"SERVER={host};DATABASE={database};UID={user};PWD={password};Max Pool Size={maxPool};Allow User Variables=True";
                connectionString = _awsParameterStoreService.MySqlConnectionString;
            }
            using (MySqlConnection dbMySqlConn = new MySqlConnection(connectionString))
            {
                Int32 NoTimes = 1;
                Int32 ConnectionTested = 0;
                while (ConnectionTested == 0)
                {
                    try
                    {
                        dbMySqlConn.Open();
                    }
                    catch
                    {
                    }
                    finally
                    {
                        if (dbMySqlConn.State != System.Data.ConnectionState.Open)
                        {
                            if (NoTimes < 5)
                            {
                                NoTimes++;
                            }
                            else
                            {
                                ConnectionTested = 1;
                            }
                        }
                        else
                        {
                            ConnectionTested = 1;
                        }
                    }
                }

                Int32 CounterOfDeadLockTries = 0;
                bool TryToFill = true;
                Int32 NoOfLoops = 0;
                while (TryToFill)
                {
                    NoOfLoops++;
                    if (NoOfLoops > 5) //protect against endless loop
                    {
                        break;
                    }
                    try
                    {
                        records = dbMySqlConn.Query<T>(sql, parameters);
                        TryToFill = false;
                    }
                    catch (MySqlException sqlException)
                    {
                        if (sqlException.Number == 1205 || sqlException.Number == 1204 || sqlException.Number == 1222)
                        {
                            CounterOfDeadLockTries = CounterOfDeadLockTries + 1;
                            if (CounterOfDeadLockTries < 3)
                            {
                                TryToFill = true;
                            }
                            else
                            {
                                TryToFill = false;
                                Console.WriteLine("TMED-Error-MySqlLock-GetRecordsSync01: " + typeof(T).Name + " MySqlExceptionNo: " + sqlException.Number + " Message: " + sqlException.Message);
                                if (sqlException.InnerException != null)
                                {
                                    Console.WriteLine(sqlException.InnerException.Message);
                                }
                                throw AddAdditionalInfoToException(sqlException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                            }
                        }
                        else
                        {
                            TryToFill = false;
                            Console.WriteLine("TMED-Error-MySqlLock-GetRecordsSync02: " + typeof(T).Name + " Message: " + sqlException.Message);
                            if (sqlException.InnerException != null)
                            {
                                Console.WriteLine(sqlException.InnerException.Message);
                            }
                            throw AddAdditionalInfoToException(sqlException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                        }
                    }
                    catch (Exception originalException)
                    {
                        Console.WriteLine("TMED-Error-MySql-Dapper02: " + originalException.Message);
                        if (originalException.InnerException != null)
                        {
                            Console.WriteLine(originalException.InnerException.Message);
                        }
                        TryToFill = false;
                        throw AddAdditionalInfoToException(originalException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                    }
                }
            }

            return records;
        }

        public async Task<T> GetRecord<T>(string sql, object parameters = null)
        {
            T record = default(T);
            string connectionString = _awsParameterStoreService.SqlConnectionString;
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                var response = GetAWSParameterStoreValues("/WEB/Tournet/SqlConn", 5);
                var parameterStore = JsonObject.Parse(response.Result);
                var host = parameterStore["Host"];
                var database = parameterStore["Database"];
                var user = parameterStore["Username"];
                var password = parameterStore["Password"];
                var maxPool = parameterStore["MaxPool"];
                _awsParameterStoreService.SqlConnectionString = $"SERVER={host};DATABASE={database};UID={user};PWD={password};Max Pool Size={maxPool};TrustServerCertificate=True";
                connectionString = _awsParameterStoreService.SqlConnectionString;
            }
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.StatisticsEnabled = true;
                await connection.OpenAsync();

                try
                {
                    record = await connection.QueryFirstOrDefaultAsync<T>(sql, parameters);
                }
                catch (Exception originalException)
                {
                    throw AddAdditionalInfoToException(originalException, "Error: GetRecord: " + typeof(T).Name, sql, parameters);
                }

                var stats = connection.RetrieveStatistics();
                //LogInfo("GetRecord: " + typeof(T).Name, stats, sql, parameters);
            }

            return record;
        }

        public async Task<IEnumerable<dynamic>> GetMultipleRecords(string sql, int maxRetryCount = 4, object command_params = null, params Type[] types)
        {
            int retryCount = 0;
            var resultSets = new List<IEnumerable<object>>();
            string connectionString = _awsParameterStoreService.SqlConnectionString;
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                var response = GetAWSParameterStoreValues("/WEB/Tournet/SqlConn", 5);
                var parameterStore = JsonObject.Parse(response.Result);
                var host = parameterStore["Host"];
                var database = parameterStore["Database"];
                var user = parameterStore["Username"];
                var password = parameterStore["Password"];
                var maxPool = parameterStore["MaxPool"];
                _awsParameterStoreService.SqlConnectionString = $"SERVER={host};DATABASE={database};UID={user};PWD={password};Max Pool Size={maxPool};TrustServerCertificate=True";
                connectionString = _awsParameterStoreService.SqlConnectionString;
            }
            // Retry reading from the database
            while (retryCount <= maxRetryCount)
            {
                try
                {
                    using (SqlConnection connection = new SqlConnection(connectionString))
                    {
                        // Set command timeout
                        //connection.OpenAsync();
                        var command = connection.CreateCommand();
                        command.CommandText = sql;
                        command.CommandType = CommandType.Text; // Changed to CommandType.Text for SQL query
                        command.CommandTimeout = 5;

                        // Execute the command and retrieve the result set
                        var reader = await connection.QueryMultipleAsync(sql, command_params);


                        // Read each result set and map to the specified types
                        foreach (var type in types)
                        {
                            var resultSet = reader.Read(type);
                            resultSets.Add(resultSet);
                        }

                        return resultSets;
                    }
                }
                catch (SqlException sqlException) when (sqlException.Number == 1205 && retryCount < maxRetryCount)
                {
                    // Error code 1205 indicates a deadlock
                    retryCount++;
                    if (retryCount == maxRetryCount)
                    {
                        Console.WriteLine("TMED-Error-SqlLock-GetMultipleRecordsAsync: " + "SqlExceptionNo: " + sqlException.Number + " Message: " + sqlException.Message);
                        if (sqlException.InnerException != null)
                        {
                            Console.WriteLine(sqlException.InnerException.Message);
                        }
                    }
                    System.Threading.Thread.Sleep(100); // Wait for a short delay before retrying
                }
                catch (SqlException sqlException) when (retryCount < maxRetryCount)
                {
                    // Retry for other SQL connection errors
                    retryCount++;
                    Console.WriteLine("TMED-Error-Sql-GetMultipleRecordsAsync: " + "Message: " + sqlException.Message);
                    if (sqlException.InnerException != null)
                    {
                        Console.WriteLine(sqlException.InnerException.Message);
                    }
                    System.Threading.Thread.Sleep(100); // Wait for a short delay before retrying
                }
                catch (Exception ex)
                {
                    // Handle other exceptions
                    // Log or handle the exception appropriately
                    //throw; // Rethrow the exception
                    retryCount++;
                    Console.WriteLine("TMED-Error-Sql-GetMultipleRecordsAsync: " + ex.Message);
                    if (ex.InnerException != null)
                    {
                        Console.WriteLine(ex.InnerException.Message);
                    }
                }
            }
            return resultSets;
        }

        public async Task<IEnumerable<T>> pgSQLGetRecordsAsync<T>(string sql, int maxRetryCount = 4, object command_params = null)
        {
            int retryCount = 0;
            IEnumerable<T> records = default(IEnumerable<T>);
            string connectionString = _awsParameterStoreService.PostgresConnectionString;
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                var response = GetAWSParameterStoreValues("/WEB/Tournet/PostgresConn", 5);
                var parameterStore = JsonObject.Parse(response.Result);
                var host = parameterStore["Host"];
                var hostRo = parameterStore["HostRO"];
                var database = parameterStore["Database"];
                var user = parameterStore["Username"];
                var password = parameterStore["Password"];
                var maxPool = parameterStore["MaxPool"];
                _awsParameterStoreService.PostgresConnectionString = $"SERVER={hostRo};DATABASE={database};Username={user};Password={password}";
                connectionString = _awsParameterStoreService.PostgresConnectionString;
            }
            // Retry reading from the database
            while (retryCount <= maxRetryCount)
            {
                try
                {
                    using (var connection = new NpgsqlConnection(connectionString))
                    {
                        // Open connection
                        await connection.OpenAsync();

                        // Execute the command and retrieve the result set
                        records = await connection.QueryAsync<T>(sql, command_params);

                        return records;
                    }
                }
                catch (SqlException sqlException) when (sqlException.Number == 1205 && retryCount < maxRetryCount)
                {
                    // Error code 1205 indicates a deadlock
                    retryCount++;
                    if (retryCount == maxRetryCount)
                    {
                        Console.WriteLine("TMED-Error-PostgreSQLock-pgSQLGetRecordsAsync: " + "SqlExceptionNo: " + sqlException.Number + " Message: " + sqlException.Message);
                        if (sqlException.InnerException != null)
                        {
                            Console.WriteLine(sqlException.InnerException.Message);
                        }
                    }
                    System.Threading.Thread.Sleep(100); // Wait for a short delay before retrying
                }
                catch (SqlException sqlException) when (retryCount < maxRetryCount)
                {
                    // Retry for other SQL connection errors
                    retryCount++;
                    Console.WriteLine("TMED-Error-PostgreSql-pgSQLGetRecordsAsync: " + "Message: " + sqlException.Message);
                    if (sqlException.InnerException != null)
                    {
                        Console.WriteLine(sqlException.InnerException.Message);
                    }
                    System.Threading.Thread.Sleep(100); // Wait for a short delay before retrying
                }
                catch (Exception ex)
                {
                    // Handle other exceptions
                    // Log or handle the exception appropriately
                    retryCount++;
                    Console.WriteLine("TMED-Error-pgSQLGetRecordsAsync: " + ex.Message);
                    if (ex.InnerException != null)
                    {
                        Console.WriteLine(ex.InnerException.Message);
                    }
                }
            }
            return records;
        }
        public async Task<string> pgJsonGetRecordsAsync<T>(string sql, int maxRetryCount = 4, object command_params = null)
        {
            int retryCount = 0;
            string jsonResult = null;
            string connectionString = _awsParameterStoreService.PostgresConnectionString;
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                var response = GetAWSParameterStoreValues("/WEB/Tournet/PostgresConn", 5);
                var parameterStore = JsonObject.Parse(response.Result);
                var host = parameterStore["Host"];
                var hostRo = parameterStore["HostRO"];
                var database = parameterStore["Database"];
                var user = parameterStore["Username"];
                var password = parameterStore["Password"];
                var maxPool = parameterStore["MaxPool"];
                _awsParameterStoreService.PostgresConnectionString = $"SERVER={hostRo};DATABASE={database};Username={user};Password={password}";
                connectionString = _awsParameterStoreService.PostgresConnectionString;
            }
            // Retry reading from the database
            while (retryCount <= maxRetryCount)
            {
                try
                {
                    using (var connection = new NpgsqlConnection(connectionString))
                    {
                        // Open connection
                        await connection.OpenAsync();

                        jsonResult = await connection.QueryFirstOrDefaultAsync<string>(sql, command_params);

                        return jsonResult;
                    }
                }
                catch (SqlException sqlException) when (sqlException.Number == 1205 && retryCount < maxRetryCount)
                {
                    // Error code 1205 indicates a deadlock
                    retryCount++;
                    if (retryCount == maxRetryCount)
                    {
                        Console.WriteLine("TMED-Error-PostgreSQLock-pgSQLGetRecordsAsync: " + "SqlExceptionNo: " + sqlException.Number + " Message: " + sqlException.Message);
                        if (sqlException.InnerException != null)
                        {
                            Console.WriteLine(sqlException.InnerException.Message);
                        }
                    }
                    System.Threading.Thread.Sleep(100); // Wait for a short delay before retrying
                }
                catch (SqlException sqlException) when (retryCount < maxRetryCount)
                {
                    // Retry for other SQL connection errors
                    retryCount++;
                    Console.WriteLine("TMED-Error-PostgreSql-pgSQLGetRecordsAsync: " + "Message: " + sqlException.Message);
                    if (sqlException.InnerException != null)
                    {
                        Console.WriteLine(sqlException.InnerException.Message);
                    }
                    System.Threading.Thread.Sleep(100); // Wait for a short delay before retrying
                }
                catch (Exception ex)
                {
                    // Handle other exceptions
                    // Log or handle the exception appropriately
                    retryCount++;
                    Console.WriteLine("TMED-Error-pgSQLGetRecordsAsync: " + ex.Message);
                    if (ex.InnerException != null)
                    {
                        Console.WriteLine(ex.InnerException.Message);
                    }
                }
            }
            return jsonResult;
        }
        private Exception AddAdditionalInfoToException(Exception originalException, string message, string sql, object parameters = null)
        {
            var additionalInfoException = new Exception(message, originalException);
            additionalInfoException.Data.Add("SQL", sql);
            return additionalInfoException;
        }
        private static async Task<string> GetAWSParameterStoreValues(string parameterName, int maxRetries)
        {
            int retryCount = 0;
            TimeSpan delay = TimeSpan.FromMilliseconds(200); // Wait for 200 milliseconds between retries
            Console.WriteLine($"****** TMED - Invoke GetAWSParameterStoreValues for: {parameterName}");

            while (retryCount < maxRetries)
            {
                try
                {
                    // Attempt to retrieve the parameter
                    var request = new GetParameterRequest
                    {
                        Name = parameterName,
                        WithDecryption = true
                    };

                    var response = await _ssmClient.GetParameterAsync(request);
                    Console.WriteLine($"****** TMED - Succeeded in retrieving the parameter {parameterName} after {retryCount + 1} attempts.");
                    return response.Parameter.Value;
                }
                catch (Exception ex)
                {
                    retryCount++;

                    if (retryCount == maxRetries)
                    {
                        // Log or handle the error if max retries are reached
                        Console.WriteLine($"****** TMED - Failed to retrieve the parameter '{parameterName}' after {maxRetries} attempts.");
                        Console.WriteLine(ex.Message);
                        Console.WriteLine(ex.StackTrace);
                        throw new Exception($"Failed to retrieve the parameter '{parameterName}' after {maxRetries} attempts.", ex);
                    }

                    // Optionally log the retry attempt here

                    // Wait before retrying
                    await Task.Delay(delay);
                }
            }

            // If retries fail, return null or handle it appropriately
            return null;
        }
    }
}
