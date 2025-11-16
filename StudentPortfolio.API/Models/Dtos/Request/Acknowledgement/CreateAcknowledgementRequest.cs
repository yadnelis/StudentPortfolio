using StudentPortfolio.API.Models.Dtos.Base;
using StudentPortfolio.API.Models.Infrastructure;

namespace StudentPortfolio.API.Models.Dtos.Request.Acknowledgement
{
    public class CreateAcknowledgementRequest : IBaseModRequest
    {
        public Guid StudentId { get; set; }
        public AcknowledgementType Type { get; set; }
        public string Place { get; set; }
        public string Description { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string OtherType { get; set; }
        public string Email { get; set; }
        public uint? CompetitionPosition { get; set; }
        public string CompetitionName { get; set; }
        public string StudentOrganizatonName { get; set; }
    }
}
