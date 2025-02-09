using SimplyFairDMS.DataModels.EntityPropClasses;

namespace QR_Templates_Generator.Models
{
    public class QRTemplate : QRTemplateProps
    {
        public override long ID { get; set; }
        public override string? Description { get; set; }

        public virtual ICollection<QRTemplateSection> QRTemplateSections { get; set; } = new List<QRTemplateSection>();
        public virtual ICollection<QRRecord> QRTemplateRecords { get; set;} = new List<QRRecord>();
    }
}
