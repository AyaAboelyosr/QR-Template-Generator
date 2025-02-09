using SimplyFairDMS.DataModels.EntityPropClasses;

namespace QR_Templates_Generator.Models
{
    public class QRRecord : QRRecordProps
    {
        public override long ID { get; set; }
        public virtual QRTemplate QRTemplate { get; set; }
        public virtual ICollection<QRRecordSectionFieldValue> Values { get; set; }
    }
}
