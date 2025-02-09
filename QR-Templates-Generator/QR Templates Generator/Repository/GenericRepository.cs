using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using QR_Templates_Generator.Models;

namespace QR_Templates_Generator.Repository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly QRDatabaseContext context;
        protected readonly DbSet<T> dbSet;
        public GenericRepository(QRDatabaseContext context) { 

            this.context = context;
            dbSet= context.Set<T>();

        }

        public List<T> GetAll()
        {
            return dbSet.ToList();
        }
        public T GetById(long id)
        {
            return dbSet.Find(id);
        }
        public void Insert(T obj)
        {

            dbSet.Add(obj);
        }

        public void Update(T obj)
        {
            dbSet.Update(obj);
        }
        public void Delete(long id)
        {
            T existing = dbSet.Find(id);
            dbSet.Remove(existing);
        }

        public void Delete(T entity)
        {
            context.Set<T>().Remove(entity);
        }
        public void Save()
        {
            context.SaveChanges();
        }
    }
}
