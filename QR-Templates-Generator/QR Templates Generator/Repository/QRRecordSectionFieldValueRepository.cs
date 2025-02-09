using QR_Templates_Generator.Models;

namespace QR_Templates_Generator.Repository
{
    public class QRRecordSectionFieldValueRepository : GenericRepository<QRRecordSectionFieldValue>, IQRRecordSectionFieldValueRepository
    {
        public QRRecordSectionFieldValueRepository(QRDatabaseContext context) : base(context)
        {
        }
    }
}
