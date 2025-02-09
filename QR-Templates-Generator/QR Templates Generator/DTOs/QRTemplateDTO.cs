namespace QR_Templates_Generator.DTOs
{
    public class QRTemplateDTO

    {
        public long ID { get; set; }
        public string Title { get; set; }
        public string UniqeCode { get; set; }

        public List<QRTemplateSectionDTO> Sections { get; set; }

    }

}
