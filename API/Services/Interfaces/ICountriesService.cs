using API.DTOs;

namespace API.Services.Interfaces
{
    public interface ICountriesService
    {
        Task<ResultResponse<IEnumerable<CountryDTO>>> GetAll();
        Task<BaseResponse> SaveVisits(CountryVisitsDTO dto);
        Task<ResultResponse<CountryVisitsDTO>> GetVisitsByUserId(Guid userId);
        Task<ResultResponse<List<UserCountryVisitSummaryDTO>>> GetUserCountryVisitSummary(
            Guid userId
        );
    }
}
