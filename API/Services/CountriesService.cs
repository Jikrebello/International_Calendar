using API.DTOs;
using API.Entities;
using API.Repositories.Interfaces;
using API.Services.Interfaces;
using AutoMapper;

namespace API.Services
{
    public class CountriesService : ICountriesService
    {
        private readonly ICountriesRepository _countriesRepository;
        private readonly IMapper _mapper;

        public CountriesService(ICountriesRepository countriesRepository, IMapper mapper)
        {
            _countriesRepository = countriesRepository;
            _mapper = mapper;
        }

        public async Task<ResultResponse<IEnumerable<CountryDTO>>> GetAll()
        {
            var countries = await _countriesRepository.GetAllCountriesAsync().ToListAsync();
            var countriesDTO = _mapper.Map<IEnumerable<CountryDTO>>(countries);

            return new ResultResponse<IEnumerable<CountryDTO>>(
                success: true,
                message: countries.Any() ? "Countries found." : "No countries found.",
                result: countriesDTO
            );
        }

        public async Task<BaseResponse> SaveVisits(CountryVisitsDTO dto)
        {
            var allCountries = await _countriesRepository.GetAllCountriesAsync().ToListAsync();

            foreach (var entry in dto.SelectedCountries)
            {
                if (DateTime.TryParse(entry.Key, out DateTime parsedDate))
                {
                    foreach (var countryName in entry.Value.Distinct())
                    {
                        var country = allCountries.FirstOrDefault(x => x.Name == countryName);

                        if (country != null)
                        {
                            var existingVisit =
                                await _countriesRepository.GetVisitsByUserIdAndDateAndCountryId(
                                    Guid.Parse(dto.UserId),
                                    parsedDate,
                                    country.Id
                                );

                            if (existingVisit == null)
                            {
                                var visit = new UserCountryVisit
                                {
                                    UserId = Guid.Parse(dto.UserId),
                                    DateVisited = parsedDate,
                                    CountryId = country.Id
                                };

                                await _countriesRepository.InsertCountryVisit(visit);
                            }
                        }
                        else
                        {
                            return new BaseResponse
                            {
                                Success = false,
                                Message =
                                    $"Country `{countryName}` doesn't exist in Countries Table."
                            };
                        }
                    }
                }
                else
                {
                    return new BaseResponse
                    {
                        Success = false,
                        Message = $"Invalid date `{entry.Key}`."
                    };
                }
            }
            return new BaseResponse { Success = true, Message = "All visits saved successfully." };
        }

        public async Task<ResultResponse<CountryVisitsDTO>> GetVisitsByUserId(Guid userId)
        {
            var visits = await _countriesRepository
                .GetAllUserCountryVisitsAsync()
                .Where(x => x.UserId == userId)
                .ToListAsync();

            var countryVisits = new Dictionary<string, List<string>>();

            foreach (var visit in visits)
            {
                var dateKey = visit.DateVisited.ToString(format: "yyyy-MM-dd");
                if (!countryVisits.ContainsKey(dateKey))
                {
                    countryVisits[dateKey] = new List<string>();
                }

                var countryName = await _countriesRepository
                    .GetAllCountriesAsync()
                    .Where(x => x.Id == visit.CountryId)
                    .Select(x => x.Name)
                    .FirstOrDefaultAsync();
                if (!string.IsNullOrEmpty(countryName))
                {
                    countryVisits[dateKey].Add(countryName);
                }
            }

            var dto = new CountryVisitsDTO
            {
                UserId = userId.ToString(),
                SelectedCountries = countryVisits
            };

            return new ResultResponse<CountryVisitsDTO>(
                success: true,
                message: "Visits fetched successfully.",
                result: dto
            );
        }
    }
}
