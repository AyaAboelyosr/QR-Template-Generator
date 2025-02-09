using Microsoft.EntityFrameworkCore;
using QR_Templates_Generator.Models;

namespace QR_Templates_Generator.Repository
{
    public class QRRecordRepository : GenericRepository<QRRecord>, IQRRecordRepository
    {
        private readonly QRDatabaseContext _Context;
        public QRRecordRepository(QRDatabaseContext context) : base(context)
        {
            _Context = context;
        }

        public async Task<IEnumerable<QRRecord>> GetAllAsync()
        {
            return await _Context.QRRecords.ToListAsync();
        }

        public async Task<QRRecord> GetByIdAsync(long? id)
        {
            return await _Context.QRRecords.FirstOrDefaultAsync(r => r.ID == id);

        }

        public Task<int> SaveAsync()
        {
            return  _Context.SaveChangesAsync();
        }
    }
}
