using StudentPortfolio.API.Infrastructure.Validation.Models;
using StudentPortfolio.API.Models.Dtos.Request.Acknowledgement;
using StudentPortfolio.API.Models.Entities;
using StudentPortfolio.API.Models.Infrastructure;
using StudentPortfolio.API.Repositories;
using StudentPortfolio.API.Repositories.Base;

namespace StudentPortfolio.API.Infrastructure.Validation
{
    public class AcknowledgementValidator(IAcknowledgementsRepository repo) : IValidator<Acknowledgement, CreateAcknowledgementRequest, UpdateAcknowledgementRequest>
    {
        public async Task<ValidationResult<CreateAcknowledgementRequest>> ValidateCreate(CreateAcknowledgementRequest request)
        {
            var errors = new List<ValidationError>();
            var requestValidator = new RequestValidator<Acknowledgement, CreateAcknowledgementRequest>(repo, request);

            errors.AddRange(requestValidator.NotNull(x => x.StartDate));
            errors.AddRange(requestValidator.NotEmpty(x => x.StudentId));

            if(request.EndDate.HasValue && request.StartDate.HasValue)
            {
                errors.AddRange(requestValidator.GreaterThan(x => x.EndDate.Value, x => x.StartDate.Value));
            }
            if (request.Type == AcknowledgementType.Other)
            {
                errors.AddRange(requestValidator.NotNull(s => s.OtherType));

            }
            if (request.Type == AcknowledgementType.Internship || request.Type == AcknowledgementType.Investigation)
            {
                errors.AddRange(requestValidator.NotNull(s => s.Place));
            }

            return new ValidationResult<CreateAcknowledgementRequest>
            {
                Success = errors.Count == 0,
                Payload = request,
                Errors = errors
            };
        }

        public async Task<ValidationResult<UpdateAcknowledgementRequest>> ValidateUpdate(UpdateAcknowledgementRequest request)
        {
            var errors = new List<ValidationError>();
            var requestValidator = new RequestValidator<Acknowledgement, UpdateAcknowledgementRequest>(repo, request);

            if (request.Type == AcknowledgementType.Other)
            {
                errors.AddRange(requestValidator.NotNull(s => s.OtherType));

            }
            if (request.Type == AcknowledgementType.Internship || request.Type == AcknowledgementType.Investigation)
            {
                errors.AddRange(requestValidator.NotNull(s => s.Place));

            }
            return new ValidationResult<UpdateAcknowledgementRequest>
            {
                Success = true,
                Payload = request,
                Errors = errors
            };
        }
    }
}
