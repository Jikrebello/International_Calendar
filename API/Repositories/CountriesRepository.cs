using API.Entities;
using API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class CountriesRepository : ICountriesRepository
    {
        private readonly DataContext _dataContext;

        public CountriesRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public IAsyncEnumerable<Country> GetAllCountriesAsync()
        {
            return _dataContext.Countries.AsNoTracking().AsAsyncEnumerable();
        }

        public IAsyncEnumerable<UserCountryVisit> GetAllUserCountryVisitsAsync()
        {
            return _dataContext.UserCountryVisits.AsNoTracking().AsAsyncEnumerable();
        }

        public async Task InsertCountryVisit(UserCountryVisit visit)
        {
            _dataContext.UserCountryVisits.Add(visit);
            await _dataContext.SaveChangesAsync();
        }

        public async Task<UserCountryVisit> GetVisitsByUserIdAndDateAndCountryId(
            Guid userId,
            DateTime dateVisited,
            int countryId
        )
        {
            return await _dataContext.UserCountryVisits
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    v =>
                        v.UserId == userId
                        && v.DateVisited == dateVisited
                        && v.CountryId == countryId
                );
        }
    }
}
