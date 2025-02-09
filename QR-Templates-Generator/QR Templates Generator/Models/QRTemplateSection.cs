using SimplyFairDMS.DataModels.EntityPropClasses;

namespace QR_Templates_Generator.Models
{
    public class QRTemplateSection : QRTemplateSectionProps
    {
        public override long ID { get; set; }

        public virtual QRTemplate QRTemplate { get; set; }

        public virtual ICollection<QRTemplateSectionField> QRTemplateSectionFields { get; set; } = new List<QRTemplateSectionField>();
    }
}
