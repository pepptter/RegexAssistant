using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser> 
    {
        public DbSet<RegexPattern> RegexPatterns { get; set; }
        public DbSet<CommonRegex> CommonRegexes { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {

        }
    }
}
