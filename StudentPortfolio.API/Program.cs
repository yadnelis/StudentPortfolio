using Mapster;
using Microsoft.EntityFrameworkCore;
using StudentPortfolio.API.Infrastructure;
using StudentPortfolio.API.Infrastructure.Validation;
using StudentPortfolio.API.Models.Dtos.Request.Acknowledgement;
using StudentPortfolio.API.Models.Dtos.Request.Student;
using StudentPortfolio.API.Models.Entities;
using StudentPortfolio.API.Repositories;

var builder = WebApplication.CreateBuilder(args);

TypeAdapterConfig.GlobalSettings.Default.IgnoreNullValues(true);

// Add services to the container.
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Repositories
builder.Services.AddScoped<IStudentsRepository, StudentsRepository>();
builder.Services.AddScoped<IAcknowledgementsRepository, AcknowledgementsRepository>();

//Validators
builder.Services.AddScoped<IValidator<Acknowledgement, CreateAcknowledgementRequest, UpdateAcknowledgementRequest>, AcknowledgementValidator>();
builder.Services.AddScoped<IValidator<Student, CreateStudentRequest, UpdateStudentRequest>, StudentValidator>();

var connectionString = builder.Configuration.GetConnectionString("DbConnection");
var serverVersion = ServerVersion.AutoDetect(connectionString);

builder.Services.AddDbContext<StudentPortfolioContext>(sbContextoptions =>
    sbContextoptions
    .UseMySql(connectionString, serverVersion)
    .UseSnakeCaseNamingConvention()
    .EnableDetailedErrors()
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();
app.MapControllers();

app.UseCors(config =>
{
    config.AllowAnyOrigin();
    config.AllowAnyMethod();
    config.AllowAnyHeader();
});

app.Map("/api", () => "Ok");

app.Run();
