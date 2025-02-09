using QR_Templates_Generator.Models;
using static SimplyFairDMS.Utilities.TypeEnums;

namespace QRGenerator.DTOs.RespnseDTOs
{
    public class QRTemplateSectionFieldReaderDTO
    {
        public long ID { get; set; }
        
        public string FieldTitle { get; set; }
        public string FieldDescription { get; set; }
        public int FieldOrder { get; set; }
        public QRTemplateSectionFieldType FieldType { get; set; }
        public bool IsRequired {  get; set; }

        
        public QRTemplateSectionFieldReaderDTO(QRTemplateSectionField entity)
        {
            ID = entity.ID;
            
            FieldTitle = entity.FieldTitle;
            FieldDescription = entity.FieldDescription;
            FieldOrder = entity.FieldOrder;
            FieldType = entity.FieldType;
            IsRequired=entity.IsRequired;
        }
    }
}
