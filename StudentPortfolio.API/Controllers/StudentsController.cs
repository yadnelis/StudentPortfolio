using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;
using StudentPortfolio.API.Infrastructure.Validation;
using StudentPortfolio.API.Models.Dtos.Request.Student;
using StudentPortfolio.API.Models.Dtos.Response.Student;
using StudentPortfolio.API.Models.Entities;
using StudentPortfolio.API.Repositories;

namespace StudentPortfolio.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController(
        IStudentsRepository repo,
        IWebHostEnvironment env,
        IValidator<Student, CreateStudentRequest, UpdateStudentRequest> validator
    ) : AppControllerBase(env)
    {
        [HttpGet]
        public async Task<IActionResult> Get(ODataQueryOptions<Student> opts)
        {
            try
            {
                var query = repo.Query(opts);
                return Ok(query);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            try
            {
                var entity = await repo.Get(id);
                return Ok(entity.Adapt<GetStudentResponse>());
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(CreateStudentRequest request)
        {

            try
            {
                var validationResult = await validator.ValidateCreate(request);
                if (!validationResult.Success)
                    return UnprocessableEntity(validationResult);

                var entity = await repo.Create(request);
                return Ok(entity.Adapt<GetStudentResponse>());
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateStudentRequest request)
        {

            try
            {
                var validationResult = await validator.ValidateUpdate(request);
                if (!validationResult.Success)
                    return UnprocessableEntity(validationResult);

                var entity = await repo.Update(id, request);
                return Ok(entity.Adapt<GetStudentResponse>());
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await repo.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
