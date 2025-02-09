using QR_Templates_Generator.Models;



namespace QRGenerator.DTOs.RespnseDTOs
{
    public class QRTemplateReaderDTO
    {
        public long ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<QRTemplateSectionReaderDTO> Sections { get; set; }

       
        public QRTemplateReaderDTO(QRTemplate entity)
        {
            ID = entity.ID;
            Title = entity.Title;
            Description = entity.Description;
            Sections = entity.QRTemplateSections?
                .Select(s => new QRTemplateSectionReaderDTO(s))
                .ToList() ?? new List<QRTemplateSectionReaderDTO>();
        }
    }
}
