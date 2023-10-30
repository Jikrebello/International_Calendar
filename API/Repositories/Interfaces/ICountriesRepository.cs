using API.Entities;

namespace API.Repositories.Interfaces
{
    public interface ICountriesRepository
    {
        IAsyncEnumerable<Country> GetAllCountriesAsync();
        IQueryable<UserCountryVisit> GetAllUserCountryVisitsAsync();
        Task InsertCountryVisit(UserCountryVisit visit);
        Task<UserCountryVisit> GetVisitsByUserIdAndDateAndCountryId(
            Guid userId,
            DateTime dateVisited,
            int countryId
        );
    }
}
