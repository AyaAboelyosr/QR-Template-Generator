using Microsoft.AspNetCore.Identity;

namespace QR_Templates_Generator.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? LastUpdated { get; set; }


    }
}
