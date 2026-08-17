using Microsoft.EntityFrameworkCore;
using StudentPortfolio.Models.Entities;
using System.Reflection.Metadata;

namespace StudentPortfolio.Infrastructure
{
    public class StudentPortfolioContext : DbContext
    {
        public DbSet<Acknowledgement> Acknowledgements { get; set; }
        public DbSet<Student> Students { get; set; }
        public StudentPortfolioContext(DbContextOptions<StudentPortfolioContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Acknowledgement>().HasQueryFilter(b => !b.Deleted);
            modelBuilder.Entity<Student>().HasQueryFilter(b => !b.Deleted);
            base.OnModelCreating(modelBuilder);
        }

        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {

            //configurationBuilder.Properties<string>()
            //    //.AreUnicode(false)
            //    //.AreFixedLength()
            //    //.HaveMaxLength(256);
            //    .HaveColumnType("NVARCHAR(255)");

            configurationBuilder.Properties<int>()
              //.AreUnicode(false)
              //.AreFixedLength()
              //.HaveMaxLength(256);
              .HaveColumnType("smallint");

            configurationBuilder.Properties<bool>()
             //.AreUnicode(false)
             //.AreFixedLength()
             //.HaveMaxLength(256);
             .HaveColumnType("bit");

            base.ConfigureConventions(configurationBuilder);
        }
    }
}
