namespace API.DTOs
{
    public class CountryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class CountryVisitsDTO
    {
        public string UserId { get; set; }
        public Dictionary<string, List<string>> SelectedCountries { get; set; }
    }
}
