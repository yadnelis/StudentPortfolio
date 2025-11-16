namespace StudentPortfolio.API.Infrastructure.Validation.Models
{
    public struct ValidationResult<T>
    {
        public DateTime Time;
        public bool Success { get; set; }
        public IEnumerable<ValidationError> Errors { get; set;}
        public T Payload { get; set;}
    }
}
