using QR_Templates_Generator.Models;


namespace QRGenerator.DTOs.RequestDTOs
{
    public class RecordListDTO
    {
        public long RecordId {  get; set; }
        public long? TemplateId { get; set; }
        public string TemplateTitle { get; set; }
        public RecordListDTO(QRRecord record)
        {

            RecordId = record.ID;
            TemplateId = record.QRTemplateID;
            TemplateTitle = record.QRTemplate.Title;
            
        }
    }
}
