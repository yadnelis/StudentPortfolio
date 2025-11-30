using StudentPortfolio.API.Models.Dtos.Response.Student;
using StudentPortfolio.API.Models.Entities;
using StudentPortfolio.API.Models.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentPortfolio.API.Models.Dtos.Response.Acknowledgement
{
    public class GetAcknowledgementResponse : GetAcknowledgementResponseNoNavigation
    {
        public GetStudentResponseNoNavigation Student { get; set; }
    }

    /**
     * The base DTO does not include the Student navigation property
     * to avoid an infinite loop caused by EF Core lazy loading 
     * when the object is getting serialized
     */
    public class GetAcknowledgementResponseNoNavigation
    {

        public Guid Id { get; set; }
        public Guid StudentId { get; set; }
        public AcknowledgementType Type { get; set; }
        public string Place { get; set; }
        public string Description { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string OtherType { get; set; }
        public DateTimeOffset DateCreated { get; set; }
        public uint? CompetitionPosition { get; set; }
        public string CompetitionName { get; set; }
        public string StudentOrganizatonName { get; set; }
    }
}

