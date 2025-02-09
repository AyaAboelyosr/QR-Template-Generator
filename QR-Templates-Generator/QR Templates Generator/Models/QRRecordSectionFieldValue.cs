using SimplyFairDMS.DataModels.EntityPropClasses;

namespace QR_Templates_Generator.Models
{
    public class QRRecordSectionFieldValue : QRRecordSectionFieldValueProps
    {
        public override long ID { get; set; }
        public Guid? RowIndex { get; set; }
        public virtual QRRecord QRRecord { get; set; }
        public virtual QRTemplateSectionField QRTemplateSectionField { get; set; }
        public virtual QRTemplateSection QRTemplateSection { get; set; }
    }
}
