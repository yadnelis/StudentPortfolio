using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Hosting;
using StudentPortfolio.API.Infrastructure.Validation.Models;
using StudentPortfolio.API.Models.Dtos.Base;
using StudentPortfolio.API.Models.Entities;
using StudentPortfolio.API.Models.Infrastructure;
using StudentPortfolio.API.Repositories.Base;
using System.Linq.Expressions;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace StudentPortfolio.API.Infrastructure.Validation
{
    public interface IValidator<T, TCreate, TUpdate>
    {
        Task<ValidationResult<TCreate>> ValidateCreate(TCreate request);
        Task<ValidationResult<TUpdate>> ValidateUpdate(TUpdate request);
    }

    public class RequestValidator<TModel, TRequest>(IRepo<TModel> repo, TRequest request)
        where TRequest : IBaseModRequest where TModel : class, IDeletable, IModel
    {
        public IEnumerable<ValidationError> NotNull<TResult>(Expression<Func<TRequest, TResult>> selector)
        {
            var errors = new List<ValidationError>();
            var propertyName = GetPropertyName(selector);


            if (selector.Compile().Invoke(request) == null)
                errors.Add(new ValidationError
                {
                    Property = propertyName,
                    Message = "Must be defined."
                });

            return errors;
        }

        public IEnumerable<ValidationError> NotEmpty<TResult>(Expression<Func<TRequest, TResult>> selector)
            where TResult: struct, IEquatable<TResult>
        {
            var errors = new List<ValidationError>();
            var propertyName = GetPropertyName(selector);

            if (selector.Compile().Invoke(request).Equals(default(TResult)))
                errors.Add(new ValidationError
                {
                    Property = propertyName,
                    Message = "Must be defined."
                });

            return errors;
        }

        public IEnumerable<ValidationError> GreaterThan<TResult>(Expression<Func<TRequest, TResult>> selector, Expression<Func<TRequest, TResult>> lessserSelector)
            where TResult : IComparable<TResult>
        {
            var errors = new List<ValidationError>();
            var propertyName = GetPropertyName(selector);

            var lesserPropertyName = GetPropertyName(lessserSelector);

            var greatValue = selector.Compile().Invoke(request);
            var lessValue = lessserSelector.Compile().Invoke(request);

            if (greatValue.CompareTo(lessValue) < 0)
                errors.Add(new ValidationError
                {
                    Property = propertyName,
                    Message = $"Must be greater than ({lesserPropertyName})."
                });

            return errors;
        }

        public async Task<IEnumerable<ValidationError>> MustBeUnique<TResult>(Expression<Func<TModel, TResult>> selector, TResult property)
        {
            var errors = new List<ValidationError>();

            var propertyName = GetPropertyName(selector);

            var parameter = Expression.Parameter(typeof(TModel));
            var selectionExpression = Expression.Invoke(selector, parameter);
            var comparisonValueExpression = Expression.Constant(property);
            var comparisonExpression = Expression.Equal(selectionExpression, comparisonValueExpression);
            var filterExpression = Expression.Lambda(comparisonExpression, parameter) as Expression<Func<TModel, bool>>;


            var exists = await repo.Get(filterExpression).FirstOrDefaultAsync();
            if (exists != null)
                errors.Add(new ValidationError
                {
                    Property = propertyName,
                    Message = "Must be unique."
                });

            return errors;
        }

        public string GetPropertyName<T, TResult>(Expression<Func<T, TResult>> selector)
        {
            var memberExpression = (MemberExpression)selector.Body;
            var propertyName = memberExpression.Member.Name;
            var nameArray= propertyName.ToCharArray();
            nameArray[0] = char.ToLower(nameArray[0]);
            return new string(nameArray);
        }
    }
}
