using QR_Templates_Generator.Validations;
using System.ComponentModel.DataAnnotations;

namespace QR_Templates_Generator.DTOs
{
    public class UpdateQRTemplateDTO
    {
        

        [Required(ErrorMessage = "Name is required.")]
        [MinLength(3, ErrorMessage = "Name must be at least 3 characters long.")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Unique Code is required.")]
        [RegularExpression(@"^[A-Z]{2}-\d{3}$", ErrorMessage = "Unique Code must be in the format 'SI-001'.")]
        [Unique]
        public string UniqeCode { get; set; }
    }
}
