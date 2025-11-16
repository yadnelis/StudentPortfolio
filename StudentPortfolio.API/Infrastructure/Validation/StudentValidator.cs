using StudentPortfolio.API.Infrastructure.Validation.Models;
using StudentPortfolio.API.Models.Dtos.Request.Student;
using StudentPortfolio.API.Models.Entities;
using StudentPortfolio.API.Repositories;

namespace StudentPortfolio.API.Infrastructure.Validation
{
    public class StudentValidator(IStudentsRepository repo) : IValidator<Student, CreateStudentRequest, UpdateStudentRequest>
    {
        public async Task<ValidationResult<CreateStudentRequest>> ValidateCreate(CreateStudentRequest request)
        {
            var errors = new List<ValidationError>();
            var requestValidator = new RequestValidator<Student, CreateStudentRequest>(repo, request);

            errors.AddRange(requestValidator.NotNull(s => s.InstitutionalId));
            if(request.InstitutionalId != null)
                errors.AddRange(await requestValidator.MustBeUnique(s => s.InstitutionalId, request.InstitutionalId));

            errors.AddRange(requestValidator.NotNull(s => s.Name));
            errors.AddRange(requestValidator.NotNull(s => s.LastName));

            return new ValidationResult<CreateStudentRequest>
            {
                Success = errors.Count == 0,
                Payload = request,
                Errors = errors
            };
        }

        public async Task<ValidationResult<UpdateStudentRequest>> ValidateUpdate(UpdateStudentRequest request)
        {

            var errors = new List<ValidationError>();
            var requestValidator = new RequestValidator<Student, UpdateStudentRequest>(repo, request);

            errors.AddRange(await requestValidator.MustBeUnique(s => s.InstitutionalId, request.InstitutionalId));
            errors.AddRange(requestValidator.NotNull(s => s.Name));
            errors.AddRange(requestValidator.NotNull(s => s.LastName));

            return new ValidationResult<UpdateStudentRequest>
            {
                Success = errors.Count == 0,
                Payload = request,
                Errors  = errors
            };
        }
    }
}
