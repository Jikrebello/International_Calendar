namespace API.Exceptions
{
    public class UsersNotFoundException : Exception
    {
        public UsersNotFoundException()
            : base() { }

        public UsersNotFoundException(string message)
            : base(message) { }
    }
}
