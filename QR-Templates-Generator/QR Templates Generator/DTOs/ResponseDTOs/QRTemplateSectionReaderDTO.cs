using QR_Templates_Generator.Models;
using static SimplyFairDMS.Utilities.TypeEnums;

namespace QRGenerator.DTOs.RespnseDTOs
{
    public class QRTemplateSectionReaderDTO
    {
        public long ID { get; set; }
        
        public string SectionTitle { get; set; }
        public string SectionDescription { get; set; }
        public int SectionOrder { get; set; }
        public QRTemplateSectionType SectionType { get; set; }
        public List<QRTemplateSectionFieldReaderDTO> Fields { get; set; }

        
        public QRTemplateSectionReaderDTO(QRTemplateSection entity)
        {
            ID = entity.ID;
             
            SectionTitle = entity.SectionTitle;
            SectionDescription = entity.SectionDescription;
            SectionOrder = entity.SectionOrder;
            SectionType = entity.SectionType;
            Fields = entity.QRTemplateSectionFields?
                .Select(f => new QRTemplateSectionFieldReaderDTO(f))
                .ToList() ?? new List<QRTemplateSectionFieldReaderDTO>();
        }
    }
}
