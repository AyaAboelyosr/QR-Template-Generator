using QR_Templates_Generator.Models;
using System.ComponentModel.DataAnnotations;
using QR_Templates_Generator.DTOs;

namespace QR_Templates_Generator.Validations
{
    public class UniqueAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value != null)
            {
                var context = (QRDatabaseContext)validationContext.GetService(typeof(QRDatabaseContext));

               
                var entity = validationContext.ObjectInstance;

               
                if (entity is AddQRTemplateDTO addDto)
                {
                
                    var existingEntity = context.QRTemplates.SingleOrDefault(e => e.UniqeCode == value.ToString());

                    if (existingEntity != null)
                    {
                        return new ValidationResult("Unique Code already exists.");
                    }
                }
                else if (entity is UpdateQRTemplateDTO updateDto)
                {
                  
                    var isUniqeCodeChanged = updateDto.UniqeCode != null && updateDto.UniqeCode != value.ToString();

                    if (isUniqeCodeChanged)
                    {
                        var existingEntity = context.QRTemplates.SingleOrDefault(e => e.UniqeCode == value.ToString());

                        if (existingEntity != null)
                        {
                            return new ValidationResult("Unique Code already exists.");
                        }
                    }
                }
            }

            return ValidationResult.Success;
        }
    }
}
