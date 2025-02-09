using Microsoft.EntityFrameworkCore;

namespace QR_Templates_Generator.Repository
{
    public interface IGenericRepository<T> where T : class
    {
        List<T> GetAll();
        T GetById(long id);
        void Insert(T obj);
        void Update(T obj);
        void Delete(long id);
        void Save();
        public void Delete(T entity);
     
    }
}
