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

    public class UserCountryVisitSummaryDTO
    {
        public Guid UserId { get; set; }
        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public int VisitCount { get; set; }
    }
}
