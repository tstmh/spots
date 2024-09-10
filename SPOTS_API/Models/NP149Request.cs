using FluentValidation;
using FluentValidation.Attributes;

namespace SPOTSapi.Models
{

    [Validator(typeof(OSIRequestValidator))]
    public class NP149Request 
    {
        public string FIR { get; set; }

        public class OSIRequestValidator : AbstractValidator<NP149Request>
        {
            public OSIRequestValidator()
            {
                RuleFor(x => x).NotNull().WithMessage("NP149 Request cannot be null.");
            }
        }

    }

}