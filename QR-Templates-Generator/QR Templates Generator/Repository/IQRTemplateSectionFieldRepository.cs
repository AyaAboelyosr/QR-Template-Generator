using QR_Templates_Generator.DTOs;
using QR_Templates_Generator.Models;

namespace QR_Templates_Generator.Repository
{
    public interface IQRTemplateSectionFieldRepository : IGenericRepository<QRTemplateSectionField> 
    {
        public QRTemplateSectionField GetFieldById(long fieldId, long sectionId);


    }
}
