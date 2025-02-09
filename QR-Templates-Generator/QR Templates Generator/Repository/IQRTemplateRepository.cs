using QR_Templates_Generator.DTOs;
using QR_Templates_Generator.Models;
using System.Collections.Generic;

namespace QR_Templates_Generator.Repository
{
    public interface IQRTemplateRepository :IGenericRepository<QRTemplate>
    {
        IEnumerable<QRTemplate> GetAllWithSections();
        QRTemplate GetByIdWithSections(long id);
    }
}
