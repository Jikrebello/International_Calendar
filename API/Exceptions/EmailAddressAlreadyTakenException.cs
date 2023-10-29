namespace API.Exceptions
{
    public class EmailAddressAlreadyTakenException : Exception
    {
        public EmailAddressAlreadyTakenException()
            : base() { }

        public EmailAddressAlreadyTakenException(string message)
            : base(message) { }
    }
}
