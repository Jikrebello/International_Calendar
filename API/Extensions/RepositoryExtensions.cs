using API.Repositories;
using API.Repositories.Interfaces;

namespace API.Extensions
{
    public static class RepositoryExtensions
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IUsersRepository, UsersRepository>();
            services.AddScoped<ICountriesRepository, CountriesRepository>();

            return services;
        }
    }
}
