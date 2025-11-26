using Mapster;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Query.Validator;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using StudentPortfolio.API.Infrastructure;
using StudentPortfolio.API.Models.Dtos.Request.Student;
using StudentPortfolio.API.Models.Dtos.Response.Acknowledgement;
using StudentPortfolio.API.Models.Dtos.Response.Student;
using StudentPortfolio.API.Models.Entities;
using StudentPortfolio.API.Repositories.Base;

namespace StudentPortfolio.API.Repositories
{
    public interface IStudentsRepository : IRepo<Student>
    {
        IQueryable<GetStudentResponse> Query(ODataQueryOptions<Student> opts);
        Task<Student> Create(CreateStudentRequest request);
        Task<Student> Update(Guid id, UpdateStudentRequest request);
        Task<Student> GetByInstitutionalId(string institutionalId);
    }


    public class StudentsRepository(StudentPortfolioContext ctx)
        : BaseRepo<Student>(ctx), IStudentsRepository
    {
        public override IQueryable<Student> IncludeRelatedEntities(IQueryable<Student> query)       
            => query.Include(x => x.Acknowledgements);

        public IQueryable<GetStudentResponse> Query(ODataQueryOptions<Student> opts)
        {
            var query = this.Get();
            // posibly add some limits here to avoid users querying by properties we don't like
            var results = opts.ApplyTo(query, new ODataQuerySettings { PageSize = 100 }, 
                AllowedQueryOptions.Skip | 
                AllowedQueryOptions.Filter | 
                AllowedQueryOptions.OrderBy | 
                AllowedQueryOptions.Top | 
                AllowedQueryOptions.Skip | 
                AllowedQueryOptions.Count
            ) as IQueryable<Student>;

            // Mapster breaks here so it is necesary to use this type of query
            return results.Select(st => new GetStudentResponse
            {
                Id = st.Id,
                Name = st.Name,
                LastName = st.LastName,
                Institution = st.Institution,
                InstitutionalId = st.InstitutionalId,
                StartDate = st.StartDate,
                DateCreated = st.DateCreated,
                Acknowledgements = st.Acknowledgements.Select(ack => new GetAcknowledgementResponse
                {
                    Id = ack.Id,
                    StudentId = ack.StudentId,
                    Type = ack.Type,
                    OtherType = ack.OtherType,
                    Description = ack.Description,
                    Place = ack.Place,
                    StartDate = ack.StartDate,
                    EndDate = ack.EndDate,
                    CompetitionName = ack.CompetitionName,
                    CompetitionPosition = ack.CompetitionPosition,
                    StudentOrganizatonName = ack.StudentOrganizatonName,
                    DateCreated = ack.DateCreated,
                })
            });
        }

        public Task<Student> Create(CreateStudentRequest request)
        {
            return base.Create(request.Adapt<Student>());
        }

        public async Task<Student> GetByInstitutionalId(string id)
        {
            return await base.Get(x => x.InstitutionalId == id).FirstOrDefaultAsync();
        }

        public Task<Student> Update(Guid id, UpdateStudentRequest request)
        {
            return base.Update(id,
                (entity) =>
                {
                    entity = request.Adapt(entity);
                });
        }
    }
}
