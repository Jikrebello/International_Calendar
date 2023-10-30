using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Mappings
{
    public class CountriesProfile : Profile
    {
        public CountriesProfile()
        {
            CreateMap<Country, CountryDTO>();
        }
    }
}
