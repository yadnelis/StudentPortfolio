using Microsoft.EntityFrameworkCore.Metadata.Internal;
using StudentPortfolio.API.Models.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentPortfolio.API.Models.Entities
{
    public class Student : IModel, IDeletable
    {
        public Guid Id { get; set; }
        
        [Column(TypeName = "tinytext")]
        public string InstitutionalId { get; set; }
        
        [Column(TypeName = "tinytext")]
        public string Name { get; set; }
        
        [Column(TypeName = "tinytext")]
        public string LastName { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }

        [Column(TypeName = "tinytext")]
        public string Institution { get; set; }
        public bool Deleted { get; set; }
        public DateTimeOffset? DeletedAt { get; set; }
        public DateTimeOffset DateCreated { get; set; }
        public ICollection<Acknowledgement> Acknowledgements { get; set;}
    }
}
