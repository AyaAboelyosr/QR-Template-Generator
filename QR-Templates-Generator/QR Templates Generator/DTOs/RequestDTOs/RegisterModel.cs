using System.ComponentModel.DataAnnotations;

namespace QRGenerator.DTOs.RequestDTOs
{
    public class RegisterModel
    {
        [Required]
      
        public string Email { get; set; }
        [Required]
        
        public string Password { get; set; }
        [Required]
        public string FirstName  { get; set; }
        [Required]
        public string LastName { get; set; }
    }
}
