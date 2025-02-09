using QR_Templates_Generator.Models;

namespace QR_Templates_Generator.Repository
{
    public class QRTemplateSectionFieldRepository : GenericRepository<QRTemplateSectionField>, IQRTemplateSectionFieldRepository
    {
        public QRTemplateSectionFieldRepository(QRDatabaseContext context) : base(context)
        {
        }

        public QRTemplateSectionField GetFieldById(long fieldId, long sectionId)
        {
            return context.QRTemplateSectionFields
                .FirstOrDefault(f => f.ID == fieldId && f.QRTemplateSectionID == sectionId);
        }
    }
}
