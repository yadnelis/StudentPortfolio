using StudentPortfolio.API.Models.Dtos.Base;

namespace StudentPortfolio.API.Models.Dtos.Request.Student
{
    public class CreateStudentRequest : IBaseModRequest
    {
        public string InstitutionalId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string Institution { get; set; }
    }
}
