using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options)
        : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Country> Countries { get; set; }
    public DbSet<UserCountryVisit> UserCountryVisits { get; set; }
}
