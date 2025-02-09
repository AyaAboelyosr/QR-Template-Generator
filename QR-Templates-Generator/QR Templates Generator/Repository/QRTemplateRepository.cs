using Microsoft.EntityFrameworkCore;
using QR_Templates_Generator.DTOs;
using QR_Templates_Generator.Models;
using System.Collections.Generic;
using System.Linq;

namespace QR_Templates_Generator.Repository
{
    public class QRTemplateRepository : GenericRepository<QRTemplate>, IQRTemplateRepository
    {
        public QRTemplateRepository(QRDatabaseContext context) : base(context)
        {
        }

        public IEnumerable<QRTemplate> GetAllWithSections()
        {
            return context.Set<QRTemplate>()
                           .Include(t => t.QRTemplateSections)
                           .ThenInclude(s => s.QRTemplateSectionFields)
                           .ToList();
        }


        public QRTemplate GetByIdWithSections(long id)
        {
            return context.Set<QRTemplate>()
                           .Include(t => t.QRTemplateSections)
                           .ThenInclude(s => s.QRTemplateSectionFields)
                           .FirstOrDefault(t => t.ID == id);
        }
    }

}
