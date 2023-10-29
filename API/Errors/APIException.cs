namespace API.Errors
{
    public class APIException
    {
        public APIException(int statusCode, string details)
        {
            StatusCode = statusCode;
            Details = details;
        }

        public int StatusCode { get; set; }
        public string Details { get; set; }
    }
}
