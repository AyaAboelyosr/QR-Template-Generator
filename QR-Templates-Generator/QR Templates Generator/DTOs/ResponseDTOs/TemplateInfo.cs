using QR_Templates_Generator.Models;


namespace QRGenerator.DTOs.ResponseDTOs
{
    public class TemplateInfo
    {
        public TemplateInfo(QRTemplate template)
        {
            Id = template.ID;
            Title = template.Title;
            Description = template.Description;
        }

        public long Id {  get; set; }
        public string Title { get; set; }
        public string Description { get; set; } 
    }
}
