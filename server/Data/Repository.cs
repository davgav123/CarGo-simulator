using CarGoSimulator.Interfaces;
using CarGoSimulator.Models.DBModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace CarGoSimulator.Data
{
    public class Repository<T> : IRepository<T> where T : Entity
    {
        private readonly CarGoSimulatorDBContext context;
        private readonly DbSet<T> entities;

        public Repository(CarGoSimulatorDBContext context)
        {
            this.context = context;
            entities = context.Set<T>();
        }

        public CarGoSimulatorDBContext Context { get => context; }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await entities.ToListAsync();
        }

        public async Task<T> GetByIdAsync(string id)
        {
            return await entities.SingleOrDefaultAsync(s => s.Id.CompareTo(id) == 0);
        }

        public async Task<IEnumerable<T>> GetByConditionAsync(Expression<Func<T, bool>> expression)
        {
            return await entities.Where(expression).ToListAsync();
        }

        public async Task<T> GetFirstByConditionAsync(Expression<Func<T, bool>> expression)
        {
            return await entities.SingleOrDefaultAsync(expression);
        }

        public void Insert(T entity)
        {
            entities.Add(entity);
        }

        public void Update(T entity)
        {
            entities.Update(entity);
        }

        public void Delete(T entity)
        {
            entities.Remove(entity);
        }

        public async Task ApplyChangesAsync()
        {
            await context.SaveChangesAsync();
        }

    }
}
