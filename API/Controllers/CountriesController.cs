using API.DTOs;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // [Authorize]
    public class CountriesController : BaseApiController
    {
        private readonly ICountriesService _countriesService;

        public CountriesController(ICountriesService countriesService)
        {
            _countriesService = countriesService;
        }

        [HttpGet]
        public async Task<ActionResult<ResultResponse<List<CountryDTO>>>> GetAllCountries()
        {
            var result = await _countriesService.GetAll();
            return Ok(result);
        }

        [HttpGet(template: "{userId}")]
        public async Task<ActionResult<ResultResponse<CountryVisitsDTO>>> GetVisitsByUserId(
            Guid userId
        )
        {
            var result = await _countriesService.GetVisitsByUserId(userId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<BaseResponse>> SaveVisits(CountryVisitsDTO dto)
        {
            var result = await _countriesService.SaveVisits(dto);
            return Ok(result);
        }
    }
}
