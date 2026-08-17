using StudentPortfolio.Models.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentPortfolio.Models.Entities
{
    public class Acknowledgement : IDeletable, IModel
    {
        public Guid Id { get; set; }

        [Column(TypeName = "tinyint")]
        public AcknowledgementType Type { get; set; }

        [Column(TypeName = "NVARCHAR(255)")]
        public string Place { get; set; }
        public string Description { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }

        [Column(TypeName = "NVARCHAR(255)")]
        public string OtherType { get; set; }
        public bool Deleted { get; set; }
        public DateTimeOffset? DeletedAt { get; set; }
        public DateTimeOffset DateCreated { get; set; }

        [Column(TypeName = "tinyint")]
        public uint? CompetitionPosition { get; set; }

        [Column(TypeName = "NVARCHAR(255)")]
        public string CompetitionName { get; set; }

        [Column(TypeName = "NVARCHAR(255)")]
        public string StudentOrganizatonName { get; set; }

        public Guid StudentId { get; set; }
        public Student Student { get; set; }
    }
}
