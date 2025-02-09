using SimplyFairDMS.DataModels.EntityPropClasses;

namespace QR_Templates_Generator.DTOs
{
    public class QRTemplateSectionDTO

    {
        public long ID { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public List<QRTemplateSectionFieldDTO> Fields { get; set; }
    }
}


