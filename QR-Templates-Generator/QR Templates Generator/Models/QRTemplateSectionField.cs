using SimplyFairDMS.DataModels.EntityPropClasses;

namespace QR_Templates_Generator.Models
{
    public class QRTemplateSectionField : QRTemplateSectionFieldProps
    {
        public override long ID { get; set; }

        public bool IsRequired { get; set; }
        public virtual QRTemplateSection QRTemplateSection { get; set; }
    }
}
