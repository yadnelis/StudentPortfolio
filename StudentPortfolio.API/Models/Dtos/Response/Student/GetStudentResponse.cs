using StudentPortfolio.API.Models.Dtos.Response.Acknowledgement;

namespace StudentPortfolio.API.Models.Dtos.Response.Student
{
    public class GetStudentResponse : GetStudentResponseNoNavigation
    {
        public IEnumerable<GetAcknowledgementResponseNoNavigation> Acknowledgements { get; set; }
    }

    /**
     * The base DTO does not include the Acknowledgements navigation property
     * to avoid an infinite loop caused by EF Core lazy loading 
     * when the object is getting serialized
     */
    public class GetStudentResponseNoNavigation
    {
        public Guid Id { get; set; }
        public string InstitutionalId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string FullName { get { return string.Join(" ", [Name, LastName]); } }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string Institution { get; set; }
        public DateTimeOffset? DateCreated { get; set;}
    }
}
