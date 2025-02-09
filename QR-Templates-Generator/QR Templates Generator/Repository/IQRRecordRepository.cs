using QR_Templates_Generator.Models;

namespace QR_Templates_Generator.Repository
{
    public interface IQRRecordRepository : IGenericRepository<QRRecord>
    {
        Task<IEnumerable<QRRecord>> GetAllAsync();
        Task<QRRecord> GetByIdAsync(long? id);
        Task<int> SaveAsync();
    }
}
